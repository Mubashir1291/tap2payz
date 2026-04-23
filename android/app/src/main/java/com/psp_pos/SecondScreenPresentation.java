package com.psp_pos;

import android.app.Presentation;
import android.content.Context;
import android.os.Bundle;
import android.view.Display;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;

public class SecondScreenPresentation extends Presentation {

    private ReactRootView reactRootView;
    private ReactInstanceManager reactInstanceManager;

    public SecondScreenPresentation(Context outerContext, Display display, String contentType, String contentUri) {
        super(outerContext, display);

        // Initialize the ReactRootView and get the ReactInstanceManager
        reactRootView = new ReactRootView(outerContext);

        // Access the ReactNativeHost via the Application class
        reactInstanceManager = ((ReactApplication) outerContext.getApplicationContext())
                .getReactNativeHost()
                .getReactInstanceManager();

        // Pass properties like contentType and contentUri to your React Native screen
        Bundle initialProps = new Bundle();

        // Use 'SecondDisplayScreen' as the component name you registered in React
        // Native
        reactRootView.startReactApplication(
                reactInstanceManager,
                "SecondDisplayScreen"

        );
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(reactRootView);
    }

    @Override
    public void dismiss() {
        super.dismiss();
        if (reactRootView != null) {
            reactRootView.unmountReactApplication();
            reactRootView = null;
        }
    }
}
