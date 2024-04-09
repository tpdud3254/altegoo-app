import React, { useEffect } from "react";
import styled from "styled-components/native";
import { color } from "../../../styles";
import MediumText from "../../../component/text/MediumText";
import {
    BackHandler,
    Image,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { showMessage } from "../../../utils";
import Layout from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import { CommonActions } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

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

function RegistStandBy({ navigation, route }) {
    const { width: windowWidth } = useWindowDimensions();

    useEffect(() => {
        console.log("RegistStandBy route : ", route);
        BackHandler.addEventListener("hardwareBackPress", () => goToHome());

        return () => {
            BackHandler.removeEventListener("hardwareBackPress");
        };
    }, []);

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
                        name: "StandByOrderProgress",
                        params: { orderId: route?.params?.orderId },
                    },
                ],
            })
        );
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(route.params.vbank_account);

        showMessage("복사완료!");
    };

    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "TabsNavigator" }],
            })
        );
        return true;
    };

    return (
        <Layout scroll={true}>
            <Container>
                <View style={{ width: "100%", alignItems: "center" }}>
                    <BoldText
                        style={{
                            fontSize: 26,
                            textAlign: "center",
                            // marginBottom: 10,
                        }}
                    >
                        입금 대기 중
                    </BoldText>
                    <RegularText
                        style={{
                            fontSize: 22,
                            textAlign: "center",
                            lineHeight: 30,
                            marginTop: 20,
                        }}
                    >
                        10분 이내에 입금 확인이 되지 않으면 작업은 자동으로
                        취소됩니다.
                    </RegularText>
                    <Image
                        source={require("../../../assets/images/regist_done.png")}
                        style={{
                            width: windowWidth - 80,
                            height: 280,
                            resizeMode: "contain",
                        }}
                    />
                    <RegularText
                        style={{
                            fontSize: 22,
                            textAlign: "center",
                            lineHeight: 35,
                            marginTop: 15,
                        }}
                    >
                        {route.params.vbank_name}
                    </RegularText>
                    <BoldText
                        style={{
                            fontSize: 26,
                            textAlign: "center",
                            marginBottom: 15,
                        }}
                    >
                        {route.params.vbank_account}
                    </BoldText>
                    <TouchableOpacity onPress={copyToClipboard}>
                        <RegularText
                            style={{
                                fontSize: 20,
                                color: color["page-bluegrey-text"],
                                textAlign: "center",
                                marginBottom: 10,
                            }}
                        >
                            복사하기
                        </RegularText>
                    </TouchableOpacity>
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

export default RegistStandBy;
