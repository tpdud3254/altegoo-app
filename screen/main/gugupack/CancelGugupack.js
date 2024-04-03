import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import axios from "axios";
import Layout from "../../../component/layout/Layout";
import { showMessage } from "../../../utils";
import UserContext from "../../../context/UserContext";
import { SERVER, VALID } from "../../../constant";

function CancelGugupack({ navigation }) {
    const { info, setInfo } = useContext(UserContext);

    const onNextStep = async () => {
        try {
            const response = await axios.post(
                SERVER + "/users/gugupack/cancel",
                {
                    id: info.id,
                }
            );

            const {
                data: {
                    data: { user },
                    result,
                },
            } = response;

            if (result === VALID) {
                showMessage("구구팩 해지에 성공하였습니다.");
                console.log("cancel! : ", user.gugupack);
                setInfo({ ...info, ...user });
                navigation.goBack();
            } else
                showMessage("해지에 실패하였습니다.\n고객센터로 문의해주세요.");
        } catch (error) {
            showMessage("해지에 실패하였습니다.\n고객센터로 문의해주세요.");
        }
    };

    return (
        <Layout
            bottomButtonProps={{
                onPress: onNextStep,
                title: "구구팩 해지하기",
                disabled: false,
            }}
        >
            <MediumText>구구팩 해지{"\n"}(추가 예정)</MediumText>
        </Layout>
    );
}

export default CancelGugupack;
