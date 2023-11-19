import React, { useContext, useEffect, useState } from "react";
import {
    Image,
    TextInput as RNTextInput,
    TouchableOpacity,
    View,
} from "react-native";
import styled from "styled-components/native";

import MediumText from "../../../component/text/MediumText";
import RegistContext from "../../../context/RegistContext";
import UserContext from "../../../context/UserContext";
import { color } from "../../../styles";
import {
    GetDate,
    GetDayOfWeek,
    GetPhoneNumberWithDash,
    GetTime,
    numberWithComma,
} from "../../../utils";
import { useForm } from "react-hook-form";
import { FONT_OFFSET, REGIST_NAV } from "../../../constant";
import Layout from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;

const Item = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${(props) => (props.uninterval ? 8 : 15)}px;
`;

const TitleWrapper = styled.View`
    width: 25%;
`;
const Wrapper = styled.View`
    width: 75%;
`;

const Content = styled.View`
    background-color: ${color.btnDefault};
    border: 1px solid ${color["box-border"]};
    padding-top: ${(props) => (props.unpadded ? 6 : 10)}px;
    padding-bottom: ${(props) => (props.unpadded ? 6 : 10)}px;
    padding-left: 17px;
    padding-right: 5px;
    border-radius: 15px;
    justify-content: center;
`;

const BottomButtonContainer = styled.View`
    flex-direction: row;
