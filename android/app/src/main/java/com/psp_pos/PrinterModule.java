package com.psp_pos;

import android.content.Context;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.common.apiutil.printer.NoPaperException;
import com.common.apiutil.printer.OverHeatException;
import com.common.apiutil.printer.ThermalPrinter;
import com.facebook.react.bridge.*;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class PrinterModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String TAG = "PrinterModule";
    private static final Object printerLock = new Object();
    private int printerWidth = 576; // Telpo C2 is 80mm
    private static boolean isPrinterOpen = false;

    public PrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "PrinterModule";
    }

    @Override
    public void invalidate() {
        super.invalidate();
        try {
            ThermalPrinter.stop();
            isPrinterOpen = false;
        } catch (Exception e) {
            Log.e(TAG, "Stop error: " + e.getMessage());
        }
    }

    private void startPrinterSync() {
        try {
            CountDownLatch latch = new CountDownLatch(1);
            new Handler(Looper.getMainLooper()).post(() -> {
                try {
                    boolean initOk = ThermalPrinter.init80mmUsbPrinter(reactContext.getApplicationContext());
                    Log.d(TAG, "init80mmUsbPrinter returned: " + initOk);
                    ThermalPrinter.start(reactContext.getApplicationContext());
                    ThermalPrinter.setGray(4);
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown();
                }
            });
            latch.await(2, TimeUnit.SECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void initializePrinter(Promise promise) {
        try {
            final android.app.Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.reject("NoActivity", "Activity is null");
                return;
            }

            synchronized (printerLock) {
                try {
                    ThermalPrinter.stop();
                } catch (Exception ignored) {
                }
                isPrinterOpen = false;
                Thread.sleep(500);

                int retry = 0;
                Exception lastEx = null;
                while (retry < 3) {
                    try {
                        startPrinterSync();
                        Thread.sleep(1200);

                        int status = -1;
                        for (int i = 0; i < 4; i++) {
                            status = ThermalPrinter.checkStatus();
                            if (status != 13)
                                break;
                            Thread.sleep(500);
                        }

                        if (status == 0 || status == 13) {
                            isPrinterOpen = true;
                            promise.resolve("Printer initialized. Status: " + status + " Width: " + printerWidth);
                            return;
                        }
                        throw new Exception("Status check returned: " + status);
                    } catch (Exception e) {
                        lastEx = e;
                        retry++;
                        try {
                            ThermalPrinter.stop();
                        } catch (Exception ignored) {
                        }
                        Thread.sleep(800);
                    }
                }
                isPrinterOpen = false;
                String errMsg = (lastEx != null && lastEx.getMessage() != null) ? lastEx.getMessage()
                        : lastEx != null ? lastEx.toString() : "Unknown SDK Error";
                promise.reject("InitError", "Could not open printer device after retries: " + errMsg);
            }
        } catch (Exception e) {
            isPrinterOpen = false;
            promise.reject("InitError",
                    "Exception during init: " + (e.getMessage() != null ? e.getMessage() : e.toString()));
        }
    }

    @ReactMethod
    public void printFun(final ReadableMap props, final Promise promise) {
        new Thread(() -> {
            Bitmap logo = null;
            try {
                final android.app.Activity activity = getCurrentActivity();
                if (activity == null) {
                    new Handler(Looper.getMainLooper()).post(() -> promise.reject("NoActivity", "Activity is null"));
                    return;
                }

                if (props.hasKey("logoBase64") && !props.isNull("logoBase64")) {
                    String base64 = props.getString("logoBase64");
                    if (base64 != null && !base64.isEmpty()) {
                        logo = decodeBase64(base64);
                    }
                }

                synchronized (printerLock) {
                    Log.d(TAG, "Processing print job. isPrinterOpen: " + isPrinterOpen);

                    if (!isPrinterOpen) {
                        try {
                            ThermalPrinter.stop();
                            Thread.sleep(500);
                        } catch (Exception ignored) {
                        }
                        try {
                            startPrinterSync();
                            Thread.sleep(1200);
                            isPrinterOpen = true;
                        } catch (Exception e) {
                            isPrinterOpen = false;
                            promise.reject("StartError", "Could not open printer device: "
                                    + (e.getMessage() != null ? e.getMessage() : e.toString()));
                            return;
                        }
                    } else {
                        int s = -1;
                        try {
                            s = ThermalPrinter.checkStatus();
                        } catch (Exception e) {
                            s = -1; // Force recovery
                        }

                        if (s != 0 && s != 13) {
                            Log.w(TAG, "Printer stale, attempting hot recovery...");
                            try {
                                ThermalPrinter.stop();
                                Thread.sleep(400);
                            } catch (Exception ignored) {
                            }
                            startPrinterSync();
                            try {
                                Thread.sleep(800);
                            } catch (Exception ignored) {
                            }
                        }
                    }

                    int status;
                    try {
                        status = ThermalPrinter.checkStatus();
                        Log.d(TAG, "Printer Status during print job: " + status);
                    } catch (Exception e) {
                        Log.e(TAG, "Status failed", e);
                        isPrinterOpen = false;
                        promise.reject("StatusError", e.getMessage() != null ? e.getMessage() : e.toString());
                        return;
                    }

                    if (status != 0 && status != 13) {
                        if (status == 1)
                            throw new NoPaperException();
                        if (status == 2)
                            throw new OverHeatException();
                        promise.reject("StatusError", "Printer not ready. Status code: " + status);
                        return;
                    }

                    boolean hasData = false;

                    if (logo != null) {
                        Bitmap resized = resizeBitmap(logo, printerWidth);
                        ThermalPrinter.setAlgin(ThermalPrinter.ALGIN_MIDDLE);
                        ThermalPrinter.printLogo(resized);
                        Thread.sleep(300);
                        hasData = true;
                    }

                    if (props.hasKey("content") && !props.isNull("content")) {
                        String content = props.getString("content");
                        if (content != null && !content.isEmpty()) {
                            ThermalPrinter.setAlgin(ThermalPrinter.ALGIN_LEFT);
                            ThermalPrinter.addString(content);
                            hasData = true;
                        }
                    }

                    if (!hasData) {
                        promise.reject("NoData", "Nothing to print");
                        return;
                    }

                    try {
                        ThermalPrinter.printString();
                        ThermalPrinter.walkPaper(100);

                        // Auto-cut the paper after printing
                        try {
                            ThermalPrinter.paperCut();
                        } catch (Exception ignored) {
                            Log.w(TAG, "Cutter not available or error during cut");
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Execution failed", e);
                        promise.reject("PrintError",
                                "Execution failed: " + (e.getMessage() != null ? e.getMessage() : e.toString()));
                        return;
                    }

                    promise.resolve("Print Success");
                }
            } catch (NoPaperException e) {
                promise.reject("NoPaper", "Out of paper");
            } catch (OverHeatException e) {
                promise.reject("OverHeat", "Printer overheating");
            } catch (Exception e) {
                Log.e(TAG, "Print error", e);
                isPrinterOpen = false;
                promise.reject("PrintError", e.getMessage() != null ? e.getMessage() : e.toString());
            }
        }).start();
    }

    private Bitmap decodeBase64(String base64) {
        try {
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        } catch (Exception e) {
            Log.e(TAG, "Decode error", e);
            return null;
        }
    }

    private Bitmap resizeBitmap(Bitmap bitmap, int maxWidth) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        if (width <= maxWidth)
            return bitmap;

        float ratio = (float) width / height;
        int newWidth = maxWidth;
        int newHeight = (int) (newWidth / ratio);
        return Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true);
    }

    @ReactMethod
    public void getUsbDevices(Promise promise) {
        try {
            UsbManager manager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
            WritableArray deviceList = Arguments.createArray();
            for (UsbDevice device : manager.getDeviceList().values()) {
                WritableMap map = Arguments.createMap();
                map.putInt("vendorId", device.getVendorId());
                map.putInt("productId", device.getProductId());
                map.putString("deviceName", device.getDeviceName());
                deviceList.pushMap(map);
            }
            promise.resolve(deviceList);
        } catch (Exception e) {
            promise.reject("Error", e.getMessage());
        }
    }




    private byte[] bitmapToEscPos(Bitmap bitmap) {
        // Simple implementation of GS v 0 (Normal mode)
        int width = (bitmap.getWidth() + 7) / 8;
        int height = bitmap.getHeight();
        byte[] data = new byte[8 + width * height];

        data[0] = 0x1D;
        data[1] = 0x76;
        data[2] = 0x30;
        data[3] = 0x00; // m = 0
        data[4] = (byte) (width % 256); // xL
        data[5] = (byte) (width / 256); // xH
        data[6] = (byte) (height % 256); // yL
        data[7] = (byte) (height / 256); // yH

        int k = 8;
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                byte b = 0;
                for (int bit = 0; bit < 8; bit++) {
                    int px = x * 8 + bit;
                    if (px < bitmap.getWidth()) {
                        int pixel = bitmap.getPixel(px, y);
                        // Simple threshold for black/white
                        int r = (pixel >> 16) & 0xff;
                        int g = (pixel >> 8) & 0xff;
                        int b_val = pixel & 0xff;
                        if ((r + g + b_val) / 3 < 128) {
                            b |= (1 << (7 - bit));
                        }
                    }
                }
                data[k++] = b;
            }
        }
        return data;
    }
}
