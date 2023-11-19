import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import {
    GetDate,
    GetDayOfWeek,
    GetTime,
    GoToOrderPage,
    getAsyncStorageToken,
    numberWithComma,
    showError,
    showErrorMessage,
    showMessage,
} from "../../utils";
import MediumText from "../text/MediumText";
import RegularText from "../text/RegularText";
import { color } from "../../styles";
import { useNavigation } from "@react-navigation/native";
import BoldText from "../text/BoldText";
import { PopupWithButtons } from "../PopupWithButtons";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { DRIVER, SERVER, VALID } from "../../constant";

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    /* background-color: ${(props) =>
        props.emergency ? color["box-color-background"] : color.lightblue}; */
    background-color: ${(props) =>
        props.emergency ? "#FFC19B50" : color.lightblue};
    padding: 15px;
    border-radius: 16px;
    /* border: ${(props) => (props.emergency ? 1 : 0)}px solid #eb1d36; */
    width: 100%;
`;

const Icon = styled.View`
    align-items: center;
    background-color: white;
    height: 60px;
    justify-content: center;
    border-radius: 16px;
    width: 60px;
    margin-right: 15px;
`;
const IconImage = styled.Image`
    width: 10px;
    height: 16px;
`;

const Wrapper = styled.View`
    padding-top: 3px;
    width: 80%;
`;
const Row = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${(props) => (props.lastChild ? 0 : 7)}px;
`;

const PointButton = styled.View`
    flex-direction: row;
    align-items: center;
`;

