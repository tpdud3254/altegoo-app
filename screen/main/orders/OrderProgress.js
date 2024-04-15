import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import Layout from "../../../component/layout/Layout";
import { shadowProps } from "../../../component/Shadow";
import RefreshBtn from "../../../assets/images/icons/btn_Refresh.png";
import Car from "../../../assets/images/icons/Procress_car.png";
import Button from "../../../component/button/Button";
import {
    CheckLoading,
    GetDate,
    GetPhoneNumberWithDash,
    GetTime,
    getAsyncStorageToken,
    numberWithComma,
    showError,
    showMessage,
} from "../../../utils";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import axios from "axios";
import { SERVER, VALID } from "../../../constant";
import UserContext from "../../../context/UserContext";
import DriverImage from "../../../assets/images/icons/img_driver.png";
import DoneImage from "../../../assets/images/icons/img_order_end.png";

const Refresh = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-right: 15px;
`;

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
    justify-content: space-evenly;
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
    margin-top: 25px;
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
    background-color: ${color["box-color-background"]};
    border-radius: 18px;
    padding: 20px 15px;
    border: 1px ${color.main} solid;
    margin-top: 20px;
`;

const Row = styled.View`
    flex-direction: row;
    justify-content: ${(props) =>
        props.around ? "space-around" : "space-between"};
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

const PointContainer = styled.View`
    align-items: flex-end;
`;

const Point = styled.View`
    background-color: ${color.blue};
    padding: 10px 20px;
    border-radius: 20px;
`;

const DriverTitle = styled.View`
    align-items: center;
