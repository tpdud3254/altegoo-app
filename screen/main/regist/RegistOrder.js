import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import RegistContext from "../../../context/RegistContext";
import {
    DIRECTION,
    REGIST_NAV,
    SERVER,
    VALID,
    VEHICLE,
    VOLUME,
} from "../../../constant";
import Layout from "../../../component/layout/Layout";
import { Image, View } from "react-native";
import RegularText from "../../../component/text/RegularText";
import SelectBox from "../../../component/selectBox/SelectBox";
import UserContext from "../../../context/UserContext";
import { PopupWithButtons } from "../../../component/popup/PopupWithButtons";
import { Box } from "../../../component/box/Box";
import {
    CheckValidation,
    numberWithComma,
    showError,
    showMessage,
} from "../../../utils";
import * as Linking from "expo-linking";
import axios from "axios";
import LoadingLayout from "../../../component/layout/LoadingLayout";

const Item = styled.View`
    margin-bottom: 35px;
    padding-bottom: ${(props) => (props.bottomSpace ? props.bottomSpace : 0)}px;
`;
const Wrapper = styled.View``;
const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const OptionContainer = styled.TouchableOpacity`
    width: ${(props) => (props.width ? props.width : "100%")};
    height: 75px;
    padding: ${(props) => (!props.width ? "0px" : "0px 15px")};
    align-items: center;
    flex-direction: row;
    justify-content: center;
    border-radius: 15px;
    background-color: ${(props) =>
        props.selected
            ? color["option-selected-background"]
            : color["option-unselected-background"]};
    border: 1px
        ${(props) =>
            props.selected
                ? color["option-selected-border"]
                : color["option-unselected-border"]};
`;
const OptionTitle = styled.View`
    width: 80%;
    padding: 0px 15px;
`;

const DIRECTION_IMAGE = [
    {
        on: require(`../../../assets/images/icons/icon_lift_down_ON.png`),
        off: require(`../../../assets/images/icons/icon_lift_down_OFF.png`),
    },
    {
        on: require(`../../../assets/images/icons/icon_lift_up_ON.png`),
        off: require(`../../../assets/images/icons/icon_lift_up_OFF.png`),
    },
    {
        on: require(`../../../assets/images/icons/icon_lift_both_ON.png`),
        off: require(`../../../assets/images/icons/icon_lift_both_OFF.png`),
    },
];

