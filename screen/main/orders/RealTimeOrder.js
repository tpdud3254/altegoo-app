import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import { VALID } from "../../../constant";
import axios from "axios";
import { SERVER } from "../../../constant";
import {
    CheckLoading,
    GoToOrderPage,
    getAsyncStorageToken,
    getDistance,
    showError,
} from "../../../utils";
import { Image } from "react-native";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import Layout from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import * as Location from "expo-location";
import { Notification } from "../../../component/Notification";
import { Row } from "../../../component/Row";
import RefreshBtn from "../../../assets/images/icons/btn_Refresh.png";
import { Order } from "../../../component/order/RealTImeOrderComponent";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import SelectFilter from "../../../component/selectBox/SelectFilter";

const Refresh = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-right: 7%;
`;

const Item = styled.View`
    width: 100%;
    margin-bottom: 25px;
`;
const ItemRow = styled(Item)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Orders = styled.View``;
const NoOrder = styled.View`
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
        props.emergency ? color["box-color-background"] : color.lightblue};
    border-radius: 16px;
    height: 150px;
`;

const Noti = styled.View`
    background-color: ${color.blue};
    margin-left: -16px;
    margin-right: -16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px;
`;

const Shortcut = styled.TouchableOpacity`
    background-color: white;
    padding: 10px;
    border-radius: 7px;
