package com.tap2payz

import android.app.Application
import android.util.Log
import com.common.apiutil.util.SDKUtil
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<com.facebook.react.ReactPackage> =
            PackageList(this).packages.apply {
              add(MyAppPackage())
              add(PermissionPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          add(MyAppPackage())
          add(PermissionPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    
    // Initialize SDK with robust error catching
    try {
        SDKUtil.getInstance(this).initSDK()
        Log.d("MainApplication", "POS SDK initialized successfully")
    } catch (e: Exception) {
        Log.e("MainApplication", "CRITICAL ERROR: SDK initialization failed!", e)
    }
  }
}
