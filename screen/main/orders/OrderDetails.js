import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, View, Linking } from "react-native";
import styled from "styled-components/native";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import Layout from "../../../component/layout/Layout";
import {
    CheckLoading,
    GetDate,
    GetDayOfWeek,
    GetPhoneNumberWithDash,
    GetTime,
    GoToKakaoNavi,
    getAsyncStorageToken,
    numberWithComma,
    showError,
    showErrorMessage,
    showMessage,
} from "../../../utils";
import WebView from "react-native-webview";
import { PopupWithButtons } from "../../../component/popup/PopupWithButtons";
import axios from "axios";
import { DRIVER, SERVER, VALID } from "../../../constant";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import UserContext from "../../../context/UserContext";

const Wrapper = styled.View`
    margin-bottom: 10px;
`;

const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
    align-items: center;
`;

const Box = styled.View`
    width: ${(props) => (props.width ? props.width : "100%")};
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 1px solid ${color["image-area-background"]};
    border-radius: 10px;
    padding: 20px;
`;

const EmergencyBox = styled(Box)`
    border: 1px solid ${color.main};
    flex-direction: row;
    align-items: flex-end;
`;

const ItemContainer = styled.View``;
const ItemButton = styled.TouchableOpacity`
    /* border: 1px solid ${color.main}; */
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 44px;
    border-radius: 10px;
    background-color: #fae100;
`;

const BottomButtonContainer = styled.View`
    background-color: ${color["page-bluegrey-text"]};
    height: 60px;
    align-items: center;
    justify-content: center;
