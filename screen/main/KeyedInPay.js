import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Alert,
    View,
    SafeAreaView,
    useWindowDimensions,
    BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import UserContext from "../../context/UserContext";
import { PAYMENT_SERVER, REGIST_NAV, SERVER, VALID } from "../../constant";
import axios from "axios";

import {
    GetCurrentDateTime,
    getAsyncStorageToken,
    showMessage,
} from "../../utils";
import RegistContext from "../../context/RegistContext";
import MediumText from "../../component/text/MediumText";
import TextInput from "../../component/input/TextInput";
import RegularText from "../../component/text/RegularText";
import { color } from "../../styles";
import styled from "styled-components/native";
import SelectBox from "../../component/selectBox/SelectBox";
import Layout from "../../component/layout/Layout";

const MONTH = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
];
const Wrapper = styled.View``;
const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

function KeyedInPay({ navigation, route }) {
    const { width: windowWidth } = useWindowDimensions();
    const cardNumRef = useRef();
    const [progress, setProgress] = useState(0.0);

    const [yearArr, setYearArr] = useState([]);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const [cardNumber, setCardNumber] = useState("");
    const [cardNumberText, setCardNumberText] = useState("");

    const { registInfo } = useContext(RegistContext);
    const { info } = useContext(UserContext);

    useEffect(() => {
        setYearArr([]);
        const now = GetCurrentDateTime();

        for (let index = 0; index < 10; index++) {
            setYearArr((prev) => [...prev, Number(now.getFullYear()) + index]);
        }

        BackHandler.addEventListener("hardwareBackPress", goBack);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress");
        };
    }, []);

    const goBack = () => {
        navigation.goBack();
        return true;
    };

    const changeCardNumber = (text) => {
        let num = "";

        if (
            cardNumber[cardNumber.length - 1] === "-" &&
            cardNumber.replace(/[^0-9]/g, "").length >=
                text.replace(/[^0-9]/g, "").length
        )
            num = cardNumber.substring(0, cardNumber.length - 2);
        else {
            num = text.replace(/[^0-9]/g, "");
        }

        if (num.length > 16) return;

        console.log("num", num, num.length);

        if (num.length < 8)
            setCardNumber(num.replace(/^(\d{4})(\d{0,3})$/, `$1-$2`));
        else if (num.length >= 8 && num.length < 12) {
            setCardNumber(num.replace(/^(\d{4})(\d{4})(\d{0,3})$/, `$1-$2-$3`));
        } else if (num.length >= 12)
            setCardNumber(
                num.replace(/^(\d{4})(\d{4})(\d{4})(\d{0,4})$/, `$1-$2-$3-$4`)
            );
        else setCardNumber(text);
    };

    const registWork = async (data) => {
        console.log("parsed payment data : ", data);

        const sendingData = {
            vehicleType: registInfo.vehicleType || null,
            direction: registInfo.direction || null,
            floor: registInfo.floor || null,
            downFloor: registInfo.downFloor || null,
            upFloor: registInfo.upFloor || null,
            volume: registInfo.volume || null,
            time: registInfo.time || null,
            quantity: registInfo.quantity || null,
            dateTime: registInfo.dateTime || null,
            address1: registInfo.address1 || null,
            address2: registInfo.address2 || null,
            detailAddress1: registInfo.detailAddress1 || null,
            detailAddress2: registInfo.detailAddress2 || null,
            simpleAddress1: registInfo.simpleAddress1 || null,
            simpleAddress2: registInfo.simpleAddress2 || null,
            region: registInfo.region || null,
            latitude: registInfo.latitude.toString() || "0",
            longitude: registInfo.longitude.toString() || "0",
            phone: info.phone || null,
            directPhone: registInfo.directPhone || null,
            emergency: registInfo.emergency || false,
            memo: registInfo.memo || null,
            price: registInfo.price || 0,
            emergencyPrice: registInfo.emergencyPrice || 0,
            usePoint: registInfo.usePoint || 0,
            orderPrice: registInfo.orderPrice || 0,
            totalPrice: registInfo.totalPrice || 0,
            tax: registInfo.tax || 0,
            finalPrice: registInfo.finalPrice || 0,
            registPoint: registInfo.registPoint || 0,
        };

        try {
            const response = await axios.post(
                SERVER + "/works/upload",
                { ...sendingData },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            console.log(response);

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { order },
                    },
                } = response;

                navigation.navigate(REGIST_NAV[6], {
                    orderId: order.id,
                    dateTime: order.dateTime,
                });
                return;
            } else {
                const {
                    data: { msg },
                } = response;

                console.log(msg);
            }
        } catch (error) {
            console.log("error : ", error);
        }
    };

    return (
        <Layout
            bottomButtonProps={{
                onPress: () => {},
                title: "결제 진행",
            }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}
            >
                <MediumText style={{ marginBottom: 30 }}>
                    결제 정보를 입력해주세요.
                </MediumText>
                <TextInput
                    ref={cardNumRef}
                    title="신용카드번호"
                    placeholder="숫자만 입력하세요"
                    returnKeyType="done"
                    keyboardType="number-pad"
                    value={cardNumber}
                    onReset={() => setCardNumber("")}
                    onChangeText={(text) => changeCardNumber(text)}
                />
                <View style={{ marginTop: 20 }}>
                    <MediumText
                        style={{
                            fontSize: 17,
                            color: color["page-grey-text"],
                        }}
                    >
                        유효기간
                    </MediumText>
                </View>
                <Wrapper>
                    <Row>
                        <SelectBox
                            width="48%"
                            placeholder="년"
                            data={yearArr}
                            onSelect={(index) => setYear(index + 1)}
                            selectedIndex={year - 1}
                        />
                        <SelectBox
                            width="48%"
                            placeholder="월"
                            data={MONTH}
                            onSelect={(index) => setMonth(index + 1)}
                            selectedIndex={month - 1}
                        />
                    </Row>
                </Wrapper>
            </View>
        </Layout>
    );
}

KeyedInPay.propTypes = {};
export default KeyedInPay;
