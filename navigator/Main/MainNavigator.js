import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import LoadingLayout from "../../component/layout/LoadingLayout";
import { FONTS, FONT_OFFSET, VALID } from "../../constant";
import LoginContext from "../../context/LoginContext";
import Charge from "../../screen/main/Charge";
import Payment from "../../screen/main/Payment";
import Welcome from "../../screen/main/Welcome";
import { SERVER } from "../../constant";
import { checkPosition, getAsyncStorageToken, speech } from "../../utils";
import TabsNavigator from "./TabsNavigator";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Image, Platform } from "react-native";
import { AndroidNotificationVisibility } from "expo-notifications";
import { color } from "../../styles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import OrderProgress from "../../screen/main/orders/OrderProgress";
import RegistNavigator from "./RegistNavigator";
import OrderDetails from "../../screen/main/orders/OrderDetails";
import DriverOrderProgress from "../../screen/main/orders/DriverOrderProgress";
import SettingNavigator from "./SettingNavigator";
import JoinGugupack from "../../screen/main/gugupack/JoinGugupack";
import CancelGugupack from "../../screen/main/gugupack/CancelGugupack";
import StandByOrderProgress from "../../screen/main/orders/StandByOrderProgress";
import Constants from "expo-constants";

Location.watchPositionAsync(
    {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000 * 10, //TEST: 나중에 수치 변경
        distanceInterval: 1000, //TEST: 나중에 수치 변경
    },
    async (position) => {
        const {
            coords: { latitude, longitude },
        } = position;

        console.log("watchPositionAsync : ", latitude, longitude);
        checkPosition({ latitude, longitude });
    }
);

const Stack = createStackNavigator();

export default function MainNavigator() {
    const [loading, setLoading] = useState(true);
    const { firstLogin } = useContext(LoginContext);
    const notificationListener = useRef();
    const responseListener = useRef();
    const navigation = useNavigation();

    useEffect(() => {
        registerForPushNotificationsAsync().then(async (token) => {
            try {
                const response = await axios.post(
                    SERVER + "/push/token",
                    {
                        token,
                    },
                    {
                        headers: {
                            auth: await getAsyncStorageToken(),
                        },
                    }
                );

                console.log(response.data);
            } catch (error) {
                console.log("error : ", error);
            }
        });

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                const {
                    request: {
                        content: { data },
                    },
                } = notification;

                console.log(
                    "addNotificationReceivedListener notification : ",
                    data
                );
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(
                        "addNotificationResponseReceivedListener response : ",
                        response
                    );

                    if (response?.notification?.request?.content?.data) {
                        const pushData =
                            response.notification.request.content.data;

                        if (pushData.screen === "DriverOrderProgress") {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [
                                        { name: "TabsNavigator" },
                                        {
                                            name: "DriverOrderProgress",
                                            params: {
                                                orderId: pushData.orderId,
                                            },
                                        },
                                    ],
                                })
                            );
                        } else if (pushData.screen === "OrderProgress") {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [
                                        { name: "TabsNavigator" },
                                        {
                                            name: "OrderProgress",
                                            params: {
                                                orderId: pushData.orderId,
                                            },
                                        },
                                    ],
                                })
                            );
                        } else if (pushData.screen === "OrderDetails") {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [
                                        { name: "TabsNavigator" },
                                        {
                                            name: "OrderDetails",
                                            params: {
                                                orderId: pushData.orderId,
                                            },
                                        },
                                    ],
                                })
                            );
                        }
                    }
                }
            );
        //NEXT: wake lock 추가 (https://www.npmjs.com/package/react-native-android-wake-lock?activeTab=readme)

        setLoading(false);

        return () => {
            if (
                typeof notificationListener.current !== "undefined" &&
                typeof responseListener.current !== "undefined"
            ) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
                Notifications.removeNotificationSubscription(
                    responseListener.current
                );
            }
        };
    }, []);

    const registerForPushNotificationsAsync = async () => {
        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: color.main,
                lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
            });

            Notifications.setNotificationChannelAsync("sky_push", {
                name: "sky_push",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: color.main,
                lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
                sound: "sky_push.wav",
                enableVibrate: true,
            });

            Notifications.setNotificationChannelAsync("ladder_push", {
                name: "ladder_push",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: color.main,
                lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
                sound: "ladder_push.wav",
                enableVibrate: true,
            });
        }

        let token;

        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (Device.isDevice) {
            token = (await Notifications.getDevicePushTokenAsync()).data;
            console.log("push token : ", token);
        } else {
            alert("Must use physical device for Push Notifications");
        }

        return token;
    };

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Stack.Navigator
                    screenOptions={{
                        headerShown: true,
                        headerTitleAlign: "center",
                        headerShadowVisible: false,
                        headerBackTitleVisible: false,
                        presentation: "transparentModal",
                        headerTintColor: color["header-title-text"],
                        headerTitleStyle: {
                            fontSize: 18 + FONT_OFFSET,
                            fontFamily: FONTS.medium,
                        },
                        headerStyle: {
                            backgroundColor: color["page-background"],
                        },
                        headerBackImage: () => (
                            <Image
                                source={require(`../../assets/images/icons/btn_prev.png`)}
                                style={{
                                    resizeMode: "contain",
                                    width: 25,
                                    marginLeft: 5,
                                }}
                            />
                        ),
                    }}
                >
                    {firstLogin ? (
                        <Stack.Screen
                            name="Welcome"
                            component={Welcome}
                            options={{
                                headerShown: false,
                            }}
                        />
                    ) : null}

                    <Stack.Screen
                        name="TabsNavigator"
                        component={TabsNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OrderProgress"
                        component={OrderProgress}
                        options={{
                            headerTitle: "작업 현황",
                        }}
                    />
                    <Stack.Screen
                        name="DriverOrderProgress"
                        component={DriverOrderProgress}
                        options={{
                            headerTitle: "작업 현황",
                        }}
                    />
                    <Stack.Screen
                        name="StandByOrderProgress"
                        component={StandByOrderProgress}
                        options={{
                            headerTitle: "대기 중인 작업",
                        }}
                    />
                    <Stack.Screen
                        name="OrderDetails"
                        component={OrderDetails}
                        options={{
                            headerTitle: "작업 상세 보기",
                        }}
                    />
                    <Stack.Screen
                        name="RegistNavigator"
                        component={RegistNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SettingNavigator"
                        component={SettingNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Charge"
                        component={Charge}
                        options={{
                            title: "결제하기",
                            headerShown: false,
                            headerTitleAlign: "center",
                        }}
                    />
                    <Stack.Screen
                        name="JoinGugupack"
                        component={JoinGugupack}
                        options={{
                            title: "구구팩 신청하기",
                            headerTitleAlign: "center",
                        }}
                    />
                    <Stack.Screen
                        name="CancelGugupack"
                        component={CancelGugupack}
                        options={{
                            title: "구구팩 해지하기",
                            headerTitleAlign: "center",
                        }}
                    />
                </Stack.Navigator>
            )}
        </>
    );
}
