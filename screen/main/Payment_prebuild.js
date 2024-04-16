import React, { useContext, useEffect, useRef } from "react";
import { BackHandler, View } from "react-native";
import UserContext from "../../context/UserContext";
import { REGIST_NAV, SERVER, VALID } from "../../constant";
import axios from "axios";
import {
    GetCurrentDateTime,
    getAsyncStorageToken,
    numberWithZero,
    showMessage,
} from "../../utils";
import RegistContext from "../../context/RegistContext";
import { Bootpay } from "react-native-bootpay-api";

function Payment({ navigation, route }) {
    const bootpay = useRef(null);
    const { registInfo } = useContext(RegistContext);
    const { info } = useContext(UserContext);

    useEffect(() => {
        console.log("payment :", route?.params?.data);
        goBootpay();
    }, []);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", goBack);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress");
        };
    }, []);

    const goBack = () => {
        navigation.goBack();
        return true;
    };

    const registWork = async () => {
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

            console.log(response.data);

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

    const registVBankWork = async (data) => {
        console.log("payment data : ", data);

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
            gugupackPrice: registInfo.gugupackPrice || 0,
            receipt_id: data.receipt_id,
            vbank_account: data.vbank_data.bank_account,
            vbank_code: data.vbank_data.bank_code,
            vbank_name: data.vbank_data.bank_name,
            vbank_expired_at: data.vbank_data.expired_at,
            vbank_tid: data.vbank_data.tid,
        };

        try {
            const response = await axios.post(
                SERVER + "/works/upload/vbank",
                { ...sendingData },
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
                        data: { order },
                    },
                } = response;

                console.log(order);

                navigation.navigate(REGIST_NAV[7], {
                    orderId: order.id,
                    dateTime: order.dateTime,
                    vbank_account: order.vbank_account,
                    vbank_name: order.vbank_name,
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

    const goBootpay = () => {
        const payload = {
            pg:
                route?.params?.data.paymentType === "keyedin"
                    ? "danal"
                    : "nicepay", //['kcp', 'danal', 'inicis', 'nicepay', 'lgup', 'toss', 'payapp', 'easypay', 'jtnet', 'tpay', 'mobilians', 'payletter', 'onestore', 'welcome'] 중 택 1
            price: route?.params?.data.price, //결제금액
            order_name: route?.params?.data.order_name, //결제창에 보여질 상품명
            order_id: route?.params?.data.order_id, //개발사에 관리하는 주문번호
            taxFree: 0, //면세금액
            // subscription_id: '12345_21345', //개발사에 관리하는 주문번호 (정기결제용)
            // authentication_id: '12345_21345', //개발사에 관리하는 주문번호 (본인인증용)

            ...(route?.params?.data.paymentType === "keyedin" && {
                method: "카드수기",
            }),
            ...(route?.params?.data.paymentType === "normal" && {
                methods: ["카드", "계좌이체", "카카오페이", "네이버페이"],
            }), // ['카드', '휴대폰', '계좌이체', '가상계좌', '카카오페이', '네이버페이', '페이코', '카드자동'] 중 택 1
        };

        //결제되는 상품정보들로 통계에 사용되며, price의 합은 결제금액과 동일해야함
        const items = [
            {
                name: route?.params?.data.order_name, //통계에 반영될 상품명
                qty: 1, //수량
                id: 1, //개발사에서 관리하는 상품고유번호
                price: route?.params?.data.price, //상품단가
                // cat1: "패션", //카테고리 상 , 자유롭게 기술
                // cat2: "여성상의", //카테고리 중, 자유롭게 기술
                // cat3: "블라우스", //카테고리 하, 자유롭게 기술
            },
        ];

        //구매자 정보로 결제창이 미리 적용될 수 있으며, 통계에도 사용되는 정보
        const user = {
            // id: 'user_id_1234', //개발사에서 관리하는 회원고유번호
            username: route?.params?.data.user.username,
            phone: route?.params?.data.user.phone,
            // email: 'user1234@gmail.com', //구매자 이메일
            // gender: 0, //성별, 1:남자 , 0:여자
            // birth: '1986-10-14', //생년월일 yyyy-MM-dd
            // phone: '01012345678', //전화번호, 페이앱 필수
            // area: '서울', // [서울,인천,대구,광주,부산,울산,경기,강원,충청북도,충북,충청남도,충남,전라북도,전북,전라남도,전남,경상북도,경북,경상남도,경남,제주,세종,대전] 중 택 1
            // addr: '서울시 동작구 상도로' //주소
        };

        //기타 설정
        const now = GetCurrentDateTime();

        now.setUTCMinutes(now.getUTCMinutes() + 10);

        const extra = {
            // card_quota: "0,2,3", //결제금액이 5만원 이상시 할부개월 허용범위를 설정할 수 있음, [0(일시불), 2개월, 3개월] 허용, 미설정시 12개월까지 허용
            // app_scheme: "bootpayrnapi", //ios의 경우 카드사 앱 호출 후 되돌아오기 위한 앱 스키마명
            show_close_button: false, // x 닫기 버튼 삽입 (닫기버튼이 없는 PG사를 위한 옵션)
            // test_deposit: true, //TEST: 가상계좌 결제 테스트 모드
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
        };

        if (bootpay != null && bootpay.current != null)
            bootpay.current.requestPayment(payload, items, user, extra);
    };

    const onCancel = (data) => {
        console.log("-- cancel", data);
        showMessage("결제가 취소되었습니다.");
        navigation.goBack();
    };

    const onError = (data) => {
        console.log("-- error", data);
        showMessage("결제 오류입니다. 다시 시도해주세요.");
        navigation.navigate(REGIST_NAV[4]);
    };

    const onIssued = (data) => {
        //가상계좌 발급 완료
        console.log("-- issued", data.data);
        registVBankWork(data.data);
    };

    const onConfirm = (data) => {
        console.log("-- confirm", data);
        if (bootpay != null && bootpay.current != null)
            bootpay.current.transactionConfirm(data);
    };

    const onDone = (data) => {
        console.log("-- done", data);
        registWork();
    };

    const onClose = () => {
        console.log("-- closed");
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
            }}
        >
            <Bootpay
                ref={bootpay}
                android_application_id={"641080ba755e27001c692293"}
                onCancel={onCancel}
                onError={onError}
                onIssued={onIssued}
                onConfirm={onConfirm}
                onDone={onDone}
                onClose={onClose}
            />
        </View>
    );
}

Payment.propTypes = {};
export default Payment;
