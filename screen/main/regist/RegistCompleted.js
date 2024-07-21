import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { color } from "../../../styles";
import MediumText from "../../../component/text/MediumText";
import { BackHandler, Image, View, useWindowDimensions } from "react-native";
import { SERVER } from "../../../constant";
import axios from "axios";
import { GetDate, GetTime, getAsyncStorageToken } from "../../../utils";
import { VALID } from "../../../constant";
import Layout from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import { CommonActions } from "@react-navigation/native";
import RegistContext from "../../../context/RegistContext";
import UserContext from "../../../context/UserContext";

const Container = styled.View`
    flex: 1;
    justify-content: space-between;
    margin-top: 80px;
    align-items: center;
`;

const Bottom = styled.View`
    /* margin-top: 55px; */
    margin-bottom: 10px;
`;

const BottomButtonWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const Button = styled.TouchableOpacity`
    background-color: ${(props) =>
        props.accent ? color.main : color.btnDefault};
    width: 34%;
    height: 60px;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
`;

const AccentButton = styled(Button)`
    width: 64%;
`;

function RegistCompleted({ navigation, route }) {
    const { width: windowWidth } = useWindowDimensions();
    const [userCount, setUserCount] = useState(0);
    const [dateTime, setDateTime] = useState("");
    const { registInfo } = useContext(RegistContext);
    const { info } = useContext(UserContext);
    useEffect(() => {
        console.log(
            "route?.params?.data?.paymentType: ",
            route?.params?.data?.paymentType
        );
        if (route?.params?.data?.paymentType === "postpaid") {
            registWork();
        }

        BackHandler.addEventListener("hardwareBackPress", () => goToHome());

        const orderDateTime = new Date(route?.params?.dateTime);
        const date = GetDate(orderDateTime);
        const time = GetTime(orderDateTime);

        setDateTime(`${date} ${time}`);

        getDriverCount();

        return () => {
            BackHandler.removeEventListener("hardwareBackPress");
        };
    }, []);

    const registWork = async () => {
        // console.log("parsed payment data : ", data);

        console.log("registInfo: ", registInfo);
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
            isDesignation: registInfo.isDesignation || false,
            driverId: registInfo.driverId || null,
            method: "postpaid",
            paymentType: 1,
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
                    isDesignation: registInfo.isDesignation || false,
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

    const getDriverCount = async () => {
        try {
            const response = await axios.get(SERVER + "/users/driver/count", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            });

            console.log(response.data);

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { count },
                    },
                } = response;

                setUserCount(count);
            } else {
                const {
                    data: { msg },
                } = response;

                console.log(msg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const goToProgress = () => {
        if (!route?.params?.orderId) {
            goToHome();
            return;
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: "TabsNavigator" },
                    {
                        name: "OrderProgress",
                        params: { orderId: route?.params?.orderId },
                    },
                ],
            })
        );
    };

    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "TabsNavigator" }],
            })
        );
        return true;
        // navigation.navigate("Home", { refresh: true });
    };

    return (
        <Layout scroll={true}>
            <Container>
                <View style={{ width: "100%", alignItems: "center" }}>
                    <BoldText
                        style={{
                            fontSize: 26,
                            textAlign: "center",
                            marginBottom: 20,
                        }}
                    >
                        결제 및 작업 등록이{"\n"}완료되었습니다.
                    </BoldText>
                    <RegularText
                        style={{
                            fontSize: 20,
                            color: color["page-bluegrey-text"],
                            textAlign: "center",
                            marginBottom: 20,
                        }}
                    >
                        {dateTime}
                    </RegularText>
                    <Image
                        source={require("../../../assets/images/regist_done.png")}
                        style={{
                            width: windowWidth - 80,
                            height: 300,
                            resizeMode: "contain",
                        }}
                    />
                    {route?.params?.isDesignation ? (
                        <RegularText
                            style={{
                                fontSize: 22,
                                textAlign: "center",
                                lineHeight: 35,
                                marginTop: 20,
                            }}
                        >
                            지정된 기사에게 요청 되었습니다.
                        </RegularText>
                    ) : (
                        <RegularText
                            style={{
                                fontSize: 22,
                                textAlign: "center",
                                lineHeight: 35,
                                marginTop: 20,
                            }}
                        >
                            현재 등록되어 있는 모든 기사님께{"\n"}작업 요청
                            알림이 전송되었습니다.
                        </RegularText>
                    )}

                    <View
                        style={{
                            height: 1.5,
                            backgroundColor: color["image-area-background"],
                            width: "90%",
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                    ></View>
                </View>

                <Bottom>
                    <BottomButtonWrapper>
                        <AccentButton accent onPress={goToProgress}>
                            <MediumText
                                style={{
                                    color: "white",
                                }}
                            >
                                내 작업 확인하기
                            </MediumText>
                        </AccentButton>
                        <Button onPress={goToHome}>
                            <MediumText>홈으로</MediumText>
                        </Button>
                    </BottomButtonWrapper>
                </Bottom>
            </Container>
        </Layout>
    );
}

export default RegistCompleted;
