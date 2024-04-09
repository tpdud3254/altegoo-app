import styled from "styled-components/native";
import { color } from "../styles";
import { Ionicons } from "@expo/vector-icons";
import { shadowProps } from "./Shadow";
import RegularText from "./text/RegularText";
import { Image } from "react-native";

const ToastBox = styled.View`
    background-color: ${color["box-color-background"]};
    width: 90%;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: 10px;
`;

export const toastConfig = {
    errorToast: ({ props }) => (
        <ToastBox style={shadowProps}>
            <Ionicons name="warning" size={25} color={color.main} />
            <RegularText
                style={{
                    color: color["page-dark-text"],
                    marginTop: 5,
                    textAlign: "center",
                }}
            >
                {props}
            </RegularText>
        </ToastBox>
    ),
    normalToast: ({ props }) => (
        <ToastBox style={shadowProps}>
            <Image
                source={require("../assets/images/icons/check_circle_ON.png")}
                style={{ width: 25, height: 25 }}
            />
            <RegularText
                style={{ color: color["page-dark-text"], marginTop: 5 }}
            >
                {props}
            </RegularText>
        </ToastBox>
    ),
};
