import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../styles";
import { SIGNUP_NAV } from "../../../constant";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import HorizontalDivider from "../../../component/divider/HorizontalDivider";
import { LAYOUT_PADDING_X } from "../../../component/layout/Layout";
import * as Linking from "expo-linking";

const termsTexts = [
    "만 14세 이상입니다.",
    "서비스 이용약관",
    "개인정보 수집 및 이용",
    "위치기반서비스 이용약관",
    "이벤트 및 혜택 안내 동의",
];

const Container = styled.View`
    width: 100%;
    margin-top: 30px;
    padding: 23px 15px;
    border-radius: 12px;
    background-color: white;
    border: 1px ${color["box-border"]};
`;

const AllAgree = styled.View`
    align-items: center;
    margin-bottom: 18px;
`;
const AllCheckWrapper = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 15px;
`;
const TermsContainer = styled.View`
    width: 100%;
    padding-top: 30px;
`;
const Terms = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${(props) => (props.lastChild ? 0 : 30)}px;
`;
const TermsWrapper = styled.View`
    flex-direction: row;
    align-items: center;
`;
function Agreements() {
    const { width: windowWidth } = useWindowDimensions();
    const [containerWidth, setContainerWidth] = useState(null);
    const navigation = useNavigation();
    const { info, setInfo } = useContext(UserContext);
    const [checkArr, setCheckArr] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [blockAllChecked, setBlockAllChecked] = useState(false);
    const [isAgree, setIsAgree] = useState(true);

    useEffect(() => {
        setContainerWidth(Math.floor(windowWidth - LAYOUT_PADDING_X * 2));
    }, []);
    const clickAllCheckButton = () => {
        if (!isAllChecked) {
            setIsAllChecked(true);
            setIsAgree(false);
            const newCheckArr = [true, true, true, true, true];

            setCheckArr(newCheckArr);
            setBlockAllChecked(false);
        } else {
            setIsAllChecked(false);
            setIsAgree(true);

            if (!blockAllChecked) {
                const newCheckArr = [false, false, false, false, false];

                setCheckArr(newCheckArr);
            } else {
                setBlockAllChecked(false);
            }
        }
    };

    const clickCheckButton = (value, index) => {
        const newCheckArr = [...checkArr];

        newCheckArr[index] = value;

        setCheckArr(newCheckArr);

        const uncheckedArr = newCheckArr.filter((value) => value === false);

        if (uncheckedArr.length < 1) {
            setIsAllChecked(true);
            setIsAgree(false);
        } else {
            setBlockAllChecked(true);
            setIsAllChecked(false);

            if (
                uncheckedArr.length === 1 &&
                !newCheckArr[newCheckArr.length - 1]
            ) {
                setIsAgree(false);
            } else {
                setIsAgree(true);
            }
        }
    };

    const ShowDetailTerms = (index) => {
        const LINK_OBJ = {
            COMPANY: [
                "https://www.notion.so/altegoo/1775434cff7b419c8b2515f585979d77?pvs=4",
                "https://www.notion.so/altegoo/6efa041354b049e3baa3691867035f0f?pvs=4",
                "https://www.notion.so/altegoo/c2a40ed9e0ec4887b4989d286d227c88?pvs=4",
            ],
            DRIVER: [
                "https://www.notion.so/altegoo/0dd456801e3f4bafbba12587b6290efb?pvs=4",
                "https://www.notion.so/altegoo/90f624334f1841a8b6d54dbfb8c14767?pvs=4",
                "https://www.notion.so/altegoo/7626645174754d7f9316f6dde30ef844?pvs=4",
            ],
            NORMAL: [
                "https://www.notion.so/altegoo/34a75fcc5b324e02aed7e623f42926b5?pvs=4",
                "https://www.notion.so/altegoo/42dda75d5a36475bb7cc0afcb16dad8d?pvs=4",
                "https://www.notion.so/altegoo/b40777eb34d7459f94d0389a0dfdb13f?pvs=4",
            ],
        };

        const type = info.userType;

        Linking.openURL(LINK_OBJ[type][index - 1]);
    };

    const onNext = () => {
        const data = {
            sms: checkArr[4] ? true : false,
        };

        setInfo({ ...info, ...data });

        const curNavIndex = SIGNUP_NAV[info.userType].indexOf("Agreements");
        navigation.navigate(SIGNUP_NAV[info.userType][curNavIndex + 1]);
    };

    const Checkbox = ({ checked }) => {
        return (
            <Image
                source={
                    checked
                        ? require("../../../assets/images/icons/Check_ON.png")
                        : require("../../../assets/images/icons/Check_OFF.png")
                }
                resizeMode="contain"
                style={{ width: 24, height: 24, marginRight: 10 }}
            />
        );
    };

    return (
        <AuthLayout
            bottomButtonProps={{
                title: "다음으로",
                onPress: onNext,
                disabled: isAgree,
            }}
        >
            <Container>
                <AllAgree>
                    <AllCheckWrapper onPress={clickAllCheckButton}>
                        <Checkbox checked={isAllChecked} />
                        <MediumText
                            style={{
                                fontSize: 20,
                            }}
                        >
                            전체 동의합니다.
                        </MediumText>
                    </AllCheckWrapper>
                </AllAgree>
                <HorizontalDivider
                    thickness={1}
                    width="100%"
                    color={color["divider-border"]}
                />
                <TermsContainer style={{ maxWidth: containerWidth }}>
                    {termsTexts.map((text, index) => (
                        <Terms
                            key={index}
                            lastChild={index === termsTexts.length - 1}
                            style={{ maxWidth: containerWidth }}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    clickCheckButton(!checkArr[index], index)
                                }
                                style={{ maxWidth: containerWidth }}
                            >
                                <TermsWrapper
                                    style={{ maxWidth: containerWidth }}
                                >
                                    <Checkbox checked={checkArr[index]} />
                                    <RegularText
                                        style={{
                                            maxWidth:
                                                index === 0 || index === 4
                                                    ? "100%"
                                                    : containerWidth * 0.5,
                                        }}
                                    >
                                        {text}
                                        {index < 4 ? " (필수)" : " (선택)"}
                                    </RegularText>
                                </TermsWrapper>
                            </TouchableOpacity>
                            {index === 0 || index === 4 ? null : (
                                <TouchableOpacity
                                    onPress={() => ShowDetailTerms(index)}
                                >
                                    <RegularText
                                        style={{
                                            fontSize: 16,
                                            color: color["page-lightgrey-text"],
                                            textDecorationLine: "underline",
                                        }}
                                    >
                                        보기
                                    </RegularText>
                                </TouchableOpacity>
                            )}
                        </Terms>
                    ))}
                </TermsContainer>
            </Container>
        </AuthLayout>
    );
}

export default Agreements;
