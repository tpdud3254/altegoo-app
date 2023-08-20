import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { Image, TouchableOpacity, View } from "react-native";
import MediumText from "../../../component/text/MediumText";
import UserContext from "../../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginContext from "../../../context/LoginContext";
import Layout from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import { GetPhoneNumberWithDash, showErrorMessage } from "../../../utils";
import { color } from "../../../styles";
import { shadowProps } from "../../../component/Shadow";
import Arrow from "../../../assets/images/icons/arrow_right_B.png";
import LightText from "../../../component/text/LightText";
import { Row } from "../../../component/Row";

const Continer = styled.View`
    justify-content: space-between;
    height: 100%;
`;
const Items = styled.View`
    background-color: white;
    padding: 25px 23px 15px 23px;
    margin-top: 8px;
    margin-bottom: 8px;
    border-radius: 11px;
`;

const SItem = styled.View`
    flex-direction: row;
    margin-bottom: 15px;
    align-items: center;
`;

const Line = styled.View`
    height: 1px;
    border: 1px dashed ${color["image-area-background"]};
    margin: 10px 0px 25px 0px;
`;

const Button = styled.TouchableOpacity`
    border: 1px solid ${color["box-border"]};
    width: ${(props) => (props.width ? props.width : 100)}px;
    align-items: center;
    padding: 10px 0px;
    border-radius: 10px;
`;
function MemberInformation({ navigation }) {
    const { setIsLoggedIn } = useContext(LoginContext);
    const { info, setInfo } = useContext(UserContext);

    const logout = async () => {
        setIsLoggedIn(false);
        setInfo({});
        await AsyncStorage.removeItem("token");
    };

    const Title = ({ children, onPress }) => (
        <View
            style={{
                marginBottom: 25,
                ...(onPress && {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }),
            }}
        >
            <RegularText style={{ fontSize: 22 }}>{children}</RegularText>
            {onPress ? (
                <Button onpress={onPress} width={55}>
                    <MediumText style={{ fontSize: 15 }}>수정</MediumText>
                </Button>
            ) : null}
        </View>
    );

    const Item = ({ children, title }) => (
        <SItem>
            <LightText style={{ width: "32%" }}>{title}</LightText>
            <View style={{ width: "68%" }}>{children}</View>
        </SItem>
    );

    const Before = ({ onPress, value, title }) => (
        <View style={{ alignItems: "flex-end", marginBottom: 15 }}>
            <Item title={title ? title : value}>
                <Button onpress={onPress}>
                    <MediumText style={{ fontSize: 15 }}>등록하기</MediumText>
                </Button>
            </Item>
            <RegularText
                style={{
                    fontSize: 15,
                    color: color.main,
                    width: "68%",
                    marginTop: -5,
                }}
            >
                {value}을 등록해주세요.
            </RegularText>
        </View>
    );

    const Checking = ({ value }) => (
        <Item title={value}>
            <MediumText style={{ color: color.blue }}>
                등록 확인중입니다.
            </MediumText>
        </Item>
    );

    const Completed = ({ value }) => (
        <Item title={value}>
            <Row>
                <Image
                    source={require("../../../assets/images/icons/icon_certification.png")}
                    style={{ width: 23, height: 23, marginRight: 5 }}
                />
                <MediumText style={{ color: color["page-bluegrey-text"] }}>
                    등록완료
                </MediumText>
            </Row>
        </Item>
    );
    return (
        <Layout scroll={info.userTypeId === 2 ? true : false}>
            <Continer>
                <View>
                    <Items style={shadowProps}>
                        <Title>기본 정보</Title>
                        <Item title="이름">
                            <MediumText>홍길동</MediumText>
                        </Item>
                        <Item title="휴대전화">
                            <MediumText>010-1234-5678</MediumText>
                        </Item>
                    </Items>
                    {info.userTypeId === 3 ? (
                        <Items style={shadowProps}>
                            <Title>회사 정보</Title>
                            <Item title="사업 종류">
                                <MediumText>가구 계열</MediumText>
                            </Item>
                            <Item title="상호명">
                                <MediumText>(주)모를테구</MediumText>
                            </Item>
                            <Item title="담당자">
                                <MediumText>홍길동</MediumText>
                            </Item>
                            <Line />
                            <Before
                                value="사업자등록증"
                                onPress={() => console.log("사업자 등록증")}
                            />
                            <Checking value="사업자등록증" />
                            <Completed value="사업자등록증" />
                        </Items>
                    ) : null}
                    {info.userTypeId === 2 ? (
                        <>
                            <Items style={shadowProps}>
                                <Title>내 차 정보</Title>
                                {true ? (
                                    <>
                                        <Item title="차량 종류">
                                            <MediumText>사다리차</MediumText>
                                        </Item>
                                        <Item title="최대작업층">
                                            <MediumText>100층</MediumText>
                                        </Item>
                                        <Item title="차량번호">
                                            <MediumText>12가 1234</MediumText>
                                        </Item>
                                    </>
                                ) : (
                                    <Before
                                        value="차량 종류"
                                        onPress={() => console.log("차량 종류")}
                                    />
                                )}

                                <Line />
                                <Before
                                    value="사업자등록증"
                                    onPress={() => console.log("사업자 등록증")}
                                />
                                <Line />
                                <Before
                                    title="화물자동차 운송사업 허가증"
                                    value="허가증"
                                    onPress={() => console.log("사업자 등록증")}
                                />
                                {/* <Checking value="사업자등록증" />
                                <Completed value="사업자등록증" /> */}
                            </Items>
                            <Items style={shadowProps}>
                                <Title onPress={() => console.log("수정")}>
                                    작업 지역 정보
                                </Title>
                                <Item title="1차 지역">
                                    <MediumText>서울</MediumText>
                                </Item>
                                <Item title="2차 지역">
                                    <MediumText>인천</MediumText>
                                </Item>
                            </Items>
                        </>
                    ) : null}
                </View>
                <TouchableOpacity onPress={logout}>
                    <MediumText
                        style={{
                            color: color["page-bluegrey-text"],
                            textAlign: "center",
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                    >
                        로그아웃
                    </MediumText>
                </TouchableOpacity>
            </Continer>
        </Layout>
    );
}

MemberInformation.propTypes = {};
export default MemberInformation;