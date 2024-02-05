import React, { useCallback, useEffect, useState } from "react";
import { Alert, AppState, Image, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { LoginProvider } from "./context/LoginContext";
import RootNavigator from "./navigator/RootNavigator";
import { toastConfig } from "./component/Toast";
import { UserProvider } from "./context/UserContext";
import { StatusBar } from "expo-status-bar";
import { RegistProvider } from "./context/RegistContext";
import { checkPosition, showMessage, speech } from "./utils";
import { Asset } from "expo-asset";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { AndroidNotificationPriority } from "expo-notifications";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { WSS_SERVER } from "./constant";
import Permission from "./screen/Permission";

SplashScreen.preventAutoHideAsync();

//TODO: 백그라운드에서 실행되어야할 것들 셋팅
// location(테스트)

const WEB_SOCKET_TASK = "WEB_SOCKET_TASK";
const LOCATION_TASK = "LOCATION_TASK";

let ws = null;

function createSocket() {
    if (ws === null) ws = new WebSocket(WSS_SERVER);

    ws.onopen = (e) => {
        console.log("webSocket connected");
    };

    ws.onmessage = (e) => {
        console.log("message : ", e.data);
        const parsed = JSON.parse(e.data);

        if (parsed.type === "REGIST") {
            speech(parsed.tts_msg, parsed.exceptionUserId, parsed.tts_id);
        }
    };

    ws.onerror = (e) => {
        console.log("ws.onerror:", e.message);
    };

    ws.onclose = (e) => {
        console.log("ws.onclose:", e);
        ws = null;
        if (e.reason !== "background" && e.reason !== "terminated") {
            setTimeout(() => createSocket(), 1000);
        }
    };
}

const createSocketOnBackground = () => {
    try {
        console.log("ws.readyState on background : ", ws.readyState);
        if (ws.readyState === 2 || ws.readyState === 3) {
            createSocket();
        }
        return backendData
            ? BackgroundFetch.BackgroundFetchResult.NewData
            : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (err) {
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: AndroidNotificationPriority.MAX,
    }),
});

const getCurrentLocation = async () => {
    let { status } = await Location.requestBackgroundPermissionsAsync();

    if (status !== "granted") {
        return;
    }

    const location = await Location.getCurrentPositionAsync();
    console.log("get location on background : ", location);
    const {
        coords: { latitude, longitude },
    } = location;

    checkPosition({ latitude, longitude });
};

const initBackgroundFetch = async (taskName, taskFn, interval = 60 * 15) => {
    try {
        if (!TaskManager.isTaskDefined(taskName)) {
            TaskManager.defineTask(taskName, taskFn);
        }
        const options = {
            minimumInterval: interval,
        };
        await BackgroundFetch.registerTaskAsync(taskName, options);
        console.log(taskName, "is registred.");
    } catch (err) {
        console.log("registerTaskAsync() failed:", err);
    }
};

initBackgroundFetch(WEB_SOCKET_TASK, createSocketOnBackground, 5);
initBackgroundFetch(LOCATION_TASK, getCurrentLocation, 5);

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [fontsLoaded] = useFonts({
        "SpoqaHanSansNeo-Bold": require("./assets/fonts/SpoqaHanSansNeo-Bold.otf"),
        "SpoqaHanSansNeo-Light": require("./assets/fonts/SpoqaHanSansNeo-Light.otf"),
        "SpoqaHanSansNeo-Medium": require("./assets/fonts/SpoqaHanSansNeo-Medium.otf"),
        "SpoqaHanSansNeo-Regular": require("./assets/fonts/SpoqaHanSansNeo-Regular.otf"),
        "SpoqaHanSansNeo-Thin": require("./assets/fonts/SpoqaHanSansNeo-Thin.otf"),
    });

    const [foreground, requestForeground] = Location.useForegroundPermissions();
    const [background, requestBackground] = Location.useBackgroundPermissions();

    const [pushGranted, setPushGranted] = useState(false);
    const [locationGranted, setLocationGranted] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                const imageAssets = cacheImages([
                    require(`./assets/images/intro/img_01.png`),
                    require(`./assets/images/intro/img_02.png`),
                    require(`./assets/images/intro/img_03.png`),
                ]);
                await Promise.all([...imageAssets]);

                if (Device.isDevice) {
                    const response = await Notifications.getPermissionsAsync();

                    let finalStatus = response.status;
                    if (response.status !== "granted") {
                        const response =
                            await Notifications.requestPermissionsAsync();
                        finalStatus = response.status;
                    }

                    if (finalStatus === "granted") {
                        // setPushGranted(true);
                    }
                }
            } catch (e) {
                console.warn("prepare error : ", e);
            } finally {
                setAppIsReady(true);
            }
        }

        AppState.addEventListener("change", (state) => {
            // console.log("state : ", state);
            // console.log("addEventlistner");
            console.log(ws);
            if (state === "background") {
                // if (ws) {
                //     ws.close(1000, "background");
                // }
                // createSocket();
            } else if (state === "active") {
                if (ws) {
                    ws.close();
                }
            }
        });

        if (ws === null) createSocket();

        prepare();

        return () => {
            if (ws) ws.close(1000, "terminated");
        };
    }, []);

    // useEffect(() => {
    //     if (
    //         foreground &&
    //         foreground.granted &&
    //         background &&
    //         background.granted
    //     ) {
    //         setLocationGranted(true);
    //     }
    // }, [foreground, background]);

    function cacheImages(images) {
        return images.map((image) => {
            if (typeof image === "string") {
                return Image.prefetch(image);
            } else {
                return Asset.fromModule(image).downloadAsync();
            }
        });
    }

    // const requestPermissions = async () => {
    //     if (locationGranted && !pushGranted) {
    //         Alert.alert(
    //             "알림 허용",
    //             "설정 > 애플리케이션 > 알테구에서 알림을 허용해주세요!"
    //         );
    //     }
    //     console.log(
    //         "[location] foreground granted : ",
    //         foreground.granted,
    //         " / status : ",
    //         foreground.status
    //     );
    //     console.log(
    //         "[location] background granted : ",
    //         background.granted,
    //         " / status : ",
    //         background.status
    //     );

    //     if (!foreground || !foreground.granted) {
    //         const response = await requestForeground();
    //         console.log("[location] request foreground response : ", response);
    //     }

    //     if (!background || !background.granted) {
    //         const response = await requestBackground();
    //         console.log("[location] request background response : ", response);
    //     }

    //     if (Device.isDevice) {
    //         const response = await Notifications.getPermissionsAsync();

    //         console.log(
    //             "[notification] get permission granted : ",
    //             response.granted,
    //             " / status : ",
    //             response.status
    //         );
    //         let finalStatus = response.status;
    //         if (response.status !== "granted") {
    //             const response = await Notifications.requestPermissionsAsync();
    //             finalStatus = response.status;
    //         }

    //         console.log("[notification] request response : ", response);
    //         if (finalStatus === "granted") {
    //             setPushGranted(true);
    //         }
    //     }
    // };

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady, fontsLoaded]);

    // if (fontsLoaded && (!locationGranted || !pushGranted)) {
    //     return (
    //         <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
    //             <Permission onPress={requestPermissions} />
    //         </View>
    //     );
    // }

    if (!appIsReady || !fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <LoginProvider>
                <UserProvider>
                    <RegistProvider>
                        <RootNavigator />
                    </RegistProvider>
                </UserProvider>
            </LoginProvider>
            <StatusBar style="dark" />
            <Toast position="bottom" bottomOffset="100" config={toastConfig} />
        </View>
    );
}
