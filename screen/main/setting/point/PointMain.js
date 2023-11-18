import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image, TouchableOpacity, View } from "react-native";
import UserContext from "../../../../context/UserContext";
import { getAsyncStorageToken, numberWithComma } from "../../../../utils";
import axios from "axios";
import { SERVER } from "../../../../constant";
import Layout from "../../../../component/layout/Layout";
import LightText from "../../../../component/text/LightText";
import BoldText from "../../../../component/text/BoldText";
import RegularText from "../../../../component/text/RegularText";
import { Row, RowAround, RowBetween } from "../../../../component/Row";
import { color } from "../../../../styles";

const Header = styled.View`
    margin-bottom: 20px;
`;
const Box = styled.View`
    background-color: ${color.lightblue};
    padding: 17px 20px;
    border-radius: 10px;
    margin-bottom: 15px;
`;
const Button = styled.TouchableOpacity`
    padding-top: 5px;
    padding-bottom: 5px;
`;
const WithdrawalButton = styled.TouchableOpacity`
    align-items: center;
    background-color: white;
    border: 1px solid ${color.main};
    border-radius: 10px;
    padding: 15px;
`;

const Dot = styled.View`
    width: 8px;
    height: 8px;
    background-color: ${color.main};
    border-radius: 5px;
`;

const COUPON_LIST = [
    {
        title: "회원 가입 축하 쿠폰",
        value: "작업 등록시 20,000 AP 할인",
    },
    {
        title: "회원 가입 축하 쿠폰",
        value: "작업 등록시 20,000 AP 할인",
    },
];

function PointMain({ navigation }) {
    const { info } = useContext(UserContext);

    const [account, setAccount] = useState({});
    const [couponListVisible, setCouponListVisible] = useState(false);

    const [point, setPoint] = useState(-1);

    useEffect(() => {
        getPoint(); //포인트

        const focusSubscription = navigation.addListener("focus", () => {
            getPoint(); //포인트
        });

        return () => {
            focusSubscription();
        };
    }, []);

    const goToPage = (page, data) => {
        navigation.navigate(page, data);
    };

    console.log(info);

    const toggleCouponList = () => setCouponListVisible((prev) => !prev);

    const getPoint = async () => {
        axios
            .get(SERVER + "/users/point", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            })
            .then(({ data }) => {
                const {
                    result,
                    data: { point },
                } = data;
                console.log("result: ", result);
                console.log("point: ", point);

                setPoint(point?.curPoint);
            })
            .catch((error) => {
                setPoint(0);
                showError(error);
            })
            .finally(() => {});
    };

    const Line = () => (
        <View
            style={{
                height: 1,
                backgroundColor: "#D3E0F4",
                marginTop: 15,
                marginBottom: 15,
            }}
        ></View>
    );

    const Coupon = ({ data, lastChild }) => (
        <View
            style={{
                alignItems: "flex-end",
                marginTop: 5,
                marginBottom: lastChild ? 10 : 20,
            }}
        >
            <Row>
                <View style={{ width: "4%" }}>
                    <Dot />
                </View>
                <BoldText style={{ width: "96%" }}>{data.title}</BoldText>
            </Row>
            <RegularText style={{ width: "96%", fontSize: 17, marginTop: 6 }}>
                작업 등록시 20,000 AP 할인
            </RegularText>
        </View>
    );

    return (
        <Layout>
            <Header>
                <LightText style={{ marginBottom: 3 }}>
                    사람과 사람을 연결하는
                </LightText>
                <BoldText>알테구 포인트</BoldText>
            </Header>
            <Box>
                <View style={{ alignItems: "center" }}>
                    <RegularText style={{ fontSize: 15, marginBottom: 10 }}>
                        보유 포인트
                    </RegularText>
                    <Row>
                        <Image
                            source={require("../../../../assets/images/icons/icon_point.png")}
                            style={{
                                width: 27,
                                height: 27,
                                marginRight: 2,
                            }}
                        />
                        <BoldText
                            style={{
                                fontSize: 16,
                            }}
                        >
                            {point > -1 ? numberWithComma(point) : null}
                            <BoldText
                                style={{
                                    fontSize: 13,
                                }}
                            >
                                {" "}
                                AP
                            </BoldText>
                        </BoldText>
                    </Row>
                </View>
                <Line />
                <RowAround>
                    {info.userTypeId === 2 ? (
                        <Button onPress={() => goToPage("ChargePoint")}>
                            <Row>
                                <Image
                                    source={require("../../../../assets/images/icons/icon_charge.png")}
                                    style={{
                                        width: 27,
                                        height: 27,
                                        marginRight: 5,
                                    }}
                                    resizeMode="contain"
                                />
                                <RegularText
                                    style={{
                                        fontSize: 15,
                                    }}
                                >
                                    충전하기
                                </RegularText>
                            </Row>
                        </Button>
                    ) : null}
                    <Button onPress={() => goToPage("PointBreakdown")}>
                        <Row>
                            <Image
                                source={require("../../../../assets/images/icons/icon_point_histy.png")}
                                style={{
                                    width: 22,
                                    height: 25,
                                    marginRight: 5,
                                }}
                                resizeMode="contain"
                            />
                            <RegularText
                                style={{
                                    fontSize: 15,
                                }}
                            >
                                이용내역
                            </RegularText>
                        </Row>
                    </Button>
                    {/* NEXT: 소득공제 */}
                    {/* <Button>
                        <Row>
                            <Image
                                source={require("../../../../assets/images/icons/icon_taxback.png")}
                                style={{
                                    width: 25,
                                    height: 25,
                                    marginRight: 5,
                                }}
                                resizeMode="contain"
                            />
                            <RegularText
                                style={{
                                    fontSize: 15,
                                }}
                            >
                                소득공제
                            </RegularText>
                        </Row>
                    </Button> */}
                </RowAround>
            </Box>
            <WithdrawalButton onPress={() => goToPage("WithdrawalPoint")}>
                <BoldText style={{ color: color.main }}>
                    포인트 출금하기
                </BoldText>
            </WithdrawalButton>
            {/* NEXT: 기사일경우 차트*/}
            {/* NEXT: 쿠폰기능 추가 */}
            {/* <BoldText style={{ marginTop: 30, marginBottom: 10 }}>
                쿠폰
            </BoldText>
            <Box>
                <TouchableOpacity
                // onPress={toggleCouponList}
                >
                    
                    <RowBetween>
                        <RegularText style={{ fontSize: 15 }}>
                            보유한 쿠폰
                        </RegularText>
                        <Row>
                            <BoldText>{COUPON_LIST.length}장</BoldText>
                            {couponListVisible ? (
                                <Image
                                    source={require("../../../../assets/images/icons/icon_fullup.png")}
                                    style={{
                                        width: 27,
                                        height: 27,
                                        marginLeft: 2,
                                    }}
                                />
                            ) : (
                                <Image
                                    source={require("../../../../assets/images/icons/icon_fulldw2.png")}
                                    style={{
                                        width: 27,
                                        height: 27,
                                        marginLeft: 2,
                                    }}
                                />
                            )}
                        </Row>
                    </RowBetween>
                    {couponListVisible ? (
                        <>
                            <Line />
                            {COUPON_LIST.map((coupon, index) => (
                                <Coupon
                                    data={coupon}
                                    key={index}
                                    lastChild={COUPON_LIST.length === index + 1}
                                />
                            ))}
                        </>
                    ) : null}
                </TouchableOpacity>
            </Box> */}
        </Layout>
    );
}

PointMain.propTypes = {};
export default PointMain;
