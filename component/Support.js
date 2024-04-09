import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import * as Linking from "expo-linking";

const Badge = styled.View`
    position: absolute;
    right: -10px;
    top: -8px;
`;
export const Support = () => {
    return (
        <View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:15229190`)}>
                <Image
                    source={require("../assets/images/icons/support.png")}
                    style={{ width: 30, height: 30 }}
                />
            </TouchableOpacity>
        </View>
    );
};
