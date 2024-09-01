import React from "react";
import styled from "styled-components/native";
import { color } from "../../styles";
import {
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
} from "react-native";
import MediumText from "../text/MediumText";
import { IsIOS } from "../../utils";

const Container = styled.View`
    flex: 1;
    background-color: ${color["page-background"]};
`;
const Wrapper = styled.View`
    flex: 1;
    padding: 10px 16px;
`;

const BottomButton = styled.TouchableOpacity`
    background-color: ${(props) =>
        props.disabled ? color.btnDisable : color.btnAccent};
    height: ${(props) => (props.ios ? "70" : "60")}px;
    padding-bottom: ${(props) => (props.ios ? "10" : "0")}px;
    align-items: center;
    justify-content: center;
`;

export default function AuthLayout({ children, bottomButtonProps }) {
    return (
        <Container>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                enabled={IsIOS()}
                behavior={IsIOS() ? "padding" : undefined}
                keyboardVerticalOffset={150}
            >
                <ScrollView>
                    <TouchableWithoutFeedback>
                        <Wrapper>{children}</Wrapper>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
            {bottomButtonProps ? (
                <BottomButton
                    ios={IsIOS()}
                    onPress={bottomButtonProps.onPress}
                    disabled={bottomButtonProps.disabled}
                >
                    <MediumText style={{ color: "white" }}>
                        {bottomButtonProps.title}
                    </MediumText>
                </BottomButton>
            ) : null}
        </Container>
    );
}
