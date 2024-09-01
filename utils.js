import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import {
    COMPANY,
    DRIVER,
    EVENT_POPUP_SHOWN,
    EVENT_POPUP_TIME,
    SERVER,
    TOKEN,
    UID,
    USER_TYPE,
    VALID,
} from "./constant";
import * as Speech from "expo-speech";
import axios from "axios";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

export const reset = (setValue, value) => {
    setValue(value, "");
};
export const checkValidation = (data) => {
    let valid = true;
    Object.keys(data).map((value) => {
        if (!data[value]) {
            valid = false;
        }
    });

    return valid;
};

export const CheckValidation = (data) => {
    let result = [];

    Object.keys(data).map((value) => {
        if (typeof data[value] === "number")
            result.push(data[value] > 0 ? true : false);
        else result.push(data[value] && data[value].length > 0 ? true : false);
    });

    for (let i = 0; i < result.length; i++)
        if (result[i] === false) return false;

    return true;
};

export const checkPassword = (password) => {
    const regExp = /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;

    if (!password.match(regExp)) {
        return false;
    } else {
        return true;
    }
};

export const GetAsyncStorageUid = () => {
    return AsyncStorage.getItem(UID);
};

export const SetAsyncStorageUid = async (id) => {
    await AsyncStorage.setItem(UID, id.toString());
};

export const GetAsyncStorageUserType = () => {
    return AsyncStorage.getItem(USER_TYPE);
};

export const SetAsyncStorageUserType = async (type) => {
    await AsyncStorage.setItem(USER_TYPE, type.toString());
};

export const getAsyncStorageToken = () => {
    return AsyncStorage.getItem(TOKEN);
};

export const setAsyncStorageToken = async (token) => {
    await AsyncStorage.setItem(TOKEN, token);
};

export const GetAsyncStorageEventPopupShown = () => {
    return AsyncStorage.getItem(EVENT_POPUP_SHOWN);
};

export const SetAsyncStorageEventPopupShown = async (isShown) => {
    await AsyncStorage.setItem(EVENT_POPUP_SHOWN, isShown.toString());
};

export const GetAsyncStorageEventPopupTime = () => {
    return AsyncStorage.getItem(EVENT_POPUP_TIME);
};

export const SetAsyncStorageEventPopupTime = async (datetime) => {
    await AsyncStorage.setItem(EVENT_POPUP_TIME, datetime.toString());
};