`;

const STEP = [
    { title: "작업요청", progress: 17 },
    { title: "예약완료", progress: 40 },
    { title: "작업시작", progress: 60 },
    { title: "작업완료", progress: 84 },
];

function OrderProgress({ navigation, route }) {
    const { info } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(-1);

    const [order, setOrder] = useState(-1);

    useEffect(() => {
        setLoading(true);

        navigation.setOptions({
            headerRight: () => (
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
            ),
        });

        if (route?.params?.orderId) {
            getOrder(route?.params?.orderId);
        } else if (route?.params?.order) {
            console.log(route?.params?.order);
            setOrder(route?.params?.order);
        }
    }, []);

    useEffect(() => {
        if (CheckLoading({ order, status })) {
            if (status === 1) setLoading(false);
            if (status > 1 && order.acceptUserData) setLoading(false);
        }
    }, [order, status]);

    useEffect(() => {
        if (status === -1) return;
        if (status === 5) setProgress(100);
        else setProgress(STEP[status - 1].progress);
    }, [status]);

    const refresh = () => {
        setLoading(true);
        setOrder(-1);
        getOrder(route?.params?.orderId);
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
                    setStatus(getStatus(orderData.orderStatusId));

                    if (getStatus(orderData.orderStatusId) > 1) {
                        getAcceptUser(orderData);
                    }
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const getAcceptUser = async (data) => {
        try {
            const response = await axios.get(SERVER + "/users/user", {
                params: { id: data.acceptUser },
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
                console.log(user);

                setOrder({ ...data, acceptUserData: user });
            } else {
                const {
                    data: { msg },
                } = response;

                console.log(msg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const cancelOrder = async () => {
        axios
            .patch(
                SERVER + "/works/cancel",
                {
                    id: route?.params?.orderId,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            )
            .then(({ data }) => {
                const { result } = data;

                console.log("cancelOrder : ", result);
                showMessage("요청한 오더가 취소되었습니다.");

                navigation.goBack();
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const confirmOrder = async () => {
        if (processing) return;

        setProcessing(true);
        axios
            .patch(
                SERVER + "/works/order/confirm",
                {
                    id: order.id,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            )
            .then(({ data }) => {
                const { result } = data;

                showMessage("작업 완료 확인이 완료되었습니다.");
                navigation.goBack();
                if (result === VALID) {
                    setStatus(5);
                }
            })
            .catch((error) => {
                console.log(error);
                // showError(error);
            })
            .finally(() => {
                setProcessing(false);
            });
    };
    const getStatus = (statusId) => {
        if (statusId === 1) return 1;
        else if (statusId === 2) return 2;
        else if (statusId === 3 || statusId === 4) return 3;
        else if (statusId === 5) return 4;
        else return 5;
    };

    const Item = ({ title, value, center, width }) => (
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
            <RegularText>{value}</RegularText>
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
                    P
                </RegularText>
            </RegularText>
        );
    };
    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout
                    bottomButtonProps={
                        status === 4 && {
                            title: "작업 완료 확인",
                            onPress: processing ? null : confirmOrder,
                        }
                    }
                    kakaoBtnShown={true}
                >
                    <Progress>
                        <Image
                            source={Car}
                            style={{
                                width: 40,
                                height: 33.22,
                                marginBottom: 10,
                                left: status === 5 ? "90%" : `${progress - 5}%`,
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
                                            done={value.progress <= progress}
                                        />
                                        <BoldText
                                            style={{
                                                fontSize: 14,
                                                marginTop: 10,
                                                color:
                                                    value.progress <= progress
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
                    {status === 4 || status === 5 ? null : (
                        <Box>
                            <BoldText style={{ lineHeight: 25 }}>
                                {status === 1
                                    ? "기사님들의 응답을\n기다리고 있습니다…"
                                    : null}
                                {status === 2
                                    ? "기사님이 고객님의 오더를\n예약하였습니다."
                                    : null}
                                {status === 3
                                    ? "기사님이 작업을 시작하였습니다."
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
                                    작업이 예약되면 알림을 보내 드립니다.
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
                                    작업 예약 현황을 확인해 주세요.
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
                                    안전하고 신속한 작업을 약속드립니다.
                                </RegularText>
                            ) : null}
                        </Box>
                    )}
                    {status === 1 || status === 2 ? (
                        <Button
                            onPress={cancelOrder}
                            type="accent"
                            text="요청 취소"
                            style={{ marginTop: 20 }}
                        />
                    ) : null}
                    {status === 4 || status === 5 ? (
                        <Items style={shadowProps}>
                            <View
                                style={{ alignItems: "center", paddingTop: 20 }}
                            >
                                <BoldText>
                                    기사님이 작업을 완료했습니다.
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
                                <RegularText
                                    style={{
                                        fontSize: 20,
                                        textAlign: "center",
                                        lineHeight: 27,
                                    }}
                                >
                                    작업 내역을 확인하시고{"\n"}작업에 이상이
                                    없을 시{"\n"}
                                    아래{" "}
                                    <RegularText
                                        style={{
                                            fontSize: 20,
                                            color: "#EB1D36",
                                            textDecorationLine: "underline",
                                        }}
                                    >
                                        작업 완료 확인 버튼
                                    </RegularText>
                                    을{"\n"}꼭! 눌러주세요
                                </RegularText>
                            </View>
                            <View
                                style={{ flexDirection: "row", marginTop: 30 }}
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
                                    작업에 문제가 있나요?{"\n"}아래 버튼을 눌러
                                    문의를 남겨주세요
                                </RegularText>
                            </View>
                        </Items>
                    ) : null}

                    {status === 2 || status === 3 ? (
                        <Items style={shadowProps}>
                            <DriverTitle>
                                <Image
                                    source={DriverImage}
                                    resizeMode="contain"
                                    style={{ width: 63, height: 63 }}
                                />
                                <MediumText
                                    style={{ marginTop: 10, marginBottom: 25 }}
                                >
                                    기사님 정보
                                </MediumText>
                            </DriverTitle>
                            <Row around={true}>
                                <Item
                                    title="성함"
                                    value={order?.acceptUserData?.name}
                                    center={true}
                                    width="30%"
                                />
                                <Item
                                    title="연락처"
                                    value={GetPhoneNumberWithDash(
                                        order?.acceptUserData?.phone
                                    )}
                                    center={true}
                                    width="70%"
                                />
                            </Row>
                            <Line />
                            <Row around={true}>
                                <Item
                                    title="차량 번호"
                                    value={
                                        order?.acceptUserData?.vehicle[0].number
                                    }
                                    center={true}
                                />
                                <Item
                                    title="차량정보"
                                    value={`${
                                        order?.acceptUserData?.vehicle[0].type
                                            .type
                                    }차${"\n"} ${
                                        order?.acceptUserData?.vehicle[0].floor
                                            ? order?.acceptUserData?.vehicle[0]
                                                  .floor.floor
                                            : order?.acceptUserData?.vehicle[0]
                                                  .weight.weight
                                    }`}
                                    center={true}
                                />
                            </Row>
                            <Line />
                        </Items>
                    ) : null}

                    <Items style={shadowProps}>
                        <MediumText>작업 내역</MediumText>
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
                            {order.direction !== "양사" ||
                            order.vehicleType === "스카이차" ? (
                                <Row>
                                    <Item
                                        title="주소"
                                        value={
                                            order.address1 +
                                            " " +
                                            order.detailAddress1
                                        }
                                    />
                                </Row>
                            ) : (
                                <>
                                    <Row>
                                        <Item
                                            title="내림 주소"
                                            value={
                                                order.address1 +
                                                " " +
                                                order.detailAddress1
                                            }
                                        />
                                    </Row>
                                    <Line />
                                    <Row>
                                        <Item
                                            title="올림 주소"
                                            value={
                                                order.address2 +
                                                " " +
                                                order.detailAddress2
                                            }
                                        />
                                    </Row>
                                </>
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
                                    value={GetPhoneNumberWithDash(order.phone)}
                                    center={true}
                                />
                            </Row>
                            <Line />
                            <Row around>
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
                                    {order.gugupackPrice > 0 ? (
                                        <Title>- 구구팩 회원 할인</Title>
                                    ) : null}
                                    <Title>부가세 (10%)</Title>
                                    {/* <Title>포인트 사용</Title>
                                    <Title>
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
                                    //NEXT: 포인트 이용, 긴급오더 삭제
                                    */}
                                </ResultTitle>
                                <ResultValue>
                                    <Price
                                        price={numberWithComma(
                                            order.orderPrice +
                                                order.gugupackPrice
                                        )}
                                    />
                                    {order.gugupackPrice > 0 ? (
                                        <Price
                                            price={numberWithComma(
                                                order.gugupackPrice
                                            )}
                                        />
                                    ) : null}
                                    <Price price={numberWithComma(order.tax)} />
                                    {/* <Price
                                        price={
                                            "- " +
                                            numberWithComma(order.usePoint)
                                        }
                                    />
                                    <Price
                                        price={numberWithComma(
                                            order.emergencyPrice
                                        )}
                                    /> 
                                    //NEXT: 포인트 이용, 긴급오더 삭제
                                    */}
                                </ResultValue>
                            </Results>
                            <Total>
                                <RegularText
                                    style={{
                                        fontSize: 16,
                                    }}
                                >
                                    총 결제 금액
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
                                        P
                                    </BoldText>
                                </BoldText>
                            </Total>
                            <PointContainer>
                                <Point>
                                    <RegularText
                                        style={{
                                            fontSize: 14,
                                            color: "white",
                                        }}
                                    >
                                        적립 예정 포인트{"    "}
                                        <BoldText
                                            style={{
                                                fontSize: 16,
                                                color: "white",
                                            }}
                                        >
                                            {numberWithComma(order.registPoint)}
                                            <BoldText
                                                style={{
                                                    fontSize: 12,
                                                    color: "white",
                                                }}
                                            >
                                                {" "}
                                                P
                                            </BoldText>
                                        </BoldText>
                                    </RegularText>
                                </Point>
                            </PointContainer>
                        </Wrapper>
                    </Items>
                    <View style={{ height: 90 }}></View>
                </Layout>
            )}
        </>
    );
}

OrderProgress.propTypes = {};
export default OrderProgress;
