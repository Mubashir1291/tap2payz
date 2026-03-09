package com.payzee;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.Display;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.ImageView;

public class SecondDisplayActivity extends Activity {

    private ImageView imageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set the layout from the XML file
        setContentView(R.layout.presentation_layout);

        // Get the display manager and the second display
        DisplayManager displayManager = (DisplayManager) getSystemService(Context.DISPLAY_SERVICE);
        Display[] displays = displayManager.getDisplays();
        if (displays.length < 2) {
            finish(); // Close the activity if there's no second display
            return;
        }
        Display secondDisplay = displays[1];

        // Configure the window manager to use the second display
        WindowManager windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY, // Use appropriate type
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                        WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
                        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.TRANSLUCENT); // Correct pixel format

        params.gravity = Gravity.TOP | Gravity.LEFT;
        params.x = 0;
        params.y = 0;

        // Find the ImageView in the layout
        imageView = findViewById(R.id.presentation_image);

        // Get the content URI from the intent
        Intent intent = getIntent();
        String contentUri = intent.getStringExtra("contentUri");

        // Check if the content URI is valid and set the image
        if (contentUri != null && !contentUri.isEmpty()) {
            // Set the image URI if provided
            imageView.setImageURI(Uri.parse(contentUri));
        } else {
            // Set the default image if no URI is provided
            imageView.setImageResource(R.drawable.ic_placeholder); // Make sure to use the correct drawable name
        }

        // Add the view to the window manager
        windowManager.addView(findViewById(R.id.presentation_image), params);
    }
}
