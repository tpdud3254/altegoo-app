import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import Layout from "../../../component/layout/Layout";
import { shadowProps } from "../../../component/Shadow";
import Car from "../../../assets/images/icons/Procress_car.png";
import Button from "../../../component/button/Button";
import {
    CheckLoading,
    GetCurrentDateTime,
    GetDate,
    GetPhoneNumberWithDash,
    GetTime,
    GoToKakaoNavi,
    getAsyncStorageToken,
    numberWithComma,
    showMessage,
} from "../../../utils";
import WebView from "react-native-webview";
import UserContext from "../../../context/UserContext";
import axios from "axios";
import { SERVER, VALID } from "../../../constant";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import DoneImage from "../../../assets/images/icons/img_order_end.png";
import { CommonActions } from "@react-navigation/native";

const Progress = styled.View`
    margin-bottom: 30px;
`;

const ProgressBar = styled.View`
    background-color: ${color["image-area-background"]};
    height: 10px;
    border-radius: 6px;
`;
const InProgressBar = styled.View`
    width: ${(props) => props.progress}%;
    background-color: ${color["main"]};
    height: 10px;
    border-radius: 6px;
`;

const Dots = styled.View`
    width: 100%;
    position: absolute;
    flex-direction: row;
    z-index: 100;
    justify-content: space-around;
`;
const Dot = styled.View`
    background-color: ${(props) =>
        props.done ? "#B14300" : color["box-border"]};
    width: 10px;
    height: 10px;
    border-radius: 5px;
`;

const Items = styled.View`
    width: 100%;
    background-color: white;
    padding: 20px 16px;
    border-radius: 14px;
`;

const SItem = styled.View`
    align-items: ${(props) => (props.center ? "center" : "flex-start")};
`;

const Wrapper = styled.View`
    margin-top: 20px;
`;

const Box = styled.View`
    background-color: ${(props) =>
        props.status === 2 || props.status === 3
            ? color.lightblue
            : color["box-color-background"]};
    border-radius: 18px;
    padding: 20px 15px;
    border: 1px
        ${(props) =>
            props.status === 2 || props.status === 3 ? color.blue : color.main}
        solid;
    margin-top: 20px;
`;

const Row = styled.View`
    flex-direction: row;
    justify-content: ${(props) =>
        props.around ? "space-around" : "space-between"};
    align-items: center;
    width: 100%;
`;

const Results = styled.View`
    justify-content: flex-end;
    flex-direction: row;
`;

const ResultTitle = styled.View`
    padding-left: 30px;
    padding-right: 15px;
    border-bottom-width: 1px;
    border-bottom-color: ${color["image-area-background"]};
`;

const ResultValue = styled.View`
    border-bottom-width: 1px;
    border-bottom-color: ${color["image-area-background"]};
`;

const Total = styled.View`
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    padding: 10px 0px;
`;

const Commission = styled(Total)`
    padding: 0px;
`;

const ItemButton = styled.TouchableOpacity`
    border: 1px solid ${color.main};
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 44px;
    border-radius: 10px;
`;

