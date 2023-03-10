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
        BackHandler.addEventListener("hardwareBackPress", onNextStep); //TODO: ???????????? ??????
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
                        ???????????? ??????
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
                        ?????? ????????? ?????????????????????
                    </SubTitleText>
                    <Logo />
                    <TruckLogo />
                    <SubTitleText style={{ fontSize: 30 }}>
                        ???????????????
                    </SubTitleText>
                    <SubTitleText
                        style={{
                            fontSize: 20,
                            color: theme.btnPointColor,
                            textAlign: "center",
                        }}
                    >
                        ???????????? ????????????{"\n"}
                        {info.phone} ?????????
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
                            ? `???????????? ????????? ?????? ????????? ?????? ???\n?????? ????????? ???????????????.\n?????? ?????? ?????? ??? 10,000P??? ????????? ???????????????.`
                            : info.userDetailType === PERSON
                            ? `???????????? ????????? ?????? ????????? ??????, ?????? ?????? ??? ??????????????? ???????????????.\n?????? ?????? ?????? ??? 10,000P??? ????????? ???????????????.`
                            : `???????????? ????????? ?????? ????????? ?????? ??? ?????? ????????? ???????????????.\n?????? ?????? ?????? ??? 10,000P??? ????????? ???????????????.`}
                    </PlainText>
                </Content>
                <HorizontalDivider color={"#dedede"} />
                <ButtonContainer>
                    <Button
                        onPress={onNextStep}
                        // onPress={() => goToPage("registWork")}
                    >
                        {/* TODO: ???????????? */}
                        <SubTitleText style={{ fontSize: 20 }}>
                            ???????????? ??????
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
                        //     // TODO: ????????????
                        // }
                        onPress={onNextStep}
                    >
                        {/* TODO: ???????????? */}
                        <SubTitleText style={{ fontSize: 20 }}>
                            {info.userType === ORDINARY
                                ? "???????????? ??????"
                                : info.userDetailType === PERSON
                                ? "???????????? ??????"
                                : "???????????? ??????"}
                        </SubTitleText>
                    </Button>
                </ButtonContainer>
            </Container>
        </DefaultLayout>
    );
}

export default SignUpStep4;
