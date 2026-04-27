package com.psp_pos;

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
import com.common.apiutil.util.SystemUtil;
import com.facebook.react.bridge.*;

public class PrinterModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String TAG = "PrinterModule";
    private static final Object printerLock = new Object();
    private int printerWidth = 384;
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
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        try {
            ThermalPrinter.stop();
            isPrinterOpen = false;
        } catch (Exception e) {
            Log.e(TAG, "Stop error: " + e.getMessage());
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
                // Stop any previous instance
                try {
                    ThermalPrinter.stop();
                } catch (Exception ignored) {
                }
                isPrinterOpen = false;
                Thread.sleep(500);

                // SystemUtil check for device type
                int check = SystemUtil.checkPrinter(reactContext);
                Log.d(TAG, "SystemUtil.checkPrinter returned: " + check);

                // If check is 0, don't give up. Telpo SDK can sometimes find the device
                // even when the SystemUtil check fails due to external USB interference.
                if (check <= 0) {
                    Log.w(TAG, "SystemUtil failed to detect printer, attempting force start.");
                }

                // C2 devices are typically 58mm (384).
                // Some detection fails return -1 or 0 on internal serial ports.
                if (check == SystemUtil.PRINTER_80MM_USB_COMMON) {
                    printerWidth = 576;
                } else {
                    printerWidth = 384;
                }
                Log.d(TAG, "Resolved printerWidth: " + printerWidth);

                int retry = 0;
                Exception lastEx = null;
                while (retry < 3) {
                    try {
                        // Telpo SDK works best when start() is initiated on the Main Looper
                        new Handler(Looper.getMainLooper()).post(() -> {
                            try {
                                ThermalPrinter.start(reactContext.getApplicationContext());
                                ThermalPrinter.setGray(4); // Slightly higher contrast for C2
                            } catch (Exception ignored) {
                            }
                        });

                        Thread.sleep(1200); // Essential delay for service binding

                        // Robust status check loop (Status 13 = Service Busy/Connecting)
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
                        : "Unknown SDK Error";
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

                // Decode Base64 image
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
                            int check = SystemUtil.checkPrinter(reactContext);
                            Log.d(TAG, "Print job printer check: " + check);

                            // Same fallback as initialization
                            if (check == 0)
                                Log.w(TAG, "Printer check 0 during print job, trying anyway.");

                            printerWidth = (check == SystemUtil.PRINTER_80MM_USB_COMMON) ? 576 : 384;

                            new Handler(Looper.getMainLooper()).post(() -> {
                                try {
                                    ThermalPrinter.start(reactContext.getApplicationContext());
                                    ThermalPrinter.setGray(4);
                                } catch (Exception ignored) {
                                }
                            });

                            Thread.sleep(1200);
                            isPrinterOpen = true;
                        } catch (Exception e) {
                            Log.e(TAG, "Printer start failed", e);
                            isPrinterOpen = false;
                            promise.reject("StartError", "Could not open printer device: " + e.getMessage());
                            return;
                        }
                    } else {
                        // Quick verification
                        int s = ThermalPrinter.checkStatus();
                        if (s != 0 && s != 13) {
                            Log.w(TAG, "Printer stale, attempting hot recovery...");
                            try {
                                ThermalPrinter.stop();
                                Thread.sleep(400);
                                ThermalPrinter.start(reactContext.getApplicationContext());
                                ThermalPrinter.setGray(4);
                                Thread.sleep(800);
                            } catch (Exception ignored) {
                            }
                        }
                    }

                    // 🔥 CHECK STATUS
                    int status;
                    try {
                        ThermalPrinter.clear();
                        status = ThermalPrinter.checkStatus();
                        Log.d(TAG, "Printer Status during print job: " + status);
                    } catch (Exception e) {
                        Log.e(TAG, "Status failed", e);
                        isPrinterOpen = false;
                        promise.reject("StatusError", e.getMessage());
                        return;
                    }

                    if (status != 0 && status != 13) { // 13 is sometimes returned as a 'busy but okay' state on C2
                        if (status == 1)
                            throw new NoPaperException();
                        if (status == 2)
                            throw new OverHeatException();

                        promise.reject("StatusError", "Printer not ready. Status code: " + status);
                        return;
                    }

                    boolean hasData = false;

                    // 🖼️ Print Image
                    if (logo != null) {
                        Bitmap resized = resizeBitmap(logo, printerWidth, 1200);

                        ThermalPrinter.setAlgin(ThermalPrinter.ALGIN_MIDDLE);
                        ThermalPrinter.printLogo(resized);

                        Thread.sleep(300);
                        hasData = true;
                    }

                    // 📝 Print Text
                    if (props.hasKey("content") && !props.isNull("content")) {
                        String content = props.getString("content");

                        if (content != null && !content.isEmpty()) {
                            ThermalPrinter.setAlgin(ThermalPrinter.ALGIN_LEFT);
                            ThermalPrinter.addString(content);
                            hasData = true;
                        }
                    }

                    if (!hasData) {
                        try {
                            ThermalPrinter.stop();
                        } catch (Exception ignored) {
                        }
                        promise.reject("NoData", "Nothing to print");
                        return;
                    }

                    // 🧾 EXECUTE PRINT
                    try {
                        ThermalPrinter.printString();
                        ThermalPrinter.walkPaper(100);
                    } catch (Exception e) {
                        Log.e(TAG, "Execution failed", e);
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
                promise.reject("PrintError", e.getMessage() != null ? e.getMessage() : "Unknown print error");
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

    private Bitmap resizeBitmap(Bitmap bitmap, int maxWidth, int maxHeight) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();

        float ratio = (float) width / height;

        if (width > maxWidth) {
            width = maxWidth;
            height = (int) (width / ratio);
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = (int) (height * ratio);
        }

        return Bitmap.createScaledBitmap(bitmap, width, height, true);
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
}