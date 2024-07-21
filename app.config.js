module.exports = {
    expo: {
      name: "ResQ",
      slug: "resq",
      scheme: "ResQ",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/image1.png",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/images/image1.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/image2.png",
          backgroundColor: "#ffffff",
        },
        permissions: [
          "android.permission.READ_EXTERNAL_STORAGE",
          "android.permission.WRITE_EXTERNAL_STORAGE",
          "android.permission.ACCESS_MEDIA_LOCATION",
          "android.permission.CAMERA",
          "android.permission.RECORD_AUDIO",
          "android.permission.BLUETOOTH_SCAN",
          "android.permission.BLUETOOTH_CONNECT",
          "android.permission.ACCESS_FINE_LOCATION",
          "android.permission.ACCESS_COARSE_LOCATION",
          "android.permission.INTERNET",
          "android.permission.ACCESS_WIFI_STATE",
          "android.permission.ACCESS_NETWORK_STATE",
          "android.permission.BLUETOOTH",
          "android.permission.BLUETOOTH_ADMIN",
        ],
        package: "com.resqapp.resq",
        backgroundColor: "#ffffff",
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      },
      web: {
        bundler: "metro",
        output: "static",
      },
      plugins: [
        [
          "expo-media-library",
          {
            photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
            savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
            isAccessMediaLocationEnabled: true,
          },
        ],
        [
          "expo-camera",
          {
            cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
            microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
            recordAudioAndroid: true,
          },
        ],
        "expo-video",
        "expo-secure-store",
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        router: {
          origin: false,
        },
        eas: {
          projectId: "9fa9c23d-427b-479d-880a-a2f8bbcde080",
        },
      },
      owner: "sankshipthshetty",
      jsEngine: "hermes",
    },
  };
  