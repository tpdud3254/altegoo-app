import React, { useContext, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { color } from "../../../styles";
import MediumText from "../../../component/text/MediumText";
import { AntDesign } from "@expo/vector-icons";
import styled from "styled-components/native";
import RegistContext from "../../../context/RegistContext";
import {
    CALENDAR_HAND,
    CALENDAR_LOCALES,
    FONT_OFFSET,
    REGIST_NAV,
} from "../../../constant";
import Layout from "../../../component/layout/Layout";
import { OptionScroll } from "../../../component/OptionScroll";
import RegularText from "../../../component/text/RegularText";
import { shadowProps } from "../../../component/Shadow";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
    GetDate,
    GetOrderOption,
    GetTime,
    showErrorMessage,
} from "../../../utils";

LocaleConfig.locales["fr"] = CALENDAR_LOCALES;
LocaleConfig.defaultLocale = "fr";

const SelectDateContainer = styled.View`
    width: 100%;
    background-color: white;
    border-radius: 10px;
`;

const Notice = styled.View`
    flex-direction: row;
    align-items: center;
    padding-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const Item = styled.View`
    margin-bottom: 35px;
`;
const Wrapper = styled.View``;

const DialogContainer = styled.View`
    min-width: 90%;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    padding-top: 5%;
    padding-bottom: 5%;
    padding-left: 3%;
    padding-right: 3%;
    background-color: white;
    max-height: 500px;
