import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

export const Insurance = ({ onPress }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <Image
                    source={require("../../assets/images/icons/insurance.png")}
                    style={{ width: 30, height: 30 }}
                />
            </TouchableOpacity>
        </View>
    );
};
