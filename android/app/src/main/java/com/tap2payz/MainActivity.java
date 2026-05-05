package com.tap2payz;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbConstants;
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

  // Telpo C2 Internal Printer IDs
  private static final int TELPO_VID = 10473;
  private static final int TELPO_PID = 653;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Fullscreen/Kiosk Mode UI
    hideSystemUI();

    // Register the USB permission receiver with modern Android security flags
    usbPermissionReceiver = new UsbPermissionReceiver();
    IntentFilter filter = new IntentFilter(UsbPermissionReceiver.ACTION_USB_PERMISSION);
    filter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);

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
    boolean foundAny = false;

    if (usbManager == null || usbManager.getDeviceList() == null)
      return;

    for (UsbDevice device : usbManager.getDeviceList().values()) {
      boolean isTarget = false;

      Log.d(TAG, "Checking device: VID=" + device.getVendorId() + " PID=" + device.getProductId());

      // Check if it's Telpo or a Generic Printer Class
      // Some C2 variants use PIDs like 650, 651, 653, or 654
      if (device.getVendorId() == TELPO_VID && (device.getProductId() == TELPO_PID ||
          device.getProductId() == 650 ||
          device.getProductId() == 651 ||
          device.getProductId() == 654 ||
          device.getProductId() == 1539)) { // Common internal PID 0x0603
        isTarget = true;
      } else {
        for (int i = 0; i < device.getInterfaceCount(); i++) {
          if (device.getInterface(i).getInterfaceClass() == UsbConstants.USB_CLASS_PRINTER) {
            isTarget = true;
            break;
          }
        }
      }

      if (isTarget) {
        foundAny = true;
        if (!usbManager.hasPermission(device)) {
          int flags = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) ? PendingIntent.FLAG_MUTABLE
              : PendingIntent.FLAG_UPDATE_CURRENT;
          PendingIntent permissionIntent = PendingIntent.getBroadcast(this, 0,
              new Intent(UsbPermissionReceiver.ACTION_USB_PERMISSION), flags);
          usbManager.requestPermission(device, permissionIntent);
          Log.d(TAG, "Requested permission for: " + device.getDeviceName() + " (VID: " + device.getVendorId()
              + ")");
        }
      }
    }

    if (!foundAny)
      Log.w(TAG, "No POS printers found on USB bus");
  }

  private UsbDevice findUsbDevice(UsbManager usbManager) {

    for (UsbDevice device : usbManager.getDeviceList().values()) {
      int vid = device.getVendorId();
      int pid = device.getProductId();

      Log.d(TAG, "Scanning USB: VID=" + device.getVendorId() + " PID=" + device.getProductId()
          + " Class=" + device.getDeviceClass());

      // Check for specific Telpo Hardware
      if (device.getVendorId() == TELPO_VID && device.getProductId() == TELPO_PID) {
        Log.d(TAG, "Matched Internal Printer");
        return device;
      }

      // Generic check for USB Printer Class (Class 7) - Supports CP-306 and others
      for (int i = 0; i < device.getInterfaceCount(); i++) {
        if (device.getInterface(i).getInterfaceClass() == UsbConstants.USB_CLASS_PRINTER) {
          Log.d(TAG, "Matched Printer Class Device: " + device.getDeviceName()
              + " VID=" + device.getVendorId());
          return device;
        }
      }
    }
    return null;
  }

  @Override
  protected String getMainComponentName() {
    return "tap2payz";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        true, // fabricEnabled
        true // bridgelessEnabled
    );
  }
}