`;

function SelectDateTime({ navigation }) {
    const { registInfo, setRegistInfo } = useContext(RegistContext);

    const [optionData, setOptionData] = useState([]);
    const [day, setDay] = useState("");
    const [time, setTime] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [popupShown, setPopupShown] = useState(false);
    const [selectionType, setSelectionType] = useState("");

    useEffect(() => {
        console.log(registInfo);

        setOptionData(GetOrderOption(registInfo));
    }, []);

    const showPopup = (option) => {
        setPopupShown(true);
        setSelectionType(option);
    };

    const hidePopup = () => {
        setPopupShown(false);
        setSelectionType("");
    };

    const getMonth = (date) => {
        return date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
    };

    const getMinDate = () => {
        const today = new Date();

        return `${today.getFullYear()}-${getMonth(today)}-${
            today.getDate() < 10 ? "0" + today.getDate() : today.getDate()
        }`;
    };
    const isHandDay = (dateString, month) =>
        CALENDAR_HAND[month - 1].includes(dateString);

    const isSelectedDay = (dataString) => selectedDay === dataString;

    const onSelectDate = (dateString) => {
        setDay(dateString);
        setSelectedDay(GetDate(dateString, "long"));
        hidePopup();
    };

    const onSelectTime = (e) => {
        hidePopup();

        const date = new Date(e.nativeEvent.timestamp);
        setTime(`${date.getHours()}:${date.getMinutes()}`);
        setSelectedTime(GetTime(date, "long"));
    };
    const onNextStep = () => {
        const sendDateTime = new Date();

        const year = day.substring(0, 4);
        const month = day.substring(5, 7);
        const date = day.substring(8, 10);
        const [hours, min] = time.split(":");

        sendDateTime.setFullYear(Number(year));
        sendDateTime.setMonth(Number(month) - 1);
        sendDateTime.setDate(Number(date));
        sendDateTime.setHours(+hours);
        sendDateTime.setMinutes(min);

        console.log(sendDateTime);

        const now = new Date();

        if (now >= sendDateTime) {
            showErrorMessage("현재 시각 이후로 선택해 주세요.");
            return;
        }

        setRegistInfo({ ...registInfo, dateTime: sendDateTime });

        navigation.navigate(REGIST_NAV[2]);
    };
    const LeftArrow = () => (
        <AntDesign name="leftcircleo" size={28} color="black" />
    );

    const RightArrow = () => (
        <AntDesign name="rightcircleo" size={28} color="black" />
    );

    const ItemTitle = ({ title }) => {
        return (
            <RegularText style={{ fontSize: 20, marginBottom: 15 }}>
                {title}
            </RegularText>
        );
    };

    const SelectButton = ({ option }) => {
        return (
            <TouchableOpacity
                onPress={() => showPopup(option)}
                style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: 2,
                    borderBottomColor: color["input-border"],
                    marginTop: 2,
                }}
            >
                <RegularText
                    style={{
                        width: "90%",
                        fontSize: 19,
                        paddingTop: 8,
                        paddingBottom: 16,
                        color:
                            option === "date"
                                ? selectedDay.length > 0
                                    ? color["page-black-text"]
                                    : color["page-lightgrey-text"]
                                : selectedTime
                                ? color["page-black-text"]
                                : color["page-lightgrey-text"],
                    }}
                >
                    {option === "date"
                        ? selectedDay.length > 0
                            ? selectedDay
                            : "날짜 선택"
                        : null}
                    {option === "time"
                        ? selectedTime
                            ? selectedTime
                            : "시간 선택"
                        : null}
                </RegularText>
                <View
                    style={{
                        width: "10%",
                        alignItems: "flex-end",
                        paddingTop: 8,
                        paddingRight: 2,
                        paddingBottom: 16,
                    }}
                >
                    <Image
                        source={require(`../../../assets/images/icons/allow_down.png`)}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    const SelectDate = () => {
        return (
            <SelectDateContainer>
                <Notice>
                    <View
                        style={{
                            backgroundColor: color.sub.yellow + "44",
                            borderRadius: 25,
                            width: 30,
                            height: 30,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    />
                    <AntDesign
                        name="arrowright"
                        size={20}
                        color="#777777"
                        style={{
                            marginLeft: 5,
                            marginRight: 5,
                        }}
                    />
                    <MediumText style={{ color: "#777777" }}>
                        손 없는 날
                    </MediumText>
                </Notice>
                <Calendar
                    style={{
                        borderTopColor: "#eeeeee",
                        borderTopWidth: 1,
                    }}
                    renderHeader={(date) => (
                        <View>
                            <MediumText>
                                {date.getFullYear()}년 {getMonth(date)}월
                            </MediumText>
                        </View>
                    )}
                    renderArrow={(direction) =>
                        direction === "left" ? <LeftArrow /> : <RightArrow />
                    }
                    dayComponent={({ date, state }) => (
                        <TouchableOpacity
                            style={{
                                backgroundColor: isSelectedDay(date.dateString)
                                    ? color.main
                                    : isHandDay(date.dateString, date.month)
                                    ? color.sub.yellow + "44"
                                    : state === "today"
                                    ? "aliceblue"
                                    : "white",
                                borderRadius: 25,
                                width: 45,
                                height: 45,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={
                                state === "disabled"
                                    ? null
                                    : () => onSelectDate(date.dateString)
                            }
                        >
                            <MediumText
                                style={{
                                    color: isSelectedDay(date.dateString)
                                        ? "white"
                                        : state === "disabled"
                                        ? "#cccccc"
                                        : "black",
                                    fontSize: 19,
                                }}
                            >
                                {date.day < 10 ? "0" + date.day : date.day}
                            </MediumText>
                        </TouchableOpacity>
                    )}
                    theme={{
                        textDayHeaderFontSize: 18 + FONT_OFFSET,
                        textDayHeaderFontFamily: "SpoqaHanSansNeo-Regular",
                        textSectionTitleColor: "#777777",
                    }}
                    minDate={getMinDate()}
                    monthFormat={"yyyy년 MM월"}
                />
            </SelectDateContainer>
        );
    };

    return (
        <Layout
            scroll={false}
            kakaoBtnShown={true}
            bottomButtonProps={{
                onPress: onNextStep,
                title: "다음으로",
                disabled: !(selectedDay.length > 0 && selectedTime.length > 0),
            }}
        >
            <OptionScroll data={optionData} />
            <Item>
                <ItemTitle title="1. 원하시는 날짜를 선택해주세요." />
                <Wrapper>
                    <SelectButton option="date" />
                </Wrapper>
            </Item>
            <Item>
                <ItemTitle title="2. 원하시는 시간을 선택해주세요." />
                <Wrapper>
                    <SelectButton option="time" />
                </Wrapper>
            </Item>
            {popupShown && selectionType === "time" ? (
                <RNDateTimePicker
                    mode="time"
                    value={new Date()}
                    display="clock"
                    onChange={onSelectTime}
                />
            ) : (
                <Dialog
                    dialogStyle={{
                        width: "100%",
                        backgroundColor: "#ffffff00",
                    }}
                    visible={popupShown}
                    onTouchOutside={hidePopup}
                    overlayOpacity={0.5}
                    overlayBackgroundColor="#00000044"
                    onHardwareBackPress={hidePopup}
                >
                    <DialogContent
                        style={{ width: "100%", alignItems: "center" }}
                    >
                        <DialogContainer style={shadowProps}>
                            <SelectDate />
                        </DialogContainer>
                    </DialogContent>
                </Dialog>
            )}
        </Layout>
    );
}

export default SelectDateTime;