export const numberWithComma = (cost) => {
    if (!cost && cost !== 0) return null;
    return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const numberWithZero = (num) => {
    return num < 10 ? "0" + num : num;
};

export const GetDate = (dateTime, mode = "short") => {
    const workDateTime = new Date(dateTime);

    if (mode === "short")
        return `${workDateTime
            .getUTCFullYear()
            .toString()
            .substring(2, 4)}.${numberWithZero(
            workDateTime.getUTCMonth() + 1
        )}.${numberWithZero(workDateTime.getUTCDate())}`;
    else if (mode === "long")
        return `${workDateTime.getUTCFullYear()}년 ${
            workDateTime.getUTCMonth() + 1
        }월 ${workDateTime.getUTCDate()}일`;
};

export const GetDayOfWeek = (dateTime) => {
    const workDateTime = new Date(dateTime);
    const dayOfWeek = workDateTime.getUTCDay();
    let str = "";
    switch (dayOfWeek) {
        case 0:
            str = "일";
            break;
        case 1:
            str = "월";
            break;
        case 2:
            str = "화";
            break;
        case 3:
            str = "수";
            break;
        case 4:
            str = "목";
            break;
        case 5:
            str = "금";
            break;
        case 6:
            str = "토";
            break;
    }
    return str;
};

export const GetTime = (dateTime, mode = "short") => {
    const workDateTime = new Date(dateTime);

    const hours =
        workDateTime.getUTCHours() === 0
            ? 12
            : workDateTime.getUTCHours() > 12
            ? workDateTime.getUTCHours() - 12
            : workDateTime.getUTCHours();

    if (mode === "short")
        return `${GetAmpm(workDateTime.getUTCHours())} ${numberWithZero(
            hours
        )}:${numberWithZero(workDateTime.getUTCMinutes())}`;
    else if (mode === "long")
        return `${GetAmpm(workDateTime.getUTCHours())} ${numberWithZero(
            hours
        )}시 ${numberWithZero(workDateTime.getUTCMinutes())}분`;
    else if (mode === "24")
        return `${numberWithZero(workDateTime.getUTCHours())}:${numberWithZero(
            workDateTime.getUTCMinutes()
        )}`;
};

export const GetAmpm = (hours) => {
    return hours === 0 ? "오전" : hours >= 12 ? "오후" : "오전";
};

export const showError = (error) => {
    console.log(error.response);
    if (!error?.response?.data?.msg || error?.response?.data?.msg?.length < 1) {
        console.log("msg.len : ", error.response.data.msg.length);
        Toast.show({
            type: "errorToast",
            props: "서버와의 통신이 원활하지 않습니다. 다시 시도하여 주십시오.",
        });
    } else {
        console.log("Error Message : ", error?.response?.data?.msg);
        Toast.show({
            type: "errorToast",
            props:
                error?.response?.data?.msg ||
                "서버와의 통신이 원활하지 않습니다. 다시 시도하여 주십시오. (2)",
        });
    }

    // console.log("error: ", error.response.status);
    // console.log("error: ", error.response.data.msg);
    // console.log("error: ", error.response.data.result);
};

export const showErrorMessage = (msg) => {
    Toast.show({
        type: "errorToast",
        props: msg,
    });
};

export const showMessage = (msg) => {
    Toast.show({
        type: "normalToast",
        props: msg,
    });
};

export const speech = async (msg, exceptionUserId, ttsId) => {
    const uid = await GetAsyncStorageUid();
    const userType = await GetAsyncStorageUserType();
    const token = await getAsyncStorageToken();

    const speak = async () => {
        const beforeTTS = (await AsyncStorage.getItem("TTS")) || 0;
        console.log(beforeTTS);
        if (Number(beforeTTS) === Number(ttsId)) return;
        const thingToSay = msg;
        Speech.speak(thingToSay);
        await AsyncStorage.setItem("TTS", ttsId.toString());
    };

    if (!token) return;
    if (!uid) return;
    if (Number(uid) === Number(exceptionUserId)) return;
    if (Number(userType) !== 2) return;
    const beforeTTS = (await AsyncStorage.getItem("TTS")) || 0;

    if (Number(beforeTTS) === Number(ttsId)) return;

    speak();
};

export const onNext = (nextOne) => {
    nextOne?.current?.focus();
};

export const getDistance = (lat1, lng1, lat2, lng2) => {
    if (lat1 == lat2 && lng1 == lng2) return 0;

    var radLat1 = (Math.PI * lat1) / 180;
    var radLat2 = (Math.PI * lat2) / 180;
    var theta = lng1 - lng2;
    var radTheta = (Math.PI * theta) / 180;
    var dist =
        Math.sin(radLat1) * Math.sin(radLat2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1) dist = 1;

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist; //dist가 2,000 --> 2km를 의미
};

export const checkPosition = async (location) => {
    const auth = await getAsyncStorageToken();

    if (!auth) {
        return;
    }

    try {
        const response = await axios.get(SERVER + "/works/mylist/accept", {
            headers: {
                auth,
            },
        });

        const {
            data: { result },
        } = response;

        if (result === VALID) {
            const {
                data: {
                    data: { list },
                },
            } = response;

            let order1 = null; //1시간 미만 남은 예약 중 작업 (orderStatusId === 2)
            let order2 = null; //출발한 작업 (orderStatusId === 3)

            if (list.length > 0) {
                list.map((order) => {
                    const now = GetCurrentDateTime();
                    const compareDate = new Date(order.dateTime);
                    if (now > compareDate) {
                        return;
                    }

                    if (!order1) {
                        compareDate.setUTCHours(compareDate.getUTCHours() - 1); //작업시간이 한 시간 이하로 남았을 경우

                        if (order.orderStatusId === 2 && now > compareDate) {
                            order1 = order;
                        }
                    }

                    if (!order2) {
                        if (order.orderStatusId === 3) {
                            order2 = order;
                        }
                    }
                });
            }

            console.log("check location position / order1 : ", order1);
            console.log("check location position / order2 : ", order2);

            if (order1) {
                try {
                    const res = await axios.get(
                        `https://dapi.kakao.com/v2/local/search/address.json?query=${order1.address1}`,
                        {
                            headers: {
                                Authorization:
                                    "KakaoAK 86e0df46fbae745bb4c658276b280088",
                            },
                        }
                    );

                    const {
                        data: { documents },
                    } = res;

                    const current = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    };

                    const destination = {
                        latitude: documents[0].y,
                        longitude: documents[0].x,
                    };

                    const distance = getDistance(
                        current.latitude,
                        current.longitude,
                        destination.latitude,
                        destination.longitude
                    );

                    if (distance < 2000) {
                        try {
                            const res = await axios.patch(
                                SERVER + "/works/order/move",
                                { id: order1.id },
                                {
                                    headers: {
                                        auth: await getAsyncStorageToken(),
                                    },
                                }
                            );

                            console.log(res);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            if (order2) {
                try {
                    const res = await axios.get(
                        `https://dapi.kakao.com/v2/local/search/address.json?query=${order2.address1}`,
                        {
                            headers: {
                                Authorization:
                                    "KakaoAK 86e0df46fbae745bb4c658276b280088",
                            },
                        }
                    );

                    const {
                        data: { documents },
                    } = res;

                    const current = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    };

                    const destination = {
                        latitude: documents[0].y,
                        longitude: documents[0].x,
                    };

                    const distance = getDistance(
                        current.latitude,
                        current.longitude,
                        destination.latitude,
                        destination.longitude
                    );

                    if (distance < 500) {
                        try {
                            const res = await axios.patch(
                                SERVER + "/works/order/move",
                                { id: order2.id },
                                {
                                    headers: {
                                        auth,
                                    },
                                }
                            );

                            console.log(res);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const GetPhoneNumberWithDash = (phone) => {
    if (!phone) {
        return "";
    }
    return `${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(
        7,
        phone.length
    )}`;
};

export const GetOrderOption = (registInfo) => {
    const data = [];

    Object.keys(registInfo).map((value, index) => {
        data.push(registInfo[value]);

        if (
            value === "address1" ||
            value === "detailAddress1" ||
            value === "address2" ||
            value === "detailAddress2" ||
            value === "latitud" ||
            value === "longitude" ||
            value === "region" ||
            value === "simpleAddress2" ||
            value === "volume"
        )
            data[index] = null;
        else {
            if (value === "price")
                data[index] =
                    data[index] === 0
                        ? "작업 비용 협의"
                        : "작업 비용 " + numberWithComma(data[index]) + "P";
            if (value === "dateTime")
                data[index] = GetDate(new Date(data[index]), "long");
        }
    });

    return data;
};

export const GetEmergencyPrice = (price) => price * 0.25;
export const GetRegistPoint = (price, commissionList) => {
    const result = commissionList.filter(
        (value) => value.name === "registPoint"
    );

    return result[0].commission * price;
};
export const GetTax = (price, commissionList) => {
    const result = commissionList.filter((value) => value.name === "tax");

    return result[0].commission * price;
};

export const CheckLoading = (data) => {
    let result = [];

    Object.keys(data).map((value) => {
        if (typeof data[value] === "number")
            result.push(data[value] > -1 ? true : false);
    });

    for (let i = 0; i < result.length; i++)
        if (result[i] === false) return false;

    return true;
};

export const Filter = ({ data, period, orderBy }) => {
    console.log("기간 : ", period);

    if (period === "전체 기간") {
        return data;
    }
    const today = GetCurrentDateTime();
    const ago = GetCurrentDateTime();

    if (period === "1주일") {
        ago.setUTCDate(today.getUTCDate() - 7);
    } else if (period === "1개월") {
        ago.setUTCMonth(today.getUTCMonth() - 1);
    } else if (period === "3개월") {
        ago.setUTCMonth(today.getUTCMonth() - 3);
    } else if (period === "6개월") {
        ago.setUTCMonth(today.getUTCMonth() - 6);
    } else if (period === "12개월") {
        ago.setUTCMonth(today.getUTCMonth() - 12);
    }

    const result = [];
    if (orderBy === "createdAt")
        data.map((value) => {
            const dateTime = new Date(value.createdAt);

            ago.setUTCHours(0, 0, 0, 0);

            if (dateTime >= ago) {
                result.push(value);
            }
        });
    else if (orderBy === "dateTime")
        data.map((value) => {
            const dateTime = new Date(value.dateTime);

            ago.setUTCHours(0, 0, 0, 0);

            if (dateTime >= ago) {
                result.push(value);
            }
        });
    else if (orderBy === "date")
        data.map((value) => {
            const dateTime = new Date(value.date);

            ago.setUTCHours(0, 0, 0, 0);

            if (dateTime >= ago) {
                result.push(value);
            }
        });

    return result;
};

export const GoToOrderPage = (info, order, extra) => {
    if (extra?.isStandByOrder) {
        return "StandByOrderProgress";
    }

    if (info.userType === DRIVER) {
        //기사일 경우
        if (order.registUser.id === info.id) {
            //내가 올린 작업인 경우
            if (order.orderStatusId === 6) {
                //완료된 작업인 경우
                return "OrderDetails";
            } else {
                //완료된 작업이 아닌 경우
                return "OrderProgress";
            }
        } else {
            //내가 올린 작업이 아닌 경우
            if (order.orderStatusId === 1) {
                //작업 요청 상태일 경우
                return "OrderDetails";
            } else if (order.orderStatusId === 6) {
                return "OrderDetails";
            } else {
                //나머지 상태일 경우
                if (order.acceptUser === info.id) {
                    //작업자가 나인 경우
                    return "DriverOrderProgress";
                } else {
                    //작업자가 내가 아닌 경우
                    return "OrderDetails";
                }
            }
        }
    } else {
        //일반, 기업일 경우
        if (order.orderStatusId === 6) {
            //완료된 작업인 경우
            return "OrderDetails";
        } else {
            //완료된 작업이 아닌 경우
            return "OrderProgress";
        }
    }
};

export const GoToKakaoNavi = async (address) => {
    console.log(address);

    let latitude = null;
    let longitude = null;
    try {
        const res = await axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
            {
                headers: {
                    Authorization: "KakaoAK 86e0df46fbae745bb4c658276b280088",
                },
            }
        );

        const {
            data: { documents },
        } = res;

        console.log(documents);

        latitude = documents[0].y;
        longitude = documents[0].x;
    } catch (error) {
        console.log(error);
        showErrorMessage("카카오 네비를 실행할 수 없습니다.");
        return;
    }
    Linking.openURL(
        `https://master.d1p7wg3e032x9j.amplifyapp.com/navi?name=${address}&x=${longitude}&y=${latitude}`
    );
};

export const GetCurrentDateTime = () => {
    const curr = new Date();

    const kr_curr = curr.setHours(curr.getHours() + 9);

    const result = new Date(kr_curr);

    return result;
};

export const GetKrDateTime = (datetime) => {
    const curr = new Date(datetime);

    const kr_curr = curr.setHours(curr.getHours() + 9);

    const result = new Date(kr_curr);

    return result;
};

export const IsGugupackMember = (info) => {
    return info.userType === COMPANY && info.gugupack;
};

export const IsIOS = () => {
    return Platform.OS === "ios";
};
