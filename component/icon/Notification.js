import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";

const Badge = styled.View`
    position: absolute;
    right: -10px;
    top: -8px;
`;
export const Notification = ({ onPress }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <Image
                    source={require("../../assets/images/icons/btn_notifcation.png")}
                    style={{ width: 30, height: 30 }}
                />
                {false ? (
                    <Badge>
                        <Image
                            source={require("../../assets/images/icons/badge.png")}
                            style={{ width: 20, height: 20 }}
                        />
                    </Badge>
                ) : null}
            </TouchableOpacity>
        </View>
    );
};
