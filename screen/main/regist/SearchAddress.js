import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import RegistContext from "../../../context/RegistContext";
import { color } from "../../../styles";
import { DIRECTION, REGIST_NAV } from "../../../constant";
import Layout from "../../../component/layout/Layout";
import { OptionScroll } from "../../../component/OptionScroll";
import RegularText from "../../../component/text/RegularText";
import TextInput from "../../../component/input/TextInput";
import { Box } from "../../../component/box/Box";
import { KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { GetOrderOption, reset, showErrorMessage } from "../../../utils";
import axios from "axios";

const Item = styled.View`
    margin-bottom: 35px;
`;
const Wrapper = styled.View``;

function SearchAddress({ route, navigation }) {
    const { registInfo, setRegistInfo } = useContext(RegistContext);

    const [optionData, setOptionData] = useState([]);
    const [validation, setValidation] = useState(false);

    const { register, setValue, watch, getValues, handleSubmit } = useForm();

    useEffect(() => {
        console.log("registInfo : ", registInfo);

        register("detailAddress1");
        register("detailAddress2");

        setOptionData(GetOrderOption(registInfo));
    }, []);

    useEffect(() => {
        if (registInfo.direction === DIRECTION[2]) {
            if (
                route?.params?.selectAddress1?.address.length > 0 &&
                getValues("detailAddress1") &&
                getValues("detailAddress1").length > 0 &&
                route?.params?.selectAddress2?.address.length > 0 &&
                getValues("detailAddress2") &&
                getValues("detailAddress2").length > 0
            )
                setValidation(true);
            else setValidation(false);
        } else {
            if (
                route?.params?.selectAddress1?.address.length > 0 &&
                getValues("detailAddress1") &&
                getValues("detailAddress1").length > 0
            )
                setValidation(true);
            else setValidation(false);
        }
    }, [route, getValues()]);

    const searchAddress = (index) => {
        navigation.navigate("Address", {
            ...route?.params,
            addressIndex: index,
        });
    };

    const getRegion = (sido, sigungu) => {
        if (sido.includes("서울")) return 1;
        else if (sido.includes("인천")) return 2;
        else if (sido.includes("경기")) {
            if (
                sigungu.includes("김포") ||
                sigungu.includes("부천") ||
                sigungu.includes("파주") ||
                sigungu.includes("고양") ||
                sigungu.includes("동두천") ||
                sigungu.includes("연천")
            )
                return 3;
            else if (
                sigungu.includes("의정부") ||
                sigungu.includes("양주") ||
                sigungu.includes("구리") ||
                sigungu.includes("남양주") ||
                sigungu.includes("포천") ||
                sigungu.includes("가평")
            )
                return 4;
            else if (
                sigungu.includes("광명") ||
                sigungu.includes("시흥") ||
                sigungu.includes("안산") ||
                sigungu.includes("안양") ||
                sigungu.includes("과천") ||
                sigungu.includes("의왕") ||
                sigungu.includes("군포") ||
                sigungu.includes("수원") ||
                sigungu.includes("오산") ||
                sigungu.includes("화성") ||
                sigungu.includes("평택")
            )
                return 5;
            else if (
                sigungu.includes("성남") ||
                sigungu.includes("하남") ||
                sigungu.includes("광주") ||
                sigungu.includes("용인") ||
                sigungu.includes("안성") ||
                sigungu.includes("이천") ||
                sigungu.includes("여주") ||
                sigungu.includes("양평")
            )
                return 6;
        }

        return 7;
    };

    const onNextStep = async (data) => {
        const { detailAddress1, detailAddress2 } = data;

        const regionId = getRegion(
            route?.params?.selectAddress1?.sido,
            route?.params?.selectAddress1?.sigungu
        );

        // if (!regionId) {
        //     showErrorMessage("해당 지역은 서비스를 이용할 수 없습니다.");
        //     return;
        // }

        let latitude = null;
        let longitude = null;
        try {
            const res = await axios.get(
                `https://dapi.kakao.com/v2/local/search/address.json?query=${route?.params?.selectAddress1?.address}`,
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

            console.log("kakao map response : ", documents);

            latitude = documents[0].y;
            longitude = documents[0].x;
        } catch (error) {
            console.log(error);
            return;
        }
        if (registInfo.direction === DIRECTION[2]) {
            setRegistInfo({
                ...registInfo,
                address1: route?.params?.selectAddress1?.address,
                simpleAddress1: `${route?.params?.selectAddress1?.sido} ${route?.params?.selectAddress1?.sigungu}`,
                detailAddress1,
                address2: route?.params?.selectAddress2?.address,
                simpleAddress2: `${route?.params?.selectAddress2?.sido} ${route?.params?.selectAddress2?.sigungu}`,
                detailAddress2,
                region: regionId,
                latitude,
                longitude,
            });
        } else {
            setRegistInfo({
                ...registInfo,
                address1: route?.params?.selectAddress1?.address,
                simpleAddress1: `${route?.params?.selectAddress1?.sido} ${route?.params?.selectAddress1?.sigungu}`,
                detailAddress1,
                address2: null,
                simpleAddress2: null,
                detailAddress2: null,
                region: regionId,
                latitude,
                longitude,
            });
        }

        navigation.navigate(REGIST_NAV[3]);
    };

    const ItemTitle = ({ title }) => {
        return (
            <RegularText style={{ fontSize: 19, marginBottom: 15 }}>
                {title}
            </RegularText>
        );
    };

    return (
        <Layout
            scroll={true}
            kakaoBtnShown={true}
            bottomButtonProps={{
                onPress: handleSubmit(onNextStep),
                title: "다음으로",
                disabled: !validation,
            }}
            touchableElement={() => <OptionScroll data={optionData} />}
        >
            <KeyboardAvoidingView>
                {registInfo.direction === DIRECTION[2] ? (
                    <>
                        <Item>
                            <ItemTitle title="1. ‘내림’ 주소를 입력하세요." />
                            <Wrapper>
                                <TouchableOpacity
                                    onPress={() => searchAddress(0)}
                                    style={{ marginBottom: 15 }}
                                >
                                    <Box
                                        width="100%"
                                        text={
                                            route?.params?.selectAddress1
                                                ?.address || "내림 주소 입력"
                                        }
                                        textStyle={{
                                            color: route?.params?.selectAddress1
                                                ?.address
                                                ? color["page-dark-text"]
                                                : color["page-lightgrey-text"],
                                        }}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder="상세 주소 입력"
                                    returnKeyType="done"
                                    value={watch("detailAddress1")}
                                    onReset={() =>
                                        reset(setValue, "detailAddress1")
                                    }
                                    onChangeText={(text) =>
                                        setValue("detailAddress1", text)
                                    }
                                />
                            </Wrapper>
                        </Item>
                        <Item>
                            <ItemTitle title="2. ‘올림’ 주소 입력하기" />
                            <Wrapper>
                                <TouchableOpacity
                                    onPress={() => searchAddress(1)}
                                    style={{ marginBottom: 15 }}
                                >
                                    <Box
                                        width="100%"
                                        text={
                                            route?.params?.selectAddress2
                                                ?.address || "올림 주소 입력"
                                        }
                                        textStyle={{
                                            color: route?.params?.selectAddress2
                                                ?.address
                                                ? color["page-dark-text"]
                                                : color["page-lightgrey-text"],
                                        }}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder="상세 주소 입력"
                                    returnKeyType="done"
                                    value={watch("detailAddress2")}
                                    onReset={() =>
                                        reset(setValue, "detailAddress2")
                                    }
                                    onChangeText={(text) =>
                                        setValue("detailAddress2", text)
                                    }
                                />
                            </Wrapper>
                        </Item>
                    </>
                ) : (
                    <Item>
                        <ItemTitle
                            title={
                                registInfo.vehicleType === "스카이차"
                                    ? "1. 주소를 입력하세요."
                                    : `1. ‘${registInfo.direction}’ 주소를 입력하세요.`
                            }
                        />
                        <Wrapper>
                            <TouchableOpacity
                                onPress={() => searchAddress(0)}
                                style={{ marginBottom: 15 }}
                            >
                                <Box
                                    width="100%"
                                    text={
                                        route?.params?.selectAddress1
                                            ?.address ||
                                        (registInfo.vehicleType === "스카이차"
                                            ? "주소 입력"
                                            : `${registInfo.direction} 주소 입력`)
                                    }
                                    textStyle={{
                                        color: route?.params?.selectAddress1
                                            ?.address
                                            ? color["page-dark-text"]
                                            : color["page-lightgrey-text"],
                                    }}
                                />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="상세 주소 입력"
                                returnKeyType="done"
                                value={watch("detailAddress1")}
                                onReset={() =>
                                    reset(setValue, "detailAddress1")
                                }
                                onChangeText={(text) =>
                                    setValue("detailAddress1", text)
                                }
                            />
                        </Wrapper>
                    </Item>
                )}
            </KeyboardAvoidingView>
        </Layout>
    );
}

export default SearchAddress;
