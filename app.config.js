export default {
    expo: {
        name: "altegoo-app",
        slug: "altegoo-app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/app_icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash6.png",
            resizeMode: "cover",
            backgroundColor: "#ffffff",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            bundleIdentifier: "com.atg.altegoo",
            buildNumber: "1.0.0",
        },
        extra: {
            eas: {
                projectId: "0d74eebd-b11d-421e-bce6-587423f34de3",
            },
        },
        android: {
            package: "com.atg.altegoo",
            googleServicesFile: "./google-services.json",
            config: {
                googleSignIn: {
                    apiKey: "AIzaSyBQ3Cu1W2RAYuFXogaGR3cIR849LbqbO5g",
                },
            },
            permissions: [
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.FOREGROUND_SERVICE",
                "android.permission.RECEIVE_BOOT_COMPLETED",
            ],
        },
        plugins: [
            [
                "expo-location",
                {
                    isAndroidBackgroundLocationEnabled: true,
                },
            ],
            "expo-asset",
            "expo-font",
        ],
    },
    android: {
        package: "com.atg.altegoo",
        googleServicesFile: "./google-services.json",
        config: {
            googleSignIn: {
                apiKey: "AIzaSyBQ3Cu1W2RAYuFXogaGR3cIR849LbqbO5g",
            },
        },
        versionCode: 1,
        adaptiveIcon: {
            foregroundImage: "./assets/app_icon.png",
            backgroundColor: "#FFFFFF",
        },
    },
    web: {
        favicon: "./assets/favicon.png",
    },
};
