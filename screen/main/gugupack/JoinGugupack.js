import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import axios from "axios";
import Layout from "../../../component/layout/Layout";
import { showMessage } from "../../../utils";
import { SERVER, VALID } from "../../../constant";
import UserContext from "../../../context/UserContext";

function JoinGugupack({ navigation }) {
    const { info, setInfo } = useContext(UserContext);

    const onNextStep = async () => {
        try {
            const response = await axios.post(SERVER + "/users/gugupack/join", {
                id: info.id,
            });

            const {
                data: {
                    data: { user },
                    result,
                },
            } = response;

            if (result === VALID) {
                showMessage("구구팩 가입에 성공하였습니다.");
                setInfo({ ...info, ...user });
                navigation.goBack();
            } else
                showMessage("가입에 실패하였습니다.\n고객센터로 문의해주세요.");
        } catch (error) {
            showMessage("가입에 실패하였습니다.\n고객센터로 문의해주세요.");
        }
    };

    return (
        <Layout
            bottomButtonProps={{
                onPress: onNextStep,
                title: "동의하고 가입하기",
                disabled: false,
            }}
        >
            <MediumText>구구팩 가입 약관{"\n"}(추가 예정)</MediumText>
        </Layout>
    );
}

export default JoinGugupack;
