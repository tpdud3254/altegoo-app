import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../../context/UserContext";
import { ORDINARY, VALID } from "../../../constant";
import axios from "axios";
import { SERVER } from "../../../constant";
import {
    CheckLoading,
    Filter,
    getAsyncStorageToken,
    numberWithComma,
    showError,
    showMessage,
} from "../../../utils";
import HeaderLeft from "../../../component/HeaderLeft";
import HeaderRight from "../../../component/HeaderRight";
import {
    FlatList,
    Image,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import Layout, { LAYOUT_PADDING_X } from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import { shadowProps } from "../../../component/Shadow";
import RegularText from "../../../component/text/RegularText";
import RightArrow from "../../../assets/images/icons/arrow_right_s.png";
import { Order } from "../../../component/order/OrderComponent";
import { Notification } from "../../../component/Notification";
import LoginContext from "../../../context/LoginContext";
import { Row } from "../../../component/Row";
import SelectPeriod from "../../../component/selectBox/SelectPeriod";
import LoadingLayout from "../../../component/layout/LoadingLayout";

const Item = styled.View`
    width: 100%;
    margin-bottom: 30px;
`;
const ItemRow = styled(Item)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const PointButton = styled.TouchableOpacity`
    background-color: ${color["button-accent-background"]};
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    padding: 8px 13px;
    border-radius: 12px;
    margin-top: -20px;
    margin-right: 10px;
`;

const ChargeButton = styled(PointButton)`
    background-color: ${color.btnDefault};
    border: 1px solid ${color["image-area-background"]};
`;
const Wrapper = styled.View`
    background-color: white;
    padding: 16px 16px;
    border-radius: 14px;
    border: ${(props) => (props.border ? "1" : "0")}px solid ${color.blue};
`;
const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
const Select = styled.TouchableOpacity`
    background-color: #f4f4f4;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 9px 10px 9px 17px;
    border-radius: 10px;
    width: 110px;
`;
const Orders = styled.View`
    margin-top: 30px;
`;
const NoOrder = styled.View`
    align-items: center;
    padding: 40px;
    margin-bottom: 10px;
`;

const orderData = [
    {
        acceptUser: 55,
        address: "",
        address1: "서울 관악구 신림동 1623-3",
        address2: null,
        bothType: null,
        createdAt: "2023-05-12T07:56:39.900Z",
        detailAddress1: null,
        detailAddress2: null,
        directPhone: "01032655452",
        emergency: false,
        floor: 8,
        id: 119,
        memo: null,
        orderReservation: [],
        orderStatusId: 3,
        otherAddress: null,
        otherFloor: null,
        phone: "01032655452",
        point: 9000,
        price: 60000,
        pushStatus: null,
        quantity: null,
        regionId: 1,
        registUser: { id: 56 },
        simpleAddress1: "서울 관악구",
        simpleAddress2: null,
        time: "하루",
        type: "올림",
        userId: 56,
        vehicleType: "스카이",
        volumeType: "time",
        workDateTime: "2023-05-13T08:00:00.000Z",
    },
    {
        acceptUser: 55,
        address: "",
        address1: "서울 관악구 신림동 1623-3",
        address2: null,
        bothType: null,
        createdAt: "2023-05-12T07:56:39.900Z",
        detailAddress1: null,
        detailAddress2: null,
        directPhone: "01032655452",
        emergency: false,
        floor: 8,
        id: 119,
        memo: null,
        orderReservation: [],
        orderStatusId: 5,
        otherAddress: null,
        otherFloor: null,
        phone: "01032655452",
        point: 9000,
        price: 60000,
        pushStatus: null,
        quantity: null,
        regionId: 1,
        registUser: { id: 56 },
        simpleAddress1: "서울 관악구",
        simpleAddress2: null,
        time: "하루",
        type: "올림",
        userId: 56,
        vehicleType: "스카이",
        volumeType: "time",
        workDateTime: "2023-05-13T08:00:00.000Z",
    },
    {
        acceptUser: 55,
        address: "",
        address1: "서울 관악구 신림동 1623-3",
        address2: null,
        bothType: null,
        createdAt: "2023-05-12T07:56:39.900Z",
        detailAddress1: null,
        detailAddress2: null,
        directPhone: "01032655452",
        emergency: false,
        floor: 8,
        id: 119,
        memo: null,
        orderReservation: [],
        orderStatusId: 1,
        otherAddress: null,
        otherFloor: null,
        phone: "01032655452",
        point: 9000,
        price: 60000,
        pushStatus: null,
        quantity: null,
        regionId: 1,
        registUser: { id: 56 },
        simpleAddress1: "서울 관악구",
        simpleAddress2: null,
        time: "하루",
        type: "올림",
        userId: 56,
        vehicleType: "스카이",
        volumeType: "time",
        workDateTime: "2023-05-13T08:00:00.000Z",
    },
];

const bannerData = [
    {
        title: "banner1",
    },
    {
        title: "banner2",
    },
    {
        title: "banner3",
    },
];

const PERIOD = ["1주일", "1개월", "3개월"];
function Home({ navigation, route }) {
    const { width } = useWindowDimensions();
    const { info } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    const [point, setPoint] = useState(-1);
    const [orders, setOrders] = useState(-1);
    const [period, setPeriod] = useState(1);

    const bannerRef = useRef();
    const { firstLogin, setFirstLogin } = useContext(LoginContext); //TODO: 앱 처음 로그인 시 가이드 말풍선 만들기
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPoint(); //포인트
        getOrders(); //작업리스트
    }, [route?.params?.refresh]);

    useEffect(() => {
        if (CheckLoading({ point, orders })) {
            setLoading(false);
        }
    }, [point, orders]);

    useEffect(() => {
        getOrders();
    }, [period]);
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

    const getOrders = async () => {
        axios
            .get(SERVER + "/orders/mylist", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order },
                    } = data;

                    console.log(order[0]);
                    setOrders(
                        Filter({ data: order, period: PERIOD[period - 1] })
                    );
                } else {
                    setOrders([]);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };
    const goToPoint = () => {
        navigation.navigate("SettingNavigator", { screen: "PointMain" });
    };

    const renderIntro = ({ item }) => (
        <View
            style={{
                width: width - LAYOUT_PADDING_X * 2,
                height: 120,
                backgroundColor: color.lightblue,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
            }}
        >
            <BoldText style={{ color: "#0561FC" }}>{item.title}</BoldText>
        </View>
    );
    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout
                    headerShown={false}
                    registBtnShown={true}
                    touchableElement={() => (
                        <>
                            <ItemRow>
                                <BoldText
                                    style={{
                                        fontSize: 23,
                                    }}
                                >
                                    안녕하세요! {info.name}님.
                                </BoldText>
                                <View style={{ flexDirection: "row" }}>
                                    {info.userTypeId === 2 ? (
                                        <TouchableOpacity>
                                            {/* TODO: 카카오톡으로 수정 */}
                                            <Image
                                                source={require("../../../assets/images/icons/icon_info2.png")}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    marginRight: 13,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    ) : null}
                                    <Notification
                                        onPress={() =>
                                            showMessage("지원 예정 기능입니다.")
                                        }
                                    />
                                </View>
                            </ItemRow>
                            <Item>
                                <Row>
                                    <PointButton onPress={goToPoint}>
                                        <Image
                                            source={require("../../../assets/images/icons/icon_point.png")}
                                            style={{ width: 27, height: 27 }}
                                        />
                                        <BoldText
                                            style={{
                                                fontSize: 15,
                                                color: "white",
                                            }}
                                        >
                                            {" " + numberWithComma(point || 0)}
                                            <BoldText
                                                style={{
                                                    fontSize: 12,
                                                    color: "white",
                                                }}
                                            >
                                                {" "}
                                                AP
                                            </BoldText>
                                        </BoldText>
                                    </PointButton>
                                    {info.userTypeId === 2 ? (
                                        <ChargeButton>
                                            <Image
                                                source={require("../../../assets/images/icons/icon_charge.png")}
                                                style={{
                                                    width: 27,
                                                    height: 27,
                                                    marginRight: 5,
                                                }}
                                            />
                                            <MediumText
                                                style={{
                                                    fontSize: 15,
                                                }}
                                            >
                                                충전
                                            </MediumText>
                                        </ChargeButton>
                                    ) : null}
                                </Row>
                            </Item>
                            <Item>
                                <FlatList
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    data={bannerData}
                                    renderItem={renderIntro}
                                    ref={bannerRef}
                                />
                            </Item>
                        </>
                    )}
                >
                    {/* <Item>
            <Wrapper style={shadowProps}>
                <Header>
                    <MediumText>
                        이번 달{" "}
                        <MediumText
                            style={{ color: color["page-color-text"] }}
                        >
                            추천인
                        </MediumText>{" "}
                        수익
                    </MediumText>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <MediumText style={{ fontSize: 22 }}>
                            1,234,000{" "}
                            <MediumText style={{ fontSize: 12 }}>
                                AP
                            </MediumText>
                        </MediumText>
                        <Image
                            source={RightArrow}
                            style={{ width: 30, height: 30 }}
                        />
                    </View>
                </Header>
            </Wrapper>
        </Item> */}
                    {info.userTypeId === 2 ? (
                        <Item>
                            <Wrapper style={shadowProps} border={true}>
                                <Header>
                                    <MediumText
                                        style={{
                                            fontSize: 18,
                                            marginTop: 5,
                                        }}
                                    >
                                        {false ? "예약된 작업" : "진행중 작업"}
                                    </MediumText>
                                </Header>
                                <Orders>
                                    <Order.Items>
                                        <Order.Item data={orderData[0]} />
                                    </Order.Items>
                                </Orders>
                            </Wrapper>
                        </Item>
                    ) : null}
                    <Item>
                        <Wrapper style={shadowProps}>
                            <Header>
                                <MediumText
                                    style={{
                                        fontSize: 18,
                                    }}
                                >
                                    최근 등록한 작업
                                </MediumText>
                                <SelectPeriod
                                    data={PERIOD}
                                    onSelect={(index) => setPeriod(index + 1)}
                                />
                            </Header>
                            {orders.length === 0 ? (
                                <NoOrder>
                                    <RegularText
                                        style={{
                                            fontSize: 18,
                                            color: color["page-bluegrey-text"],
                                        }}
                                    >
                                        최근 등록한 작업이 없습니다.
                                    </RegularText>
                                </NoOrder>
                            ) : (
                                <Orders>
                                    <Order.Items>
                                        {orders.map((order, index) => (
                                            <Order.Item
                                                key={index}
                                                data={order}
                                            />
                                        ))}
                                    </Order.Items>
                                </Orders>
                            )}
                        </Wrapper>
                    </Item>
                </Layout>
            )}
        </>
    );
}

export default Home;
