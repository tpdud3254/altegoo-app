import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image, View } from "react-native";
import MediumText from "../../../../component/text/MediumText";
import {
    CheckLoading,
    getAsyncStorageToken,
    numberWithComma,
    showErrorMessage,
    showMessage,
} from "../../../../utils";

import axios from "axios";
import { SERVER } from "../../../../constant";
import { VALID } from "../../../../constant";
import Layout from "../../../../component/layout/Layout";
import BoldText from "../../../../component/text/BoldText";
import RegularText from "../../../../component/text/RegularText";
import { Row, RowBetween } from "../../../../component/Row";
import { color } from "../../../../styles";
import Button from "../../../../component/button/Button";
import TextInput from "../../../../component/input/TextInput";
import LoadingLayout from "../../../../component/layout/LoadingLayout";

const Box = styled.View`
    background-color: ${color.lightblue};
    padding: 17px 20px;
    border-radius: 10px;
    margin-bottom: 40px;
`;

const Item = styled.View`
    margin-bottom: 25px;
`;

const ModifyButton = styled.TouchableOpacity`
    border: 1px solid ${color.main};
    padding: 10px 18px;
    border-radius: 10px;
    width: 25%;
    align-items: center;
`;

const COMMISSION = 1000;
function WithdrawalPoint({ route, navigation }) {
    const [loading, setLoading] = useState(true);

    const [point, setPoint] = useState(-1);
    const [isExistedAccount, setIsExistedAccount] = useState(true);
    const [withdrawalPoint, setWithdrawalPoint] = useState(0);

    useEffect(() => {
        getPoint();

        const focusSubscription = navigation.addListener("focus", () => {
            setPoint(-1);
            setLoading(true);
            getPoint(); //포인트
        });

        return () => {
            focusSubscription();
        };
    }, []);

    useEffect(() => {
        if (CheckLoading({ point })) {
            setLoading(false);
        }
    }, [point]);

    useEffect(() => {
        if (point === -1) return;

        if (withdrawalPoint > point.curPoint)
            setWithdrawalPoint(point.curPoint);
    }, [withdrawalPoint]);

    const refresh = () => {
        getPoint();
        setWithdrawalPoint("");
    };

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

                setPoint(point);
                if (point.accountNumber) setIsExistedAccount(true);
                else setIsExistedAccount(false);
            })
            .catch((error) => {
                setPoint(0);
                showError(error);
            })
            .finally(() => {});
    };

    const goToPage = (page, data) => {
        navigation.navigate(page, data);
    };

    const onWithdrawal = () => {
        console.log(withdrawalPoint);

        if (point.curPoint - COMMISSION - withdrawalPoint < 0) {
            showErrorMessage("출금 가능한 금액을 확인해주세요.");
            return;
        }
        pointwithdrawal();
    };
    const pointwithdrawal = async () => {
        try {
            const response = await axios.patch(
                SERVER + "/points/withdrawal",
                {
                    pointId: point.id,
                    curPoint: point.curPoint,
                    withdrawalPoint: withdrawalPoint,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            if (response.data.result === VALID) {
                showMessage("포인트 출금 신청이 완료되었습니다.");
                refresh();
            } else {
                showErrorMessage(response.data.msg);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const Line = () => (
        <View
            style={{
                height: 1,
                backgroundColor: "#D3E0F4",
                marginTop: 15,
            }}
        ></View>
    );

    const NoAccount = () => (
        <View style={{ alignItems: "center", marginTop: 10 }}>
            <BoldText style={{ fontSize: 20 }}>
                계좌 정보가 등록되지 않았습니다.
            </BoldText>
            <Image
                source={require("../../../../assets/images/icons/icon_bankpaper.png")}
                style={{
                    height: 100,
                    marginTop: 30,
                    marginBottom: 30,
                }}
                resizeMode="contain"
            />
            <RegularText>
                본인 명의의 계좌를 등록해 주시기 바랍니다.
            </RegularText>
            <Row style={{ marginTop: 8, marginBottom: 25 }}>
                <Image
                    source={require("../../../../assets/images/icons/icon_info2.png")}
                    style={{
                        width: 18,
                        height: 18,
                        marginRight: 5,
                    }}
                />
                <RegularText
                    style={{
                        fontSize: 17,
                        color: color.main,
                    }}
                >
                    본인 및 예금주 성명이 일치해야 계좌등록이 가능합니다.
                </RegularText>
            </Row>
            <Button
                onPress={() =>
                    goToPage("RegistPointAccount", { pointId: point.id })
                }
                type="accent"
                text="계좌등록 하기"
            />
        </View>
    );

    const Info = ({ title, value }) => (
        <Row style={{ marginBottom: 10 }}>
            <MediumText
                style={{
                    fontSize: 17,
                    color: color["page-grey-text"],
                    width: "32%",
                }}
            >
                {title} :
            </MediumText>
            <RegularText style={{ width: "68%" }}>{value}</RegularText>
        </Row>
    );

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout
                    bottomButtonProps={
                        isExistedAccount
                            ? {
                                  title: "포인트 출금",
                                  onPress: onWithdrawal,
                              }
                            : null
                    }
                >
                    {isExistedAccount ? (
                        <>
                            <Box>
                                <View style={{ alignItems: "center" }}>
                                    <RowBetween>
                                        <RegularText style={{ fontSize: 15 }}>
                                            출금 가능한 포인트
                                        </RegularText>
                                    </RowBetween>
                                    <Line />
                                    <RowBetween>
                                        <Row>
                                            <Image
                                                source={require("../../../../assets/images/icons/icon_point.png")}
                                                style={{
                                                    width: 27,
                                                    height: 27,
                                                    marginRight: 2,
                                                }}
                                            />
                                            <BoldText
                                                style={{
                                                    fontSize: 16,
                                                }}
                                            >
                                                {numberWithComma(
                                                    point.curPoint
                                                )}
                                                <BoldText
                                                    style={{
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {" "}
                                                    P
                                                </BoldText>
                                            </BoldText>
                                        </Row>
                                    </RowBetween>
                                </View>
                            </Box>
                            <Item>
                                <RowBetween
                                    style={{ alignItems: "flex-start" }}
                                >
                                    <View>
                                        <Info
                                            title="은행명"
                                            value={point.bank}
                                        />
                                        <Info
                                            title="계좌번호"
                                            value={point.accountNumber}
                                        />
                                        <Info
                                            title="예금주"
                                            value={point.accountName}
                                        />
                                    </View>
                                </RowBetween>
                                <View
                                    style={{
                                        alignItems: "center",
                                        marginTop: 10,
                                        marginBottom: 20,
                                    }}
                                >
                                    <ModifyButton
                                        onPress={() =>
                                            goToPage("RegistPointAccount", {
                                                pointId: point.id,
                                                type: "modify",
                                            })
                                        }
                                    >
                                        <MediumText
                                            style={{
                                                fontSize: 14,
                                                color: color.main,
                                            }}
                                        >
                                            수정
                                        </MediumText>
                                    </ModifyButton>
                                </View>
                            </Item>

                            <Item>
                                <TextInput
                                    title="출금할 포인트"
                                    placeholder="금액을 입력해주세요."
                                    returnKeyType="done"
                                    keyboardType="number-pad"
                                    value={withdrawalPoint}
                                    onReset={() => setWithdrawalPoint("")}
                                    onChangeText={(text) =>
                                        setWithdrawalPoint(text)
                                    }
                                />
                            </Item>
                            <Item>
                                <Row>
                                    <MediumText
                                        style={{
                                            fontSize: 17,
                                            color: color["page-grey-text"],
                                        }}
                                    >
                                        출금 수수료 :{" "}
                                    </MediumText>
                                    <BoldText
                                        style={{
                                            color: color["page-color-text"],
                                        }}
                                    >
                                        {numberWithComma(COMMISSION)}

                                        <BoldText
                                            style={{
                                                fontSize: 14,
                                                color: color["page-color-text"],
                                            }}
                                        >
                                            {" "}
                                            P
                                        </BoldText>
                                    </BoldText>
                                </Row>
                            </Item>
                            <Item>
                                <MediumText
                                    style={{
                                        fontSize: 15,
                                        color: color["page-grey-text"],
                                    }}
                                >
                                    * 작업비용을 카드로 결제시 영업일 기준 5-7일
                                    이후 포인트 출금 가능
                                </MediumText>
                            </Item>
                        </>
                    ) : (
                        <NoAccount />
                    )}
                </Layout>
            )}
        </>
    );
}

WithdrawalPoint.propTypes = {};
export default WithdrawalPoint;