`;

const EmergencyButton = styled.TouchableOpacity`
    flex-direction: row;
    background-color: ${color["box-color-background"]};
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 60px;
`;
const NormalButton = styled.TouchableOpacity`
    background-color: ${color["button-accent-background"]};
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 60px;
`;

function AddOtherData({ navigation }) {
    const { info } = useContext(UserContext);
    const { registInfo, setRegistInfo } = useContext(RegistContext);

    const [isDirectPhone, setIsDirectPhone] = useState(false);

    const { setValue, register, handleSubmit, watch, getValues } = useForm();

    useEffect(() => {
        console.log("registInfo : ", registInfo);

        register("directPhone");
        register("price", {
            min: 0,
        });
        register("memo");

        setValue("price", registInfo.price);
    }, []);

    useEffect(() => {
        if (isDirectPhone) {
            setValue("directPhone", info.phone);
        } else {
            setValue("directPhone", null);
        }
    }, [isDirectPhone]);

    const plus = () => {
        setValue("price", getValues("price") + 10000);
    };
    const minus = () => {
        setValue("price", getValues("price") - 10000);
    };

    const onNextStep = (data) => {
        console.log("onnextstep : ", data);
        const { directPhone, emergency, memo, price } = data;

        const prevInfo = registInfo;

        delete prevInfo.price;

        const sendData = {
            directPhone: directPhone || null,
            emergency,
            memo: memo || null,
            price,
        };

        console.log("sendData : ", sendData);

        setRegistInfo({ ...prevInfo, ...sendData });

        navigation.navigate(REGIST_NAV[4]);
    };

    const ItemTitle = ({ title }) => {
        return (
            <TitleWrapper>
                <RegularText>{title}</RegularText>
            </TitleWrapper>
        );
    };

    const Checkbox = ({ checked }) => {
        return (
            <Image
                source={
                    checked
                        ? require("../../../assets/images/icons/Check_ON.png")
                        : require("../../../assets/images/icons/Check_OFF.png")
                }
                resizeMode="contain"
                style={{ width: 23, height: 23, marginRight: 6 }}
            />
        );
    };

    const Line = () => {
        return (
            <View
                style={{
                    height: 2,
                    backgroundColor: color["input-border"],
                    marginTop: 10,
                }}
            ></View>
        );
    };
    const BottomButton = () => {
        return (
            <BottomButtonContainer>
                {/* 
                //NEXT: 긴급오더 일단 삭제
                <EmergencyButton
                    onPress={handleSubmit((data) =>
                        onNextStep({ ...data, emergency: true })
                    )}
                >
                    <Image
                        source={require("../../../assets/images/icons/icon_emerg.png")}
                        style={{ width: 24, height: 24 }}
                    />
                    <BoldText style={{ color: "#EB1D36" }}>긴급오더</BoldText>
                </EmergencyButton> */}
                {/* 
                //NEXT: 긴급오더 일단 삭제
                <NormalButton
                    
                    onPress={handleSubmit((data) =>
                        onNextStep({ ...data, emergency: false })
                    )}
                >
                    <BoldText style={{ color: "white" }}>일반오더</BoldText>
                </NormalButton> */}

                <NormalButton
                    style={{ width: "100%" }}
                    onPress={handleSubmit((data) =>
                        onNextStep({ ...data, emergency: false })
                    )}
                >
                    <BoldText style={{ color: "white" }}>다음으로</BoldText>
                </NormalButton>
            </BottomButtonContainer>
        );
    };
    return (
        <Layout
            bottomButtonProps={{
                customButton: <BottomButton />,
            }}
        >
            <Item>
                <ItemTitle title="작업 종류" />
                <Wrapper>
                    <Content>
                        <RegularText>
                            {registInfo.vehicleType === "스카이차"
                                ? registInfo.vehicleType
                                : registInfo.vehicleType +
                                  " / " +
                                  registInfo.direction}
                        </RegularText>
                    </Content>
                </Wrapper>
            </Item>
            <Item>
                <ItemTitle title="작업 일시" />
                <Wrapper>
                    <Content>
                        <RegularText>
                            {`${GetDate(
                                registInfo.dateTime,
                                "long"
                            )} (${GetDayOfWeek(registInfo.dateTime)}) ${GetTime(
                                registInfo.dateTime
                            )}`}
                        </RegularText>
                    </Content>
                </Wrapper>
            </Item>
            {registInfo.direction === "양사" ? (
                <>
                    <Item uninterval>
                        <ItemTitle title="내림 주소" />
                        <Wrapper>
                            <Content>
                                <RegularText>{registInfo.address1}</RegularText>
                            </Content>
                        </Wrapper>
                    </Item>
                    <Item>
                        <ItemTitle />
                        <Wrapper>
                            <Content>
                                <RegularText>
                                    {registInfo.detailAddress1}
                                </RegularText>
                            </Content>
                        </Wrapper>
                    </Item>
                    <Item uninterval>
                        <ItemTitle title="올림 주소" />
                        <Wrapper>
                            <Content>
                                <RegularText>{registInfo.address2}</RegularText>
                            </Content>
                        </Wrapper>
                    </Item>
                    <Item>
                        <ItemTitle />
                        <Wrapper>
                            <Content>
                                <RegularText>
                                    {registInfo.detailAddress2}
                                </RegularText>
                            </Content>
                        </Wrapper>
                    </Item>
                </>
            ) : (
                <>
                    <Item uninterval>
                        <ItemTitle title="작업 주소" />
                        <Wrapper>
                            <Content>
                                <RegularText>{registInfo.address1}</RegularText>
                            </Content>
                        </Wrapper>
                    </Item>
                    <Item>
                        <ItemTitle />
                        <Wrapper>
                            <Content>
                                <RegularText>
                                    {registInfo.detailAddress1}
                                </RegularText>
                            </Content>
                        </Wrapper>
                    </Item>
                </>
            )}

            <Item>
                <ItemTitle title="작업 높이" />
                <Wrapper>
                    <Content>
                        <RegularText>
                            {registInfo.direction === "양사"
                                ? registInfo.downFloor +
                                  "(내림) / " +
                                  registInfo.upFloor +
                                  "(올림)"
                                : registInfo.floor}
                        </RegularText>
                    </Content>
                </Wrapper>
            </Item>
            <Item>
                <ItemTitle title="연락처" />
                <Wrapper>
                    <Content>
                        <RegularText>
                            {GetPhoneNumberWithDash(info.phone)}
                        </RegularText>
                    </Content>
                </Wrapper>
            </Item>
            <Item uninterval>
                <ItemTitle title="현장 연락처" />
                <Wrapper>
                    <Content unpadded>
                        <RNTextInput
                            style={{
                                fontSize: 18 + FONT_OFFSET,
                                fontFamily: "SpoqaHanSansNeo-Regular",
                                color: color["page-black-text"],
                            }}
                            placeholder="현장 연락처를 입력해주세요 (선택)"
                            keyboardType="number-pad"
                            cursorColor={color["page-lightgrey-text"]}
                            value={watch("directPhone")}
                            onChangeText={(text) =>
                                setValue("directPhone", text)
                            }
                        />
                    </Content>
                </Wrapper>
            </Item>
            <Item>
                <ItemTitle />
                <Wrapper>
                    <TouchableOpacity
                        style={{ marginBottom: 10 }}
                        onPress={() => setIsDirectPhone((prev) => !prev)}
                    >
                        <Row>
                            <Checkbox checked={isDirectPhone} />
                            <RegularText style={{ fontSize: 16 }}>
                                핸드폰 번호 동일
                            </RegularText>
                        </Row>
                    </TouchableOpacity>
                </Wrapper>
            </Item>
            <Item uninterval>
                <ItemTitle title="작업 비용" />
                <Wrapper>
                    <BoldText>
                        {watch("price")
                            ? numberWithComma(watch("price").toString())
                            : watch("price")}
                        <BoldText style={{ fontSize: 14 }}> AP</BoldText>
                    </BoldText>
                </Wrapper>
            </Item>
            <Item>
                <ItemTitle />
                <Wrapper>
                    <Line />
                    {/* NEXT: 비용 세부 조정 일단 삭제
                    <RegularText style={{ fontSize: 14, marginTop: 7 }}>
                        비용 세부 조정
                    </RegularText>
                    <View style={{ marginTop: 7, marginBottom: 10 }}>
                        <Row>
                            <TouchableOpacity onPress={plus}>
                                <Image
                                    source={require("../../../assets/images/icons/icon_plus.png")}
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                            <MediumText
                                style={{
                                    fontSize: 16,
                                    color: color["page-color-text"],
                                    marginLeft: 10,
                                    marginRight: 10,
                                }}
                            >
                                10,000{" "}
                                <MediumText
                                    style={{
                                        fontSize: 12,
                                        color: color["page-color-text"],
                                    }}
                                >
                                    AP
                                </MediumText>
                            </MediumText>
                            <TouchableOpacity onPress={minus}>
                                <Image
                                    source={require("../../../assets/images/icons/icon_minus.png")}
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                        </Row>
                    </View> */}
                </Wrapper>
            </Item>
            <Item uninterval>
                <ItemTitle title="특이사항" />
                <Wrapper>
                    <RNTextInput
                        style={{
                            fontSize: 18 + FONT_OFFSET,
                            fontFamily: "SpoqaHanSansNeo-Regular",
                            color: color["page-black-text"],
                        }}
                        placeholder="특이사항을 입력해주세요."
                        cursorColor={color["page-lightgrey-text"]}
                        value={watch("memo")}
                        onChangeText={(text) => setValue("memo", text)}
                    />
                </Wrapper>
            </Item>
            <Item>
                <ItemTitle />
                <Wrapper>
                    <View style={{ marginTop: -10 }}>
                        <Line />
                    </View>
                </Wrapper>
            </Item>
        </Layout>
    );
}

export default AddOtherData;