function RegistOrder({ navigation }) {
    const { info } = useContext(UserContext);
    const { setRegistInfo } = useContext(RegistContext);

    const [loading, setLoading] = useState(true);

    const [ladderQuantityOptions, setLadderQuantityOptions] = useState([]);
    const [ladderQuantityFloor, setLadderQuantityFloor] = useState([]);
    const [ladderQuantityTable, setLadderQuantityTable] = useState([]);

    const [ladderTimeOptions, setLadderTimeOptions] = useState([[]]);
    const [ladderTimeFloor, setLadderTimeFloor] = useState([]);
    const [ladderTimeTable, setLadderTimeTable] = useState([]);

    const [skyTimeOptions, setSkyTimeOptions] = useState([]);
    const [skyTimeWeight, setSkyTimeWeight] = useState([]);
    const [skyTimeTable, setSkyTimeTable] = useState([]);

    const [vehicleType, setVehicleType] = useState(1);
    const [direction, setDirection] = useState(1);
    const [floor, setFloor] = useState(0);
    const [downFloor, setDownFloor] = useState(0);
    const [upFloor, setUpFloor] = useState(0);
    const [volume, setVolume] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [time, setTime] = useState(0);

    const [validation, setValidation] = useState(false);

    const [price, setPrice] = useState(0);
    const [consultation, setConsultation] = useState(false);

    const [isPopupShown, setIsPopupShown] = useState(false);

    useEffect(() => {
        getAllPrice();
    }, []);

    useEffect(() => {
        if (
            ladderQuantityTable.length > 0 &&
            ladderQuantityOptions.length > 0 &&
            ladderTimeTable.length > 0 &&
            ladderTimeOptions.length > 0 &&
            skyTimeTable.length > 0 &&
            skyTimeOptions.length > 0 &&
            skyTimeWeight.length > 0
        )
            setLoading(false);
        else setLoading(true);
    }, [
        ladderQuantityTable,
        ladderQuantityOptions,
        ladderTimeTable,
        ladderTimeOptions,
        skyTimeTable,
        skyTimeOptions,
        skyTimeWeight,
    ]);

    useEffect(() => {
        if (vehicleType === 2 && floor > 14 && time === 1) {
            showMessage("1시간 작업은 2층 ~ 14층 사이만 가능합니다.");
        }
    }, [vehicleType, floor, time]);

    useEffect(() => {
        //유효성 검사
        const check = {
            vehicleType,
            ...(vehicleType === 1 && {
                direction,
                ...((direction === 1 || direction === 2) && { floor }),
                ...(direction === 3 && { downFloor, upFloor }),
                volume,
                ...(volume === 1 && { quantity }),
                ...(volume === 2 && { time }),
            }),
            ...(vehicleType === 2 && { floor, time }),
        };

        if (CheckValidation(check)) {
            setValidation(true);

            //금액 책정
            let calc = 0;
            setConsultation(false);

            if (vehicleType === 1) {
                if (direction === 1 || direction === 2) {
                    let ladderPrice = 0;

                    if (volume === 1)
                        ladderPrice =
                            ladderQuantityTable[quantity - 1][floor - 2];
                    else ladderPrice = ladderTimeTable[time - 1][floor - 2];

                    if (ladderPrice === 0) setConsultation(true);
                    else calc = calc + ladderPrice;
                } else if (direction === 3) {
                    let ladderPrice1 = 0;

                    if (volume === 1)
                        ladderPrice1 =
                            ladderQuantityTable[quantity - 1][downFloor - 2];
                    else
                        ladderPrice1 = ladderTimeTable[time - 1][downFloor - 2];

                    if (ladderPrice1 === 0) setConsultation(true);
                    else calc = calc + ladderPrice1;

                    let ladderPrice2 = 0;

                    if (volume === 1)
                        ladderPrice2 =
                            ladderQuantityTable[quantity - 1][upFloor - 2];
                    else ladderPrice2 = ladderTimeTable[time - 1][upFloor - 2];

                    if (ladderPrice2 === 0) setConsultation(true);
                    else calc = calc + ladderPrice2;
                }
            } else if (vehicleType === 2) {
                let skyPrice = 0;

                if (floor <= 5) skyPrice = skyTimeTable[time - 1][floor - 1];
                else skyPrice = skyTimeTable[time + 2][floor - 1];

                if (skyPrice === 0) setConsultation(true);
                else calc = calc + skyPrice;
            }

            setPrice(calc);
        } else {
            setValidation(false);
        }
    }, [
        vehicleType,
        direction,
        floor,
        downFloor,
        upFloor,
        volume,
        quantity,
        time,
    ]);

    const getAllPrice = async () => {
        try {
            const response = await axios.get(SERVER + "/admin/price/order", {
                headers: {
                    "ngrok-skip-browser-warning": true,
                },
                params: {
                    type: "all",
                },
            });
            const {
                data: {
                    result,
                    data: { priceTable },
                },
            } = response;

            if (result === VALID) {
                saveLadderQuantityTable(
                    priceTable.ladderQuantity.options,
                    priceTable.ladderQuantity.datas
                );
                saveLadderTimeTable(
                    priceTable.ladderTime.options,
                    priceTable.ladderTime.datas
                );
                saveSkyTimeTable(
                    priceTable.skyTime.options,
                    priceTable.skyTime.weight,
                    priceTable.skyTime.datas
                );
            } else {
                console.log("getAllPrice invalid");
            }
        } catch (error) {
            console.log("getAllPrice error : ", error);
        }
    };

    const saveLadderQuantityTable = (options, data) => {
        const newArr = [];
        const optionsArr = [];
        const floorArr = [];

        options.map((value) => {
            optionsArr.push(value.title);
        });

        let curOptionIndex = 1;
        let arr = [];

        data.map((value, index) => {
            if (value.optionId > curOptionIndex) {
                newArr.push(arr);
                curOptionIndex = curOptionIndex + 1;
                arr = [];
            } else if (
                value.optionId === optionsArr.length &&
                curOptionIndex === optionsArr.length &&
                index === data.length - 1
            ) {
                newArr.push(arr);
            }
            arr.push(value.price);
        });

        const resultArr = [];

        for (let x = 0; x < optionsArr.length; x++) {
            resultArr[x] = [];
            for (let y = 0; y < newArr[0].length; y++) {
                resultArr[x].push(newArr[x][y]);
                if (x === 0)
                    floorArr.push(
                        y +
                            2 +
                            "층" +
                            (y === newArr[0].length - 1 ? " 이상" : "")
                    );
            }
        }

        setLadderQuantityOptions(optionsArr);
        setLadderQuantityFloor(floorArr);
        setLadderQuantityTable(resultArr);
    };

    const saveLadderTimeTable = (options, data) => {
        const newArr = [];
        const optionsArr = [];
        const floorArr = [];

        options.map((value) => {
            optionsArr.push(value.title);
        });

        let curOptionIndex = 1;
        let arr = [];

        data.map((value, index) => {
            if (value.optionId > curOptionIndex) {
                newArr.push(arr);
                curOptionIndex = curOptionIndex + 1;
                arr = [];
            } else if (
                value.optionId === optionsArr.length &&
                curOptionIndex === optionsArr.length &&
                index === data.length - 1
            ) {
                newArr.push(arr);
            }
            arr.push(value.price);
        });

        const resultArr = [];
        for (let x = 0; x < optionsArr.length; x++) {
            resultArr[x] = [];
            for (let y = 0; y < newArr[0].length; y++) {
                resultArr[x].push(newArr[x][y]);
                if (x === 0)
                    floorArr.push(
                        y +
                            2 +
                            "층" +
                            (y === newArr[0].length - 1 ? " 이상" : "")
                    );
            }
        }

        setLadderTimeOptions(optionsArr);
        setLadderTimeFloor(floorArr);
        setLadderTimeTable(resultArr);
    };

    const saveSkyTimeTable = (options, weight, data) => {
        const newArr = [];
        const optionsArr = [];
        const weightArr = [];

        options.map((value) => {
            optionsArr.push(value.title);
        });

        weight.map((value) => {
            weightArr.push(value.weightTitle);
        });

        let curOptionIndex = 1;
        let arr = [];

        data.map((value, index) => {
            if (value.optionId > curOptionIndex) {
                newArr.push(arr);
                curOptionIndex = curOptionIndex + 1;
                arr = [];
            } else if (
                value.optionId === optionsArr.length &&
                curOptionIndex === optionsArr.length &&
                index === data.length - 1
            ) {
                newArr.push(arr);
            }
            arr.push(value.price);
        });

        const resultArr = [];
        for (let x = 0; x < optionsArr.length; x++) {
            resultArr[x] = [];
            for (let y = 0; y < newArr[0].length; y++) {
                resultArr[x].push(newArr[x][y]);
            }
        }

        setSkyTimeOptions([optionsArr.slice(3, optionsArr.length), optionsArr]);
        setSkyTimeWeight(weightArr);
        setSkyTimeTable(resultArr);
    };

    const cancelConsultation = () => {
        setIsPopupShown(false);
    };

    const startConsultation = () => {
        setIsPopupShown(true);
    };

    const onNextStep = () => {
        if (consultation) {
            startConsultation();
            return;
        }

        if (vehicleType === 2 && floor > 14 && time === 1) {
            showMessage("1시간 작업은 2층 ~ 14층 사이만 가능합니다.");
            return;
        }

        const data = {
            price,
            vehicleType: VEHICLE[vehicleType - 1],
            ...(vehicleType === 1 && {
                direction: DIRECTION[direction - 1],
                ...((direction === 1 || direction === 2) && {
                    floor: floor > 24 ? "25층 이상" : floor + "층",
                }),
                ...(direction === 3 && {
                    downFloor: downFloor > 25 ? "26층 이상" : downFloor + "층",
                    upFloor: upFloor > 25 ? "26층 이상" : upFloor + "층",
                }),
                volume: VOLUME[volume - 1],
                ...(volume === 1 && {
                    quantity: ladderQuantityOptions[quantity - 1],
                }),
                ...(volume === 2 && { time: ladderTimeOptions[time - 1] }),
            }),
            ...(vehicleType === 2 && {
                floor: skyTimeWeight[floor - 1],
                volume: VOLUME[1],
                time:
                    floor === 6
                        ? skyTimeOptions[0][time - 1]
                        : skyTimeOptions[1][time - 1],
            }),
        };

        setRegistInfo(data);

        navigation.navigate(REGIST_NAV[1]);
    };

    const selectVehicleType = (index) => {
        setDirection(1);
        setFloor(0);
        setDownFloor(0);
        setUpFloor(0);
        setVolume(0);
        setQuantity(0);
        setTime(0);

        setVehicleType(index);
    };

    const selectDirection = (index) => {
        const prev = direction;

        if ((prev !== 3 && index === 3) || (prev === 3 && index !== 3)) {
            console.log("dd");
            setFloor(0);
            setDownFloor(0);
            setUpFloor(0);
            setVolume(0);
            setQuantity(0);
            setTime(0);
        }
        setDirection(index);
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
                style={{ width: 24, height: 24, marginRight: 10 }}
            />
        );
    };

    const ItemTitle = ({ title }) => {
        return (
            <RegularText style={{ fontSize: 20, marginBottom: 15 }}>
                {title}
            </RegularText>
        );
    };

    const Option = ({ selected, width, children, onPress }) => {
        let radio = require(`../../../assets/images/icons/Radio_ON.png`);

        if (!selected)
            radio = require(`../../../assets/images/icons/Radio_OFF.png`);

        return (
            <OptionContainer
                selected={selected}
                width={width}
                onPress={onPress}
            >
                <Image
                    source={radio}
                    resizeMode="contain"
                    style={{ width: 25 }}
                />
                <OptionTitle>{children}</OptionTitle>
            </OptionContainer>
        );
    };

    const goToKakaoChat = async () => {
        axios
            .get(SERVER + "/admin/kakao")
            .then(({ data }) => {
                const {
                    data: { url },
                    result,
                } = data;

                if (result === VALID) {
                    if (url) {
                        console.log(data);
                        Linking.openURL(url);
                    } else {
                        showMessage("해당 기능은 추후에 제공 예정입니다.");
                        cancelConsultation();
                    }
                } else {
                    showMessage("해당 기능은 추후에 제공 예정입니다.");
                    cancelConsultation();
                }
            })
            .catch((error) => {
                showError(error);
                cancelConsultation();
            })
            .finally(() => {});
    };
    return (
        <>
            {!loading ? (
                <Layout
                    kakaoBtnShown={true}
                    bottomButtonProps={{
                        onPress: onNextStep,
                        title: consultation
                            ? "예상 운임 협의"
                            : `예상 운임 ${numberWithComma(price)}P 확인`,
                        disabled: !validation,
                    }}
                >
                    <Item>
                        <ItemTitle title="1. 작업 종류를 선택하세요." />
                        <Wrapper>
                            <Row>
                                {VEHICLE.map((value, index) => (
                                    <Option
                                        key={index}
                                        width="48%"
                                        selected={index + 1 === vehicleType}
                                        onPress={() =>
                                            selectVehicleType(index + 1)
                                        }
                                    >
                                        <MediumText
                                            style={{
                                                color:
                                                    index + 1 === vehicleType
                                                        ? color.main
                                                        : color[
                                                              "page-black-text"
                                                          ],
                                                textAlign: "center",
                                            }}
                                        >
                                            {value}
                                        </MediumText>
                                    </Option>
                                ))}
                            </Row>
                        </Wrapper>
                    </Item>
                    {vehicleType === 1 ? (
                        <>
                            <Item>
                                <ItemTitle title="2. 작업 형태를 선택하세요." />
                                <Wrapper>
                                    {DIRECTION.map((value, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                marginBottom:
                                                    index + 1 ===
                                                    DIRECTION.length
                                                        ? 0
                                                        : 13,
                                            }}
                                        >
                                            <Option
                                                selected={
                                                    index + 1 === direction
                                                }
                                                onPress={() =>
                                                    selectDirection(index + 1)
                                                }
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <MediumText
                                                        style={{
                                                            color:
                                                                index + 1 ===
                                                                direction
                                                                    ? color.main
                                                                    : color[
                                                                          "page-black-text"
                                                                      ],
                                                        }}
                                                    >
                                                        {value}
                                                    </MediumText>
                                                    <Image
                                                        source={
                                                            index + 1 ===
                                                            direction
                                                                ? DIRECTION_IMAGE[
                                                                      index
                                                                  ].on
                                                                : DIRECTION_IMAGE[
                                                                      index
                                                                  ].off
                                                        }
                                                        style={{
                                                            width: 13,
                                                            height: 20,
                                                            marginLeft: 8,
                                                        }}
                                                    />
                                                </View>
                                            </Option>
                                        </View>
                                    ))}
                                </Wrapper>
                            </Item>
                            <Item>
                                <ItemTitle title="3. 작업 물량 또는 시간을 선택하세요." />
                                <Wrapper>
                                    <Row>
                                        <SelectBox
                                            width="25%"
                                            placeholder="선택"
                                            data={VOLUME}
                                            onSelect={(index) =>
                                                setVolume(index + 1)
                                            }
                                            selectedIndex={volume - 1}
                                        />
                                        <SelectBox
                                            width="71%"
                                            placeholder={
                                                volume !== 0
                                                    ? `${
                                                          VOLUME[volume - 1]
                                                      } 선택`
                                                    : "물량 또는 시간을 선택하세요."
                                            }
                                            data={
                                                volume === 1
                                                    ? ladderQuantityOptions
                                                    : volume === 2
                                                    ? ladderTimeOptions
                                                    : []
                                            }
                                            onSelect={(index) =>
                                                volume === 1
                                                    ? setQuantity(index + 1)
                                                    : volume === 2
                                                    ? setTime(index + 1)
                                                    : null
                                            }
                                            selectedIndex={
                                                volume === 1
                                                    ? quantity - 1
                                                    : volume === 2
                                                    ? time - 1
                                                    : -1
                                            }
                                        />
                                    </Row>
                                </Wrapper>
                            </Item>
                            <Item bottomSpace="40">
                                <ItemTitle title="4. 작업 높이를 선택하세요." />
                                {direction !== 3 ? (
                                    <Wrapper>
                                        <SelectBox
                                            placeholder="층 수 선택"
                                            data={
                                                !volume
                                                    ? []
                                                    : volume === 1
                                                    ? ladderQuantityFloor
                                                    : ladderTimeFloor
                                            }
                                            onSelect={(index) =>
                                                setFloor(index + 2)
                                            }
                                        />
                                    </Wrapper>
                                ) : (
                                    <Wrapper>
                                        <View style={{ marginBottom: 20 }}>
                                            <Row>
                                                <Box text="내림" />
                                                <SelectBox
                                                    width="71%"
                                                    placeholder="층 수 선택"
                                                    data={
                                                        !volume
                                                            ? []
                                                            : volume === 1
                                                            ? ladderQuantityFloor
                                                            : ladderTimeFloor
                                                    }
                                                    onSelect={(index) =>
                                                        setDownFloor(index + 2)
                                                    }
                                                />
                                            </Row>
                                        </View>
                                        <Row>
                                            <Box text="올림" />
                                            <SelectBox
                                                width="71%"
                                                placeholder="층 수 선택"
                                                data={
                                                    !volume
                                                        ? []
                                                        : volume === 1
                                                        ? ladderQuantityFloor
                                                        : ladderTimeFloor
                                                }
                                                onSelect={(index) =>
                                                    setUpFloor(index + 2)
                                                }
                                            />
                                        </Row>
                                    </Wrapper>
                                )}
                            </Item>
                        </>
                    ) : (
                        <>
                            <Item>
                                <ItemTitle title="2. 작업 높이(톤 수)를 선택하세요" />
                                <Wrapper>
                                    <SelectBox
                                        placeholder="작업 높이 선택"
                                        data={skyTimeWeight}
                                        onSelect={(index) =>
                                            setFloor(index + 1)
                                        }
                                    />
                                </Wrapper>
                            </Item>
                            <Item>
                                <ItemTitle title="3. 작업 시간을 선택하세요." />
                                <Wrapper>
                                    <Row>
                                        <SelectBox
                                            placeholder="시간 선택"
                                            data={
                                                floor
                                                    ? floor <= 5
                                                        ? skyTimeOptions[1]
                                                        : skyTimeOptions[0]
                                                    : []
                                            }
                                            onSelect={(index) =>
                                                setTime(index + 1)
                                            }
                                        />
                                    </Row>
                                </Wrapper>
                            </Item>
                        </>
                    )}
                    {/* <PopupWithButtons
                visible={isPopupShown}
                onTouchOutside={cancelLastOrder}
                onClick={getLastOrder}
            >
                <RegularText
                    style={{
                        fontSize: 20,
                        textAlign: "center",
                        lineHeight: 30,
                        paddingTop: 15,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 25,
                    }}
                >
                    지난 번에 진행했던{"\n"}내용을 불러옵니다.
                </RegularText>
            </PopupWithButtons> */}
                    <PopupWithButtons
                        visible={isPopupShown}
                        onTouchOutside={cancelConsultation}
                        onClick={goToKakaoChat}
                    >
                        <RegularText
                            style={{
                                fontSize: 20,
                                textAlign: "center",
                                lineHeight: 30,
                                paddingTop: 15,
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingBottom: 25,
                            }}
                        >
                            예상 운임 협의일 경우 카카오톡 채널을 통해서 진행
                            가능합니다.{"\n"}카카오톡 채널로 이동하시겠습니까?
                        </RegularText>
                    </PopupWithButtons>
                </Layout>
            ) : (
                <LoadingLayout />
            )}
        </>
    );
}

export default RegistOrder;
