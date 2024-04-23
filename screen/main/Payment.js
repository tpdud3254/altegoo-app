import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Alert,
    View,
    SafeAreaView,
    useWindowDimensions,
    BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import UserContext from "../../context/UserContext";
import { PAYMENT_SERVER, REGIST_NAV, SERVER, VALID } from "../../constant";
import axios from "axios";

import { getAsyncStorageToken, showMessage } from "../../utils";
import RegistContext from "../../context/RegistContext";

function Payment({ navigation, route }) {
    const { width: windowWidth } = useWindowDimensions();
    const webViewRef = useRef();
    const [progress, setProgress] = useState(0.0);

    const { registInfo } = useContext(RegistContext);
    const { info } = useContext(UserContext);

    console.log("payment :", route?.params?.data);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", goBack);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress");
        };
    }, []);

    useEffect(() => {
        //TEST: 테스트 코드
        setTimeout(async () => {
            await registWork();
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
                    navigation.navigate(REGIST_NAV[4]);
                    // navigation.goBack();
                    break;
                case "cancel":
                    showMessage("결제가 취소되었습니다.");
                    navigation.goBack();
                    break;
                case "issued":
                    //가상계좌 발급 완료
                    console.log("가상계좌 발급 완료");
                    console.log(
                        "parsed.data.receipt_id",
                        parsed.data.receipt_id
                    );
                    console.log(
                        "parsed.data.vbank_data",
                        parsed.data.vbank_data
                    );
                    await registVBankWork(parsed.data);
                    break;
                case "done":
                    //결제 완료
                    await registWork(parsed);
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

    const registVBankWork = async (data) => {
        console.log("parsed payment data : ", data);

        const sendingData = {
            vehicleType: registInfo.vehicleType || null,
            direction: registInfo.direction || null,
            floor: registInfo.floor || null,
            downFloor: registInfo.downFloor || null,
            upFloor: registInfo.upFloor || null,
            volume: registInfo.volume || null,
            time: registInfo.time || null,
            quantity: registInfo.quantity || null,
            dateTime: registInfo.dateTime || null,
            address1: registInfo.address1 || null,
            address2: registInfo.address2 || null,
            detailAddress1: registInfo.detailAddress1 || null,
            detailAddress2: registInfo.detailAddress2 || null,
            simpleAddress1: registInfo.simpleAddress1 || null,
            simpleAddress2: registInfo.simpleAddress2 || null,
            region: registInfo.region || null,
            latitude: registInfo.latitude.toString() || "0",
            longitude: registInfo.longitude.toString() || "0",
            phone: info.phone || null,
            directPhone: registInfo.directPhone || null,
            emergency: registInfo.emergency || false,
            memo: registInfo.memo || null,
            price: registInfo.price || 0,
            emergencyPrice: registInfo.emergencyPrice || 0,
            usePoint: registInfo.usePoint || 0,
            orderPrice: registInfo.orderPrice || 0,
            totalPrice: registInfo.totalPrice || 0,
            tax: registInfo.tax || 0,
            finalPrice: registInfo.finalPrice || 0,
            registPoint: registInfo.registPoint || 0,
            gugupackPrice: registInfo.gugupackPrice || 0,
            receipt_id: data.receipt_id,
            vbank_account: data.vbank_data.bank_account,
            vbank_code: data.vbank_data.bank_code,
            vbank_name: data.vbank_data.bank_name,
            vbank_expired_at: data.vbank_data.expired_at,
            vbank_tid: data.vbank_data.tid,
            method: "vbank",
        };

        try {
            const response = await axios.post(
                SERVER + "/works/upload/vbank",
                { ...sendingData },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { order },
                    },
                } = response;

                console.log(order);

                navigation.navigate(REGIST_NAV[7], {
                    orderId: order.id,
                    dateTime: order.dateTime,
                    vbank_account: order.vbank_account,
                    vbank_name: order.vbank_name,
                });

                return;
            } else {
                const {
                    data: { msg },
                } = response;

                console.log(msg);
            }
        } catch (error) {
            console.log("error : ", error);
        }
    };

    const registWork = async (data) => {
        console.log("parsed payment data : ", data);

        const sendingData = {
            vehicleType: registInfo.vehicleType || null,
            direction: registInfo.direction || null,
            floor: registInfo.floor || null,
            downFloor: registInfo.downFloor || null,
            upFloor: registInfo.upFloor || null,
            volume: registInfo.volume || null,
            time: registInfo.time || null,
            quantity: registInfo.quantity || null,
            dateTime: registInfo.dateTime || null,
            address1: registInfo.address1 || null,
            address2: registInfo.address2 || null,
            detailAddress1: registInfo.detailAddress1 || null,
            detailAddress2: registInfo.detailAddress2 || null,
            simpleAddress1: registInfo.simpleAddress1 || null,
            simpleAddress2: registInfo.simpleAddress2 || null,
            region: registInfo.region || null,
            latitude: registInfo.latitude.toString() || "0",
            longitude: registInfo.longitude.toString() || "0",
            phone: info.phone || null,
            directPhone: registInfo.directPhone || null,
            emergency: registInfo.emergency || false,
            memo: registInfo.memo || null,
            price: registInfo.price || 0,
            emergencyPrice: registInfo.emergencyPrice || 0,
            usePoint: registInfo.usePoint || 0,
            orderPrice: registInfo.orderPrice || 0,
            totalPrice: registInfo.totalPrice || 0,
            tax: registInfo.tax || 0,
            finalPrice: registInfo.finalPrice || 0,
            registPoint: registInfo.registPoint || 0,
            gugupackPrice: registInfo.gugupackPrice || 0,
            method: "test",
        };

        try {
            const response = await axios.post(
                SERVER + "/works/upload",
                { ...sendingData },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            console.log(response);

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { order },
                    },
                } = response;

                navigation.navigate(REGIST_NAV[6], {
                    orderId: order.id,
                    dateTime: order.dateTime,
                });
                return;
            } else {
                const {
                    data: { msg },
                } = response;

                console.log(msg);
            }
        } catch (error) {
            console.log("error : ", error);
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
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
            }}
        >
            <SafeAreaView>
                <View style={{ height: 700 }}>
                    <WebView
                        ref={webViewRef}
                        containerStyle={{ width: windowWidth, height: 700 }}
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

Payment.propTypes = {};
export default Payment;
