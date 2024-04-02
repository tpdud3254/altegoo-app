import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import axios from "axios";
import Layout from "../../../component/layout/Layout";
import { showMessage } from "../../../utils";

function CancelRPack({ navigation }) {
    const onNextStep = () => {
        showMessage("해당 기능은 추후에 제공 예정입니다.");
    };

    return (
        <Layout
            bottomButtonProps={{
                onPress: onNextStep,
                title: "알팩 해지하기",
                disabled: false,
            }}
        >
            <MediumText>알팩 해지{"\n"}(추가 예정)</MediumText>
        </Layout>
    );
}

export default CancelRPack;
