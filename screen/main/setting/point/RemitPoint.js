import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import axios from "axios";
import { SERVER } from "../../../../constant";
import {
    CheckValidation,
    getAsyncStorageToken,
    GetPhoneNumberWithDash,
    numberWithComma,
    showErrorMessage,
    showMessage,
} from "../../../../utils";
import { VALID } from "../../../../constant";
import Layout from "../../../../component/layout/Layout";
import SelectBox from "../../../../component/selectBox/SelectBox";
import TextInput from "../../../../component/input/TextInput";
import Button from "../../../../component/button/Button";
import UserContext from "../../../../context/UserContext";
import { Keyboard } from "react-native";
import { color } from "../../../../styles";
import MediumText from "../../../../component/text/MediumText";
import { shadowProps } from "../../../../component/Shadow";
import RegularText from "../../../../component/text/RegularText";
import { PopupWithButtons } from "../../../../component/popup/PopupWithButtons";

const Container = styled.View`
    margin-top: 30px;
    margin-bottom: 10px;
`;

const Wrapper = styled.View`
    margin-bottom: 25px;
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

function RemitPoint({ route, navigation }) {
    const { info } = useContext(UserContext);

    const { register, handleSubmit, setValue, watch, getValues } = useForm();

    const [validation, setValidation] = useState(false);

    const [show, setShow] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userPhone, setUserPhone] = useState(null);
    const [userType, setUserType] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelecteduser] = useState({
        userId: null,
        userName: null,
        userPhone: null,
        userType: null,
    });
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        register("remitUser");
        register("remitPoint");
    }, []);

    useEffect(() => {
        if (
            CheckValidation({
                selectedUserId,
                remitPoint: getValues("remitPoint"),
            })
        ) {
            setValidation(true);
        } else {
            setValidation(false);
        }
    }, [selectedUserId, watch("remitPoint")]);

    useEffect(() => {
        const phone = getValues("remitUser");

        if (phone && phone.length > 10) {
            checkUser(phone);
        } else {
            setShow(false);
        }
    }, [watch("remitUser")]);

    useEffect(() => {
        const remitUser = getValues("remitUser");

        if (!remitUser || remitUser.length <= 0) return;

        const regex = /[^0-9]/g;
        const result = remitUser.replace(regex, "");

        setValue("remitUser", result);
    }, [watch("remitUser")]);

    const checkUser = async (phone) => {
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
                        data: { userId, name, phone, userTypeId },
                    },
                } = response;
                setUserId(userId);
                setUserName(name);
                setUserPhone(phone);
                setUserType(userTypeId);
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
        const userInfo = {
            userId: userId,
            userName: userName,
            userPhone: userPhone,
            userType: userType,
        };

        setSelecteduser(userInfo);
        setUserId(null);
        setUserName(null);
        setUserPhone(null);
        setUserType(null);
        setShow(false);
    };

    const onNext = async (data) => {
        setShowPopup(false);
        console.log("data: ", data);

        try {
            const response = await axios.patch(
                SERVER + "/points/remit",
                {
                    remitUserId: selectedUser?.userId,
                    remitPoint: Number.parseInt(data?.remitPoint),
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: {
                    data: { points },
                    result,
                    msg,
                },
            } = response;

            if (result === VALID) {
                showMessage("포인트 송금이 완료되었습니다.");
                navigation.goBack();
            } else {
                showMessage("포인트 송금에 실패했습니다.");
            }
        } catch (error) {
            console.log("onModifyPoint error : ", error);
            showMessage("포인트 송금에 실패했습니다.");
        }
    };

    return (
        <Layout
            bottomButtonProps={{
                title: "송금하기",
                onPress: () => setShowPopup(true),
                disabled: !validation,
            }}
        >
            <Container>
                <Wrapper>
                    <TextInput
                        title="받으실 분의 전화번호"
                        placeholder="숫자만 입력하세요"
                        keyboardType="number-pad"
                        returnKeyType="done"
                        value={GetPhoneNumberWithDash(watch("remitUser"))}
                        onChangeText={(text) => {
                            setValue("remitUser", text);
                            setSelectedUserId(null);
                        }}
                        onReset={() => {
                            setValue("remitUser", "");
                        }}
                    />
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
                    <TextInput
                        title="금액"
                        placeholder="숫자만 적어주세요."
                        keyboardType="number-pad"
                        value={watch("remitPoint")}
                        onChangeText={(text) => setValue("remitPoint", text)}
                        onReset={() => setValue("remitPoint", "")}
                    />
                </Wrapper>
            </Container>
            <PopupWithButtons
                visible={showPopup}
                onTouchOutside={() => setShowPopup(false)}
                onClick={handleSubmit(onNext)}
                negativeButtonLabel={"취소"}
            >
                <RegularText
                    style={{
                        textAlign: "center",
                        marginBottom: 10,
                        marginLeft: 50,
                        marginRight: 50,
                    }}
                >
                    {selectedUser?.userName}(
                    {selectedUser?.userType === 1
                        ? "일반회원"
                        : selectedUser?.userType === 2
                        ? "기사회원"
                        : "기업회원"}
                    ){"\n"}
                    {GetPhoneNumberWithDash(selectedUser?.userPhone)}
                </RegularText>
                <RegularText
                    style={{
                        textAlign: "center",
                    }}
                >
                    해당 회원에게{" "}
                    <RegularText style={{ color: color.main }}>
                        {numberWithComma(getValues("remitPoint"))}P
                    </RegularText>
                    {"\n"}
                    송금하시겠습니까?
                </RegularText>
            </PopupWithButtons>
        </Layout>
    );
}

RemitPoint.propTypes = {};
export default RemitPoint;
