import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../styles";
import { SERVER, SIGNUP_NAV, VALID } from "../../../constant";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import { Radio } from "../../../component/radio/Radio";
import { RadioContainer } from "../../../component/radio/RadioContainer";
import TextInput from "../../../component/input/TextInput";
import { useForm } from "react-hook-form";
import {
    CheckLoading,
    CheckValidation,
    getAsyncStorageToken,
    showErrorMessage,
} from "../../../utils";
import axios from "axios";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import { Popup } from "../../../component/popup/Popup";

const Container = styled.View`
    justify-content: space-between;
    max-width: 400px;
`;

const Wrapper = styled.View`
    margin-top: 0px;
`;

const Item = styled.View`
    margin-bottom: 20px;
`;

const SkipButton = styled.TouchableOpacity`
    align-items: center;
    margin-top: 20px;
    margin-bottom: 10px;
`;

const PopupContainer = styled.View`
    width: 200px;
    height: 230px;
    justify-content: center;
`;

const vehicleType = ["사다리차", "스카이차"];

function RegisterVehicle({ route }) {
    const navigation = useNavigation();
    const [popupVisible, setPopupVisible] = useState(false);
    const { info, setInfo } = useContext(UserContext);
    const { register, setValue, watch, getValues, handleSubmit } = useForm();

    const [floor, setFloor] = useState(-1);
    const [weight, setWeight] = useState(-1);

    const [loading, setLoading] = useState(true);
    const [validation, setValidation] = useState(false);

    const [settingMode, setSettingMode] = useState(false);

    useEffect(() => {
        if (route?.params?.modify) setSettingMode(true);

        console.log(info);
        register("vehicleType");
        register("vehicleNumber");
        register("option");

        setValue("vehicleType", 1);
        setValue("option", 1);

        getVehicleFloor();
        getVehicleWeight();
    }, []);

    useEffect(() => {
        if (
            CheckLoading({
                floor,
                weight,
            })
        ) {
            setLoading(false);
        }
    }, [floor, weight]);

    useEffect(() => {
        if (CheckValidation(getValues())) {
            setValidation(true);
        } else {
            setValidation(false);
        }
    }, [getValues()]);

    const showPopup = () => {
        setPopupVisible(true);
    };

    const hidePopup = () => {
        setPopupVisible(false);
    };

    const getVehicleFloor = async () => {
        try {
            const response = await axios.get(SERVER + "/admin/vehicle/floor");

            const {
                data: {
                    data: { vehicleFloor },
                },
            } = response;
            console.log("getvehicle floor : ", vehicleFloor);

            if (vehicleFloor.length === 0) {
                setFloor([
                    "5층 이하",
                    "6~10층",
                    "11~15층",
                    "16~20층",
                    "21~25층",
                    "26층 이상",
                ]);
            } else {
                const floordata = [];

                vehicleFloor.map((value) => {
                    floordata.push(value.floor);
                });

                setFloor(floordata);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getVehicleWeight = async () => {
        try {
            const response = await axios.get(SERVER + "/admin/vehicle/weight");

            const {
                data: {
                    data: { vehicleWeight },
                },
            } = response;
            console.log("getvehicle weight : ", vehicleWeight);

            if (vehicleWeight.length === 0) {
                setWeight(["1t", "2.5t", "3.5t", "5t", "17t", "19.5t"]);
            } else {
                const weightData = [];

                vehicleWeight.map((value) => {
                    weightData.push(value.weight);
                });

                setWeight(weightData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onNext = (data) => {
        const { vehicleType, vehicleNumber, option } = data;

        let vehicle = {};

        if (data.skip) {
            vehicle = null;
        } else {
            vehicle.type = vehicleType;
            vehicle.number = vehicleNumber;
            if (vehicleType === 1) {
                vehicle.floor = option;
                vehicle.weight = null;
            } else {
                vehicle.floor = null;
                vehicle.weight = option;
            }
        }

        setInfo({ ...info, vehicle });

        const curNavIndex =
            SIGNUP_NAV[info.userType].indexOf("RegisterVehicle");
        navigation.navigate(SIGNUP_NAV[info.userType][curNavIndex + 1]);
    };

    const registVehicle = async (data) => {
        console.log(data);

        const { vehicleType, vehicleNumber, option } = data;

        let vehicle = {};

        vehicle.type = vehicleType;
        vehicle.number = vehicleNumber;
        if (vehicleType === 1) {
            vehicle.floor = option;
            vehicle.weight = null;
        } else {
            vehicle.floor = null;
            vehicle.weight = option;
        }

        try {
            const response = await axios.post(
                SERVER + "/users/setting/vehicle",
                {
                    vehicle: [vehicle],
                },
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
                        data: { user },
                    },
                } = response;

                setInfo(user);
                navigation.goBack();
            }
        } catch (error) {
            console.log(error);
            navigation.goBack();
            showErrorMessage("차량 정보 등록에 실패하였습니다.");
        }
    };

    const Title = ({ children }) => (
        <RegularText
            style={{
                fontSize: 17,
                marginBottom: 5,
            }}
        >
            {children}
        </RegularText>
    );
    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <AuthLayout
                    bottomButtonProps={{
                        title: settingMode ? "등록하기" : "다음으로",
                        onPress: settingMode
                            ? handleSubmit(registVehicle)
                            : handleSubmit(onNext),
                        disabled: !validation,
                    }}
                >
                    <Container>
                        <Wrapper>
                            <Item>
                                <Title>차량 종류</Title>
                                <RadioContainer>
                                    {vehicleType.map((value, index) => (
                                        <Radio
                                            key={index}
                                            value={value}
                                            selected={
                                                watch("vehicleType") ===
                                                index + 1
                                            }
                                            onSelect={() =>
                                                setValue(
                                                    "vehicleType",
                                                    index + 1
                                                )
                                            }
                                        />
                                    ))}
                                </RadioContainer>
                            </Item>
                            {watch("vehicleType") !== 1 ? (
                                <Item>
                                    <Title>차량 옵션</Title>
                                    <RadioContainer>
                                        {weight.map((value, index) => (
                                            <Radio
                                                key={index}
                                                value={value}
                                                selected={
                                                    watch("option") ===
                                                    index + 1
                                                }
                                                onSelect={() =>
                                                    setValue(
                                                        "option",
                                                        index + 1
                                                    )
                                                }
                                            />
                                        ))}
                                    </RadioContainer>
                                </Item>
                            ) : (
                                <Item>
                                    <Title>최대 작업 층수</Title>
                                    <RadioContainer>
                                        {floor.map((value, index) => (
                                            <Radio
                                                key={index}
                                                value={value}
                                                selected={
                                                    watch("option") ===
                                                    index + 1
                                                }
                                                onSelect={() =>
                                                    setValue(
                                                        "option",
                                                        index + 1
                                                    )
                                                }
                                            />
                                        ))}
                                    </RadioContainer>
                                </Item>
                            )}

                            <Item>
                                <Title>차량번호</Title>
                                <TextInput
                                    placeholder="12가1234"
                                    returnKeyType="done"
                                    value={watch("vehicleNumber")}
                                    onChangeText={(text) =>
                                        setValue("vehicleNumber", text)
                                    }
                                    onReset={() =>
                                        setValue("vehicleNumber", "")
                                    }
                                />
                            </Item>
                        </Wrapper>
                        {settingMode ? null : (
                            <SkipButton onPress={showPopup}>
                                <RegularText
                                    style={{
                                        fontSize: 16,
                                        color: color["page-color-text"],
                                        textDecorationLine: "underline",
                                    }}
                                >
                                    다음에 할게요
                                </RegularText>
                            </SkipButton>
                        )}
                    </Container>
                    <Popup
                        visible={popupVisible}
                        onTouchOutside={hidePopup}
                        onClick={() => onNext({ skip: true })}
                    >
                        <PopupContainer>
                            <RegularText
                                style={{
                                    fontSize: 19,
                                    lineHeight: 20,
                                    textAlign: "center",
                                }}
                            >
                                차량 번호가 있어야{"\n"}작업이 가능합니다.{"\n"}
                                {"\n"}정확한 정보 입력 후에{"\n"}알테구 서비스를
                                {"\n"}이용해 보세요.
                            </RegularText>
                        </PopupContainer>
                    </Popup>
                </AuthLayout>
            )}
        </>
    );
}

export default RegisterVehicle;
