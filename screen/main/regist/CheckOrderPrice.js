import styled from "styled-components/native";
import Layout from "../../../component/layout/Layout";
import RegularText from "../../../component/text/RegularText";
import { color } from "../../../styles";
import MediumText from "../../../component/text/MediumText";
import { Image, View, useWindowDimensions } from "react-native";
import BoldText from "../../../component/text/BoldText";
import { REGIST_NAV, SERVER } from "../../../constant";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import RegistContext from "../../../context/RegistContext";
import {
    GetCurrentDateTime,
    GetEmergencyPrice,
    GetSavePoint,
    GetTax,
    IsGugupackMember,
    getAsyncStorageToken,
    numberWithComma,
    numberWithZero,
    showError,
} from "../../../utils";
import axios from "axios";
import { useForm } from "react-hook-form";
import { PAYMENT_APP_ID } from "@env";
import Button from "../../../component/button/Button";

const Item = styled.View`
    background-color: white;
    border: 1px solid
        ${(props) =>
            props.accent
                ? color["page-black-text"]
                : props.emergency
                ? "#EB1D36"
                : color["box-border"]};
    border-radius: 10px;
    padding: 22px 23px;
    align-items: flex-end;
    margin-bottom: 18px;
`;

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;

const PopupContainer = styled.View`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #00000033;
    align-items: center;
    justify-content: center;
`;

const PopupWrapper = styled.View`
    background-color: white;
    width: 90%;
    border-radius: 10px;
    align-items: center;
    padding-top: 25px;
    padding-bottom: 25px;
`;

const PayButton = styled.TouchableOpacity`
    width: 80%;
    flex-direction: row;
    align-items: center;
`;

const PayButtonImage = styled.Image`
    /* background-color: black; */
`;
const PayButtonText = styled.View`
    width: 70%;
    align-items: center;
`;

