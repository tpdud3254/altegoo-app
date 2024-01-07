import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { Notification } from "../../../component/Notification";
import { color } from "../../../styles";
import Layout from "../../../component/layout/Layout";
import { shadowProps } from "../../../component/Shadow";
import { Order } from "../../../component/order/OrderComponent";
import UserContext from "../../../context/UserContext";
import {
    CheckLoading,
    Filter,
    GoToOrderPage,
    getAsyncStorageToken,
    showError,
    showMessage,
} from "../../../utils";
import axios from "axios";
import { SERVER, VALID } from "../../../constant";
import SelectFilter from "../../../component/selectBox/SelectFilter";
import LoadingLayout from "../../../component/layout/LoadingLayout";

const HeaderContainer = styled.View`
    background-color: white;
    padding-top: 48px;

    padding-left: 15px;
    padding-right: 15px;
    border-bottom-color: ${color["image-area-background"]};
    border-bottom-width: 1px;
`;

const HeaderWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const HeaderItem = styled.View`
    flex-direction: row;
    align-items: center;
    width: 32%;
`;

const HeaderTab = styled.TouchableOpacity`
    width: 50%;
    align-items: center;
    margin-top: 25px;
`;

const HeaderTabText = styled.View`
    border-bottom-color: ${color.main};
    border-bottom-width: ${(props) => (props.selected ? 2 : 0)}px;
    padding-bottom: 12px;
    padding-left: 1px;
    padding-right: 1px;
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

const PERIOD = ["1개월", "3개월", "6개월", "12개월"];

function DriverOrderList({ navigation }) {
    const { info } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    const [period, setPeriod] = useState(1);
    const [orders, setOrders] = useState(-1);
    const [accpetOrders, setAcceptOrders] = useState(-1);
    const [sortedOrders, setSortedOrders] = useState(-1);
    const [sortedAccpetOrders, setSortedAccpetOrders] = useState(-1);
    const [scheduledOrderCount, setScheduledOrderCount] = useState(-1);
    const [scheduledAcceptOrderCount, setScheduledAcceptOrderCount] =
        useState(-1);

    const [menu, setMenu] = useState(1);

    useEffect(() => {
        navigation.setOptions({
            header: Header,
        });
    });

    useEffect(() => {
        setLoading(true);
        getOrders(); //작업리스트
        getAcceptOrders();

        const focusSubscription = navigation.addListener("focus", () => {
            setLoading(true);
            getOrders();
            getAcceptOrders();
        });

        return () => {
            focusSubscription();
        };
    }, []);

    useEffect(() => {
        if (
            CheckLoading({
                orders,
                accpetOrders,
                sortedOrders,
                sortedAccpetOrders,
                scheduledOrderCount,
                scheduledAcceptOrderCount,
            })
        ) {
            setLoading(false);
        }
    }, [
        orders,
        accpetOrders,
        sortedOrders,
        sortedAccpetOrders,
        scheduledOrderCount,
        scheduledAcceptOrderCount,
    ]);

    useEffect(() => {
        if (menu === 1) getOrders();
        else getAcceptOrders();
    }, [period]);

    useEffect(() => {
        setPeriod(1);
    }, [menu]);

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
                    const filterd = Filter({
                        data: order,
                        period: PERIOD[period - 1],
                        orderBy: "dateTime",
                    });
                    setOrders(filterd);
                    setSortedOrders(getSortedOrders(filterd));
                    setScheduledOrderCount(getScheduledOrderCount(filterd));
                } else {
                    setOrders([]);
                    setSortedOrders({});
                    setScheduledOrderCount(0);
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
            })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order },
                    } = data;

                    console.log("acceptOrders : ", order);

                    const filterd = Filter({
                        data: order,
                        period: PERIOD[period - 1],
                        orderBy: "dateTime",
                    });

                    setAcceptOrders(filterd);
                    setSortedAccpetOrders(getSortedOrders(filterd));
                    setScheduledAcceptOrderCount(
                        getScheduledOrderCount(filterd)
                    );
                } else {
                    setAcceptOrders([]);
                    setSortedAccpetOrders({});
                    setScheduledAcceptOrderCount(0);
                }
            })
            .catch((error) => {
                console.log(error);
                showError(error);
            })
            .finally(() => {});
    };
    const getSortedOrders = (orders) => {
        const result = {};

        orders.map((order) => {
            if (order.orderStatusId === 8) return;
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
            <HeaderContainer>
                <HeaderWrapper>
                    <HeaderItem>
                        <Image
                            source={require("../../../assets/images/icons/bullet_tri.png")}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                        />
                        <BoldText style={{ fontSize: 16 }}>
                            {menu === 1
                                ? scheduledAcceptOrderCount < 0
                                    ? 0
                                    : scheduledAcceptOrderCount
                                : scheduledOrderCount < 0
                                ? 0
                                : scheduledOrderCount}
                            건
                            <RegularText style={{ fontSize: 16 }}>
                                {" "}
                                예정
                            </RegularText>
                        </BoldText>
                    </HeaderItem>
                    {true ? (
                        <HeaderItem style={{ justifyContent: "flex-start" }}>
                            <SelectFilter
                                data={PERIOD}
                                onSelect={(index) => setPeriod(index + 1)}
                            />
                        </HeaderItem>
                    ) : (
                        <View
                            style={{
                                alignItems: "center",
                            }}
                        >
                            <HeaderItem
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
                            </HeaderItem>
                            <RegularText
                                style={{ fontSize: 14, paddingTop: 4 }}
                            >
                                23년 5월
                            </RegularText>
                        </View>
                    )}
                    <HeaderItem style={{ justifyContent: "flex-end" }}>
                        <Notification
                            onPress={() => showMessage("지원 예정 기능입니다.")}
                        />
                    </HeaderItem>
                </HeaderWrapper>
                <HeaderWrapper>
                    <HeaderTab onPress={() => setMenu(1)}>
                        <HeaderTabText selected={menu === 1}>
                            {menu === 1 ? (
                                <BoldText style={{ color: color.main }}>
                                    작업 내역
                                </BoldText>
                            ) : (
                                <RegularText
                                    style={{ color: color["page-grey-text"] }}
                                >
                                    작업 내역
                                </RegularText>
                            )}
                        </HeaderTabText>
                    </HeaderTab>
                    <HeaderTab onPress={() => setMenu(2)}>
                        <HeaderTabText selected={menu === 2}>
                            {menu === 2 ? (
                                <BoldText style={{ color: color.main }}>
                                    등록 내역
                                </BoldText>
                            ) : (
                                <RegularText
                                    style={{ color: color["page-grey-text"] }}
                                >
                                    등록 내역
                                </RegularText>
                            )}
                        </HeaderTabText>
                    </HeaderTab>
                </HeaderWrapper>
            </HeaderContainer>
        );
    };

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout>
                    {menu === 1 ? (
                        accpetOrders === -1 ||
                        accpetOrders.length === 0 ? null : (
                            <>
                                {Object.keys(sortedAccpetOrders).map(
                                    (value, index) => (
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
                                                        {sortedAccpetOrders[
                                                            value
                                                        ].map(
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
                                    )
                                )}
                            </>
                        )
                    ) : null}

                    {menu === 2 ? (
                        orders === -1 || orders.length === 0 ? null : (
                            <>
                                {Object.keys(sortedOrders).map(
                                    (value, index) => (
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
                                                        {sortedOrders[
                                                            value
                                                        ].map(
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
                                    )
                                )}
                            </>
                        )
                    ) : null}
                </Layout>
            )}
        </>
    );
}

DriverOrderList.propTypes = {};
export default DriverOrderList;