const STEP = [
    { title: "예약완료", progress: 17 },
    { title: "작업시작", progress: 50 },
    { title: "작업완료", progress: 84 },
];
function DriverOrderProgress({ navigation, route }) {
    const webViewRef = useRef();
    const { info } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(-1);
    const [mapProgress, setMapProgress] = useState(0.0);

    const [order, setOrder] = useState(-1);

    const sendMessage = (data) => {
        webViewRef.current.postMessage(data);
    };

    useEffect(() => {
        setLoading(true);

        if (route?.params?.orderId) {
            getOrder(route?.params?.orderId);
        }
    }, []);

    useEffect(() => {
        if (CheckLoading({ order, status })) {
            setLoading(false);
        }
    }, [order, status]);

    useEffect(() => {
        if (status === -1) return;
        if (status === 2 && order.orderStatusId === 3) setProgress(40);
        else if (status === 3 && order.orderStatusId === 4) setProgress(60);
        else if (status === 4) setProgress(100);
        else setProgress(STEP[status - 1].progress);
    }, [status]);

    const getOrder = async (id) => {
        axios
            .get(SERVER + "/orders/info", { params: { id: id } })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order: order },
                    } = data;

                    console.log(order);
                    if (order.orderStatusId === 2) {
                        checkStartOrder(order);
                    } else {
                        setOrder(order);
                        setStatus(getStatus(order.orderStatusId));
                    }
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const checkStartOrder = (order) => {
        if (order.orderStatusId !== 2) return;

        const now = GetCurrentDateTime();
        const orderDateTime = new Date(order.dateTime);

        if (orderDateTime > now) {
            const diffSec = orderDateTime.getTime() - now.getTime();
            const diffMin = diffSec / (60 * 1000);

            console.log("last time : ", diffMin);
            if (diffMin <= 10) {
                setStartMoving(order.id);
            } else {
                setOrder(order);
                setStatus(getStatus(order.orderStatusId));
            }
        } else {
            setStartMoving(order.id);
        }
    };

    const setStartMoving = async (orderId) => {
        axios
            .patch(
                SERVER + "/works/order/move",
                {
                    id: orderId,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            )
            .then(({ data }) => {
                const {
                    result,
                    data: { list },
                } = data;
                console.log("list: ", list);

                //DEVELOP: 나중에 효율적으로 바꾸기
                list.map((resultOrder, index) => {
                    if (resultOrder.id === orderId) {
                        setOrder(resultOrder);
                        setStatus(getStatus(resultOrder.orderStatusId));
                    }
                });
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const getStatus = (statusId) => {
        if (statusId === 2) return 1;
        else if (statusId === 3) return 2;
        else if (statusId === 4) return 3;
        else return 4;
    };

    const setCancelOrder = async (orderId) => {
        axios
            .patch(
                SERVER + "/works/order/cancel",
                {
                    id: orderId,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            )
            .then(({ data }) => {
                const {
                    result,
                    data: { list },
                } = data;
                console.log("result: ", result);

                if (result === VALID) {
                    showMessage("작업 예약이 취소되었습니다.");
                    navigation.goBack();
                }
                //DEVELOP: 나중에 효율적으로 바꾸기
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const setStartOrder = async (orderId) => {
        axios
            .patch(
                SERVER + "/works/order/start",
                {
                    id: orderId,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            )
            .then(({ data }) => {
                const {
                    result,
                    data: { list },
                } = data;
                console.log("list: ", list);

                //DEVELOP: 나중에 효율적으로 바꾸기
                list.map((resultOrder, index) => {
                    if (resultOrder.id === order.id) {
                        setOrder(resultOrder);
                        setStatus(getStatus(resultOrder.orderStatusId));
                    }
                });
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const setDoneOrder = async (orderId) => {
        axios
            .patch(
                SERVER + "/works/order/done",
                {
                    id: orderId,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            )
            .then(({ data }) => {
                const {
                    result,
                    data: { list },
                } = data;
                console.log("list: ", list);
                //DEVELOP: 나중에 효율적으로 바꾸기
                list.map((resultOrder, index) => {
                    if (resultOrder.id === order.id) {
                        setOrder(resultOrder);
                        setStatus(getStatus(resultOrder.orderStatusId));
                    }
                });
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };
    const Item = ({ title, value, center, onClick }) => (
        <SItem center={center}>
            <RegularText
                style={{
                    fontSize: 16,
                    color: color["page-grey-text"],
                    marginBottom: 5,
                }}
            >
                {title}
            </RegularText>
            {onClick ? (
                <TouchableOpacity onPress={onClick}>
                    <RegularText
                        style={{
                            color: color.main,
                            textDecorationLine: "underline",
                        }}
                    >
                        {value}
                    </RegularText>
                </TouchableOpacity>
            ) : (
                <RegularText>{value}</RegularText>
            )}
        </SItem>
    );

    const Line = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: color["image-area-background"],
                    marginTop: 18,
                    marginBottom: 18,
                }}
            />
        );
    };

    const Title = ({ children }) => {
        return (
            <RegularText
                style={{
                    fontSize: 16,
                    textAlign: "right",
                    marginBottom: 10,
                }}
            >
                {children}
            </RegularText>
        );
    };
    const Price = ({ price }) => {
        return (
            <RegularText
                style={{ fontSize: 16, textAlign: "right", marginBottom: 10 }}
            >
                {price}{" "}
                <RegularText style={{ fontSize: 12, textAlign: "right" }}>
                    AP
                </RegularText>
            </RegularText>
        );
    };

    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }],
            })
        );

        navigation.navigate("Home", { refresh: true });
    };

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout
                    scroll={status === 4 ? false : true}
                    kakaoBtnShown={status === 4 ? true : false}
                    bottomButtonProps={
                        status === 4
                            ? { title: "홈으로", onPress: goToHome }
                            : null
                    }
                    touchableElement={() => (
                        <View>
                            <Progress>
                                <Image
                                    source={Car}
                                    style={{
                                        width: 40,
                                        height: 33.22,
                                        marginBottom: 10,
                                        left:
                                            status === 4
                                                ? "90%"
                                                : `${progress - 5}%`,
                                    }}
                                    resizeMode="contain"
                                />
                                <ProgressBar>
                                    <Dots>
                                        {STEP.map((value, index) => (
                                            <View
                                                key={index}
                                                style={{
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Dot
                                                    done={
                                                        value.progress <=
                                                        progress
                                                    }
                                                />
                                                <BoldText
                                                    style={{
                                                        fontSize: 14,
                                                        marginTop: 10,
                                                        color:
                                                            value.progress <=
                                                            progress
                                                                ? color.main
                                                                : color[
                                                                      "page-lightgrey-text"
                                                                  ],
                                                    }}
                                                >
                                                    {value.title}
                                                </BoldText>
                                            </View>
                                        ))}
                                    </Dots>
                                    <InProgressBar progress={progress} />
                                </ProgressBar>
                            </Progress>
                            {status === 4 ? null : (
                                <Box status={status}>
                                    <BoldText style={{ lineHeight: 25 }}>
                                        {status === 1
                                            ? "예약이 완료되었습니다."
                                            : null}
                                        {status === 2
                                            ? "작업이 시작될 시간입니다.\n안전한 작업 부탁 드립니다."
                                            : null}
                                        {status === 3
                                            ? "현재 작업이 진행중입니다."
                                            : null}
                                    </BoldText>
                                    {status === 1 ? (
                                        <RegularText
                                            style={{
                                                color: color["page-grey-text"],
                                                fontSize: 15,
                                                marginTop: 10,
                                            }}
                                        >
                                            작업 시간을 꼭 확인해 주세요{"\n"}
                                            작업 24시간 내에는 취소가
                                            어렵습니다.
                                        </RegularText>
                                    ) : null}
                                    {status === 2 ? (
                                        <RegularText
                                            style={{
                                                color: color["page-grey-text"],
                                                fontSize: 15,
                                                marginTop: 10,
                                            }}
                                        >
                                            작업을 시작하기 전에{"\n"}작업 시작
                                            버튼을 꼭 눌러 주세요
                                        </RegularText>
                                    ) : null}
                                    {status === 3 ? (
                                        <RegularText
                                            style={{
                                                color: color["page-grey-text"],
                                                fontSize: 15,
                                                marginTop: 10,
                                            }}
                                        >
                                            작업이 완료되면 작업 완료 버튼을
                                            반드시 눌러주세요.{"\n"}고객이 확인
                                            후 비용이 지급됩니다.
                                        </RegularText>
                                    ) : null}
                                </Box>
                            )}
                            {status === 1 ? (
                                <Button
                                    onPress={() => setCancelOrder(order.id)}
                                    type="accent"
                                    text="예약 취소"
                                    style={{ marginTop: 20 }}
                                />
                            ) : null}
                            {status === 2 ? (
                                <Button
                                    onPress={() => setStartOrder(order.id)}
                                    type="accent"
                                    text="작업 시작"
                                    style={{
                                        marginTop: 20,
                                        backgroundColor: color.blue,
                                    }}
                                />
                            ) : null}
                            {status === 3 ? (
                                <Button
                                    onPress={() => setDoneOrder(order.id)}
                                    type="accent"
                                    text="작업 완료"
                                    style={{
                                        marginTop: 20,
                                        backgroundColor: color.blue,
                                    }}
                                />
                            ) : null}
                            {status === 4 ? null : (
                                <View
                                    style={{
                                        alignItems: "center",
                                        marginTop: 20,
                                        marginBottom: 20,
                                    }}
                                >
                                    <View style={{ height: 350 }}>
                                        <WebView
                                            ref={webViewRef}
                                            containerStyle={{
                                                width: 400,
                                                height: 350,
                                            }}
                                            source={{
                                                uri: "https://master.d1p7wg3e032x9j.amplifyapp.com/map",
                                            }}
                                            onLoad={() =>
                                                sendMessage(
                                                    JSON.stringify({
                                                        address: order.address1,
                                                    })
                                                )
                                            }
                                            onLoadProgress={(event) => {
                                                setMapProgress(
                                                    event.nativeEvent.progress
                                                );
                                            }}
                                            androidHardwareAccelerationDisabled={
                                                true
                                            }
                                            style={{
                                                opacity: 0.99,
                                                minHeight: 1,
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                >
                    {status === 4 ? (
                        <View style={{ marginTop: 20 }}>
                            <Items style={shadowProps}>
                                <View
                                    style={{
                                        alignItems: "center",
                                        paddingTop: 20,
                                    }}
                                >
                                    <BoldText
                                        style={{
                                            textAlign: "center",
                                            lineHeight: 30,
                                        }}
                                    >
                                        수고하셨습니다.{"\n"}작업이
                                        완료되었습니다.
                                    </BoldText>
                                    <Image
                                        source={DoneImage}
                                        resizeMode="contain"
                                        style={{
                                            width: 160,
                                            height: 160,
                                            marginTop: 30,
                                            marginBottom: 30,
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 30,
                                    }}
                                >
                                    <Image
                                        source={require("../../../assets/images/icons/icon_info2.png")}
                                        style={{
                                            width: 17,
                                            height: 17,
                                            marginRight: 5,
                                            marginTop: 2,
                                        }}
                                        resizeMode="contain"
                                    />
                                    <RegularText
                                        style={{
                                            fontSize: 16,
                                            color: color.main,
                                            lineHeight: 23,
                                        }}
                                    >
                                        고객과 문제가 있나요?{"\n"}아래 버튼을
                                        눌러 문의를 남겨주세요
                                    </RegularText>
                                </View>
                            </Items>
                        </View>
                    ) : (
                        <>
                            <Items style={shadowProps}>
                                <MediumText>작업 정보</MediumText>
                                <Wrapper>
                                    <Row>
                                        <Item
                                            title="작업 일시"
                                            value={
                                                GetDate(order.dateTime) +
                                                " " +
                                                GetTime(order.dateTime)
                                            }
                                        />
                                    </Row>
                                    <Line />
                                    {order.vehicleType === "사다리차" &&
                                    order.direction === "양사" ? (
                                        <>
                                            <View>
                                                <RegularText
                                                    style={{
                                                        fontSize: 16,
                                                        color: color[
                                                            "page-grey-text"
                                                        ],
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    내림 주소
                                                </RegularText>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        width: "100%",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <RegularText
                                                        style={{
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {order.address1 +
                                                            " " +
                                                            order.detailAddress1}
                                                    </RegularText>
                                                    <ItemButton
                                                        onPress={() =>
                                                            GoToKakaoNavi(
                                                                order.address1
                                                            )
                                                        }
                                                    >
                                                        <Image
                                                            source={require(`../../../assets/images/icons/icon_location.png`)}
                                                            style={{
                                                                width: 26,
                                                                height: 26,
                                                            }}
                                                        />
                                                    </ItemButton>
                                                </View>
                                            </View>
                                            <View>
                                                <RegularText
                                                    style={{
                                                        fontSize: 16,
                                                        color: color[
                                                            "page-grey-text"
                                                        ],
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    올림 주소
                                                </RegularText>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        width: "100%",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <RegularText
                                                        style={{
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {order.address2 +
                                                            " " +
                                                            order.detailAddress2}
                                                    </RegularText>
                                                    <ItemButton
                                                        onPress={() =>
                                                            GoToKakaoNavi(
                                                                order.address2
                                                            )
                                                        }
                                                    >
                                                        <Image
                                                            source={require(`../../../assets/images/icons/icon_location.png`)}
                                                            style={{
                                                                width: 26,
                                                                height: 26,
                                                            }}
                                                        />
                                                    </ItemButton>
                                                </View>
                                            </View>
                                        </>
                                    ) : (
                                        <View>
                                            <RegularText
                                                style={{
                                                    fontSize: 16,
                                                    color: color[
                                                        "page-grey-text"
                                                    ],
                                                    marginBottom: 5,
                                                }}
                                            >
                                                주소
                                            </RegularText>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    width: "100%",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <RegularText
                                                    style={{ maxWidth: "90%" }}
                                                >
                                                    {order.address1 +
                                                        " " +
                                                        order.detailAddress1}
                                                </RegularText>
                                                <ItemButton
                                                    onPress={() =>
                                                        GoToKakaoNavi(
                                                            order.address1
                                                        )
                                                    }
                                                >
                                                    <Image
                                                        source={require(`../../../assets/images/icons/icon_location.png`)}
                                                        style={{
                                                            width: 26,
                                                            height: 26,
                                                        }}
                                                    />
                                                </ItemButton>
                                            </View>
                                        </View>
                                    )}

                                    <Line />
                                    {order.vehicleType === "스카이차" ? (
                                        <Row around>
                                            <Item
                                                title="차량 종류"
                                                value={order.vehicleType}
                                                center={true}
                                            />
                                            <Item
                                                title="작업 높이"
                                                value={order.floor}
                                                center={true}
                                            />
                                            <Item
                                                title="작업 시간"
                                                value={order.time}
                                                center={true}
                                            />
                                        </Row>
                                    ) : order.direction !== "양사" ? (
                                        <>
                                            <Row around>
                                                <Item
                                                    title="차량 종류"
                                                    value={order.vehicleType}
                                                    center={true}
                                                />
                                                <Item
                                                    title="작업 종류"
                                                    value={order.direction}
                                                    center={true}
                                                />
                                            </Row>
                                            <Line />
                                            <Row around>
                                                <Item
                                                    title="작업 높이"
                                                    value={order.floor}
                                                    center={true}
                                                />
                                                <Item
                                                    title={
                                                        order.volume === "물량"
                                                            ? "작업 물량"
                                                            : "작업 시간"
                                                    }
                                                    value={
                                                        order.volume === "물량"
                                                            ? order.quantity
                                                            : order.time
                                                    }
                                                    center={true}
                                                />
                                            </Row>
                                        </>
                                    ) : (
                                        <>
                                            <Row around>
                                                <Item
                                                    title="차량 종류"
                                                    value={order.vehicleType}
                                                    center={true}
                                                />
                                                <Item
                                                    title="내림 층수"
                                                    value={order.downFloor}
                                                    center={true}
                                                />
                                            </Row>
                                            <Line />
                                            <Row around>
                                                <Item
                                                    title="올림 층수"
                                                    value={order.upFloor}
                                                    center={true}
                                                />
                                                <Item
                                                    title={
                                                        order.volume === "물량"
                                                            ? "작업 물량"
                                                            : "작업 시간"
                                                    }
                                                    value={
                                                        order.volume === "물량"
                                                            ? order.quantity
                                                            : order.time
                                                    }
                                                    center={true}
                                                />
                                            </Row>
                                        </>
                                    )}

                                    <Line />
                                    <Row around={true}>
                                        <Item
                                            title="연락처"
                                            value={GetPhoneNumberWithDash(
                                                order.phone
                                            )}
                                            center={true}
                                            onClick={() =>
                                                Linking.openURL(
                                                    "tel:" +
                                                        order.phone.toString()
                                                )
                                            }
                                        />
                                    </Row>
                                    <Line />
                                    <Row around={true}>
                                        <Item
                                            title="현장 연락처"
                                            value={
                                                order.directPhone
                                                    ? GetPhoneNumberWithDash(
                                                          order.directPhone
                                                      )
                                                    : "없음"
                                            }
                                            center={true}
                                            onClick={
                                                order.directPhone
                                                    ? () =>
                                                          Linking.openURL(
                                                              "tel:" +
                                                                  order.phone.toString()
                                                          )
                                                    : null
                                            }
                                        />
                                    </Row>
                                    <Line />
                                    <Row>
                                        <Item
                                            title="특이사항"
                                            value={order.memo || "없음"}
                                        />
                                    </Row>
                                    <Line />

                                    <Results>
                                        <ResultTitle>
                                            <Title>알테구 이용비</Title>
                                            <Title>부가세 (10%)</Title>

                                            {/* <Title>
                                                긴급 오더{" "}
                                                <RegularText
                                                    style={{
                                                        fontSize: 16,
                                                        color: "#EB1D36",
                                                    }}
                                                >
                                                    (25%)
                                                </RegularText>
                                            </Title> 
                                            NEXT: 긴급오더 일단 삭제
                                            */}
                                        </ResultTitle>
                                        <ResultValue>
                                            <Price
                                                price={numberWithComma(
                                                    order.price
                                                )}
                                            />
                                            <Price
                                                price={numberWithComma(
                                                    order.tax
                                                )}
                                            />

                                            {/* <Price
                                                price={numberWithComma(
                                                    order.emergencyPrice || 0
                                                )}
                                            /> 
                                            NEXT: 긴급오더 일단 삭제
                                            */}
                                        </ResultValue>
                                    </Results>
                                    <Total>
                                        <RegularText
                                            style={{
                                                fontSize: 16,
                                            }}
                                        >
                                            총 수입 금액
                                        </RegularText>
                                        <BoldText
                                            style={{
                                                fontSize: 20,
                                                color: color.main,
                                                marginLeft: 30,
                                            }}
                                        >
                                            {numberWithComma(order.finalPrice)}
                                            <BoldText
                                                style={{
                                                    fontSize: 14,
                                                    color: color.main,
                                                }}
                                            >
                                                {" "}
                                                AP
                                            </BoldText>
                                        </BoldText>
                                    </Total>
                                    <Commission>
                                        <RegularText
                                            style={{
                                                fontSize: 16,
                                                color: color["page-grey-text"],
                                            }}
                                        >
                                            수수료
                                        </RegularText>
                                        <BoldText
                                            style={{
                                                fontSize: 17,
                                                marginLeft: 12,
                                            }}
                                        >
                                            {numberWithComma(
                                                order.finalPrice -
                                                    order.orderPoint
                                            )}
                                            <BoldText
                                                style={{
                                                    fontSize: 13,
                                                }}
                                            >
                                                {" "}
                                                AP
                                            </BoldText>
                                        </BoldText>
                                    </Commission>
                                </Wrapper>
                            </Items>
                        </>
                    )}
                </Layout>
            )}
        </>
    );
}

DriverOrderProgress.propTypes = {};
export default DriverOrderProgress;
