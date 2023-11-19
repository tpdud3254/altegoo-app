import React, { useEffect, useRef, useState } from "react";
import { Alert, View, SafeAreaView, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import { PAYMENT_SERVER, SERVER, VALID } from "../../constant";
import axios from "axios";
import { getAsyncStorageToken, showMessage } from "../../utils";

function Charge({ navigation, route }) {
    const webViewRef = useRef();
    const [progress, setProgress] = useState(0.0);

    console.log("charge : ", route?.params?.data);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", goBack);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress");
        };
    }, []);

    useEffect(() => {
        //TEST: 테스트 코드
        setTimeout(async () => {
            await setPoint();
        }, 2000);
    }, []);

    const goBack = () => {
        navigation.goBack();
        return true;
    };

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
            console.log(parsed);
            switch (parsed.handle) {
                case "error":
                    Alert.alert("결제 오류입니다. 다시 시도해주세요.");
                    navigation.goBack();
                    break;
                case "cancle":
                    Alert.alert("결제를 취소하였습니다.");
                    navigation.goBack();
                    break;
                case "issued":
                    await setPoint();
                    break;
                case "done":
                    await setPoint();
                    break;
                case "confirm":
                    // navigation.navigate("ReservationConfirm", {
                    //     data: { price, checkIn, checkOut, service, petId },
                    // });
                    break;
            }
        } catch (e) {
            console.log("e!!");
        }
    };

    const setPoint = async () => {
        try {
            const response = await axios.patch(
                SERVER + "/points/charge",
                {
                    pointId: route?.params?.data?.pointId,
                    curPoint: route?.params?.data?.curPoint,
                    point: route?.params?.data?.price,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: {
                    data: { points },
                    result,
                },
            } = response;

            console.log(points);

            if (result === VALID) {
                showMessage("포인트 충전이 완료되었습니다.");
                navigation.goBack();
            } else console.log(msg);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (progress === 1) {
            sendMessage(
                JSON.stringify({
                    ...route?.params?.data,
                })
            );
        }
    }, [progress]);

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <SafeAreaView>
                <View style={{ height: 700 }}>
                    <WebView
                        ref={webViewRef}
                        containerStyle={{ width: 400, height: 700 }}
                        source={{
                            uri: PAYMENT_SERVER,
                        }}
                        javaScriptEnabled={true}
                        onError={errorHandler}
                        onMessage={receiveMessage}
                        onLoadProgress={(event) => {
                            setProgress(event.nativeEvent.progress);
                        }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

Charge.propTypes = {};
export default Charge;
