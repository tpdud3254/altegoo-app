import React, { useContext, useEffect, useState } from "react";
import {
    Image,
    Keyboard,
    TextInput as RNTextInput,
    ScrollView,
    TouchableOpacity,
    View,
    useWindowDimensions,
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
    IsIOS,
    getAsyncStorageToken,
    numberWithComma,
    numberWithZero,
    showMessage,
} from "../../../utils";
import { useForm } from "react-hook-form";
import {
    FONT_OFFSET,
    NORMAL,
    REGIST_NAV,
    SERVER,
    VALID,
} from "../../../constant";
import Layout from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import RegularText from "../../../component/text/RegularText";
import { PopupWithButtons } from "../../../component/popup/PopupWithButtons";
import TextInput from "../../../component/input/TextInput";
import axios from "axios";
import { shadowProps } from "../../../component/Shadow";
import { RowEvenly } from "../../../component/Row";

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
    height: ${(props) => (props.ios ? 70 : 60)}px;
    padding-bottom: ${(props) => (props.ios ? 10 : 0)}px;
`;

const PopupWrapper = styled.View`
    margin-bottom: 20px;
`;

const SelectPopup = styled.View`
    width: 100%;
    position: absolute;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    top: 120px;
    z-index: 100;
    padding: 15px 18px;
    border-radius: 12px;
    background-color: white;
`;

const SelectPopupText = styled.View`
    width: 55%;
    justify-content: space-between;
    flex-direction: row;
`;
const PopupButton = styled.TouchableOpacity`
    width: 60px;
    height: 40px;
    border: 1px solid ${color["input-focus-border"]};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