`;

const REGION = [
    "전체 지역",
    "서울",
    "인천",
    "김포, 부천, 파주, 고양, 동두천, 연천",
    "의정부, 양주, 구리, 남양주, 포천, 가평",
    "광명, 시흥, 안산, 안양, 과천, 의왕, 군포, 수원, 오산, 화성, 평택",
    "성남, 하남, 광주, 용인, 안성, 이천, 여주, 양평",
];

const FILTER = ["시간 순", "거리 순"];

function RealTimeOrder({ navigation }) {
    const { info } = useContext(UserContext);

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState(-1);
    const [acceptOrder, setAcceptOrder] = useState(-1);
    const [filteredOrders, setFilteredOrders] = useState(-1);

    const [filter, setFilter] = useState(1);
    const [curLatitude, setCurLatitude] = useState(0);
    const [curLongitude, setCurLongitude] = useState(0);

    useEffect(() => {
        getCurrentLocation();
        setLoading(true);

        setOrders(-1);
        setFilteredOrders(-1);
        setFilter(1);

        getOrders();
        getAcceptOrders();

        const focusSubscription = navigation.addListener("focus", () => {
            refresh();
        });

        return () => {
            focusSubscription();
        };
    }, []);

    useEffect(() => {
        if (CheckLoading({ orders, acceptOrder, filteredOrders })) {
            setLoading(false);
        }
    }, [orders, acceptOrder, filteredOrders]);

    const refresh = () => {
        getCurrentLocation();
        setLoading(true);

        setOrders(-1);
        setFilteredOrders(-1);
        setFilter(1);

        getOrders();
        getAcceptOrders();
    };

    const getCurrentLocation = async () => {
        const location = await Location.getCurrentPositionAsync();

        const {
            coords: { latitude, longitude },
        } = location;

        setCurLatitude(latitude);
        setCurLongitude(longitude);
    };

    const getOrders = async () => {
        axios
            .get(SERVER + "/orders/realtime", {
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

                    console.log("orders : ", order);
                    setOrders(order || []);
                    setDistanceFilter(order);
                } else {
                    setOrders([]);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const getAcceptOrders = async () => {
        axios
            .get(SERVER + "/orders/accept", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
                params: { orderStatusArr: [2, 3, 4] },
            })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order },
                    } = data;

                    console.log("acceptOrders : ", order[order.length - 1]);
                    if (order.length > 0)
                        setAcceptOrder(order[order.length - 1]);
                    else setAcceptOrder(0);
                } else {
                    setAcceptOrder(0);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const setDistanceFilter = (orders) => {
        console.log(curLatitude, curLongitude);
        const filteredList = [];

        orders.map((order) => {
            const distance = getDistance(
                Number(curLatitude),
                Number(curLongitude),
                Number(order.latitude),
                Number(order.longitude)
            );

            order.distance = distance;

            filteredList.push(order);
        });

        for (let i = 0; i < filteredList.length - 1; i++) {
            for (let j = 1; j < filteredList.length - i; j++) {
                if (filteredList[j - 1].distance > filteredList[j].distance) {
                    let temp = filteredList[j - 1];
                    filteredList[j - 1] = filteredList[j];
                    filteredList[j] = temp;
                }
            }
        }

        console.log("filter : ", filteredList);

        setFilteredOrders(filteredList);
    };

    const goToDriverProgress = () => {
        const page = GoToOrderPage(info, acceptOrder);
        navigation.navigate(page, { orderId: acceptOrder.id });
    };

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout headerShown={false} registBtnShown={true}>
                    <ItemRow>
                        <BoldText
                            style={{
                                fontSize: 23,
                                maxWidth: "50%",
                            }}
                        >
                            {orders && orders !== -1 ? orders.length : "0"}건의
                            실시간 오더
                        </BoldText>
                        <Row style={{ maxWidth: "50%" }}>
                            <Refresh onPress={refresh}>
                                <MediumText
                                    style={{
                                        fontSize: 15,
                                        color: color.blue,
                                        marginRight: 3,
                                    }}
                                >
                                    새로고침
                                </MediumText>
                                <Image
                                    source={RefreshBtn}
                                    resizeMode="contain"
                                    style={{ width: 27, height: 27 }}
                                />
                            </Refresh>
                            <Notification />
                        </Row>
                    </ItemRow>
                    {acceptOrder ? (
                        <Item>
                            <Noti>
                                <Row>
                                    <Image
                                        source={require("../../../assets/images/icons/icon_info1.png")}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            marginRight: 7,
                                        }}
                                    />
                                    <MediumText
                                        style={{
                                            fontSize: 16,
                                            color: "white",
                                            maxWidth: "80%",
                                        }}
                                    >
                                        현재 진행중인 작업이 있습니다.
                                    </MediumText>
                                </Row>
                                <Shortcut onPress={goToDriverProgress}>
                                    <MediumText
                                        style={{
                                            fontSize: 14,
                                            color: color.blue,
                                        }}
                                    >
                                        바로가기
                                    </MediumText>
                                </Shortcut>
                            </Noti>
                        </Item>
                    ) : null}
                    <ItemRow style={{ justifyContent: "flex-end" }}>
                        {/* <SelectFilter
                            data={REGION}
                            // onSelect={(index) => setPeriod(index + 1)}
                        /> TODO: 작업 지역 필터 추가*/}
                        <SelectFilter
                            data={FILTER}
                            onSelect={(index) => setFilter(index + 1)}
                        />
                    </ItemRow>

                    {filter === 1 && orders !== -1 ? (
                        orders !== -1 && orders.length > 0 ? (
                            <Item>
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
                            </Item>
                        ) : (
                            <NoOrder>
                                <RegularText>
                                    등록된 오더가 없습니다.
                                </RegularText>
                            </NoOrder>
                        )
                    ) : null}

                    {filter === 2 && filteredOrders !== -1 ? (
                        filteredOrders !== -1 && filteredOrders.length > 0 ? (
                            <Item>
                                <Orders>
                                    <Order.Items>
                                        {filteredOrders.map((order, index) => (
                                            <Order.Item
                                                key={index}
                                                data={order}
                                            />
                                        ))}
                                    </Order.Items>
                                </Orders>
                            </Item>
                        ) : (
                            <NoOrder>
                                <RegularText>
                                    등록된 오더가 없습니다.
                                </RegularText>
                            </NoOrder>
                        )
                    ) : null}
                </Layout>
            )}
        </>
    );
}

export default RealTimeOrder;
