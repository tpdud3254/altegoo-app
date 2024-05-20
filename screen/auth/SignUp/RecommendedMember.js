import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../styles";
import { SERVER, SIGNUP_NAV, VALID } from "../../../constant";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import TextInput from "../../../component/input/TextInput";
import { Image, Keyboard } from "react-native";
import { shadowProps } from "../../../component/Shadow";
import { useForm } from "react-hook-form";
import { GetPhoneNumberWithDash, showError } from "../../../utils";
import axios from "axios";

const Container = styled.View`
    margin-top: 25px;
`;
const Wrapper = styled.View`
    margin-bottom: 20px;
`;
const CheckBox = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;
const Info = styled.View`
    flex-direction: row;
    align-items: flex-start;
`;

const SelectPopup = styled.View`
    width: 100%;
    position: absolute;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    top: 80px;
    z-index: 100;
    padding: 15px 18px;
    border-radius: 12px;
    background-color: white;
`;

const SelectPopupText = styled.View`
    width: 55%;
    justify-content: space-between;
    flex-direction: row;
`;
const PopupButton = styled.TouchableOpacity`
    width: 60px;
    height: 40px;
    border: 1px solid ${color["input-focus-border"]};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
`;

function RecommendedMember() {
    const navigation = useNavigation();
    const { info, setInfo } = useContext(UserContext);
    const { register, setValue, watch, getValues } = useForm();

    const [validation, setValidation] = useState(false);
    const [isExist, setIsExist] = useState(true);
    const [show, setShow] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userPhone, setUserPhone] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searching, setSearching] = useState(false);

    //NEXT: [추천할 회원이 없어요.] 를 체크한 뒤, 연락처를 수정할 경우 check
    useEffect(() => {
        console.log(info);
        register("recommendedMember");
    }, []);

    useEffect(() => {
        if (!isExist) setValue("recommendedMember", "99999999999");
        else setValue("recommendedMember", "");
    }, [isExist]);

    useEffect(() => {
        if (selectedUserId > 0) {
            setValidation(true);
        } else {
            setValidation(false);
        }
    }, [selectedUserId]);

    useEffect(() => {
        if (!isExist) {
            return;
        }
        const phone = getValues("recommendedMember");

        if (phone && phone.length > 10) {
            checkRecommnedUser(phone);
        } else {
            setShow(false);
        }
    }, [watch("recommendedMember")]);

    useEffect(() => {
        const recommendedMember = getValues("recommendedMember");

        if (!recommendedMember || recommendedMember.length <= 0) return;

        const regex = /[^0-9]/g;
        const result = recommendedMember.replace(regex, "");

        setValue("recommendedMember", result);
    }, [watch("recommendedMember")]);

    const checkRecommnedUser = async (phone) => {
        setSearching(true);
        try {
            const response = await axios.get(SERVER + "/users/search", {
                params: {
                    phone,
                },
            });

            console.log(response.data);

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { userId, name, phone },
                    },
                } = response;
                setUserId(userId);
                setUserName(name);
                setUserPhone(phone);
                Keyboard.dismiss();
            } else {
                setUserId(0);
            }

            setShow(true);
        } catch (error) {
            console.log(error);
            showError(error);
        } finally {
            setSearching(false);
        }
    };

    const onSelect = () => {
        setSelectedUserId(userId);
        setUserId(null);
        setUserName(null);
        setUserPhone(null);
        setShow(false);
    };

    const onNext = () => {
        const data = {};
        if (!isExist) data.recommendUserId = 1;
        else data.recommendUserId = selectedUserId;

        setInfo({ ...info, ...data });

        const curNavIndex =
            SIGNUP_NAV[info.userType].indexOf("RecommendedMember");

        navigation.navigate(SIGNUP_NAV[info.userType][curNavIndex + 1]);
    };

    return (
        <AuthLayout
            bottomButtonProps={{
                title: "회원가입 완료",
                onPress: onNext,
                disabled: !isExist ? false : !validation,
            }}
        >
            <Container>
                <Wrapper>
                    <TextInput
                        title="추천인 연락처"
                        placeholder="전화번호를 입력하세요"
                        keyboardType="number-pad"
                        returnKeyType="done"
                        value={
                            isExist
                                ? watch("recommendedMember")
                                : GetPhoneNumberWithDash(
                                      watch("recommendedMember")
                                  )
                        }
                        onChangeText={(text) => {
                            setValue("recommendedMember", text);
                            setSelectedUserId(null);
                        }}
                        onReset={() => {
                            setValue("recommendedMember", "");
                        }}
                    />
                    <RegularText
                        style={{
                            fontSize: 16,
                            color: color["page-grey-text"],
                            marginTop: 8,
                        }}
                    >
                        숫자만 입력하세요.
                    </RegularText>
                </Wrapper>
                {searching ? (
                    <SelectPopup style={shadowProps}>
                        <RegularText
                            style={{ width: "100%", textAlign: "center" }}
                        >
                            검색 중
                        </RegularText>
                    </SelectPopup>
                ) : show ? (
                    <SelectPopup style={shadowProps}>
                        {userId === 0 ? (
                            <RegularText
                                style={{ width: "100%", textAlign: "center" }}
                            >
                                해당 번호가 없습니다.
                            </RegularText>
                        ) : (
                            <>
                                <SelectPopupText>
                                    <MediumText>{userPhone}</MediumText>
                                    <MediumText>{userName}</MediumText>
                                </SelectPopupText>
                                <PopupButton onPress={onSelect}>
                                    <MediumText
                                        style={{
                                            color: color["page-color-text"],
                                            fontSize: 14,
                                        }}
                                    >
                                        선택
                                    </MediumText>
                                </PopupButton>
                            </>
                        )}
                    </SelectPopup>
                ) : null}

                <Wrapper>
                    {/* <CheckBox onPress={() => setIsExist((prev) => !prev)}>
                        <Image
                            style={{ width: 23, height: 23 }}
                            source={
                                !isExist
                                    ? require("../../../assets/images/icons/Check_ON.png")
                                    : require("../../../assets/images/icons/Check_OFF.png")
                            }
                        />
                        <RegularText
                            style={{
                                marginLeft: 5,
                            }}
                        >
                            추천할 회원이 없어요.
                        </RegularText>
                    </CheckBox> */}
                </Wrapper>
                <Wrapper>
                    {/* <Info>
                        <Image
                            style={{ width: 18, height: 18 }}
                            source={require("../../../assets/images/icons/icon_info2.png")}
                        />
                        <RegularText
                            style={{
                                fontSize: 16,
                                marginLeft: 5,
                                marginTop: -3,
                                color: color["page-color-text"],
                            }}
                        >
                            추천인이 없어도 회원 가입이 가능합니다.{"\n"}
                            <RegularText
                                style={{
                                    fontSize: 14,
                                    marginLeft: 5,
                                    color: color["page-grey-text"],
                                }}
                            >
                                추천인 미입력 시 알테구로 자동 등록 됩니다.
                            </RegularText>
                        </RegularText>
                    </Info> */}
                </Wrapper>
            </Container>
        </AuthLayout>
    );
}

export default RecommendedMember;
