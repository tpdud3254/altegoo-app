import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useForm } from "react-hook-form";
import {
    CheckValidation,
    checkPassword,
    getAsyncStorageToken,
    showError,
    showErrorMessage,
    showMessage,
} from "../../../utils";
import Layout from "../../../component/layout/Layout";
import TextInput from "../../../component/input/TextInput";
import RegularText from "../../../component/text/RegularText";
import { color } from "../../../styles";
import Button from "../../../component/button/Button";
import axios from "axios";
import { SERVER, VALID } from "../../../constant";

const InputContainer = styled.View`
    margin-top: 30px;
`;

const InputWrapper = styled.View`
    margin-bottom: 30px;
`;

function ChangePassword({ navigation }) {
    const { info, setInfo } = useContext(UserContext);
    const { register, setValue, watch, getValues, handleSubmit } = useForm();

    const [validation, setValidation] = useState(false);

    const passwordRef = useRef();
    const verifyPasswordRef = useRef();

    useEffect(() => {
        console.log(info);
        register("curPassword");
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

    const onNext = async (data) => {
        const { curPassword, password, verifyPassword } = data;

        if (!validation) {
            showErrorMessage("모든 필드를 입력해주세요.");
            return;
        }
        if (password !== verifyPassword) {
            showErrorMessage("입력하신 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!checkPassword(password)) {
            showErrorMessage("비밀번호가 조건에 맞지 않습니다.");
            return;
        }

        try {
            const response = await axios.post(
                SERVER + "/users/setting/password",
                {
                    curPassword,
                    password,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: { result },
            } = response;
            console.log(result);

            if (result === VALID) {
                showMessage("비밀번호가 변경되었습니다.");
                navigation.goBack();
            } else {
                showMessage(response.data.msg);
            }
        } catch (error) {
            console.log(error);
            showError(error);
        }
    };

    return (
        <Layout scroll={false}>
            <InputContainer>
                <InputWrapper>
                    <TextInput
                        type="password"
                        title="현재 비밀번호"
                        placeholder="비밀번호 (8자 이상)"
                        returnKeyType="next"
                        value={watch("curPassword")}
                        onChangeText={(text) => setValue("curPassword", text)}
                        onReset={() => setValue("curPassword", "")}
                        onSubmitEditing={() => passwordRef.current.setFocus()}
                    />
                </InputWrapper>
                <InputWrapper>
                    <TextInput
                        ref={passwordRef}
                        type="password"
                        title="새 비밀번호"
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
                        title="새 비밀번호 확인"
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
            <Button
                onPress={handleSubmit(onNext)}
                type="accent"
                text="비밀번호 변경"
            />
        </Layout>
    );
}

export default ChangePassword;
