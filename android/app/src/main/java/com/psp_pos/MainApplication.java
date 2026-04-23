package com.psp_pos;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.common.apiutil.util.SDKUtil;
import com.common.apiutil.util.SystemUtil;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.ArrayList;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private static final String TAG = "MainApplication";

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

        // The following lines are commented out as their logic should be handled by
        // specific modules
        // or after the SDK is fully initialized and ready to be used by the app.
        // if (!SystemUtil.isInstallServiceApk()) { Log.d(TAG, "API 调用 >> 系统反射"); }
        // else { Log.d(TAG, "API 调用 >> 服务APK"); }
        // internal_Model = SystemUtil.getInternalModel();
        // initConfig();
        // try { detectPrinterType(); } catch (IOException | DeviceAlreadyOpenException
        // e) { Log.e(TAG, "Error detecting printer type", e); }
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        // If any BroadcastReceivers were registered here, unregister them.
        // For now, no receivers are registered in this simplified MainApplication.
    }

}
