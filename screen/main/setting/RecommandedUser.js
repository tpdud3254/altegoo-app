import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import Layout, { LAYOUT_PADDING_X } from "../../../component/layout/Layout";
import { Row, RowBetween } from "../../../component/Row";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import { shadowProps } from "../../../component/Shadow";
import { Image, TouchableOpacity, View } from "react-native";
import RegularText from "../../../component/text/RegularText";
import { SERVER, VALID } from "../../../constant";
import axios from "axios";
import {
    CheckLoading,
    getAsyncStorageToken,
    showErrorMessage,
} from "../../../utils";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import BoldText from "../../../component/text/BoldText";

const Tabs = styled.View`
    border-bottom-width: 1px;
    border-bottom-color: ${color["image-area-background"]};
    flex-direction: row;
    align-items: center;
    margin-left: -${LAYOUT_PADDING_X}px;
    margin-right: -${LAYOUT_PADDING_X}px;
    margin-bottom: 10px;
`;

const Tab = styled.TouchableOpacity`
    width: 50%;
    align-items: center;
    border-bottom-width: ${(props) => (props.selected ? 2 : 0)}px;
    border-bottom-color: ${color.main};
    padding-bottom: 15px;
`;
const Item = styled.View`
    background-color: white;
    padding: 25px 23px;
    margin-top: 10px;
    margin-bottom: 8px;
    border-radius: 11px;
`;

const COMPANY_LIST = [
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
];

const DRIVER_LIST = [
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
    "홍길동",
];
function RecommandedUser({ route, navigation }) {
    const { info } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(1);

    const [driverList, setDriverList] = useState(-1);
    const [companyList, setCompanyList] = useState(-1);
    const [myRecommendUser, setMyRecommendUser] = useState(-1);

    useEffect(() => {
        getRecommendUser();
        if (info.recommendUserId !== 1) getMyRecommendUser();
        else setMyRecommendUser("altegoo");
    }, []);

    useEffect(() => {
        if (CheckLoading({ driverList, companyList, myRecommendUser })) {
            setLoading(false);
        }
    }, [driverList, companyList, myRecommendUser]);

    const getMyRecommendUser = async () => {
        try {
            const response = await axios.get(SERVER + "/users/user", {
                params: { id: info.recommendUserId },
            });

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { user },
                    },
                } = response;
                setMyRecommendUser(user);
            }
        } catch (e) {
            console.log(e);
            showErrorMessage("추천인 조회에 실패하였습니다.");
        }
    };

    const getRecommendUser = async () => {
        try {
            const response = await axios.get(SERVER + "/users/user/recommend", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            });

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { list },
                    },
                } = response;

                classifyByUserType(list);
            }
        } catch (error) {
            console.log(error);
            showErrorMessage("추천인 조회에 실패했습니다.");
        }
    };

    const classifyByUserType = (list) => {
        if (list.length === 0) {
            setDriverList([]);
            setCompanyList([]);
        }

        const driverList = [];
        const companyList = [];

        list.map((value) => {
            if (value.userTypeId === 2) driverList.push(value);
            else if (value.userTypeId === 3) companyList.push(value);
        });

        console.log("driverList : ", driverList);
        console.log("companyList : ", companyList);

        setDriverList(driverList);
        setCompanyList(companyList);
    };

    const TabTitle = ({ title, num }) => (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <MediumText>{title}</MediumText>
            <MediumText style={{ color: color.main, marginLeft: 5 }}>
                {num}
            </MediumText>
        </View>
    );

    const Line = () => {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: color["image-area-background"],
                    marginTop: 17,
                    marginBottom: 17,
                }}
            ></View>
        );
    };

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
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout>
                    <Tabs>
                        <Tab selected={menu === 1} onPress={() => setMenu(1)}>
                            <TabTitle
                                title="추천 기사"
                                num={driverList.length}
                            />
                        </Tab>
                        <Tab selected={menu === 2} onPress={() => setMenu(2)}>
                            <TabTitle
                                title="추천 기업"
                                num={companyList.length}
                            />
                        </Tab>
                    </Tabs>
                    <Item style={shadowProps}>
                        {menu === 1
                            ? driverList.map((value, index) => (
                                  <View key={index}>
                                      <RegularText>{value.name}</RegularText>
                                      <Line />
                                  </View>
                              ))
                            : companyList.map((value, index) => (
                                  <View key={index}>
                                      {value.gugupack ? (
                                          <Row>
                                              <RegularText
                                                  style={{ marginRight: 5 }}
                                              >
                                                  {value.name}
                                              </RegularText>
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
                                          <RegularText>
                                              {value.name}
                                          </RegularText>
                                      )}
                                      <Line />
                                  </View>
                              ))}
                        {/* {false ? (
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
                        )} */}
                    </Item>
                    <Item style={shadowProps}>
                        <View style={{ alignItems: "center" }}>
                            <RegularText style={{ marginBottom: 15 }}>
                                알테구 추천인 정보
                            </RegularText>
                            {info.recommendUserId === 1 ? (
                                <BoldText>주식회사지앤지195</BoldText>
                            ) : myRecommendUser.userTypeId !== 3 ? (
                                <BoldText>{myRecommendUser.name}</BoldText>
                            ) : (
                                <BoldText>
                                    {myRecommendUser.companyName}
                                </BoldText>
                            )}
                        </View>
                    </Item>
                </Layout>
            )}
        </>
    );
}

RecommandedUser.propTypes = {};
export default RecommandedUser;
