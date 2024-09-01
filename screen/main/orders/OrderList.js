import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { Notification } from "../../../component/icon/Notification";
import { color } from "../../../styles";
import Layout from "../../../component/layout/Layout";
import { shadowProps } from "../../../component/Shadow";
import { Order } from "../../../component/order/OrderComponent";
import UserContext from "../../../context/UserContext";
import {
    CheckLoading,
    Filter,
    GoToOrderPage,
    IsIOS,
    getAsyncStorageToken,
    showMessage,
} from "../../../utils";
import axios from "axios";
import { SERVER, VALID } from "../../../constant";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import SelectFilter from "../../../component/selectBox/SelectFilter";
import { Support } from "../../../component/icon/Support";

const HeaderContainer = styled.View`
    background-color: white;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: ${(props) => (props.ios ? 58 : 48)}px;
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom-color: ${color["image-area-background"]};
    border-bottom-width: 1px;
`;

const HaederWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    width: 32%;
`;

const Item = styled.View`
    width: 100%;
    margin-bottom: 30px;
`;

const Wrapper = styled.View`
    background-color: white;
    padding: 10px 16px;
    border-radius: 14px;
`;
const Orders = styled.View`
    margin-top: 15px;
`;

const PERIOD = ["1개월", "3개월", "6개월", "전체 기간"];

function OrderList({ navigation }) {
    const { info } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    const [period, setPeriod] = useState(1);
    const [orders, setOrders] = useState(-1);
    const [sortedData, setSortedData] = useState(-1);
    const [scheduledOrderCount, setScheduledOrderCount] = useState(-1);

    useEffect(() => {
        navigation.setOptions({
            header: Header,
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        getOrders(); //작업리스트

        const focusSubscription = navigation.addListener("focus", () => {
            setLoading(true);
            getOrders();
        });

        return () => {
            focusSubscription();
        };
    }, []);

    useEffect(() => {
        if (CheckLoading({ orders, scheduledOrderCount, sortedData })) {
            setLoading(false);
        }
    }, [orders, scheduledOrderCount, sortedData]);

    useEffect(() => {
        getOrders();
    }, [period]);

    const getOrders = async () => {
        axios
            .get(SERVER + "/orders/mylist/all", {
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
                    if (order.length === 0) {
                        setOrders([]);
                        setSortedData({});
                        setScheduledOrderCount(0);
                    } else {
                        const filterd = Filter({
                            data: order,
                            period: PERIOD[period - 1],
                            orderBy: "dateTime",
                        });
                        setOrders(filterd);
                        setSortedData(getSortedOrders(filterd));
                        setScheduledOrderCount(getScheduledOrderCount(filterd));
                    }
                } else {
                    setOrders([]);
                    setSortedData({});
                    setScheduledOrderCount(0);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const getSortedOrders = (orders) => {
        const result = {};

        orders.map((order) => {
            const dateTime = new Date(order.dateTime);

            const key = `${dateTime
                .getUTCFullYear()
                .toString()
                .substring(2, 4)}년 ${dateTime.getUTCMonth() + 1}월`;

            if (!result[key]) result[key] = [];

            result[key].push(order);
        });

        return result;
    };

    const getScheduledOrderCount = (orders) => {
        let count = 0;

        orders.map((order) => {
            if (order.orderStatusId === 1 || order.orderStatusId === 2) {
                count = count + 1;
            }
        });

        return count;
    };

    const Header = () => {
        return (
            <HeaderContainer ios={IsIOS()}>
                <HaederWrapper>
                    <Image
                        source={require("../../../assets/images/icons/bullet_tri.png")}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    <BoldText style={{ fontSize: 16 }}>
                        {scheduledOrderCount < 0 ? 0 : scheduledOrderCount}건
                        <RegularText style={{ fontSize: 16 }}>
                            {" "}
                            예정
                        </RegularText>
                    </BoldText>
                </HaederWrapper>
                {true ? (
                    <HaederWrapper style={{ justifyContent: "center" }}>
                        <SelectFilter
                            data={PERIOD}
                            onSelect={(index) => setPeriod(index + 1)}
                        />
                    </HaederWrapper>
                ) : (
                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <HaederWrapper
                            style={{
                                justifyContent: "center",
                            }}
                        >
                            <Image
                                source={require("../../../assets/images/icons/btn_prev_s.png")}
                                style={{
                                    width: 25,
                                    height: 25,
                                    resizeMode: "contain",
                                }}
                            />
                            <BoldText
                                style={{
                                    fontSize: 22,
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                }}
                            >
                                3주차
                            </BoldText>
                            <Image
                                source={require("../../../assets/images/icons/btn_next_s.png")}
                                style={{
                                    width: 25,
                                    height: 25,
                                    resizeMode: "contain",
                                }}
                            />
                        </HaederWrapper>
                        <RegularText style={{ fontSize: 14, paddingTop: 4 }}>
                            23년 5월
                        </RegularText>
                    </View>
                )}

                <HaederWrapper style={{ justifyContent: "flex-end" }}>
                    <Support />
                    {/* <Notification
                        onPress={() => showMessage("지원 예정 기능입니다.")}
                    /> */}
                </HaederWrapper>
            </HeaderContainer>
        );
    };

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout>
                    {orders === -1 || orders.length === 0 ? null : (
                        <>
                            {Object.keys(sortedData).map((value, index) => (
                                <Item key={index}>
                                    <MediumText
                                        style={{
                                            textAlign: "center",
                                            paddingBottom: 17,
                                            marginTop: 20,
                                        }}
                                    >
                                        {value}
                                    </MediumText>
                                    <Wrapper style={shadowProps}>
                                        <Orders>
                                            <Order.Items>
                                                {sortedData[value].map(
                                                    (order, index) => (
                                                        <Order.Item
                                                            key={index}
                                                            data={order}
                                                            nextPage={GoToOrderPage(
                                                                info,
                                                                order
                                                            )}
                                                        />
                                                    )
                                                )}
                                            </Order.Items>
                                        </Orders>
                                    </Wrapper>
                                </Item>
                            ))}
                        </>
                    )}
                </Layout>
            )}
        </>
    );
}

OrderList.propTypes = {};
export default OrderList;
