import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import TextInput from "../../component/input/TextInput";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import {
    checkPassword,
    checkValidation,
    showError,
    showErrorMessage,
    showMessage,
} from "../../utils";
import axios from "axios";
import { VALID } from "../../constant";
import { SERVER } from "../../constant";
import Button from "../../component/button/Button";
import AuthLayout from "../../component/layout/AuthLayout";
import RegularText from "../../component/text/RegularText";
import { color } from "../../styles";

const Container = styled.View`
    padding-top: 30px;
`;

const InputContainer = styled.View`
    margin-bottom: 10px;
`;

const InputWrapper = styled.View`
    margin-bottom: 30px;
`;

function SetPassword({ route }) {
    const navigation = useNavigation();
    const { register, setValue, watch, getValues } = useForm();

    const [focus, setFocus] = useState("name");
    const [validation, setValidation] = useState(false);

    useEffect(() => {
        console.log(route?.params);
        register("phone");
        register("password");
        register("verifyPassword");

        setValue("phone", route?.params?.cerfifyData.phone);
    }, [register]);

    useEffect(() => {
        setValidation(
            checkValidation({
                password: watch("password"),
                verifyPassword: watch("verifyPassword"),
            })
        );
    }, [watch()]);

    const onNext = (value) => {
        setFocus(value);
    };

    const onChangePassword = async () => {
        const { phone, password, verifyPassword } = getValues();

        if (password !== verifyPassword) {
            showErrorMessage("입력하신 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!checkPassword(password)) {
            showErrorMessage("비밀번호가 조건에 맞지 않습니다.");
            return;
        }

        try {
            const response = await axios.post(SERVER + "/users/password", {
                phone,
                password,
            });

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                showMessage("비밀번호가 변경 되었습니다.");
                goToSignIn();
            }
        } catch (error) {
            console.log(error);
            showError(error);
        }
    };

    const goToSignIn = () => {
        navigation.navigate("SignIn", {
            reset: true,
        });
    };

    return (
        <AuthLayout>
            <Container>
                <InputContainer>
                    <InputWrapper>
                        <TextInput
                            type="password"
                            title="새 비밀번호"
                            placeholder="비밀번호 (8자리 이상)"
                            returnKeyType="next"
                            value={watch("password")}
                            onSubmitEditing={() => onNext("verifyPassword")}
                            onChangeText={(text) => setValue("password", text)}
                        />
                        <RegularText
                            style={{
                                fontSize: 16,
                                color: color["page-grey-text"],
                                marginTop: 8,
                            }}
                        >
                            영문, 숫자를 포함한 8자 이상
                        </RegularText>
                    </InputWrapper>
                    <InputWrapper>
                        <TextInput
                            type="password"
                            title="새 비밀번호 확인"
                            placeholder="비밀번호 (8자리 이상)"
                            returnKeyType="done"
                            value={watch("verifyPassword")}
                            onChangeText={(text) =>
                                setValue("verifyPassword", text)
                            }
                            focus={focus === "verifyPassword"}
                        />
                    </InputWrapper>
                </InputContainer>
                <Button
                    onPress={onChangePassword}
                    type="accent"
                    text="비밀번호 재설정"
                    disabled={!validation}
                />
            </Container>
        </AuthLayout>
    );
}

SetPassword.propTypes = {};
export default SetPassword;
