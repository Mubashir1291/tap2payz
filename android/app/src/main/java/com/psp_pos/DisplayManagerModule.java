package com.psp_pos;

import android.app.Activity;
import android.content.Context;
import android.hardware.display.DisplayManager;
import android.util.Log;
import android.view.Display;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DisplayManagerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private SecondScreenPresentation presentation;

    public DisplayManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DisplayManager";
    }

    @ReactMethod
    public void getDisplayCount(Callback callback) {
        DisplayManager displayManager = (DisplayManager) reactContext.getSystemService(Context.DISPLAY_SERVICE);
        Display[] displays = displayManager.getDisplays();
        callback.invoke(displays.length);
    }

    @ReactMethod
    public void showContentOnSecondDisplay(String contentType, String contentUri, Callback errorCallback) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            errorCallback.invoke("Activity is null");
            return;
        }
        activity.runOnUiThread(() -> {
            DisplayManager displayManager = (DisplayManager) reactContext.getSystemService(Context.DISPLAY_SERVICE);
            Display[] displays = displayManager.getDisplays();

            if (displays.length < 2) {
                errorCallback.invoke("No secondary display found");
                return;
            }

            // Dismiss any existing presentation before creating a new one
            if (presentation != null) {
                Log.d("DisplayManagerModule", "Dismissing existing presentation before creating a new one.");
                presentation.dismiss();
                presentation = null;
            }

            Display secondaryDisplay = displays[1];

            presentation = new SecondScreenPresentation(reactContext, secondaryDisplay, contentType, contentUri);
            try {
                presentation.show();
            } catch (Exception e) {
                errorCallback.invoke("Error showing presentation: " + e.getMessage());
            }
        });
    }

    @ReactMethod
    public void dismissSecondDisplay() {
        getCurrentActivity().runOnUiThread(() -> {
            if (presentation != null) {
                Log.d("DisplayManagerModule", "Dismissing presentation.");
                presentation.dismiss();
                presentation = null;
            } else {
                Log.d("DisplayManagerModule", "No presentation to dismiss.");
            }

            Activity currentActivity = getCurrentActivity();
            if (currentActivity != null && currentActivity instanceof SecondDisplayActivity) {
                Log.d("DisplayManagerModule", "Finishing SecondDisplayActivity.");
                currentActivity.finish();
            } else {
                Log.d("DisplayManagerModule", "Current activity is not an instance of SecondDisplayActivity.");
            }
        });
    }

}
