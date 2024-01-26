import React from "react";
import styled from "styled-components/native";
import { Image, TouchableOpacity, View } from "react-native";
import Layout from "../../../component/layout/Layout";
import MediumText from "../../../component/text/MediumText";
import { Row, RowAround, RowBetween } from "../../../component/Row";
import { shadowProps } from "../../../component/Shadow";
import BoldText from "../../../component/text/BoldText";
import LightText from "../../../component/text/LightText";
import { numberWithComma } from "../../../utils";
import RegularText from "../../../component/text/RegularText";
import { color } from "../../../styles";

const Select = styled.TouchableOpacity`
    background-color: #f4f4f4;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 9px 10px 9px 17px;
    border-radius: 10px;
    width: 45%;
    margin-left: 10px;
`;

const Box = styled.View`
    background-color: white;
    padding: 25px 23px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 11px;
`;

const LIST = [
    {
        date: "23.07.25 월요일",
        value: "사다리차 작업 요청",
        point: "2000",
        balance: "900000",
        type: "적립",
    },
    {
        date: "23.07.25 월요일",
        value: "사다리차 작업 요청",
        point: "2000",
        balance: "900000",
        type: "사용",
    },
    {
        date: "23.07.25 월요일",
        value: "사다리차 작업 요청",
        point: "2000",
        balance: "900000",
        type: "적립",
    },
];
function PaymentDetails() {
    // NEXT: 추후 추가
    const Title = ({ children }) => (
        <BoldText style={{ fontSize: 26, marginBottom: 30 }}>
            {children}
        </BoldText>
    );

    const Line = () => (
        <View
            style={{
                height: 1,
                backgroundColor: color["image-area-background"],
                marginTop: 18,
                marginBottom: 18,
            }}
        ></View>
    );

    const Item = ({ data }) => (
        <View>
            <LightText style={{ marginBottom: 15 }}>{data.date}</LightText>
            <RowBetween style={{ marginBottom: 10 }}>
                <MediumText>{data.value}</MediumText>
                <BoldText
                    style={{
                        color: color.blue,
                    }}
                >
                    {numberWithComma(data.point)}
                    <RegularText style={{ fontSize: 14 }}>{"  "}P</RegularText>
                </BoldText>
            </RowBetween>
            <RegularText
                style={{
                    color: color["page-grey-text"],
                    fontSize: 15,
                }}
            >
                {data.type}
            </RegularText>
            <Line />
        </View>
    );

    const More = () => (
        <TouchableOpacity style={{ marginTop: 10 }}>
            <Row style={{ justifyContent: "center" }}>
                <Image
                    source={require("../../../assets/images/icons/icon_more.png")}
                    style={{ width: 25, height: 25, marginRight: 5 }}
                />
                <RegularText style={{ fontSize: 16 }}>더보기</RegularText>
            </Row>
        </TouchableOpacity>
    );

    return (
        <Layout>
            <RowAround>
                <Select>
                    <MediumText
                        style={{
                            fontSize: 15,
                        }}
                    >
                        전체 지역
                    </MediumText>
                    <Image
                        source={require("../../../assets/images/icons/allow_down.png")}
                        style={{ width: 21, height: 12 }}
                    />
                </Select>
                <Select>
                    <MediumText
                        style={{
                            fontSize: 15,
                        }}
                    >
                        시간 순
                    </MediumText>
                    <Image
                        source={require("../../../assets/images/icons/allow_down.png")}
                        style={{ width: 21, height: 12 }}
                    />
                </Select>
            </RowAround>

            <Box style={shadowProps}>
                <Title>2023년 7월</Title>
                {LIST.map((item, index) => (
                    <Item data={item} key={index} />
                ))}
                {false ? (
                    <More />
                ) : (
                    <RegularText
                        style={{
                            fontSize: 17,
                            textAlign: "center",
                            marginTop: 10,
                        }}
                    >
                        더 이상 내역이 없습니다.
                    </RegularText>
                )}
            </Box>
        </Layout>
    );
}

PaymentDetails.propTypes = {};
export default PaymentDetails;
