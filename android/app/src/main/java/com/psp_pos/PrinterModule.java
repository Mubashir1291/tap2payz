package com.payzee;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.hardware.usb.UsbConstants;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.common.apiutil.InternalErrorException;
import com.common.apiutil.printer.NoPaperException;
import com.common.apiutil.printer.OverHeatException;
import com.common.apiutil.printer.ThermalPrinter;
import com.common.apiutil.util.SystemUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class PrinterModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final String TAG = "PrinterModule";
    private static final int NOPAPER = 3;
    private boolean has80mmUsbPrinter = true;
    private boolean initSuccess;

    private boolean isPrinterOpen = false;
    private final Object printerLock = new Object();

    private UsbDeviceConnection connection;
    private UsbEndpoint endpoint;

    private Handler handler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            if (msg.what == NOPAPER) {
                Log.d(TAG, "Printer is out of paper");
            } else {
                super.handleMessage(msg);
            }
        }
    };

    public PrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "PrinterModule";
    }

    @ReactMethod
    public void getPrinterType(Promise promise) {
        try {
            int printerCheck = SystemUtil.checkPrinter581(reactContext);
            String printerType;

            switch (printerCheck) {
                case SystemUtil.PRINTER_80MM_USB_COMMON:
                    printerType = "PRINTER_80MM_USB_COMMON";
                    break;
                case SystemUtil.PRINTER_SY581:
                    printerType = "SY581 Serial printer";
                    break;
                case SystemUtil.PRINTER_PRT_COMMON:
                    printerType = "58mm Serial/USB printer";
                    break;
                default:
                    printerType = "Unknown printer type";
                    break;
            }

            Log.d(TAG, "Detected printer type: " + printerType);
            promise.resolve(printerType);
        } catch (Exception e) {
            Log.e(TAG, "Error getting printer type: " + e.getMessage(), e);
            promise.reject("Error getting printer type", e);
        }
    }

    @ReactMethod
    public void checkPrinterConfig(Promise promise) {
        try {
            boolean isConfigured = MainApplication.getConfig() != null;
            WritableMap result = Arguments.createMap();
            result.putBoolean("isConfigured", isConfigured);
            result.putString("message", isConfigured ? "Printer configured successfully." : "Printer not configured.");
            Log.d(TAG, "Printer configuration check: " + result.getString("message"));
            promise.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Error checking printer config: " + e.getMessage(), e);
            promise.reject("Error checking printer config", e);
        }
    }

    @ReactMethod
    public void initializePrinter(Promise promise) {
        synchronized (printerLock) {
            try {
                UsbManager usbManager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
                UsbDevice device = findUsbDevice(usbManager);

                if (device == null) {
                    Log.e(TAG, "No USB device found during initialization");
                    promise.reject("NoDeviceFound", "No USB device found during initialization");
                    return;
                }

                if (connection != null) {
                    Log.d(TAG, "Releasing previous USB connection");
                    connection.releaseInterface(device.getInterface(0));
                    connection.close();
                }

                connection = usbManager.openDevice(device);
                if (connection == null) {
                    Log.e(TAG, "Failed to open USB device connection");
                    promise.reject("ConnectionError", "Failed to open USB device connection");
                    return;
                }

                UsbInterface usbInterface = device.getInterface(0);
                if (!connection.claimInterface(usbInterface, true)) {
                    Log.e(TAG, "Failed to claim USB interface");
                    connection.close();
                    connection = null;
                    promise.reject("ClaimInterfaceError", "Failed to claim USB interface");
                    return;
                }

                endpoint = findUsbEndpoint(device);
                if (endpoint == null) {
                    Log.e(TAG, "No suitable USB endpoint found");
                    connection.close();
                    connection = null;
                    promise.reject("EndpointError", "No suitable USB endpoint found");
                    return;
                }

                // Initialization logic...
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error during initialization: " + e.getMessage(), e);
                promise.reject("InitializationException", e.getMessage());
            }
        }
    }



    @ReactMethod
    public void printFun(final ReadableMap props, final Promise promise) {
        new Thread(() -> {
            try {
                Log.d(TAG, "Starting print job with content");

                synchronized (printerLock) {
                    if (getCurrentActivity() == null) {
                        Log.e(TAG, "Current activity is null");
                        promise.reject("NoActivity", "Current activity is null");
                        return;
                    }

                    if (!isPrinterOpen) {
                        ThermalPrinter.start(getCurrentActivity());
                        isPrinterOpen = true;
                        Log.d(TAG, "Printer started for print job");
                    }
                    isPrinterOpen = true;
                    Log.d(TAG, "Printer is in working");

                    // Extract props with null checks
                    if (props.hasKey("logoUrl")) {
                        String myUrl = props.getString("logoUrl");
                        Bitmap logo1 = fetchLogo(myUrl);
                        if (logo1 != null) {
                            Bitmap resizedLogo1 = resizeBitmap(logo1, 576, 1000); // Adjust size as needed
                            ThermalPrinter.setAlgin(ThermalPrinter.ALGIN_MIDDLE);
                            ThermalPrinter.printLogo(resizedLogo1);
                        } else {
                            Log.e(TAG, "Failed to fetch logo");
                        }
                    }
                    if (props.hasKey("logoBase64")) {
                        String logoBase64 = props.getString("logoBase64");
                        Bitmap logo = decodeBase64ToBitmap(logoBase64);
                        if (logo != null) {
                            Bitmap resizedLogo = resizeBitmap(logo, 560, 1020); // Adjust size as needed
                            ThermalPrinter.setAlgin(ThermalPrinter.ALGIN_MIDDLE);
                            ThermalPrinter.printLogo(resizedLogo);
                        } else {
                            Log.e(TAG, "Failed to decode base64 logo");
                        }
                    }

                    ThermalPrinter.printString();
                    ThermalPrinter.walkPaper(100);
                    ThermalPrinter.paperCut();
                }
            } catch (InternalErrorException e) {
                Log.e(TAG, "Internal error occurred: " + e.getMessage(), e);
                promise.reject("InternalErrorException", e.getMessage());
            } catch (NoPaperException e) {
                Log.e(TAG, "No paper in the printer", e);
                handler.sendMessage(handler.obtainMessage(NOPAPER, 1, 0, null));
                promise.reject("NoPaperException", "No paper in the printer");
            } catch (OverHeatException e) {
                Log.e(TAG, "Printer is overheating", e);
                promise.reject("OverHeatException", "Printer is overheating");
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error occurred: " + e.getMessage(), e);
                promise.reject("UnexpectedException", e.getMessage());
            }
        }).start();
    }


    private Bitmap decodeBase64ToBitmap(String base64Str) {
        try {
            byte[] decodedBytes = Base64.decode(base64Str, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        } catch (Exception e) {
            Log.e(TAG, "Failed to decode base64 to bitmap: " + e.getMessage(), e);
            return null;
        }
    }

    private Bitmap fetchLogo(String logoUrl) {
        try {
            Log.d(TAG, "Fetching logo from: " + logoUrl);
            URL url = new URL(logoUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            Bitmap bitmap = BitmapFactory.decodeStream(input);
            Log.d(TAG, "Fetched logo, dimensions: " + (bitmap != null ? bitmap.getWidth() + "x" + bitmap.getHeight() : "null"));
            return bitmap;
        } catch (Exception e) {
            Log.e(TAG, "Failed to fetch logo: " + e.getMessage(), e);
            return null;
        }
    }
    private Bitmap resizeBitmap(Bitmap bitmap, int maxWidth, int maxHeight) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        float aspectRatio = (float) width / height;
        if (width > maxWidth) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
        }
        if (height > maxHeight) {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
        }
        return Bitmap.createScaledBitmap(bitmap, width, height, true);
    }

    private UsbDevice findUsbDevice(UsbManager usbManager) {
        int expectedVendorId = 10473;
        int expectedProductId = 653;

        for (UsbDevice device : usbManager.getDeviceList().values()) {
            int vendorId = device.getVendorId();
            int productId = device.getProductId();
            Log.d(TAG, "Checking USB Device: Vendor ID = " + vendorId + ", Product ID = " + productId);

            if (vendorId == expectedVendorId && productId == expectedProductId) {
                Log.d(TAG, "USB Device Found: " + device.getDeviceName());
                return device;
            }
        }
        Log.e(TAG, "No matching USB device found");
        return null;
    }
    private UsbEndpoint findUsbEndpoint(UsbDevice device) {
        for (int i = 0; i < device.getInterfaceCount(); i++) {
            UsbInterface usbInterface = device.getInterface(i);
            for (int j = 0; j < usbInterface.getEndpointCount(); j++) {
                UsbEndpoint endpoint = usbInterface.getEndpoint(j);
                if (endpoint.getType() == UsbConstants.USB_ENDPOINT_XFER_BULK &&
                        endpoint.getDirection() == UsbConstants.USB_DIR_OUT) {
                    Log.d(TAG, "USB Endpoint Found: " + endpoint.toString());
                    return endpoint;
                }
            }
        }
        Log.e(TAG, "No suitable USB endpoint found");
        return null;
    }

}
