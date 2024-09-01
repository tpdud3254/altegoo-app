import React from "react";
import PropTypes from "prop-types";
import { color } from "../../styles";
import { Image } from "react-native";
import MediumText from "../text/MediumText";
import { IsIOS } from "../../utils";

export default function TabIcon({ tabName, focused, iconText }) {
    const focusImage =
        tabName === "home"
            ? require("../../assets/images/icons/GNB_01_ON.png")
            : tabName === "list"
            ? require("../../assets/images/icons/GNB_02_ON.png")
            : tabName === "setting"
            ? require("../../assets/images/icons/GNB_03_ON.png")
            : require("../../assets/images/icons/GNB_driver_02_on.png");

    const blurImage =
        tabName === "home"
            ? require("../../assets/images/icons/GNB_01_OFF.png")
            : tabName === "list"
            ? require("../../assets/images/icons/GNB_02_OFF.png")
            : tabName === "setting"
            ? require("../../assets/images/icons/GNB_03_OFF.png")
            : require("../../assets/images/icons/GNB_driver_02_off.png");
    return (
        <>
            <Image
                source={focused ? focusImage : blurImage}
                style={{ width: 27, height: 27, marginTop: IsIOS() ? 15 : 0 }}
                resizeMode="contain"
            />
            <MediumText
                style={{
                    fontSize: 15,
                    color: focused
                        ? color["page-color-text"]
                        : color["page-bluegrey-text"],
                    marginTop: 6,
                    textAlign: "center",
                }}
            >
                {iconText}
            </MediumText>
        </>
    );
}

TabIcon.propTypes = {
    tabName: PropTypes.string.isRequired,
    focused: PropTypes.bool,
    iconText: PropTypes.string.isRequired,
};
