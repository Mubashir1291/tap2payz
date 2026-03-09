package com.payzee;

import android.app.Application;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbConstants;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.os.Build;
import android.util.Log;

import com.common.apiutil.DeviceAlreadyOpenException;
import com.common.apiutil.moneybox.MoneyBox;
import com.common.apiutil.printer.ThermalPrinter;
import com.common.apiutil.serial.Serial;
import com.common.apiutil.util.PowerUtil;
import com.common.apiutil.util.SDKUtil;
import com.common.apiutil.util.SystemUtil;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.soloader.SoLoader;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private static final String TAG = "MainApplication";
    private static final String ACTION_USB_PERMISSION = "com.payzee.USB_PERMISSION";

    public static ThermalPrinter thermalPrinter;
    public static MoneyBox moneyBox;
    public static PowerUtil powerUtil;
    private static int[] config = null;

    private String internal_Model;
    private boolean has80mmUsbPrinter = false;
    private int printerType; // Add this variable to store the detected printer type

    private Serial mSerialPort;
    private UsbManager usbManager;
    private PendingIntent permissionIntent;
    private static final int NOPAPER = 3;

    private boolean isPrinterOpen = false;
    private UsbDevice device2;
    private UsbDeviceConnection connection;
    private UsbEndpoint endpoint;

    private final Object printerLock = new Object();
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            List<ReactPackage> newPackages = new ArrayList<>(packages);
            newPackages.add(new MyAppPackage());
            newPackages.add(new PermissionPackage());
            return newPackages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);

        // Initialize SDK
        SDKUtil.getInstance(this).initSDK();

        usbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
        permissionIntent = PendingIntent.getBroadcast(this, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
        registerReceiver(usbReceiver, new IntentFilter(ACTION_USB_PERMISSION));

        if (!SystemUtil.isInstallServiceApk()) {
            Log.d(TAG, "API 调用 >> 系统反射");
        } else {
            Log.d(TAG, "API 调用 >> 服务APK");
        }

        internal_Model = SystemUtil.getInternalModel();
        initConfig();
//        requestPermission();

        try {
            detectPrinterType();
        } catch (IOException | DeviceAlreadyOpenException e) {
            Log.e(TAG, "Error detecting printer type", e);
        }
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        unregisterReceiver(usbReceiver);
    }
    public void initializePrinter() {
        synchronized (printerLock) {
            try {
                UsbManager usbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
                int expectedVendorId = 10473;
                int expectedProductId = 653;
                boolean deviceFound = false;

                for (UsbDevice device : usbManager.getDeviceList().values()) {
                    int vendorId = device.getVendorId();
                    int productId = device.getProductId();
                    Log.d(TAG, "Checking USB Device: Vendor ID = " + vendorId + ", Product ID = " + productId);

                    if (vendorId == expectedVendorId && productId == expectedProductId) {
                        Log.d(TAG, "USB Device Found: " + device.getDeviceName());
                        device2 = device;
                        deviceFound = true;

                        if (usbManager.hasPermission(device2)) {
                            Log.d(TAG, "USB Device has permission");
                        } else {
                            Log.d(TAG, "Requesting permission for USB Device");
                            PendingIntent mPermissionIntent;
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                                mPermissionIntent = PendingIntent.getBroadcast(
                                        this, 0, new Intent("com.android.usb.USB_PERMISSION"),
                                        PendingIntent.FLAG_MUTABLE);
                            } else {
                                mPermissionIntent = PendingIntent.getBroadcast(
                                        this, 0, new Intent("com.android.usb.USB_PERMISSION"), PendingIntent.FLAG_IMMUTABLE);
                            }
                            usbManager.requestPermission(device2, mPermissionIntent);
                            return;
                        }
                        break;
                    }
                }

                if (!deviceFound) {
                    Log.e(TAG, "No USB device found during initialization");
                    return;
                }

                if (connection != null) {
                    Log.d(TAG, "Releasing previous USB connection");
                    connection.releaseInterface(device2.getInterface(0));
                    connection.close();
                    connection = null;
                }

                connection = usbManager.openDevice(device2);
                if (connection == null) {
                    Log.e(TAG, "Failed to open USB device connection");
                    return;
                }

                UsbInterface usbInterface = device2.getInterface(0);
                if (!connection.claimInterface(usbInterface, true)) {
                    Log.e(TAG, "Failed to claim USB interface");
                    connection.close();
                    connection = null;
                    return;
                }

                endpoint = findUsbEndpoint(device2);
                if (endpoint == null) {
                    Log.e(TAG, "No suitable USB endpoint found");
                    connection.close();
                    connection = null;
                    return;
                }

                // Additional printer setup can be done here
                Log.d(TAG, "Printer configured successfully");

            } catch (Exception e) {
                Log.e(TAG, "Unexpected error during initialization: " + e.getMessage(), e);
            }
        }
    }
    private UsbEndpoint findUsbEndpoint(UsbDevice device) {
        for (int i = 0; i < device.getInterfaceCount(); i++) {
            UsbInterface usbInterface = device.getInterface(i);
            for (int j = 0; j < usbInterface.getEndpointCount(); j++) {
                UsbEndpoint endpoint = usbInterface.getEndpoint(j);
                if (endpoint.getType() == UsbConstants.USB_ENDPOINT_XFER_BULK &&
                        endpoint.getDirection() == UsbConstants.USB_DIR_OUT) {
                    return endpoint;
                }
            }
        }
        return null;
    }
    private final BroadcastReceiver usbReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (ACTION_USB_PERMISSION.equals(action)) {
                synchronized (this) {
                    UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        if (device != null) {
                            Log.d(TAG, "USB Permission Granted for device: " + device.getDeviceName());
                        }
                    } else {
                        Log.d(TAG, "USB Permission Denied");
                    }
                }
            }
        }
    };

    public String getPrinterType() {
        return internal_Model;
    }

    @ReactMethod
    public void getPrinterType(Promise promise) {
        String printerType = getPrinterType();
        promise.resolve(printerType);
    }

    private void detectPrinterType() throws IOException, DeviceAlreadyOpenException {
        if ("USB".equalsIgnoreCase(SystemUtil.getProperty("persist.printer.interface", ""))) {
            has80mmUsbPrinter = ThermalPrinter.init80mmUsbPrinter(MainApplication.this);
            Log.d(TAG, "Printer Type from SystemUtil: " + has80mmUsbPrinter);
        } else {
            ThermalPrinter.init80mmSerialPrinter();
            has80mmUsbPrinter = false;
        }

        printerType = SystemUtil.getDeviceType();
        Log.d(TAG, "Printer Type from SystemUtil: " + printerType);

        int deviceType = SystemUtil.getDeviceType();
            mSerialPort = new Serial("/dev/ttyS4", SystemUtil.getPrinterSY581Baudrate(), 0);
    }

    public static void setConfig(int[] config) {
        MainApplication.config = config;
    }

    public static int[] getConfig() {
        return config;
    }

    private void initConfig() {
        String[] testSupports = SystemUtil.getDeviceSupport();
        if (testSupports != null) {
            setConfig(StringArrayToIntArray(testSupports));
        } else {
            switch (internal_Model) {
                case "T20":
                    setConfig(ConfigureUtil.T20);
                    break;
                case "T20P":
                    setConfig(ConfigureUtil.T20P);
                    break;
                case "C1B":
                    setConfig(ConfigureUtil.C1B);
                    break;
                case "C11":
                    setConfig(ConfigureUtil.C11);
                    break;
                case "T20B":
                    setConfig(ConfigureUtil.T20B);
                    break;
                case "C1P":
                    setConfig(ConfigureUtil.C1P);
                    break;
                case "TPS967M":
                    setConfig(ConfigureUtil.TPS967M);
                    break;
                case "F10B":
                    setConfig(ConfigureUtil.F10B);
                    break;
                case "TPS980B":
                    setConfig(ConfigureUtil.TPS980B);
                    break;
                case "C1Pro":
                    setConfig(ConfigureUtil.C1Pro);
                    break;
                case "TPS900":
                    setConfig(ConfigureUtil.TPS900);
                    break;
                case "S8G":
                    setConfig(ConfigureUtil.S8G);
                    break;
                case "M8":
                    setConfig(ConfigureUtil.M8);
                    break;
                case "V502":
                    setConfig(ConfigureUtil.V502);
                    break;
                case "T10":
                    setConfig(ConfigureUtil.T10);
                    break;
                default:
                    setConfig(ConfigureUtil.COMMON);
                    break;
            }
        }
    }

    public int[] StringArrayToIntArray(String[] arr) {
        int[] array = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            array[i] = Integer.parseInt(arr[i]);
        }
        return array;
    }

//    private void requestPermission() {
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
//            if (!Environment.isExternalStorageManager()) {
//                Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
//                intent.setData(Uri.parse("package:" + getPackageName()));
////                startActivityForResult(intent, 1011);
//            }
//        }
//    }
}

