import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import DefaultLayout from "../../../component/layout/DefaultLayout";
import { Ionicons } from "@expo/vector-icons";
import TitleText from "../../../component/text/TitleText";
import HorizontalDivider from "../../../component/divider/HorizontalDivider";
import SubTitleText from "../../../component/text/SubTitleText";
import { theme } from "../../../styles";
import Logo from "../../../component/logo/Logo";
import TruckLogo from "../../../component/logo/TruckLogo";
import { ORDINARY, PERSON, VALID } from "../../../constant";
import PlainText from "../../../component/text/PlainText";
import VerticalDivider from "../../../component/divider/VerticalDivider";
import LoginContext from "../../../context/LoginContext";
import { BackHandler } from "react-native";
import axios from "axios";
import { SERVER } from "../../../server";
import { setAsyncStorageToken, showError } from "../../../utils";

const Container = styled.View`
    flex: 1;
    justify-content: space-between;
    margin-top: 20px;
`;
const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0px 5px 0px;
`;
const HeaderButton = styled.TouchableOpacity``;

const Content = styled.View`
    flex: 1;
    justify-content: space-between;
    align-items: center;
    padding: 40px 0px;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    height: 100px;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 10px;
`;
const Button = styled.TouchableOpacity``;

function SignUpStep4({ navigation }) {
    const { info, setInfo } = useContext(UserContext);
    const { setIsLoggedIn } = useContext(LoginContext);
    // const navigation = useNavigation();

    console.log("step4 info : ", info);
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", onNextStep); //TODO: 뒤로가기 안됨
    });

    const goToPage = (pageName) => {
        // console.log(pageName);
        // if (pageName === "registWork") {
        //     navigation.navigate("TabsNavigator", { screen: "TabRegistWork" });
        // } else if (pageName === "Setting") {
        //     navigation.navigate("SettingNavigator", { screen: "Setting" });
        // } else {
        //     navigation.navigate("Home");
        // }
    };

    const onNextStep = () => {
        signIn();
        return true;
    };

    const signIn = () => {
        const { phone, password } = info;

        axios
            .post(SERVER + "/users/login", {
                phone,
                password,
            })
            .then(async ({ data }) => {
                const {
                    result,
                    data: { token, user },
                    msg,
                } = data;

                if (result === VALID) {
                    setInfo(user);
                    await setAsyncStorageToken(token);
                    setIsLoggedIn(true);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    return (
        <DefaultLayout>
            <Container>
                <Header>
                    <Ionicons
                        name={"close-outline"}
                        size={45}
                        color={"white"}
                    />
                    <TitleText style={{ fontSize: 23 }}>
                        회원가입 완료
                    </TitleText>
                    <HeaderButton onPress={onNextStep}>
                        <Ionicons
                            name={"close-outline"}
                            size={45}
                            color={"black"}
                        />
                    </HeaderButton>
                </Header>
                <HorizontalDivider color={"#dedede"} />
                <Content>
                    <SubTitleText
                        style={{ fontSize: 23, color: theme.btnPointColor }}
                    >
                        회원 가입이 완료되었습니다
                    </SubTitleText>
                    <Logo />
                    <TruckLogo />
                    <SubTitleText style={{ fontSize: 30 }}>
                        환영합니다
                    </SubTitleText>
                    <SubTitleText
                        style={{
                            fontSize: 20,
                            color: theme.btnPointColor,
                            textAlign: "center",
                        }}
                    >
                        회원님의 아이디는{"\n"}
                        {info.phone} 입니다
                    </SubTitleText>

                    <PlainText
                        style={{
                            fontSize: 16,
                            textAlign: "center",
                            color: "#555555",
                            backgroundColor: theme.sub.yellow + "33",
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 10,
                        }}
                    >
                        {info.userType === ORDINARY
                            ? `지금부터 알테구 작업 리스트 보기 및\n작업 등록이 가능합니다.\n최초 작업 등록 시 10,000P가 적립될 예정입니다.`
                            : info.userDetailType === PERSON
                            ? `지금부터 알테구 작업 리스트 보기, 작업 등록 및 작업예약이 가능합니다.\n최초 작업 등록 시 10,000P가 적립될 예정입니다.`
                            : `지금부터 알테구 작업 리스트 보기 및 작업 등록이 가능합니다.\n최초 작업 등록 시 10,000P가 적립될 예정입니다.`}
                    </PlainText>
                </Content>
                <HorizontalDivider color={"#dedede"} />
                <ButtonContainer>
                    <Button
                        onPress={onNextStep}
                        // onPress={() => goToPage("registWork")}
                    >
                        {/* TODO: 기능추가 */}
                        <SubTitleText style={{ fontSize: 20 }}>
                            작업등록 하기
                        </SubTitleText>
                    </Button>
                    <VerticalDivider color={theme.textBoxColor} />
                    <Button
                        // onPress={
                        //     () =>
                        //         info.userType === ORDINARY
                        //             ? goToPage("Setting")
                        //             : info.userDetailType === PERSON
                        //             ? goToPage("Home")
                        //             : goToPage("Setting")
                        //     // TODO: 기능추가
                        // }
                        onPress={onNextStep}
                    >
                        {/* TODO: 기능추가 */}
                        <SubTitleText style={{ fontSize: 20 }}>
                            {info.userType === ORDINARY
                                ? "가입정보 보기"
                                : info.userDetailType === PERSON
                                ? "작업요청 보기"
                                : "가입정보 보기"}
                        </SubTitleText>
                    </Button>
                </ButtonContainer>
            </Container>
        </DefaultLayout>
    );
}

export default SignUpStep4;
