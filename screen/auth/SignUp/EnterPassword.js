import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../styles";
import { NORMAL, SIGNUP_NAV } from "../../../constant";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import TextInput from "../../../component/input/TextInput";
import { useForm } from "react-hook-form";
import {
    CheckValidation,
    checkPassword,
    showErrorMessage,
} from "../../../utils";

const InputContainer = styled.View`
    margin-top: 30px;
    margin-bottom: 10px;
`;

const InputWrapper = styled.View`
    margin-bottom: 30px;
`;

function EnterPassword() {
    const navigation = useNavigation();
    const { info, setInfo } = useContext(UserContext);
    const { register, setValue, watch, getValues, handleSubmit } = useForm();

    const [validation, setValidation] = useState(false);

    const verifyPasswordRef = useRef();

    useEffect(() => {
        console.log(info);
        register("password");
        register("verifyPassword");
    }, []);

    useEffect(() => {
        if (CheckValidation(getValues())) {
            setValidation(true);
        } else {
            setValidation(false);
        }
    }, [getValues()]);

    const onNext = (data) => {
        const { password, verifyPassword } = data;

        if (password !== verifyPassword) {
            showErrorMessage("입력하신 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!checkPassword(password)) {
            showErrorMessage("비밀번호가 조건에 맞지 않습니다.");
            return;
        }

        const infoData = {
            password,
        };

        setInfo({ ...info, ...infoData });

        const curNavIndex = SIGNUP_NAV[info.userType].indexOf("EnterPassword");
        navigation.navigate(SIGNUP_NAV[info.userType][curNavIndex + 1]);
    };

    return (
        <AuthLayout
            bottomButtonProps={{
                title: info.userType === NORMAL ? "회원가입 완료" : "다음으로",
                onPress: handleSubmit(onNext),
                disabled: !validation,
            }}
        >
            <InputContainer>
                <InputWrapper>
                    <TextInput
                        type="password"
                        title="비밀번호 입력"
                        placeholder="비밀번호 (8자 이상)"
                        returnKeyType="next"
                        value={watch("password")}
                        onChangeText={(text) => setValue("password", text)}
                        onReset={() => setValue("password", "")}
                        onSubmitEditing={() =>
                            verifyPasswordRef.current.setFocus()
                        }
                    />
                    <RegularText
                        style={{
                            fontSize: 16,
                            color: color["page-grey-text"],
                            marginTop: 8,
                        }}
                    >
                        영문, 숫자 포함 8자 이상
                    </RegularText>
                </InputWrapper>
                <InputWrapper>
                    <TextInput
                        ref={verifyPasswordRef}
                        type="password"
                        title="비밀번호 확인"
                        placeholder="비밀번호 (8자 이상)"
                        returnKeyType="done"
                        value={watch("verifyPassword")}
                        onChangeText={(text) =>
                            setValue("verifyPassword", text)
                        }
                        onReset={() => setValue("verifyPassword", "")}
                    />
                </InputWrapper>
            </InputContainer>
        </AuthLayout>
    );
}

export default EnterPassword;
