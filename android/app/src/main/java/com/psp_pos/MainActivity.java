package com.psp_pos;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.view.View;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

    private UsbPermissionReceiver usbPermissionReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        // Register the USB permission receiver
        usbPermissionReceiver = new UsbPermissionReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(UsbPermissionReceiver.ACTION_USB_PERMISSION);
        registerReceiver(usbPermissionReceiver, filter);

        // Request USB permission if needed
        requestUsbPermission();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Unregister the receiver
        if (usbPermissionReceiver != null) {
            unregisterReceiver(usbPermissionReceiver);
        }
    }

    private void requestUsbPermission() {
        UsbManager usbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
        UsbDevice device = findUsbDevice(usbManager); // Replace this with your method to find the USB device

        if (device != null && !usbManager.hasPermission(device)) {
            PendingIntent permissionIntent = PendingIntent.getBroadcast(this, 0,
                    new Intent(UsbPermissionReceiver.ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
            usbManager.requestPermission(device, permissionIntent);
        }
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
                DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }

    private UsbDevice findUsbDevice(UsbManager usbManager) {
        int expectedVendorId = 10473;
        int expectedProductId = 653;

        for (UsbDevice device : usbManager.getDeviceList().values()) {
            int vendorId = device.getVendorId();
            int productId = device.getProductId();
            if (vendorId == expectedVendorId && productId == expectedProductId) {
                return device;
            }
        }
        return null;
    }
}
