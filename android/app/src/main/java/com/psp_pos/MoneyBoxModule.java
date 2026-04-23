package com.psp_pos;

import com.common.apiutil.ErrorCode;
import com.common.apiutil.moneybox.MoneyBox;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MoneyBoxModule extends ReactContextBaseJavaModule {

    public MoneyBoxModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MoneyBoxModule";
    }

    @ReactMethod
    public void openMoneyBox(Promise promise) {
        try {
            // No argument is passed if MoneyBox.open() expects 0 arguments
            int result = MoneyBox.open(); // Call open without arguments

            if (result == ErrorCode.OK) {
                // Delay to allow the money box to open
                Thread.sleep(500);
                promise.resolve("Money box opened successfully");
            } else if (result == ErrorCode.ERR_SYS_UNEXPECT) {
                promise.reject("Error", "Unexpected system error occurred");
            } else if (result == ErrorCode.ERR_SYS_NOT_SUPPORT) {
                promise.reject("Error", "System does not support opening the money box");
            } else {
                promise.reject("Error", "Failed to open money box");
            }
        } catch (Exception e) {
            promise.reject("Exception", e.getMessage());
        }
    }

    @ReactMethod
    public void getMoneyBoxState(Promise promise) {
        try {
            // No argument is passed if MoneyBox.getState() expects 0 arguments
            int state = MoneyBox.getState(); // Call getState without arguments

            if (state == 1) {
                promise.resolve("Money box is open");
            } else if (state == 0) {
                promise.resolve("Money box is closed");
            } else if (state == ErrorCode.ERR_SYS_UNEXPECT) {
                promise.reject("Error", "Unexpected system error");
            } else if (state == ErrorCode.ERR_SYS_NOT_SUPPORT) {
                promise.reject("Error", "System does not support getting money box state");
            } else {
                promise.reject("Error", "Failed to retrieve money box state");
            }
        } catch (Exception e) {
            promise.reject("Exception", e.getMessage());
        }
    }
}
