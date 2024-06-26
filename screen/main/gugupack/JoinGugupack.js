import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import axios from "axios";
import Layout from "../../../component/layout/Layout";
import { getAsyncStorageToken, showMessage } from "../../../utils";
import { SERVER, VALID } from "../../../constant";
import UserContext from "../../../context/UserContext";
import RegularText from "../../../component/text/RegularText";

function JoinGugupack({ navigation }) {
    const onNextStep = async () => {
        try {
            const response = await axios.get(
                SERVER + "/users/gugupack/subscribe",
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: { result },
            } = response;

            console.log(" JoinGugupac :  ", result);
            if (result === VALID) {
                showMessage(
                    "구구팩 신청에 성공하였습니다.\n가입 승인을 기다려주세요."
                );
                navigation.goBack();
            } else
                showMessage(
                    "구구팩 신청에 실패하였습니다.\n고객센터로 문의해주세요."
                );
        } catch (error) {
            showMessage(
                "구구팩 신청에 실패하였습니다.\n고객센터로 문의해주세요."
            );
        }
    };

    return (
        <Layout
            bottomButtonProps={{
                onPress: onNextStep,
                title: "동의하고 신청하기",
                disabled: false,
            }}
        >
            <RegularText style={{ fontSize: 15 }}>
                99팩 서비스 이용 약관{"\n"}
                {"\n"}
                제１조 (목적) {"\n"}본 약관은 주식회사 지앤지 195(이하‘알테구’
                또는 ‘회사’라 합니다.)가 제공하는 99팩 서비스(이하‘서비스’라
                합니다.), 서비스이용자(이하‘회원’이라 합니다.)는 회사와 이용자
                간의 서비스 이용조건, 절차, 권리, 의무 및 기타 제반사항을
                규정함을 목적으로 합니다. {"\n"}
                {"\n"}
                제２조 (용어의 정의) {"\n"}① 99팩 서비스란, 회사가 회원에게
                추가적으로 제공하는 각종 서비스 및 관련 부가서비스 일체를
                의미한다. {"\n"}② 99팩 회원이란, 『99팩 이용약관』에 동의하고 그
                서비스를 이용하는 자로서, 본 서비스 중 개별 서비스를 이용할 수
                있는 요건을 갖춘 자를 의미한다. {"\n"}
                {"\n"}
                제３조 (서비스의 제공 및 변경) {"\n"}① 일반회원, 99팩 회원은
                대상지역의 범위 및 대상 서비스의 내용 등은 회사의 사정에 따라
                변경될 수 있으며, 그 변경으로 인하여 본 회원이 본 서비스를
                중도에 이용하지 못하게 된 경우 회사는 본 약관 제10조의 규정에
                따라 환불한다. {"\n"}② 99팩 서비스 건수 별 월 이용료(9,900원) 및
                요금할인 종류는 아래와 같다.{"\n"}월 이용건수 별 월정액 : 1~5건
                9,900원 / 6~10건 19,000원 / 11~15건 29,900원 / 16건 이상
                39,000원으로 이용 할 수 있다.{"\n"}
                99팩 서비스가입회원은 건당 업계 및 지역 평균 이용요금에서 최저
                10,000원~30,000원 까지 할인 적용 받을 수 있으며 평균 할인금액은
                20,000원으로 적용한다. (단, 손 없는 날은 제한적 할인율이 적용 될
                수 있다.){"\n"}③ 99팩 회원은 알테구앱을 통해 할인된 요금을
                지불하고 본 서비스의 전부 또는 일부를 제공 받을 수 있으며,
                알테구 회원지원정책에도 혜택를 받을 수 있다. 이때 제공하는
                서비스의 내용, 대상, 기한, 회원지원, 이용방법 등은 회사의 정책에
                따라 변경될 수 있다. {"\n"}④ 회사는 개별 서비스에 대한
                세부정책을 별도로 정하여 회원에게 통지할 수 있으며, 이 경우 개별
                서비스에 대한 세부정책이 본 약관에 우선한다. {"\n"}
                {"\n"}
                제４조 (서비스 가입 신청) {"\n"}① 본 서비스는 99팩
                서비스이용약관에 동의함으로써 가입 신청할 수 있다. {"\n"}②
                회사는 99팩 회원에게 『알테구 기업회원 서비스 이용약관』상
                결격사유가 없으면 가입 신청을 승인하며, 회원은 회사가 가입
                신청을 승인하는 즉시 본 99팩 회원이 된다. {"\n"}③ 99팩 회원의
                경우, 서비스 이용 동안에 한하여 본 회원에 준하는 것으로 보며, 본
                약관 및 월정액 결제 등에 동의해야한다. {"\n"}
                {"\n"}
                제５조 (추가 정보의 수집) {"\n"}
                회사는 본 서비스를 제공하기 위하여 필수적으로 요구되는 정보를
                별도의 동의 없이 추가로 수집할 수 있다. 다만, 수집하는 정보가
                개인정보에 해당하는 경우 관련 법령 및 『알테구 기업회원
                이용약관』상의 개인정보 보호 규정을 준수해야 한다. {"\n"}
                {"\n"}
                제６조 (회원의 의무) {"\n"}
                회원은 회사로부터 본 서비스의 이용 및 이용료의 결제를 위해 회원
                본인의 정보를 최신으로 유지하여야 하며, 회사는 회원정보가
                부정확하여 발생하는 불이익에 대하여는 책임지지 않는다. {"\n"}
                {"\n"}
                제７조 (회사의 통지 의무) {"\n"}① 회사는 회원에게 본 서비스에
                대해 설명하여야 하고, 서비스 내용의 변경이 있는 경우, 이를
                회원에게 통지하여야 한다. {"\n"}② 회원의 이용료가 결제된 경우
                회사는 회원에게 결제 사실을 통지하여야 한다. {"\n"}
                {"\n"}
                제８조 (금지행위) {"\n"}① 회원은 이 약관에 따른 회원의 권리,
                의무의 전부 또는 일부를 타인에게 대여, 양도, 위임할 수 없다.{" "}
                {"\n"}② 회원은 본 서비스의 정상적인 운영 또는 다른 회원의 본
                서비스 이용을 방해하는 행위를 하여서는 아니된다. {"\n"}
                {"\n"}
                제９조 (결제) {"\n"}① 본 서비스 가입 후 월 이용료 결제는 매월
                5일 또는 25일에 해야 하며 결제정보를 등록하여야 한다. 부득이 한
                경우 서면으로 날인 후 자동이체 동의계약서를 우편으로 본사로
                발송하여야 한다.{"\n"}
                회원이 결제수단을 등록할 경우, 해당 결제수단으로 이용료를 계속
                청구하는 것에 동의하는 것이며, 회원이 다수의 결제수단을 등록한
                경우, 회사가 정한 세부정책에 따라 결제수단을 변경하여 결제할 수
                있다. {"\n"}② 회원의 잔액 부족, 한도 초과, 결제 오류 등 기타
                사유로 이용료의 결제가 이루어 지지 않을 경우, 회원은 회사가
                고지한 재결제 기한 내에 결제 정보를 재등록, 수정하는 등
                정상적으로 결제가 이루어질 수 있도록 필요한 조치를 취하여야
                한다.  {"\n"}
                {"\n"}
                제1０조 (해지 및 환불) {"\n"}① 회사는 회원이 해지할 시 즉시
                결제정보를 파기하고 이용료에 대하여 환불 조건과 그 변경 내용에
                대해 회원에게 설명 하고 일할 계산으로 차감 후 지불하여야 한다.{" "}
                {"\n"}② 이 외에 환불은 알테구 서비스 환불규정에 의거하여
                진행된다.{"\n"}
                {"\n"}
                {"\n"}본 약관은 2024년 4월 1일자로 실행한다.
            </RegularText>
        </Layout>
    );
}

export default JoinGugupack;
