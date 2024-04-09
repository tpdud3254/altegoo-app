import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image, View } from "react-native";
import MediumText from "../../../component/text/MediumText";
import UserContext, { UserConsumer } from "../../../context/UserContext";
import Layout from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import {
    GetPhoneNumberWithDash,
    IsGugupackMember,
    getAsyncStorageToken,
    numberWithComma,
} from "../../../utils";
import { color } from "../../../styles";
import { shadowProps } from "../../../component/Shadow";
import Arrow from "../../../assets/images/icons/arrow_right_B.png";
import axios from "axios";
import { COMPANY, SERVER } from "../../../constant";
import { Row } from "../../../component/Row";

const Top = styled.View`
    background-color: white;
    flex-direction: row;
    justify-content: space-between;
    padding: 60px 20px 20px 20px;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: ${color["image-area-background"]};
`;

const UserInfomation = styled.TouchableOpacity`
    border: 1px ${color["box-border"]} solid;
    justify-content: center;
    padding-left: 13px;
    padding-right: 13px;
    border-radius: 10px;
    height: 40px;
`;

const SMenu = styled.TouchableOpacity`
    background-color: white;
    padding: 25px 23px;
    margin-top: 8px;
    margin-bottom: 8px;
    border-radius: 11px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const Footer = styled.ScrollView`
    position: absolute;
    bottom: 0;
    max-height: 100px;
    width: 110%;
`;

function Menus({ navigation }) {
    const { info, setInfo } = useContext(UserContext);

    const [point, setPoint] = useState(-1);

    useEffect(() => {
        getPoint(); //포인트

        navigation.setOptions({
            header: () => (
                <Top>
                    <View>
                        <UserConsumer>
                            {({ info }) =>
                                IsGugupackMember(info) ? (
                                    <Row style={{ marginBottom: 3 }}>
                                        <BoldText
                                            style={{
                                                fontSize: 22,
                                                marginRight: 5,
                                            }}
                                        >
                                            {info.name} 님
                                        </BoldText>
                                        <Image
                                            style={{
                                                width: 25,
                                                height: 25,
                                                marginBottom: 2,
                                            }}
                                            resizeMode="contain"
                                            source={require(`../../../assets/images/icons/gugu_badge.png`)}
                                        />
                                    </Row>
                                ) : (
                                    <BoldText
                                        style={{
                                            fontSize: 22,
                                            marginBottom: 5,
                                        }}
                                    >
                                        {info.name} 님
                                    </BoldText>
                                )
                            }
                        </UserConsumer>
                        <RegularText>
                            {GetPhoneNumberWithDash(info.phone)}
                        </RegularText>
                    </View>
                    <UserInfomation
                        onPress={() => goToPage("MemberInformation")}
                    >
                        <MediumText style={{ fontSize: 16 }}>
                            회원정보
                        </MediumText>
                    </UserInfomation>
                </Top>
            ),
        });
        const focusSubscription = navigation.addListener("focus", () => {
            getPoint(); //포인트
        });

        return () => {
            focusSubscription();
        };
    }, []);

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

    const goToPage = (pageName) => {
        navigation.navigate("SettingNavigator", {
            screen: pageName,
        });
    };

    const Menu = ({ children, onPress }) => {
        return (
            <SMenu style={shadowProps} onPress={onPress}>
                <View>{children}</View>
                <Image source={Arrow} style={{ width: 20, height: 30 }} />
            </SMenu>
        );
    };
    return (
        <Layout scroll={false}>
            <Menu onPress={() => goToPage("PointMain")}>
                <MediumText>
                    포인트 정보{"\n"}
                    {/* 포인트 및 쿠폰 NEXT: 쿠폰 삭제 */}
                    {point > -1 ? (
                        <MediumText style={{ color: color.main }}>
                            {numberWithComma(point)}{" "}
                            <MediumText
                                style={{ color: color.main, fontSize: 14 }}
                            >
                                P
                            </MediumText>
                        </MediumText>
                    ) : null}
                </MediumText>
            </Menu>
            {/* <Menu onPress={() => goToPage("PaymentDetails")}>
                <MediumText>결제내역</MediumText>
            </Menu> TODO: 결제내역 추가*/}
            <Menu onPress={() => goToPage("RecommandedUser")}>
                <MediumText>추천인 정보</MediumText>
            </Menu>
            <Menu onPress={() => goToPage("ChangePassword")}>
                <MediumText>비밀번호 변경</MediumText>
            </Menu>

            <Footer>
                <MediumText
                    style={{
                        color: color["page-bluegrey-text"],
                        textAlign: "center",
                        fontSize: 12,
                        marginBottom: 10,
                    }}
                >
                    회사명 : (주)지앤지195 / 대표자 : 조선희 {"\n"}
                    주소 : 서울 금천구 디지털로9길 46 (이앤씨드림타워7차) 707호
                    {"\n"}
                    이메일 : pilka4133@altegoo.com{"\n"}
                    전화 : 1522-9190 / 팩스 : 02-867-0196{"\n"}
                    사업자등록번호 : 525-81-03000 / 통신판매업신고 : 제
                    2023-서울금천-2122 호{"\n"}
                    COPYRIGHT (c) (주)지앤지195 ALL RIGHTS RESERVED.
                </MediumText>
            </Footer>
        </Layout>
    );
}

Menus.propTypes = {};
export default Menus;
