package com.psp_pos;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";
    private UsbPermissionReceiver usbPermissionReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Fullscreen/Kiosk Mode UI
        hideSystemUI();

        // Register the USB permission receiver with modern Android security flags
        usbPermissionReceiver = new UsbPermissionReceiver();
        IntentFilter filter = new IntentFilter(UsbPermissionReceiver.ACTION_USB_PERMISSION);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(usbPermissionReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(usbPermissionReceiver, filter);
        }

        // Request USB permission
        requestUsbPermission();
    }

    private void hideSystemUI() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (usbPermissionReceiver != null) {
            try {
                unregisterReceiver(usbPermissionReceiver);
            } catch (IllegalArgumentException e) {
                Log.e(TAG, "Receiver not registered: " + e.getMessage());
            }
        }
    }

    private void requestUsbPermission() {
        UsbManager usbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
        UsbDevice device = findUsbDevice(usbManager);

        if (device != null) {
            if (!usbManager.hasPermission(device)) {
                // USB Hardware often requires MUTABLE intents to attach device data
                int flags = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
                        ? PendingIntent.FLAG_MUTABLE
                        : PendingIntent.FLAG_UPDATE_CURRENT;

                PendingIntent permissionIntent = PendingIntent.getBroadcast(
                        this, 0, new Intent(UsbPermissionReceiver.ACTION_USB_PERMISSION), flags);

                usbManager.requestPermission(device, permissionIntent);
                Log.d(TAG, "Requesting USB permission for: " + device.getDeviceName());
            } else {
                Log.d(TAG, "USB Permission already granted");
            }
        } else {
            Log.w(TAG, "POS USB Device not found during request");
        }
    }

    private UsbDevice findUsbDevice(UsbManager usbManager) {
        int expectedVendorId = 10473;
        int expectedProductId = 653;

        for (UsbDevice device : usbManager.getDeviceList().values()) {
            if (device.getVendorId() == expectedVendorId && device.getProductId() == expectedProductId) {
                return device;
            }
        }
        return null;
    }

    @Override
    protected String getMainComponentName() {
        return "PSP_POS";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
                this,
                getMainComponentName(),
                true, // fabricEnabled
                true  // bridgelessEnabled
        );
    }
}