const CheckOrderPrice = ({ navigation }) => {
    const { width: windowWidth } = useWindowDimensions();
    const { info } = useContext(UserContext);
    const { registInfo, setRegistInfo } = useContext(RegistContext);

    const { setValue, register, handleSubmit, watch, getValues } = useForm();

    const [pointData, setPointData] = useState(null);
    const [isPopupShown, setIsPopupShown] = useState(false);

    useEffect(() => {
        console.log("registInfo : ", registInfo);

        getGugupackPrice();
        getPoint();

        register("price"); //운임
        register("emergencyPrice"); // 긴급 비용
        register("curPoint"); //보유한 포인트
        register("orderPrice"); //??
        register("usePoint"); //사용할 포인트
        register("totalPrice"); //최종 결제 금액
        register("registPoint"); //적립 예정 포인트
        register("tax"); //부가세
        register("gugupackPrice"); //구구팩 요금

        setValue("price", registInfo.price.toString());

        if (registInfo.emergency)
            setValue(
                "emergencyPrice",
                GetEmergencyPrice(registInfo.price).toString()
            );
        else setValue("emergencyPrice", "0");
    }, []);

    useEffect(() => {
        const { price, emergencyPrice, usePoint, gugupackPrice } = getValues();

        const priceNum = Number(price) || 0;
        const emergencyPriceNum = Number(emergencyPrice) || 0;
        const usePointNum = Number(usePoint) || 0;
        const gugupackPriceNum = Number(gugupackPrice) || 0;

        const orderPrice = priceNum + emergencyPriceNum;
        const totalPrice =
            priceNum + emergencyPriceNum - usePointNum - gugupackPriceNum;
        const registPoint = GetSavePoint(priceNum + emergencyPriceNum);
        const tax = GetTax(priceNum + emergencyPriceNum - gugupackPriceNum);

        setValue("orderPrice", orderPrice.toString());
        setValue("totalPrice", totalPrice.toString());
        setValue("registPoint", registPoint.toString());
        setValue("tax", tax.toString());
    }, [
        watch("price"),
        watch("emergencyPrice"),
        watch("usePoint"),
        watch("gugupackPrice"),
    ]);

    useEffect(() => {
        //내가 가지고 있는 포인트보다 작거나 같아야함
        if (!pointData) null;
        const usePoint = watch("usePoint");

        if (usePoint && usePoint > 0) {
            if (usePoint > pointData.curPoint) {
                setValue("usePoint", pointData.curPoint.toString());
                return;
            }

            const { price, emergencyPrice } = getValues();

            const priceNum = Number(price) || 0;
            const emergencyPriceNum = Number(emergencyPrice) || 0;

            const total = priceNum + emergencyPriceNum;

            if (usePoint > total) {
                setValue("usePoint", total.toString());
            }
        }
    }, [watch("usePoint")]);

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

                setPointData(point);
                setValue("curPoint", point.curPoint.toString());

                // setPointData({ curPoint: 30000 });
                // setValue("curPoint", "30000");
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const getGugupackPrice = async () => {
        if (IsGugupackMember(info)) {
            axios
                .get(SERVER + "/users/gugupack/price")
                .then(({ data }) => {
                    const {
                        result,
                        data: { price },
                    } = data;
                    console.log("result: ", result);

                    setValue("gugupackPrice", price.gugupackPrice.toString());
                })
                .catch((error) => {
                    showError(error);
                })
                .finally(() => {});
        } else {
            setValue("gugupackPrice", "0");
        }
    };

    const showPopup = () => {
        setIsPopupShown(true);
    };

    const hidePopup = () => {
        setIsPopupShown(false);
    };

    const onNextStep = (data) => {
        const {
            curPoint,
            emergencyPrice,
            price,
            registPoint,
            tax,
            totalPrice,
            usePoint,
            type,
            gugupackPrice,
        } = data;

        const prevInfo = registInfo;

        delete prevInfo.price;

        const finalPrice = Number(totalPrice) + Number(tax);

        const sendData = {
            price: Number(price),
            emergencyPrice: Number(emergencyPrice) || 0,
            usePoint: Number(usePoint) || 0,
            orderPrice: Number(price) + Number(emergencyPrice) || 0,
            totalPrice: Number(totalPrice),
            tax: Number(tax),
            finalPrice: finalPrice,
            registPoint: Number(registPoint),
            gugupackPrice: Number(gugupackPrice),
        };
        console.log("sendData :", sendData);

        setRegistInfo({ ...prevInfo, ...sendData });

        const now = GetCurrentDateTime();

        now.setUTCMinutes(now.getUTCMinutes() + 10);

        const paymentData = {
            application_id: PAYMENT_APP_ID,
            price: finalPrice,
            order_name: registInfo.vehicleType + " 이용비 결제",
            order_id: info.id + "_" + Date.now(),
            user: {
                username: info.name,
                phone: info.phone,
            },
            curPoint,
            pointId: pointData.id,
            extra: {
                // test_deposit: true, //TEST: 가상계좌결제 테스트
                deposit_expiration:
                    now.getUTCFullYear() +
                    "-" +
                    numberWithZero(now.getUTCMonth() + 1) +
                    "-" +
                    numberWithZero(now.getUTCDate()) +
                    " " +
                    numberWithZero(now.getUTCHours()) +
                    ":" +
                    numberWithZero(now.getUTCMinutes()) +
                    ":" +
                    "00",
            },
        };

        hidePopup();

        if (type === "normal") {
            //일반결제
            navigation.navigate(REGIST_NAV[5], { data: paymentData });
        } else if (type === "keyedin") {
            //수기결제
            navigation.navigate("KeyedInPay", { data: paymentData });
        } else {
            //무통장입금
            console.log("무통장");
        }
    };

    //NEXT: 쿠폰사용 포함
    return (
        <>
            <Layout
                bottomButtonProps={{
                    onPress: showPopup,
                    title: "결제 진행",
                }}
            >
                <Item>
                    <RegularText style={{ marginBottom: 13 }}>
                        알테구 작업 비용 결제
                    </RegularText>
                    <RegularText
                        style={{
                            color: color["page-bluegrey-text"],
                            fontSize: 15,
                            marginBottom: 5,
                        }}
                    >
                        결제금액
                    </RegularText>
                    <MediumText>
                        {numberWithComma(watch("price", "0"))}
                        <MediumText style={{ fontSize: 14 }}> P</MediumText>
                    </MediumText>
                </Item>
                {registInfo.emergency ? (
                    <Item emergency>
                        <Row>
                            <Image
                                source={require("../../../assets/images/icons/icon_emerg.png")}
                                style={{ width: 25, height: 25 }}
                            />
                            <RegularText
                                style={{
                                    fontSize: 19,
                                    color: "#EB1D36",
                                    marginTop: 5,
                                    marginLeft: 8,
                                }}
                            >
                                긴급오더
                            </RegularText>
                        </Row>
                        <RegularText
                            style={{
                                color: color.main,
                                fontSize: 15,
                                marginBottom: 5,
                                marginTop: 13,
                            }}
                        >
                            25% 추가운임
                        </RegularText>
                        <BoldText style={{ fontSize: 22 }}>
                            {numberWithComma(watch("emergencyPrice", "0"))}
                            <BoldText style={{ fontSize: 16 }}> P</BoldText>
                        </BoldText>
                    </Item>
                ) : null}

                {/* 
            //NEXT: 포인트 결제 일단 삭제
            <Item>
                <RegularText style={{ marginBottom: 13 }}>포인트</RegularText>
                <RegularText
                    style={{
                        color: color["page-bluegrey-text"],
                        fontSize: 15,
                        marginBottom: 5,
                    }}
                >
                    보유한 포인트
                </RegularText>
                <MediumText style={{ marginBottom: 18 }}>
                    {numberWithComma(watch("curPoint", "0"))}
                    <MediumText style={{ fontSize: 14 }}> P</MediumText>
                </MediumText>
                <Row>
                    <View style={{ width: "55%", marginRight: 20 }}>
                        <Row>
                            <TextInput
                                style={{
                                    width: "90%",
                                    fontSize: 18 + FONT_OFFSET,
                                    fontFamily: "SpoqaHanSansNeo-Regular",
                                    color: color["page-black-text"],
                                }}
                                placeholder="사용할 포인트 입력"
                                cursorColor={color["page-lightgrey-text"]}
                                returnKeyType="done"
                                keyboardType="number-pad"
                                value={watch("usePoint")}
                                onChangeText={(text) =>
                                    setValue("usePoint", text)
                                }
                            />
                            <BoldText
                                style={{ color: color["page-color-text"] }}
                            >
                                P
                            </BoldText>
                        </Row>
                        <View
                            style={{
                                height: 2,
                                backgroundColor: color["input-border"],
                                marginTop: 10,
                            }}
                        ></View>
                    </View>
                    <PointButton
                        onPress={() =>
                            setValue("usePoint", pointData.curPoint.toString())
                        }
                    >
                        <MediumText
                            style={{
                                fontSize: 15,
                                color: color["page-color-text"],
                            }}
                        >
                            전액사용
                        </MediumText>
                    </PointButton>
                </Row>
            </Item> */}
                <Item accent>
                    <MediumText style={{ marginBottom: 25 }}>
                        최종 결제 금액
                    </MediumText>
                    <Row>
                        <RegularText
                            style={{
                                fontSize: 15,
                                marginBottom: 8,
                                maxWidth: "50%",
                                marginRight: 10,
                                textAlign: "right",
                            }}
                        >
                            알테구 작업 비용
                        </RegularText>
                        <RegularText
                            style={{
                                fontSize: 16,
                                marginBottom: 8,
                                // width: "25%",
                                maxWidth: "50%",
                                textAlign: "right",
                            }}
                        >
                            {numberWithComma(watch("orderPrice", "0"))}
                            <RegularText
                                style={{
                                    fontSize: 14,
                                }}
                            >
                                {" "}
                                P
                            </RegularText>
                        </RegularText>
                    </Row>
                    {IsGugupackMember(info) ? (
                        <Row>
                            <RegularText
                                style={{
                                    fontSize: 15,
                                    marginBottom: 8,
                                    maxWidth: "50%",
                                    marginRight: 10,
                                    textAlign: "right",
                                }}
                            >
                                - 구구팩 회원 할인
                            </RegularText>
                            <RegularText
                                style={{
                                    fontSize: 16,
                                    marginBottom: 8,
                                    // width: "25%",
                                    maxWidth: "50%",
                                    textAlign: "right",
                                }}
                            >
                                {registInfo.volume === "시간" &&
                                registInfo.vehicleType === "사다리차" &&
                                registInfo.time.search("간단") !== -1 &&
                                (registInfo.floor === "2층" ||
                                    registInfo.floor === "3층" ||
                                    registInfo.floor === "4층" ||
                                    registInfo.floor === "5층")
                                    ? numberWithComma(10000)
                                    : numberWithComma(
                                          watch("gugupackPrice", "0")
                                      )}
                                <RegularText
                                    style={{
                                        fontSize: 14,
                                    }}
                                >
                                    {" "}
                                    P
                                </RegularText>
                            </RegularText>
                        </Row>
                    ) : null}

                    <Row>
                        <RegularText
                            style={{
                                fontSize: 15,
                                marginBottom: 8,
                                maxWidth: "50%",
                                marginRight: 10,
                                textAlign: "right",
                            }}
                        >
                            부가세(10%)
                        </RegularText>
                        <RegularText
                            style={{
                                fontSize: 16,
                                marginBottom: 8,
                                // width: "25%",
                                maxWidth: "50%",
                                textAlign: "right",
                            }}
                        >
                            {numberWithComma(watch("tax", "0"))}
                            <RegularText
                                style={{
                                    fontSize: 14,
                                }}
                            >
                                {" "}
                                P
                            </RegularText>
                        </RegularText>
                    </Row>
                    {/* <Row>
                    <RegularText
                        style={{
                            fontSize: 15,
                            width: "25%",
                            textAlign: "right",
                        }}
                    >
                        포인트 사용
                    </RegularText>
                    <RegularText
                        style={{
                            fontSize: 16,

                            width: "25%",
                            textAlign: "right",
                        }}
                    >
                        - {numberWithComma(watch("usePoint", "0"))}
                        <RegularText
                            style={{
                                fontSize: 14,
                            }}
                        >
                            {" "}
                            P
                        </RegularText>
                    </RegularText>
                </Row> */}
                    <View
                        style={{
                            height: 1.5,
                            backgroundColor: color["image-area-background"],
                            width: "60%",
                            marginTop: 13,
                            marginBottom: 13,
                        }}
                    ></View>
                    <Row>
                        <RegularText
                            style={{
                                fontSize: 15,
                                marginRight: 20,
                                maxWidth: windowWidth * 0.3,
                            }}
                        >
                            총 결제 금액{" "}
                        </RegularText>
                        <BoldText
                            style={{
                                fontSize: 22,
                                color: color.main,
                                maxWidth: windowWidth * 0.7,
                            }}
                        >
                            {numberWithComma(
                                Number(watch("totalPrice", "0")) +
                                    Number(watch("tax", "0"))
                            )}
                            <BoldText
                                style={{ fontSize: 16, color: color.main }}
                            >
                                {" "}
                                P
                            </BoldText>
                        </BoldText>
                    </Row>
                </Item>
                <Item accent>
                    <MediumText style={{ color: color.blue, marginBottom: 20 }}>
                        적립 예정 포인트
                    </MediumText>
                    <BoldText style={{ fontSize: 22, color: color.blue }}>
                        {numberWithComma(watch("registPoint", "0"))}
                        <BoldText style={{ fontSize: 16, color: color.blue }}>
                            {" "}
                            P
                        </BoldText>
                    </BoldText>
                </Item>
            </Layout>
            {isPopupShown ? (
                <PopupContainer>
                    <PopupWrapper>
                        <PayButton
                            onPress={handleSubmit((data) =>
                                onNextStep({ ...data, type: "normal" })
                            )}
                        >
                            <View style={{ width: "30%" }}>
                                <PayButtonImage
                                    source={require("../../../assets/images/icons/pay_mobile.png")}
                                    style={{
                                        width: 60,
                                        height: 65,
                                        opacity: 0.8,
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                            <PayButtonText>
                                <RegularText>
                                    일반 결제 및 무통장입금
                                </RegularText>
                            </PayButtonText>
                        </PayButton>
                        <View
                            style={{
                                width: "92%",
                                backgroundColor: "grey",
                                height: 0.5,
                                opacity: 0.5,
                                marginTop: 20,
                                marginBottom: 20,
                            }}
                        ></View>
                        <PayButton
                            onPress={handleSubmit((data) =>
                                onNextStep({ ...data, type: "keyedin" })
                            )}
                        >
                            <View
                                style={{
                                    width: "30%",
                                }}
                            >
                                <PayButtonImage
                                    source={require("../../../assets/images/icons/pay_keyedin.png")}
                                    style={{
                                        width: 85,
                                        height: 75,
                                        marginLeft: -13,
                                        marginTop: -5,
                                        opacity: 0.9,
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                            <PayButtonText>
                                <RegularText>카드번호 직접 입력</RegularText>
                            </PayButtonText>
                        </PayButton>
                    </PopupWrapper>
                </PopupContainer>
            ) : null}
        </>
    );
};

export default CheckOrderPrice;
