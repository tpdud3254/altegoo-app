import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import MediumText from "../../component/text/MediumText";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { VALID } from "../../constant";
import UserContext from "../../context/UserContext";
import LoginContext from "../../context/LoginContext";
import { SERVER } from "../../constant";
import {
    SetAsyncStorageUid,
    SetAsyncStorageUserType,
    checkValidation,
    reset,
    setAsyncStorageToken,
    showError,
} from "../../utils";
import { color } from "../../styles";
import AuthLayout from "../../component/layout/AuthLayout";
import TextInput from "../../component/input/TextInput";
import RegularText from "../../component/text/RegularText";

const InputContainer = styled.View``;

const InputWrapper = styled.View`
    margin-bottom: 30px;
`;

const FindPassword = styled.View`
    align-items: center;
`;

function SignIn() {
    const navigation = useNavigation();
    const { setInfo } = useContext(UserContext);
    const { setIsLoggedIn, setFirstLogin } = useContext(LoginContext);
    const { register, setValue, watch, getValues } = useForm();

    const [focus, setFocus] = useState("phone");
    const [validation, setValidation] = useState(false);

    useEffect(() => {
        register("phone");
        register("password");
    }, [register]);

    useEffect(() => {
        setValidation(checkValidation(watch()));
    }, [watch()]);

    const onNext = (value) => {
        setFocus(value);
    };

    const onSubmit = async () => {
        const { phone, password } = getValues();

        try {
            const response = await axios.post(SERVER + "/users/login", {
                phone,
                password,
            });

            const {
                data: {
                    result,
                    data: { token, user },
                },
            } = response;

            if (result === VALID) {
                console.log("Current User : ", user);
                console.log("Token : ", token);
                setInfo(user);
                await setAsyncStorageToken(token);
                await SetAsyncStorageUid(user.id);
                await SetAsyncStorageUserType(user.userTypeId);
                setIsLoggedIn(true);
                setFirstLogin(false);
            }
        } catch (error) {
            console.log(error);
            showError(error);
        }
    };

    const goToResetPassword = () => {
        navigation.navigate("Certification");
    };

    return (
        <AuthLayout
            bottomButtonProps={{
                title: "로그인",
                onPress: onSubmit,
                disabled: !validation,
            }}
        >
            <MediumText
                style={{
                    fontSize: 16,
                    textAlign: "center",
                    color: color["page-grey-text"],
                    marginTop: 15,
                    marginBottom: 25,
                }}
            >
                안녕하세요. 환영합니다.
            </MediumText>
            <InputContainer>
                <InputWrapper>
                    <TextInput
                        title="휴대폰 번호"
                        placeholder="숫자만 입력하세요"
                        returnKeyType="next"
                        keyboardType="number-pad"
                        value={watch("phone")}
                        onSubmitEditing={() => onNext("password")}
                        onReset={() => reset(setValue, "phone")}
                        onChangeText={(text) => setValue("phone", text)}
                    />
                </InputWrapper>
                <InputWrapper>
                    <TextInput
                        type="password"
                        title="비밀번호"
                        placeholder="비밀번호 (8자리 이상)"
                        returnKeyType="done"
                        value={watch("password")}
                        onChangeText={(text) => setValue("password", text)}
                        focus={focus === "password"}
                    />
                </InputWrapper>
            </InputContainer>
            <FindPassword>
                <TouchableOpacity onPress={goToResetPassword}>
                    <RegularText
                        style={{
                            fontSize: 16,
                            color: color["page-color-text"],
                            textDecorationLine: "underline",
                        }}
                    >
                        비밀번호 찾기
                    </RegularText>
                </TouchableOpacity>
            </FindPassword>
        </AuthLayout>
    );
}

export default SignIn;