`;
function OrderDetails({ navigation, route }) {
    const webViewRef = useRef();
    const { info } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(-1);

    const [progress, setProgress] = useState(0.0);

    const [isPopupShown, setIsPopupShown] = useState(false);
    const [buttonType, setButtonType] = useState(1);
    const [buttonText, setButtonText] = useState("");

    // 1: 예약하기, 긴급 예약하기
    // 2: 예약 취소하기
    // 3: 예약대기 하기
    // 4: 예약대기 취소
    // 5: 예약중 (NEXT: 예약대기 우선 삭제)

    const sendMessage = (data) => {
        webViewRef.current.postMessage(data);
    };

    useEffect(() => {
        setLoading(true);

        console.log("route?.params?.orderId : ", route?.params?.orderId);
        if (route?.params?.orderId) {
            getOrder(route?.params?.orderId);
        }
    }, []);

    useEffect(() => {
        if (CheckLoading({ order })) {
            setLoading(false);
            getButtonType();
            getButtonText();
        }
    }, [order]);

    const getButtonType = () => {
        if (order.orderStatusId === 1) {
            setButtonType(1);
        } else {
            if (order.acceptUser === info.id) {
                setButtonType(2);
            } else {
                setButtonType(5);
                //NEXT: 예약대기 우선 삭제
                // if (order.orderReservation.length === 0) {
                //     setButtonType(3);
                // } else {
                //     let isMyReservation = false;
                //     order.orderReservation.map((value) => {
                //         if (value.userId === info.id) {
                //             isMyReservation = true;
                //         }
                //     });

                //     if (isMyReservation) setButtonType(4);
                //     else setButtonType(3);
                // }
            }
        }
    };

    const getButtonText = () => {
        if (order.orderStatusId === 1) {
            if (order.emergency) {
                setButtonText("긴급 예약하기");
            } else {
                setButtonText("예약하기");
            }
        } else {
            if (order.acceptUser === info.id) {
                setButtonText("예약 취소하기");
            } else {
                setButtonText("예약 완료");
                //예약중에서 예약완료로 텍스트 수정
                //NEXT: 예약대기 우선 삭제
                // if (order.orderReservation.length === 0) {
                //     setButtonText("예약대기 하기");
                // } else {
                //     let isMyReservation = false;
                //     order.orderReservation.map((value) => {
                //         if (value.userId === info.id) {
                //             isMyReservation = true;
                //         }
                //     });

                //     if (isMyReservation) setButtonText("예약대기 취소");
                //     else setButtonText("예약대기 하기");
                // }
            }
        }
    };

    const getOrder = async (id) => {
        axios
            .get(SERVER + "/orders/info", { params: { id: id } })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order: orderData },
                    } = data;

                    console.log(orderData);
                    setOrder(orderData);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const onButtonClick = () => {
        if (buttonType === 1) {
            //예약하기
            setAcceptOrder(order.id);
        } else if (buttonType === 2) {
            //예약취소하기
            setCancelOrder(order.id);
        } else if (buttonType === 3) {
            //예약대기하기
            setReserveOrder(order.id);
        } else if (buttonType === 4) {
            //예약대기취소하기
            setCancelReservation(order.id);
        }
        hidePopup();
    };

    const setAcceptOrder = async (orderId) => {
        if (
            info.userType === DRIVER &&
            (!info.license || !info.vehiclePermission)
        ) {
            showMessage("내 정보 > 회원정보에서 필요한 서류들을 등록해주세요.");
            return;
        }
        try {
            const response = await axios.patch(
                SERVER + "/works/order/accept",
                {
                    id: orderId,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { list },
                    },
                } = response;

                list.map((resultOrder) => {
                    if (resultOrder.id === order.id) {
                        setOrder(resultOrder);
                    }
                });
                //DEVELOP: 나중에 효율적으로 바꾸기
            } else {
                if (response?.data) {
                    const {
                        data: { msg },
                    } = response;

                    showErrorMessage(msg);
                }
            }
        } catch (error) {
            console.log(error);
        }
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
                list.map((resultOrder, index) => {
                    if (resultOrder.id === order.id) {
                        setOrder(resultOrder);
                    }
                });
                //DEVELOP: 나중에 효율적으로 바꾸기
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const setReserveOrder = async (orderId) => {
        axios
            .patch(
                SERVER + "/works/order/reservation",
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
                list.map((resultOrder, index) => {
                    if (resultOrder.id === order.id) {
                        setOrder(resultOrder);
                    }
                });
                //DEVELOP: 나중에 효율적으로 바꾸기
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const setCancelReservation = async (orderId) => {
        axios
            .delete(SERVER + "/works/order/reservation", {
                data: { id: orderId },
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            })
            .then(({ data }) => {
                const {
                    result,
                    data: { list },
                } = data;
                list.map((resultOrder, index) => {
                    if (resultOrder.id === order.id) {
                        setOrder(resultOrder);
                    }
                });
                //DEVELOP: 나중에 효율적으로 바꾸기
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const showPopup = () => {
        setIsPopupShown(true);
    };

    const hidePopup = () => {
        setIsPopupShown(false);
    };

    const Map = () => (
        <View
            style={{
                alignItems: "center",
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
                        setProgress(event.nativeEvent.progress);
                    }}
                    androidHardwareAccelerationDisabled={true}
                    style={{ opacity: 0.99, minHeight: 1 }}
                />
            </View>
        </View>
    );

    const Emergency = () => (
        <EmergencyBox>
            <Image
                source={require("../../../assets/images/icons/icon_emerg.png")}
                style={{ width: 24, height: 24 }}
            />
            <RegularText
                style={{ color: "#EB1D36", marginLeft: 7, fontSize: 19 }}
            >
                긴급
            </RegularText>
        </EmergencyBox>
    );

    const BoxItem = ({ title, value, width }) => (
        <Box width={width}>
            <RegularText
                style={{
                    fontSize: 15,
                    color: color["page-grey-text"],
                    marginBottom: 7,
                }}
            >
                {title}
            </RegularText>
            <RegularText
                style={{
                    fontSize: 19,
                }}
            >
                {value}
            </RegularText>
        </Box>
    );

    const Item = ({ title, value, button = null }) => (
        <ItemContainer>
            <Row>
                <View style={{ ...(button === null || { maxWidth: "90%" }) }}>
                    <RegularText
                        style={{
                            fontSize: 15,
                            color: color["page-grey-text"],
                            marginBottom: 10,
                        }}
                    >
                        {title}
                    </RegularText>
                    <RegularText
                        style={{
                            fontSize: 19,
                            ...(button === null || { maxWidth: "98%" }),
                        }}
                    >
                        {value}
                    </RegularText>
                </View>
                {button ? button : null}
            </Row>
            <Line />
        </ItemContainer>
    );

    const Line = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: color["image-area-background"],
                    marginTop: 5,
                    marginBottom: 18,
                }}
            />
        );
    };

    const BottomButton = () => {
        return (
            <BottomButtonContainer>
                <MediumText style={{ color: "white" }}>완료된 작업</MediumText>
            </BottomButtonContainer>
        );
    };

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout
                    touchableElement={Map}
                    bottomButtonProps={{
                        onPress: showPopup,
                        title: buttonText,
                        customButton:
                            order.orderStatusId > 4 ? (
                                <BottomButton />
                            ) : buttonType === 5 ? (
                                <BottomButtonContainer>
                                    <MediumText style={{ color: "white" }}>
                                        예약 완료
                                        {/* //예약중에서 예약완료로 텍스트 수정 */}
                                    </MediumText>
                                </BottomButtonContainer>
                            ) : null,
                    }}
                >
                    <Wrapper>
                        {order.emergency ? (
                            <Row>
                                <Emergency />
                            </Row>
                        ) : null}
                        <Row>
                            <BoxItem
                                title="차량 종류"
                                value={order.vehicleType}
                                width="48%"
                            />
                            <BoxItem
                                title={"작업 " + order.volume}
                                value={
                                    order.volume === "시간"
                                        ? order.time
                                        : order.quantity
                                }
                                width="48%"
                            />
                        </Row>
                        {order.direction === "양사" ? (
                            <Row>
                                <BoxItem
                                    title="내림 층수"
                                    value={order.downFloor}
                                    width="48%"
                                />
                                <BoxItem
                                    title="올림 층수"
                                    value={order.upFloor}
                                    width="48%"
                                />
                            </Row>
                        ) : (
                            <Row>
                                <BoxItem
                                    title="작업 높이"
                                    value={order.floor}
                                />
                            </Row>
                        )}
                    </Wrapper>
                    <Wrapper>
                        <Item
                            title="작업 일시"
                            value={`${GetDate(
                                order.dateTime,
                                "long"
                            )} (${GetDayOfWeek(order.dateTime)}) ${GetTime(
                                order.dateTime
                            )}`}
                        />
                        {order.acceptUser === info.id ||
                        order.orderStatusId === 1 ? (
                            order.vehicleType === "사다리차" &&
                            order.direction === "양사" ? (
                                <>
                                    <Item
                                        title="내림 주소"
                                        value={
                                            order.address1 +
                                            " " +
                                            order.detailAddress1
                                        }
                                        button={
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
                                        }
                                    />
                                    <Item
                                        title="올림 주소"
                                        value={
                                            order.address2 +
                                            " " +
                                            order.detailAddress2
                                        }
                                        button={
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
                                        }
                                    />
                                </>
                            ) : (
                                <Item
                                    title="주소"
                                    value={
                                        order.address1 +
                                        " " +
                                        order.detailAddress1
                                    }
                                    button={
                                        <ItemButton
                                            onPress={() =>
                                                GoToKakaoNavi(order.address1)
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
                                    }
                                />
                            )
                        ) : null}
                        {order.orderStatusId === 1 ||
                        order.acceptUser !== info.id ? null : (
                            <>
                                <Item
                                    title="고객 연락처"
                                    value={GetPhoneNumberWithDash(order.phone)}
                                    button={
                                        <ItemButton
                                            onPress={() =>
                                                Linking.openURL(
                                                    "tel:" +
                                                        order.phone.toString()
                                                )
                                            }
                                        >
                                            <Image
                                                source={require(`../../../assets/images/icons/icon_phone.png`)}
                                                style={{
                                                    width: 26,
                                                    height: 26,
                                                }}
                                            />
                                        </ItemButton>
                                    }
                                />
                                <Item
                                    title="현장 연락처"
                                    value={
                                        order.directPhone
                                            ? GetPhoneNumberWithDash(
                                                  order.directPhone
                                              )
                                            : "없음"
                                    }
                                    button={
                                        <ItemButton
                                            onPress={() =>
                                                order.directPhone
                                                    ? Linking.openURL(
                                                          "tel:" +
                                                              order.directPhone.toString()
                                                      )
                                                    : undefined
                                            }
                                        >
                                            <Image
                                                source={require(`../../../assets/images/icons/icon_phone.png`)}
                                                style={{
                                                    width: 26,
                                                    height: 26,
                                                }}
                                            />
                                        </ItemButton>
                                    }
                                />
                            </>
                        )}

                        <Item title="특이사항" value={order.memo || "없음"} />
                        <Item
                            title="작업 비용"
                            value={
                                <RegularText>
                                    {numberWithComma(order.finalPrice)}{" "}
                                    <RegularText
                                        style={{
                                            fontSize: 14,
                                        }}
                                    >
                                        P
                                    </RegularText>
                                </RegularText>
                            }
                        />
                    </Wrapper>
                    <PopupWithButtons
                        visible={isPopupShown}
                        onTouchOutside={hidePopup}
                        onClick={onButtonClick}
                        negativeButtonLabel="취소"
                    >
                        <RegularText
                            style={{
                                fontSize: 22,
                                textAlign: "center",
                                lineHeight: 33,
                                paddingTop: 15,
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingBottom: 15,
                            }}
                        >
                            {buttonType === 1 ? (
                                <>
                                    {order.emergency ? "긴급 " : ""}예약을
                                    진행하시겠습니까?{"\n"}예약 후{" "}
                                    <RegularText
                                        style={{
                                            fontSize: 22,
                                            textDecorationLine: "underline",
                                            color: color.main,
                                        }}
                                    >
                                        내 작업
                                    </RegularText>{" "}
                                    메뉴에서{"\n"} 확인할 수 있습니다.
                                </>
                            ) : null}
                            {buttonType === 2 ? (
                                <>예약을 취소하시겠습니까?</>
                            ) : null}
                            {buttonType === 3 ? (
                                <>예약 대기를 진행하시겠습니까?</>
                            ) : null}
                            {buttonType === 4 ? (
                                <>예약 대기를 취소하시겠습니까?</>
                            ) : null}
                        </RegularText>
                    </PopupWithButtons>
                </Layout>
            )}
        </>
    );
}

OrderDetails.propTypes = {};
export default OrderDetails;