const Button = styled.TouchableOpacity`
    background-color: ${(props) =>
        props.type === 1
            ? color.main
            : props.type === 3
            ? "white"
            : color.btnDefault};
    align-items: center;
    padding: 12px;
    border-radius: 11px;
    margin-top: 5px;
    border: ${(props) => (props.type === 3 ? 1 : 0)}px solid ${color.main};
`;
export const Order = {
    Items: ({ children }) => {
        return <View>{children}</View>;
    },
    Item: ({ data }) => {
        const { info } = useContext(UserContext);
        const navigation = useNavigation();

        const [order, setOrder] = useState(-1);
        const [isPopupShown, setIsPopupShown] = useState(false);
        const [buttonType, setButtonType] = useState(1);
        // 1: 예약하기, 긴급 예약하기
        // 2: 예약 취소하기
        // 3: 예약대기 하기
        // 4: 예약대기 취소
        // 5: 예약중 (NEXT: 예약대기 우선 삭제)

        useEffect(() => {
            setOrder(data);
        }, []);

        useEffect(() => {
            if (order !== -1) getButtonType();
        }, [order]);

        const goToOrderProgress = () => {
            const page = GoToOrderPage(info, order);
            navigation.navigate(page, { orderId: order.id });
        };

        const showPopup = () => {
            setIsPopupShown(true);
        };

        const hidePopup = () => {
            setIsPopupShown(false);
        };

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
                    return "긴급 예약하기";
                } else {
                    return "예약하기";
                }
            } else {
                if (order.acceptUser === info.id) {
                    return "예약 취소하기";
                } else {
                    return "예약 중";
                    //NEXT: 예약대기 우선 삭제
                    // if (order.orderReservation.length === 0) {
                    //     return "예약대기 하기";
                    // } else {
                    //     let isMyReservation = false;
                    //     order.orderReservation.map((value) => {
                    //         if (value.userId === info.id) {
                    //             isMyReservation = true;
                    //         }
                    //     });

                    //     if (isMyReservation) return "예약대기 취소";
                    //     else return "예약대기 하기";
                    // }
                }
            }
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
                showMessage(
                    "내 정보 > 회원정보에서 필요한 서류들을 등록해주세요."
                );
                return;
            }

            if (
                info.userType === DRIVER &&
                (!info.vehicle || !info.vehiclePermission)
            ) {
                showMessage("내 정보 > 회원정보에서 차량 정보를 등록해주세요.");
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

        return (
            <>
                {order !== -1 ? (
                    <View style={{ marginBottom: 20 }}>
                        <ItemContainer
                            onPress={goToOrderProgress}
                            // emergency={order.emergency} NEXT: 스카이차, 사다리차 색깔구분으로 변경
                            emergency={order.vehicleType !== "스카이차"}
                        >
                            <Icon>
                                {order.direction === "올림" ? (
                                    <IconImage
                                        source={require("../../assets/images/icons/icon_lift_up_ON.png")}
                                    />
                                ) : order.direction === "내림" ? (
                                    <IconImage
                                        source={require("../../assets/images/icons/icon_lift_down_ON.png")}
                                    />
                                ) : (
                                    <IconImage
                                        source={require("../../assets/images/icons/icon_lift_both_ON.png")}
                                    />
                                )}
                                <MediumText
                                    style={{ fontSize: 14, color: color.main }}
                                >
                                    {order.vehicleType === "스카이차"
                                        ? "양사"
                                        : order.direction}
                                </MediumText>
                            </Icon>
                            <Wrapper>
                                <Row>
                                    <BoldText>
                                        {order.vehicleType === "스카이차"
                                            ? `${order.vehicleType} / ${order.time} / ${order.floor}`
                                            : `${order.vehicleType} / ${
                                                  order.volume === "시간"
                                                      ? order.time
                                                      : order.quantity
                                              } / ${
                                                  order.direction === "양사"
                                                      ? order.upFloor
                                                      : order.floor
                                              }`}
                                    </BoldText>
                                </Row>
                                <Row>
                                    <RegularText
                                        style={{
                                            fontSize: 15,
                                        }}
                                    >
                                        {order.address1}
                                    </RegularText>
                                </Row>
                                <Row>
                                    <RegularText style={{ fontSize: 15 }}>
                                        {`${GetDate(
                                            order.dateTime,
                                            "long"
                                        )} (${GetDayOfWeek(
                                            order.dateTime
                                        )}) ${GetTime(order.dateTime)}`}
                                    </RegularText>
                                </Row>
                                <Row>
                                    <PointButton>
                                        <Image
                                            source={require("../../assets/images/icons/icon_point.png")}
                                            style={{
                                                width: 27,
                                                height: 27,
                                                marginRight: 2,
                                            }}
                                        />
                                        <BoldText
                                            style={{
                                                fontSize: 15,
                                            }}
                                        >
                                            {" " +
                                                numberWithComma(
                                                    order.price +
                                                        order.emergencyPrice
                                                )}
                                            <BoldText
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                {" "}
                                                AP
                                            </BoldText>
                                        </BoldText>
                                    </PointButton>
                                </Row>
                                <Row
                                    style={{
                                        justisfyContent: "space-between",
                                    }}
                                    lastChild={true}
                                >
                                    <RegularText
                                        style={{
                                            fontSize: 15,
                                        }}
                                    >
                                        수수료 :
                                        <BoldText
                                            style={{
                                                fontSize: 15,
                                            }}
                                        >
                                            {
                                                " " +
                                                    numberWithComma(
                                                        order.price +
                                                            order.emergencyPrice -
                                                            order.orderPoint ||
                                                            0
                                                    )
                                                //TODO: 어떤정보가 보여야되는지 확실히
                                            }
                                            <BoldText
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                {" "}
                                                AP
                                            </BoldText>
                                        </BoldText>
                                    </RegularText>
                                </Row>
                            </Wrapper>
                        </ItemContainer>
                        <Button
                            onPress={buttonType === 5 ? undefined : showPopup}
                            type={buttonType}
                        >
                            <MediumText
                                style={{
                                    color:
                                        buttonType === 1
                                            ? "white"
                                            : buttonType === 3
                                            ? color.main
                                            : color["page-grey-text"],
                                }}
                            >
                                {getButtonText()}
                            </MediumText>
                        </Button>
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
                    </View>
                ) : null}
            </>
        );
    },
};
