package com.payzee;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PermissionModule extends ReactContextBaseJavaModule {
    private UsbPermissionReceiver usbPermissionReceiver;
    private static final int REQUEST_CODE = 1011;
    private Promise permissionPromise;

    public PermissionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public String getName() {
        return "PermissionModule";
    }

    @ReactMethod
    public void requestPermission(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (Environment.isExternalStorageManager()) {
                promise.resolve(true);
            } else {
                permissionPromise = promise;
                Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                intent.setData(Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                getCurrentActivity().startActivityForResult(intent, REQUEST_CODE);
            }
        } else {
            promise.resolve(true);
        }
    }

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
            if (requestCode == REQUEST_CODE) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    if (Environment.isExternalStorageManager()) {
                        permissionPromise.resolve(true);
                    } else {
                        permissionPromise.reject("PERMISSION_DENIED", "Permission denied by user");
                    }
                }
            }
        }
    };
}
