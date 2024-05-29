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
import { PopupWithButtons } from "../popup/PopupWithButtons";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { DRIVER, SERVER, VALID } from "../../constant";

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    /* background-color: ${(props) =>
        props.emergency ? color["box-color-background"] : color.lightblue}; */
    /* background-color: ${(props) =>
        props.emergency ? "#FFC19B50" : color.lightblue}; */
    padding: 15px 0px;
    /* border-radius: 16px; */
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
    margin-right: 10px;
`;
const IconImage = styled.Image`
    width: 52px;
    height: 52px;
`;

const Wrapper = styled.View`
    padding-top: 3px;
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
            ? color.lightblue
            : props.type === 3
            ? "white"
            : color.btnDefault};
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 11px;
    margin-top: 5px;
    border: ${(props) => (props.type === 3 ? 1 : 0)}px solid ${color.main};
    height: 78px;
    width: 78px;
`;

const Line = styled.View`
    background-color: ${color["image-area-background"]};
    width: 100%;
    height: 1px;
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
                    return "긴급\n예약";
                } else {
                    return "예약\n하기";
                }
            } else {
                if (order.acceptUser === info.id) {
                    return "예약\n취소";
                } else {
                    return "예약중";
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
                (!info.vehicle ||
                    !info.vehiclePermission ||
                    info.vehicle?.length === 0)
            ) {
                showMessage("내 정보 > 회원정보에서 차량 정보를 등록해주세요.");
                return;
            }

            if (
                order.vehicleType.substring(0, 3) !== info.vehicle[0].type.type
            ) {
                showMessage("내 차량 정보와 다른 종류의 작업입니다.");
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
                    <View style={{ marginBottom: 0 }}>
                        <Line />
                        <ItemContainer onPress={goToOrderProgress}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    maxWidth: "70%",
                                }}
                            >
                                <Icon>
                                    {order.vehicleType === "스카이차" ? (
                                        <IconImage
                                            source={require("../../assets/images/icons/icon_sky.png")}
                                        />
                                    ) : order.direction === "올림" ? (
                                        <IconImage
                                            source={require("../../assets/images/icons/icon_ladder_up.png")}
                                        />
                                    ) : order.direction === "내림" ? (
                                        <IconImage
                                            source={require("../../assets/images/icons/icon_ladder_down.png")}
                                        />
                                    ) : (
                                        <IconImage
                                            source={require("../../assets/images/icons/icon_ladder_both.png")}
                                        />
                                    )}
                                </Icon>
                                <Wrapper>
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
                                                    fontSize: 17,
                                                    color: color.main,
                                                }}
                                            >
                                                {" " +
                                                    numberWithComma(
                                                        order.finalPrice
                                                    )}
                                                <BoldText
                                                    style={{
                                                        fontSize: 14,
                                                        color: color.main,
                                                    }}
                                                >
                                                    {" "}
                                                    P
                                                </BoldText>
                                            </BoldText>
                                        </PointButton>
                                    </Row>
                                    <Row>
                                        <BoldText style={{ maxWidth: "95%" }}>
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
                                        <RegularText style={{ fontSize: 15 }}>
                                            {`${GetDate(
                                                order.dateTime
                                            )} (${GetDayOfWeek(
                                                order.dateTime
                                            )}) ${GetTime(order.dateTime)}`}
                                        </RegularText>
                                    </Row>
                                    <Row>
                                        <RegularText
                                            style={{
                                                fontSize: 15,
                                                color: "#ABA9BC",
                                            }}
                                        >
                                            {order.simpleAddress1}
                                        </RegularText>
                                    </Row>
                                </Wrapper>
                            </View>
                            <Button
                                onPress={
                                    buttonType === 5 ? undefined : showPopup
                                }
                                type={buttonType}
                            >
                                <MediumText
                                    style={{
                                        color:
                                            buttonType === 1
                                                ? color.blue
                                                : buttonType === 3
                                                ? color.main
                                                : color["page-grey-text"],
                                    }}
                                >
                                    {getButtonText()}
                                </MediumText>
                            </Button>
                        </ItemContainer>
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
