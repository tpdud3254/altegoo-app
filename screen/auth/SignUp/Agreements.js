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
        navigation.navigate("AgreementDetail", {
            index,
            title: termsTexts[index],
            type: info.userType,
        });
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
