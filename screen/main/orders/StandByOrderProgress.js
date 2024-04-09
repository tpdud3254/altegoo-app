import React, { useEffect, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import Layout from "../../../component/layout/Layout";
import { shadowProps } from "../../../component/Shadow";
import {
    CheckLoading,
    GetDate,
    GetPhoneNumberWithDash,
    GetTime,
    numberWithComma,
    showError,
    showMessage,
} from "../../../utils";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import axios from "axios";
import { SERVER, VALID } from "../../../constant";
import * as Clipboard from "expo-clipboard";

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

const CopyButton = styled.TouchableOpacity`
    justify-content: center;
`;

function StandByOrderProgress({ navigation, route }) {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(-1);

    useEffect(() => {
        setLoading(true);

        if (route?.params?.orderId) {
            getOrder(route?.params?.orderId);
        } else if (route?.params?.order) {
            console.log(route?.params?.order);
            setOrder(route?.params?.order);
        }
    }, []);

    useEffect(() => {
        if (CheckLoading({ order })) {
            setLoading(false);
        }
    }, [order]);

    const getOrder = async (id) => {
        axios
            .get(SERVER + "/orders/vbank/info", { params: { id: id } })
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

    const getStandByDateTimeText = () => {
        const datetime = new Date(order?.createdAt);

        datetime.setUTCMinutes(datetime.getUTCMinutes() + 10);

        const text =
            GetDate(order?.createdAt, "long") +
            " " +
            GetTime(datetime, "long") +
            "까지 입금해주세요.";
        return text;
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(order?.vbank_account);

        showMessage("복사완료!");
    };

    const Item = ({ title, value, center }) => (
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
                <Layout kakaoBtnShown={true}>
                    <Box>
                        <BoldText style={{ lineHeight: 25 }}>
                            입금 대기 중입니다.
                        </BoldText>
                        <RegularText
                            style={{
                                color: color["page-grey-text"],
                                fontSize: 15,
                                marginTop: 10,
                            }}
                        >
                            {getStandByDateTimeText()}
                        </RegularText>
                        <RegularText
                            style={{
                                color: color["page-grey-text"],
                                fontSize: 15,
                                marginTop: 5,
                            }}
                        >
                            시간 내에 입금 확인이 되지 않으면 작업은 자동으로
                            취소됩니다.
                        </RegularText>
                    </Box>

                    <Items style={shadowProps}>
                        <MediumText>입금 정보</MediumText>
                        <Wrapper>
                            <Row>
                                <Item title="은행" value={order?.vbank_name} />
                            </Row>
                            <Line />
                            <Row>
                                <Item
                                    title="계좌번호"
                                    value={order?.vbank_account}
                                />
                                <CopyButton onPress={copyToClipboard}>
                                    <RegularText
                                        style={{
                                            fontSize: 17,
                                            color: color["page-bluegrey-text"],
                                            textAlign: "center",
                                            marginRight: 5,
                                        }}
                                    >
                                        복사하기
                                    </RegularText>
                                </CopyButton>
                            </Row>
                        </Wrapper>
                    </Items>
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
                                            order.orderPrice
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

StandByOrderProgress.propTypes = {};
export default StandByOrderProgress;
