import React, { useContext, useState } from "react";
import styled from "styled-components/native";
import { Image, TouchableOpacity } from "react-native";
import MediumText from "../../../../component/text/MediumText";
import { color } from "../../../../styles";
import UserContext from "../../../../context/UserContext";
import { PAYMENT_APP_ID } from "@env";
import Layout from "../../../../component/layout/Layout";
import TextInput from "../../../../component/input/TextInput";
import BoldText from "../../../../component/text/BoldText";
import { Row, RowBetween } from "../../../../component/Row";
import RegularText from "../../../../component/text/RegularText";
import { showMessage } from "../../../../utils";

const Container = styled.View`
    height: 100%;
`;

const Button = styled.TouchableOpacity`
    align-items: center;
    background-color: white;
    border: 1px solid ${color.main};
    border-radius: 10px;
    padding: 15px;
    margin-top: 20px;
`;

const Noti = styled.View`
    margin-top: 20px;
`;

const NotiContainer = styled.View`
    padding-top: 20px;
`;

const Dot = styled.View`
    width: 6px;
    height: 6px;
    background-color: ${color.main};
    border-radius: 5px;
    margin-top: 4px;
    margin-right: 4px;
`;

const Wrapper = styled.View`
    background-color: ${color.main};
    align-items: center;
    padding: 15px 0px;
    border-radius: 10px;
`;

function ChargePoint({ route, navigation }) {
    const { info } = useContext(UserContext);

    const [notiVisible, setNotiVisiblè] = useState(false);
    const onPay = (price) => {
        console.log(price);
        const data = {
            application_id: PAYMENT_APP_ID,
            price: price,
            order_name: "포인트 충전",
            order_id: info.userId + "_" + Date.now(),
            user: {
                username: info.userName,
                phone: info.phone,
            },
            pointId: route?.params?.account?.id,
            curPoint: route?.params?.account?.curPoint,
        };
        navigation.navigate("Charge", { data });
    };

    const toggleNoti = () => setNotiVisiblè((prev) => !prev);
    const NotiContent = ({ children }) => (
        <Row style={{ alignItems: "flex-start", marginBottom: 10 }}>
            <Dot />
            <MediumText style={{ fontSize: 14 }}>{children}</MediumText>
        </Row>
    );
    //NEXT: 포인트 충전 기능
    return (
        <Layout scroll={true}>
            <Container>
                <Wrapper>
                    <BoldText style={{ textAlign: "center", color: "white" }}>
                        우리은행{"\n"}1005-204-462233{"\n"}예금주 : 주식회사
                        지앤지 195
                    </BoldText>
                </Wrapper>
                {/* <TextInput
                    title="충전 포인트 입력"
                    placeholder="충전할 금액을 입력해주세요."
                    returnKeyType="done"
                    keyboardType="number-pad"
                    // value={watch("phone")}
                    // onSubmitEditing={() => onNext("password")}
                    // onReset={() => reset(setValue, "phone")}
                    // onChangeText={(text) => setValue("phone", text)}
                />
                <Button onPress={() => showMessage("지원 예정 기능입니다.")}>
                    <BoldText style={{ color: color.main }}>
                        포인트 충전하기
                    </BoldText>
                </Button> */}
                <Noti>
                    <TouchableOpacity onPress={toggleNoti}>
                        <RowBetween>
                            <Row>
                                <Image
                                    source={require("../../../../assets/images/icons/icon_info2.png")}
                                    style={{
                                        width: 18,
                                        height: 18,
                                        marginRight: 5,
                                    }}
                                />
                                <RegularText
                                    style={{ fontSize: 16, color: color.main }}
                                >
                                    포인트 충전 시 유의사항
                                </RegularText>
                            </Row>
                            {notiVisible ? (
                                <Image
                                    source={require("../../../../assets/images/icons/icon_fullup.png")}
                                    style={{
                                        width: 24,
                                        height: 24,
                                    }}
                                />
                            ) : (
                                <Image
                                    source={require("../../../../assets/images/icons/icon_fulldw2.png")}
                                    style={{
                                        width: 24,
                                        height: 24,
                                    }}
                                />
                            )}
                        </RowBetween>
                    </TouchableOpacity>
                    {notiVisible ? (
                        <NotiContainer>
                            <NotiContent>
                                1원당 1포인트가 충전됩니다.
                            </NotiContent>
                            <NotiContent>
                                최대 200만 포인트 까지 보유 가능합니다.
                            </NotiContent>
                            <NotiContent>
                                충전수단에 따라 충전수단 발행자가 부과하는
                                사용수수료를 부담할 수 있습니다.
                            </NotiContent>
                            <BoldText
                                style={{
                                    fontSize: 14,
                                    marginTop: 15,
                                    marginBottom: 15,
                                }}
                            >
                                포인트 충전취소/환급 시 유의사항
                            </BoldText>
                            <NotiContent>
                                포인트 충전 후 7일 내에 청약철회 시
                                전자상거래법에 따라 충전금액이 환급됩니다.
                            </NotiContent>
                            <NotiContent>
                                은행 점검 시간으로 인해 매일 23:50~00:10
                                사이에는 환급신청 불가합니다.
                            </NotiContent>
                            <NotiContent>
                                보유한 충전포인트가 환급 수수료보다 많은
                                경우에만 환급 신청할 수 있습니다.
                            </NotiContent>
                            <NotiContent>
                                충전 포인트의 환급은 본인명의 계좌로만
                                가능합니다.
                            </NotiContent>
                        </NotiContainer>
                    ) : null}
                </Noti>
            </Container>
        </Layout>
    );
}

ChargePoint.propTypes = {};
export default ChargePoint;
