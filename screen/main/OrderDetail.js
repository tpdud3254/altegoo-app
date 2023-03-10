import React, { useContext, useEffect, useState } from "react";
import {
    ScrollView,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import styled from "styled-components/native";
import MainLayout from "../../component/layout/MainLayout";
import PlainText from "../../component/text/PlainText";
import RegistContext from "../../context/RegistContext";
import UserContext from "../../context/UserContext";
import { theme } from "../../styles";
import { numberWithComma } from "../../utils";
import Checkbox from "expo-checkbox";
import { useForm } from "react-hook-form";
import { REGIST_NAV } from "../../constant";

const Container = styled.View``;
const SRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;
const STitle = styled.View`
    width: 25%;
    align-items: center;
`;

const SContent = styled.View`
    width: 75%;
    border: ${(props) =>
            props.borderLine || props.inputBorderLine ? "0px" : "1px"}
        solid ${theme.boxColor};
    padding: 5px;
    background-color: ${(props) => (props.background ? "white" : "")};
`;

const Emergency = styled.View`
    align-items: center;
    margin-top: -5px;
`;

const ButtonContainer = styled.View`
    align-items: center;
`;
const Button = styled.TouchableOpacity`
    background-color: ${theme.sub.blue};
    width: 100px;
    align-items: center;
    border-radius: 5px;
    margin-top: 15px;
    margin-bottom: 10px;
    padding: 10px;
`;
function OrderDetail({ navigation, route }) {
    const { registInfo, setRegistInfo } = useContext(RegistContext);
    const { info } = useContext(UserContext);
    const [price, setPrice] = useState(60000);
    const [emergencyOrder, setEmergencyOrder] = useState(false);
    const [isDirectPhone, setIsDirectPhone] = useState(false);
    const { setValue, register, handleSubmit } = useForm();
    console.log("registInfo : ", registInfo);

    console.log(route?.params);
    useEffect(() => {
        register("directPhone");
        register("memo");
    }, []);

    useEffect(() => {
        if (isDirectPhone) {
            setValue("directPhone", info.phone);
        } else {
            setValue("directPhone", null);
        }
    }, [isDirectPhone]);

    useEffect(() => {
        setPrice(60000);
        if (emergencyOrder) {
            setPrice((prev) => prev + prev * 0.2);
        }
    }, [emergencyOrder]);

    const getWorkType = () => {
        const info = registInfo;

        let text = "";
        if (info.upDown !== "??????") {
            text = `${info.vehicleType} / ${info.upDown}`;
        } else {
            text = `${info.vehicleType} / ${info.upDown} (${
                info.bothType === 1 ? "?????? > ??????" : "?????? > ??????"
            })`;
        }

        return text;
    };

    const getWorkTime = () => {
        const getDay = (index) => {
            switch (index) {
                case 0:
                    return "???";
                case 1:
                    return "???";
                case 2:
                    return "???";
                case 3:
                    return "???";
                case 4:
                    return "???";
                case 5:
                    return "???";
                case 6:
                    return "???";

                default:
                    break;
            }
        };
        const info = registInfo;
        const workTime = new Date(info.dateTime);
        let text = `${workTime.getFullYear()}??? ${
            workTime.getMonth() + 1 < 10
                ? "0" + (workTime.getMonth() + 1)
                : workTime.getMonth() + 1
        }??? ${
            workTime.getDate() < 10
                ? "0" + workTime.getDate()
                : workTime.getDate()
        }??? (${getDay(workTime.getDay())}) ${
            workTime.getHours() < 10
                ? "0" + workTime.getHours()
                : workTime.getHours()
        }:${
            workTime.getMinutes() < 10
                ? "0" + workTime.getMinutes()
                : workTime.getMinutes()
        }`;

        return text;
    };

    const getWorkFloor = () => {
        const info = registInfo;

        let text = "";

        if (info.upDown === "??????") {
            text = `${info.floor}???(${
                info.bothType === 1 ? "??????" : "??????"
            }) > ${info.otherFloor}???(${
                info.bothType === 1 ? "??????" : "??????"
            })`;
        } else {
            text = `${info.floor}???`;
        }

        return text;
    };

    const getPrice = () => {
        //TODO: ????????????
        return `${numberWithComma(price)} AP`;
    };

    const getPoint = () => {
        return `${numberWithComma(price * 0.15)} AP`;
    };

    const onNextStep = ({ directPhone, memo }) => {
        const point = price * 0.15;

        setRegistInfo({
            price,
            point,
            memo: memo || null,
            directPhone: directPhone || info.phone,
            emergency: emergencyOrder,
            ...registInfo,
        });

        navigation.navigate(REGIST_NAV[6]);
    };

    const Row = ({ title, content }) => (
        <SRow>
            <STitle>
                <PlainText style={{ fontSize: 18 }}>{title}</PlainText>
            </STitle>
            <SContent>
                <PlainText style={{ fontSize: 18 }}>{content}</PlainText>
            </SContent>
        </SRow>
    );

    const InputRow = ({ title, placeholder, checkBox, defaultValue, type }) => (
        <SRow>
            <STitle>
                <PlainText style={{ fontSize: 18 }}>{title}</PlainText>
            </STitle>
            <SContent
                inputBorderLine={!checkBox}
                borderLine={checkBox}
                background={!checkBox}
            >
                {checkBox ? (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: -5,
                            marginBottom: -5,
                        }}
                    >
                        <Checkbox
                            style={{
                                width: 28,
                                height: 28,
                                marginRight: 5,
                            }}
                            value={isDirectPhone}
                            onValueChange={setIsDirectPhone}
                            color="#777"
                        />
                        <PlainText style={{ fontSize: 18 }}>
                            ????????? ?????? ??????
                        </PlainText>
                    </View>
                ) : (
                    <TextInput
                        style={{ fontSize: 18 }}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        onChangeText={(text) => setValue(type, text)}
                        keyboardType={
                            type === "memo" ? "default" : "number-pad"
                        }
                    />
                )}
            </SContent>
        </SRow>
    );
    return (
        <MainLayout>
            <ScrollView>
                <TouchableWithoutFeedback>
                    <View>
                        <Container>
                            <Row title="?????? ??????" content={getWorkType()} />
                            <Row title="?????? ??????" content={getWorkTime()} />
                            {registInfo.upDown === "??????" ? (
                                <>
                                    <Row
                                        title={
                                            (registInfo.bothType === 1
                                                ? "??????"
                                                : "??????") + " ??????"
                                        }
                                        content={registInfo.address}
                                    />
                                    <Row
                                        title={
                                            (registInfo.bothType === 1
                                                ? "??????"
                                                : "??????") + " ??????"
                                        }
                                        content={registInfo.otherAddress}
                                    />
                                </>
                            ) : (
                                <Row
                                    title="?????? ??????"
                                    content={registInfo.address}
                                />
                            )}
                            <Row title="?????? ??????" content={getWorkFloor()} />

                            {registInfo.volumeType === "quantity" ? (
                                <Row
                                    title="?????? ??????"
                                    content={registInfo.quantity}
                                />
                            ) : (
                                <Row
                                    title="?????? ??????"
                                    content={registInfo.time}
                                />
                            )}

                            <Row title="?????? ??????" content={info.phone} />
                            <InputRow
                                title="?????? ?????????"
                                placeholder="???????????? ?????? ????????? ?????? ??????"
                                defaultValue={isDirectPhone ? info.phone : null}
                                type="directPhone"
                            />
                            <InputRow title="" checkBox />

                            <Row title="?????? ??????" content={getPrice()} />
                            <Row title="?????? ?????????" content={getPoint()} />
                            <SRow>
                                <STitle>
                                    <PlainText style={{ fontSize: 18 }}>
                                        ?????? ??????
                                    </PlainText>
                                </STitle>
                                <Checkbox
                                    style={{ width: 28, height: 28 }}
                                    value={emergencyOrder}
                                    onValueChange={setEmergencyOrder}
                                    color={theme.btnPointColor}
                                />
                            </SRow>
                            {emergencyOrder ? (
                                <Emergency>
                                    <PlainText
                                        style={{
                                            fontSize: 18,
                                            color: theme.main,
                                            marginBottom: 5,
                                        }}
                                    >
                                        ?????? ?????? ?????? ??? ?????? ????????? 20%
                                        ????????????
                                        {"\n"}
                                        ?????? ??????????????? ????????? ???????????????.
                                    </PlainText>
                                </Emergency>
                            ) : null}
                            <InputRow
                                title="?????? ??????"
                                placeholder="??????????????? ??????????????????."
                                type="memo"
                            />
                        </Container>
                        <ButtonContainer>
                            <Button onPress={handleSubmit(onNextStep)}>
                                <PlainText>??????</PlainText>
                            </Button>
                        </ButtonContainer>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </MainLayout>
    );
}

export default OrderDetail;
