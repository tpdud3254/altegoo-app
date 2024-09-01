import React from "react";
import styled from "styled-components/native";
import { color } from "../../styles";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import RegistButton from "../button/RegistButton";
import MediumText from "../text/MediumText";
import KakaoButton from "../button/KakaoButton";
import { IsIOS } from "../../utils";

export const LAYOUT_PADDING_X = 16;
const Container = styled.View`
    flex: 1;
    background-color: ${color["page-background"]};
    padding-top: ${(props) => (props.headerShown ? 0 : props.ios ? 50 : 40)}px;
`;
const Wrapper = styled.View`
    flex: 1;
    padding: ${(props) => (props.touchableElement ? 0 : 10)}px
        ${LAYOUT_PADDING_X}px;
    min-height: ${(props) => (props.scroll ? props.windowHeight - 120 : 0)}px;
`;

const BottomButton = styled.TouchableOpacity`
    background-color: ${(props) =>
        props.disabled ? color.btnDisable : color.btnAccent};
    height: 60px;
    align-items: center;
    justify-content: center;
`;

const CustomButton = styled.View`
    /* height: 60px; */
`;

export default function Layout({
    children,
    headerShown = true,
    registBtnShown = false,
    kakaoBtnShown = false,
    bottomButtonProps,
    scroll = true,
    touchableElement,
    onRefresh,
}) {
    const { height } = useWindowDimensions();
    return (
        <Container headerShown={headerShown} ios={IsIOS()}>
            {scroll ? (
                <ScrollView>
                    {touchableElement ? (
                        <View
                            style={{
                                paddingLeft: LAYOUT_PADDING_X,
                                paddingRight: LAYOUT_PADDING_X,
                                paddingTop: 8,
                            }}
                        >
                            {touchableElement()}
                        </View>
                    ) : null}
                    <TouchableWithoutFeedback>
                        <Wrapper
                            windowHeight={height}
                            touchableElement={touchableElement}
                        >
                            {children}
                        </Wrapper>
                    </TouchableWithoutFeedback>
                </ScrollView>
            ) : (
                <Wrapper windowHeight={height}>{children}</Wrapper>
            )}
            {kakaoBtnShown ? <KakaoButton /> : null}
            {registBtnShown ? <RegistButton /> : null}
            {bottomButtonProps ? (
                bottomButtonProps.customButton ? (
                    <CustomButton>
                        {bottomButtonProps.customButton}
                    </CustomButton>
                ) : (
                    <BottomButton
                        onPress={bottomButtonProps.onPress}
                        disabled={bottomButtonProps.disabled}
                    >
                        <MediumText style={{ color: "white" }}>
                            {bottomButtonProps.title}
                        </MediumText>
                    </BottomButton>
                )
            ) : null}
        </Container>
    );
}
