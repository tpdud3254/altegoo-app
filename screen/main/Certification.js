import React, { useEffect, useRef, useState } from "react";
import {
    View,
    SafeAreaView,
    useWindowDimensions,
    Platform,
    Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { LAYOUT_PADDING_X } from "../../component/layout/Layout";
import { CommonActions } from "@react-navigation/native";
import { SERVER, VALID } from "../../constant";
import { showErrorMessage, showMessage } from "../../utils";
import axios from "axios";
import SendIntentAndroid from "react-native-send-intent";

function Certification({ navigation }) {
    const webViewRef = useRef();
    const { width, height } = useWindowDimensions();
    const [progress, setProgress] = useState(0.0);

    const sendMessage = (data) => {
        webViewRef.current.postMessage(data);
    };

    const errorHandler = ({ nativeEvent }) =>
        console.log("WebView error: ", nativeEvent);

    const receiveMessage = async (event) => {
        console.log("받음");
        try {
            const {
                nativeEvent: { data },
            } = event;
            const parsed = JSON.parse(data);
            console.log("parsed : ", parsed);
            switch (parsed.result) {
                case "cancel":
                    navigation.goBack();
                    break;
                case "ok":
                    console.log(parsed.data);
                    goToPage(parsed.data);

                    break;
                default:
                    navigation.goBack();
                    break;
            }
        } catch (e) {
            console.log("receiveMessage :", e);
            navigation.goBack();
        }
    };

    useEffect(() => {
        if (progress === 1) {
            sendMessage(
                JSON.stringify({
                    // ...route?.params?.data,
                    test: true,
                })
            );
        }
        console.log("progress : ", progress);
    }, [progress]);

    const goToPage = async (data) => {
        try {
            const response = await axios.get(SERVER + "/users/search", {
                params: {
                    phone: data.phone,
                },
            });

            const {
                data: { result },
            } = response;

            console.log(response);
            if (result !== VALID) {
                showErrorMessage("존재하지 않는 사용자입니다.");
                navigation.goBack();
                return;
            }
        } catch (error) {
            console.log(error);
            showErrorMessage("회원정보를 찾을 수 없습니다.");
            navigation.goBack();
            return;
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: "SignIn" },
                    {
                        name: "SetPassword",
                        params: { cerfifyData: data },
                    },
                ],
            })
        );
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",

                marginLeft: -LAYOUT_PADDING_X,
                marginRight: -LAYOUT_PADDING_X,
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <WebView
                        ref={webViewRef}
                        originWhitelist={[
                            "http://*",
                            "https://*",
                            "intent://*",
                        ]}
                        style={{ width: width, height: height, flex: 1 }}
                        source={{
                            uri: "https://master.d1p7wg3e032x9j.amplifyapp.com/certification",
                        }}
                        javaScriptEnabled={true}
                        onError={errorHandler}
                        onMessage={receiveMessage}
                        onLoadProgress={(event) => {
                            setProgress(event.nativeEvent.progress);
                        }}
                        onShouldStartLoadWithRequest={(event) => {
                            console.log("onShouldstart");
                            console.log(event);
                            if (
                                event.url.startsWith("http://") ||
                                event.url.startsWith("https://") ||
                                event.url.startsWith("about:blank")
                            ) {
                                return true;
                            }
                            if (
                                Platform.OS === "android" &&
                                event.url.startsWith("intent")
                            ) {
                                let newUrl = "";
                                if (event.url.includes("tauthlink")) {
                                    newUrl = `tauthlink${event.url.substring(
                                        6,
                                        event.url.length + 1
                                    )}`;
                                    console.log(newUrl);
                                }
                                if (event.url.includes("ktauthexternalcall")) {
                                    newUrl = `ktauthexternalcall${event.url.substring(
                                        6,
                                        event.url.length + 1
                                    )}`;
                                    console.log(newUrl);
                                }
                                if (event.url.includes("upluscorporation")) {
                                    newUrl = `upluscorporation${event.url.substring(
                                        6,
                                        event.url.length + 1
                                    )}`;
                                    console.log(newUrl);
                                }
                                SendIntentAndroid.openAppWithUri(newUrl)
                                    .then((isOpened) => {
                                        if (!isOpened) {
                                            showMessage(
                                                "앱 실행에 실패했습니다"
                                            );
                                        }
                                        return false;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                                return false;
                            }
                            if (Platform.OS === "ios") {
                                return true;
                            }
                            return true;
                        }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

Certification.propTypes = {};
export default Certification;
