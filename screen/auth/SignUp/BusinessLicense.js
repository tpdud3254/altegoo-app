import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../styles";
import { SIGNUP_NAV } from "../../../constant";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { Image, ScrollView, useWindowDimensions } from "react-native";
import { Popup } from "../../../component/popup/Popup";

const Container = styled.View`
    justify-content: space-between;
`;

const Wrapper = styled.View`
    align-items: center;
    margin-top: 10%;
`;
const CameraButton = styled.TouchableOpacity`
    width: 250px;
    height: 380px;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    background-color: ${color["image-area-background"]};
`;

// DEVELOP: cancle -> cancel로 바꾸기;;;
const License = styled.View`
    width: 250px;
    height: 333px;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
`;

const CancelButton = styled.TouchableOpacity`
    position: absolute;
    right: -12px;
    top: -14px;
`;

const SkipButton = styled.TouchableOpacity`
    align-items: center;
    margin-top: 10px;
`;

const PopupContainer = styled.View`
    width: 200px;
    height: 230px;
    justify-content: center;
`;

function BusinessLicense() {
    const navigation = useNavigation();
    const { height: windowHeight } = useWindowDimensions();

    const { info, setInfo } = useContext(UserContext);
    const [imageStatus, setImageStatus] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        console.log(info);
        if (info?.licenseUrl && info?.licenseUrl.length > 0) {
            setImageStatus(true);
        } else {
            setImageStatus(false);
        }
    }, [info]);

    const onNext = ({ skip = false }) => {
        if (skip) {
            deleteLicense();
            const data = {
                licenseUrl: "",
            };

            setInfo({ ...info, ...data });
            hidePopup();
        }
        const curNavIndex =
            SIGNUP_NAV[info.userType].indexOf("BusinessLicense");
        navigation.navigate(SIGNUP_NAV[info.userType][curNavIndex + 1]);
    };

    const showPopup = () => {
        setPopupVisible(true);
    };

    const hidePopup = () => {
        setPopupVisible(false);
    };

    const takePicture = () => {
        navigation.navigate("TakePhoto", { type: "license" });
    };

    const deleteLicense = () => {
        const newInfo = info;

        delete newInfo.licenseUrl;
        setImageStatus(false);

        setInfo(newInfo);
    };

    return (
        <AuthLayout
            bottomButtonProps={{
                title: "다음으로",
                onPress: onNext,
                disabled: !imageStatus,
            }}
        >
            <Container height={windowHeight}>
                <ScrollView>
                    <Wrapper>
                        {!imageStatus ? (
                            <CameraButton onPress={takePicture}>
                                <Image
                                    style={{ width: 60, height: 60 }}
                                    source={require("../../../assets/images/icons/btn_camera.png")}
                                />
                            </CameraButton>
                        ) : (
                            <License>
                                <Image
                                    style={{ width: "100%", height: "100%" }}
                                    source={{ uri: info.licenseUrl }}
                                    resizeMode="contain"
                                />
                                <CancelButton onPress={deleteLicense}>
                                    <Image
                                        style={{ width: 30, height: 30 }}
                                        source={require("../../../assets/images/icons/btn_del_s.png")}
                                    />
                                </CancelButton>
                            </License>
                        )}

                        <MediumText
                            style={{
                                color: color["page-grey-text"],
                                fontSize: 16,
                                textAlign: "center",
                                marginTop: 20,
                                lineHeight: 24,
                            }}
                        >
                            촬영을 시작합니다.
                        </MediumText>
                    </Wrapper>
                    <SkipButton onPress={showPopup}>
                        <RegularText
                            style={{
                                fontSize: 16,
                                color: color["page-color-text"],
                                textDecorationLine: "underline",
                            }}
                        >
                            다음에 할게요
                        </RegularText>
                    </SkipButton>
                </ScrollView>
            </Container>
            <Popup
                visible={popupVisible}
                onTouchOutside={hidePopup}
                onClick={() => onNext({ skip: true })}
            >
                <PopupContainer>
                    <RegularText
                        style={{
                            fontSize: 19,
                            lineHeight: 20,
                            textAlign: "center",
                        }}
                    >
                        사업자등록증은{"\n"}정산을 위해{"\n"}반드시 필요합니다.
                        {"\n"}
                        {"\n"}정확하고 투명한{"\n"}알테구 서비스를{"\n"}이용해
                        보세요.
                    </RegularText>
                </PopupContainer>
            </Popup>
        </AuthLayout>
    );
}

export default BusinessLicense;
