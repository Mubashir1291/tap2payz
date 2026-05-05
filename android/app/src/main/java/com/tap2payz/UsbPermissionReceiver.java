package com.tap2payz;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.util.Log;

public class UsbPermissionReceiver extends BroadcastReceiver {
    private static final String TAG = "UsbPermissionReceiver";
    public static final String ACTION_USB_PERMISSION = "com.tap2payz.USB_PERMISSION";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (ACTION_USB_PERMISSION.equals(action)) {
            synchronized (this) {
                UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
                if (device != null && usbManager.hasPermission(device)) {
                    // Permission granted, handle reinitialization or notify your app
                    Log.d(TAG, "USB permission granted for device: " + device.getDeviceName());
                    // Optionally, trigger any needed action here
                } else {
                    // Permission denied, handle accordingly
                    Log.d(TAG, "USB permission denied for device: " + device.getDeviceName());
                }
            }
        }
    }
}