`;

function AddOtherData({ navigation }) {
    const { info } = useContext(UserContext);
    const { registInfo, setRegistInfo } = useContext(RegistContext);

    const { width: windowWidth } = useWindowDimensions();

    const [isDirectPhone, setIsDirectPhone] = useState(false);
    const [isDesignation, setIsDesignation] = useState(false);
    const [isPopupShown, setIsPopupShown] = useState(false);
    const [validation, setValidation] = useState(false);
    // const [isExist, setIsExist] = useState(true);
    const [show, setShow] = useState(false);
    const [searching, setSearching] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userPhone, setUserPhone] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [driverList, setDriverList] = useState([]);

    const { setValue, register, handleSubmit, watch, getValues } = useForm();

    useEffect(() => {
        console.log("registInfo : ", registInfo);

        register("directPhone");
        register("price", {
            min: 0,
        });
        register("memo");
        register("driver");

        setValue("price", registInfo.price);
    }, []);

    useEffect(() => {
        if (isDirectPhone) {
            setValue("directPhone", info.phone);
        } else {
            setValue("directPhone", null);
        }
    }, [isDirectPhone]);

    // useEffect(() => {
    //     if (!isExist) setValue("driver", "99999999999");
    //     else setValue("driver", "");
    // }, [isExist]);

    useEffect(() => {
        if (selectedUserId && selectedUserId > 0) {
            setValidation(true);
        } else {
            setValidation(false);
        }
    }, [selectedUserId]);

    useEffect(() => {
        // if (!isExist) {
        //     return;
        // }
        const phone = getValues("driver");

        if (phone && phone.length > 10) {
            setShow(true);
            setSearching(true);
            checkDriver(phone);
        } else {
            setShow(false);
        }
    }, [watch("driver")]);

    useEffect(() => {
        const driver = getValues("driver");

        if (!driver || driver.length <= 0) return;

        const regex = /[^0-9]/g;
        const result = driver.replace(regex, "");

        setValue("driver", result);
    }, [watch("driver")]);

    const checkDriver = async (phone) => {
        try {
            const response = await axios.get(SERVER + "/users/search", {
                params: {
                    phone,
                },
            });

            console.log(response.data);

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: { data },
                } = response;

                if (!data.vehicle || data.vehicle.length === 0) {
                    setUserId(0);
                } else {
                    const userVehicleType = data.vehicle[0].type.type;

                    const registVehicleType = registInfo.vehicleType;

                    if (
                        data.userTypeId === 2 &&
                        ((userVehicleType.search("사다리") > -1 &&
                            registVehicleType.search("사다리") > -1) ||
                            (userVehicleType.search("스카이") > -1 &&
                                registVehicleType.search("스카이") > -1) ||
                            (userVehicleType.search("크레인") > -1 &&
                                registVehicleType.search("크레인") > -1))
                    ) {
                        setUserId(data.userId);
                        setUserName(data.name);
                        setUserPhone(data.phone);
                        Keyboard.dismiss();
                    } else {
                        setUserId(0);
                    }
                }
            } else {
                setUserId(0);
            }
        } catch (error) {
            console.log(error);
            showError(error);
        } finally {
            setSearching(false);
        }
    };

    const onSelect = () => {
        setSelectedUserId(userId);
        setUserId(null);
        setUserName(null);
        setUserPhone(null);
        setShow(false);
        setSearching(false);
    };

    const showPopup = async () => {
        try {
            const response = await axios.get(SERVER + "/users/user/recommend", {
                headers: {
                    auth: await getAsyncStorageToken(),
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

                console.log("getRecommendUser : ", list);

                if (list.length === 0) {
                    setDriverList([]);
                }

                const driverList = [];

                list.map((value) => {
                    if (value.userTypeId === 2) {
                        if (!value.vehicle || value.vehicle.length === 0)
                            return;

                        const vehicleType =
                            value.vehicle[0].type.type === "크레인"
                                ? "크레인"
                                : value.vehicle[0].type.type + "차";
                        if (vehicleType === registInfo.vehicleType) {
                            driverList.push(value);
                        }
                    }
                });

                console.log("driverList : ", driverList);

                setDriverList(driverList);
            }
        } catch (error) {
            setDriverList([]);
        } finally {
            setIsPopupShown(true);
        }
    };

    const hidePopup = () => {
        setIsPopupShown(false);
    };

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
            isDesignation: isDesignation,
        };

        console.log("sendData : ", sendData);

        setRegistInfo({ ...prevInfo, ...sendData });

        if (!isDesignation) navigation.navigate(REGIST_NAV[4]);
        else showPopup();
    };

    const onPressDriver = (driver) => {
        const prevInfo = registInfo;

        const sendData = {
            driverId: Number(driver.id),
        };

        setRegistInfo({ ...prevInfo, ...sendData });

        hidePopup();
        navigation.navigate(REGIST_NAV[4]);
    };

    const onSelectDriver = () => {
        console.log("onSelectDriver selectedUserId: ", selectedUserId);
        console.log("onSelectDriver validation: ", validation);
        const prevInfo = registInfo;

        if (validation) {
            const sendData = {
                driverId: Number(selectedUserId),
            };

            setRegistInfo({ ...prevInfo, ...sendData });

            hidePopup();
            navigation.navigate(REGIST_NAV[4]);
        } else {
            hidePopup();
            showMessage("기사를 선택해주세요.");
        }
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
                    ios={IsIOS()}
                    onPress={handleSubmit((data) =>
                        onNextStep({ ...data, emergency: false })
                    )}
                >
                    <BoldText style={{ color: "white" }}>다음으로</BoldText>
                </NormalButton>
            </BottomButtonContainer>
        );
    };

    const Line = () => {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: color["image-area-background"],
                    marginTop: 17,
                    marginBottom: 17,
                }}
            ></View>
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
            {info.userType === NORMAL ? null : (
                <Item>
                    <ItemTitle title="기사 지정" />
                    <Wrapper>
                        <TouchableOpacity
                            onPress={() => setIsDesignation((prev) => !prev)}
                        >
                            <Row>
                                <Checkbox checked={isDesignation} />
                                <RegularText
                                    style={{
                                        fontSize: 16,
                                        color: color["page-grey-text"],
                                    }}
                                >
                                    선택 시 기사를 지정할 수 있습니다.
                                </RegularText>
                            </Row>
                        </TouchableOpacity>
                    </Wrapper>
                </Item>
            )}
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
                        <BoldText style={{ fontSize: 14 }}> P</BoldText>
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
                                    P
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
            <PopupWithButtons
                visible={isPopupShown}
                onTouchOutside={hidePopup}
                onClick={onSelectDriver}
                negativeButtonLabel="취소"
                width={windowWidth * 0.8}
            >
                <RegularText
                    style={{
                        fontSize: 22,
                        textAlign: "center",
                        paddingTop: 15,
                        // paddingLeft: 20,
                        // paddingRight: 20,
                        paddingBottom: 15,
                    }}
                >
                    기사 지정
                </RegularText>
                <PopupWrapper>
                    <TextInput
                        title=""
                        placeholder="전화번호를 입력하세요"
                        keyboardType="number-pad"
                        returnKeyType="done"
                        value={watch("driver")}
                        onChangeText={(text) => {
                            setValue("driver", text);
                            setSelectedUserId(null);
                        }}
                        onReset={() => {
                            setValue("driver", "");
                        }}
                    />
                    <RegularText
                        style={{
                            fontSize: 16,
                            color: color["page-grey-text"],
                            marginTop: 8,
                        }}
                    >
                        숫자만 입력하세요.
                    </RegularText>
                    <View
                        style={{
                            height: 200,
                            marginTop: 15,
                            borderWidth: 1,
                            borderColor: color["image-area-background"],
                            borderRadius: 10,
                            padding: 10,
                        }}
                    >
                        <RegularText
                            style={{
                                width: "100%",
                                textAlign: "center",
                                color: color["page-grey-text"],
                                marginBottom: 20,
                                marginTop: 10,
                            }}
                        >
                            나의 추천 기사
                        </RegularText>
                        <ScrollView>
                            {driverList.map((driver, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => onPressDriver(driver)}
                                >
                                    <RowEvenly style={{ marginBottom: 5 }}>
                                        <RegularText
                                            style={{
                                                color: color["page-grey-text"],
                                            }}
                                        >
                                            <BoldText>{driver.name}</BoldText> (
                                            {(driver.vehicle[0].type.id === 1
                                                ? driver.vehicle[0].floor.floor
                                                : driver.vehicle[0].type.id ===
                                                  2
                                                ? driver.vehicle[0].weight
                                                      .weight
                                                : driver.vehicle[0]
                                                      .vehicleCraneWeight
                                                      .weight) +
                                                " / " +
                                                numberWithZero(
                                                    driver.orderCount
                                                )}
                                            건)
                                        </RegularText>
                                    </RowEvenly>
                                    <RowEvenly>
                                        <RegularText>
                                            {GetPhoneNumberWithDash(
                                                driver.phone
                                            )}
                                        </RegularText>
                                    </RowEvenly>
                                    <View
                                        style={{
                                            height: 1,
                                            backgroundColor:
                                                color["image-area-background"],
                                            marginTop: 17,
                                            marginBottom: 17,
                                        }}
                                    ></View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </PopupWrapper>
                {show ? (
                    <SelectPopup style={shadowProps}>
                        {searching ? (
                            <RegularText
                                style={{ width: "100%", textAlign: "center" }}
                            >
                                검색 중
                            </RegularText>
                        ) : userId === 0 ? (
                            <RegularText
                                style={{ width: "100%", textAlign: "center" }}
                            >
                                해당 번호가 없습니다.
                            </RegularText>
                        ) : (
                            <>
                                <SelectPopupText>
                                    <MediumText>{userPhone}</MediumText>
                                    <MediumText>{userName}</MediumText>
                                </SelectPopupText>
                                <PopupButton onPress={onSelect}>
                                    <MediumText
                                        style={{
                                            color: color["page-color-text"],
                                            fontSize: 14,
                                        }}
                                    >
                                        선택
                                    </MediumText>
                                </PopupButton>
                            </>
                        )}
                    </SelectPopup>
                ) : null}
            </PopupWithButtons>
        </Layout>
    );
}

export default AddOtherData;
