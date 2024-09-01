import React, { useContext, useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import { useNavigation } from "@react-navigation/native";
import UserContext from "../../context/UserContext";
import { COMPANY, DRIVER } from "../../constant";
import { PopupWithButtons } from "../popup/PopupWithButtons";
import RegularText from "../text/RegularText";

const Container = styled.TouchableOpacity`
    position: absolute;
    bottom: 0px;
    right: 0px;
`;

function RegistButton() {
    const navigation = useNavigation();
    const { height, width: windowWidth } = useWindowDimensions();
    const { info } = useContext(UserContext);
    const [isPopupShown, setIsPopupShown] = useState(false);

    const showPopup = () => {
        setIsPopupShown(true);
    };

    const hidePopup = () => {
        setIsPopupShown(false);
    };

    const goToRegist = () => {
        if (
            info.userType === DRIVER &&
            (!info.license || !info.vehiclePermission)
        ) {
            showPopup();

            return;
        } else if (info.userType === COMPANY && !info.license) {
            showPopup();

            return;
        }
        navigation.navigate("RegistNavigator");
    };

    const goToRegistLicense = () => {
        hidePopup();
        navigation.navigate("SettingNavigator", {
            screen: "MemberInformation",
        });
    };

    return (
        <>
            <Container
                onPress={goToRegist}
                style={{
                    width: 170,
                    height: 80,
                    bottom: 10,
                }}
            >
                <Image
                    style={{
                        resizeMode: "contain",
                        width: 170,
                        height: 80,
                    }}
                    source={require(`../../assets/images/icons/btn_upload_work.png`)}
                />
            </Container>
            <View
                style={
                    isPopupShown && {
                        height: height,
                        position: "absolute",
                        width: "100%",
                        marginLeft: 16,
                    }
                }
            >
                <PopupWithButtons
                    visible={isPopupShown}
                    onTouchOutside={hidePopup}
                    onClick={goToRegistLicense}
                    negativeButtonLabel="취소"
                    width={windowWidth * 0.8}
                >
                    <RegularText
                        style={{
                            fontSize: 22,
                            textAlign: "center",
                            lineHeight: 33,
                            paddingTop: 15,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 15,
                        }}
                    >
                        필요한 서류가{"\n"}등록되지 않았습니다.{"\n"}
                        등록하시겠습니까?
                    </RegularText>
                </PopupWithButtons>
            </View>
        </>
    );
}

export default RegistButton;
