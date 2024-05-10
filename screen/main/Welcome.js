import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../styles";
import AuthLayout from "../../component/layout/AuthLayout";
import RegularText from "../../component/text/RegularText";
import MediumText from "../../component/text/MediumText";
import { BackHandler, ScrollView, useWindowDimensions } from "react-native";
import BoldText from "../../component/text/BoldText";
import UserContext from "../../context/UserContext";
import { GetPhoneNumberWithDash } from "../../utils";

const Container = styled.View`
    justify-content: space-between;
    min-height: ${(props) => props.height - 40}px;
`;

const WelcomeImage = styled.Image`
    width: 100%;
    height: 330px;
`;

const WelcomText = styled.View`
    align-items: center;
`;
const Content = styled.View`
    background-color: ${color["box-color-background"]};
    align-items: center;
    padding: 20px 10px;
    border-radius: 15px;
    margin-top: 10%;
    margin-bottom: 10%;
`;

const Bottom = styled.View``;

const BottomButtonWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const Button = styled.TouchableOpacity`
    background-color: ${(props) =>
        props.accent ? color["button-accent-background"] : color.btnDefault};
    width: 34%;
    height: 60px;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
`;

const AccentButton = styled(Button)`
    width: 64%;
`;

function Welcome() {
    const navigation = useNavigation();
    const { info } = useContext(UserContext);
    const { height: windowHeight } = useWindowDimensions();

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", onNextStep);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress");
        };
    }, []);

    const goToPage = (pageName) => {
        console.log(pageName);
        if (pageName === "registWork") {
            navigation.navigate("TabsNavigator", { screen: "TabRegistWork" });
        } else if (pageName === "Setting") {
            navigation.navigate("TabsNavigator", {
                screen: "Menus",
            });
        } else {
            navigation.navigate("TabsNavigator");
        }
    };

    const onNextStep = () => {
        navigation.navigate("TabsNavigator");
        return true;
    };

    return (
        <Container height={windowHeight}>
            <AuthLayout>
                <WelcomeImage
                    style={{
                        resizeMode: "contain",
                    }}
                    source={require(`../../assets/images/img_welcome.png`)}
                />
                <WelcomText>
                    <RegularText
                        style={{
                            fontSize: 20,
                            color: color["page-dark-text"],
                        }}
                    >
                        회원님의 아이디는
                    </RegularText>
                    <BoldText
                        style={{
                            color: color["page-color-text"],
                            fontSize: 26,
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        {GetPhoneNumberWithDash(info.phone)}
                    </BoldText>
                    <RegularText
                        style={{
                            fontSize: 20,
                            color: color["page-dark-text"],
                        }}
                    >
                        입니다.
                    </RegularText>
                </WelcomText>
                <Content>
                    {info.userTypeId === 2 ? (
                        <RegularText
                            style={{
                                fontSize: 19,
                                color: color["page-dark-text"],
                                lineHeight: 29,
                                textAlign: "center",
                            }}
                        >
                            지금 바로 작업등록 하세요.{"\n"}작업완료 시, 15%
                            포인트 적립!{"\n"}친구추천 포인트도 적립받으세요.
                        </RegularText>
                    ) : info.userTypeId === 3 ? (
                        <RegularText
                            style={{
                                fontSize: 19,
                                color: color["page-dark-text"],
                                lineHeight: 29,
                                textAlign: "center",
                            }}
                        >
                            지금 바로 작업 예약 하세요.{"\n"}작업완료 확인 시,
                            포인트 지급!{"\n"}친구추천 포인트도 적립받으세요.
                        </RegularText>
                    ) : (
                        <RegularText
                            style={{
                                fontSize: 19,
                                color: color["page-dark-text"],
                                lineHeight: 29,
                                textAlign: "center",
                            }}
                        >
                            지금 바로 작업등록 하세요.{"\n"}작업완료 시, 15%
                            포인트 적립!{"\n"}친구추천 포인트도 적립받으세요.
                        </RegularText>
                    )}
                </Content>
                <Bottom>
                    <BottomButtonWrapper>
                        <AccentButton
                            onPress={() => goToPage("registWork")}
                            accent
                        >
                            <MediumText
                                style={{
                                    color: "white",
                                }}
                            >
                                홈으로 가기
                            </MediumText>
                        </AccentButton>
                        <Button onPress={() => goToPage("Setting")}>
                            <MediumText>내정보</MediumText>
                        </Button>
                    </BottomButtonWrapper>
                </Bottom>
            </AuthLayout>
        </Container>
    );
}

export default Welcome;
