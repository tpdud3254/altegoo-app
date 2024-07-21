import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../styles";
import { SERVER, SIGNUP_NAV, VALID } from "../../../constant";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import { Image, View } from "react-native";
import { getAsyncStorageToken, showErrorMessage } from "../../../utils";
import axios from "axios";

const Container = styled.View``;
const Table = styled.View`
    width: 100%;
    margin-top: 10px;
    border-top-width: 1px;
    border-top-color: ${color["input-border"]};
    border-bottom-width: 1px;
    border-bottom-color: ${color["input-border"]};
`;
const Row = styled.View`
    width: 100%;
    flex-direction: row;
`;
const Area = styled.View`
    width: 20%;
    background-color: ${color["box-color-background"]};
    border-bottom-width: ${(props) => (props.lastIndex ? 0 : 1)}px;
    border-bottom-color: ${color["input-border"]};
    justify-content: center;
    padding-left: 3px;
`;
const AreaDetail = styled.View`
    width: 75%;
    border-bottom-width: ${(props) => (props.lastIndex ? 0 : 1)}px;
    border-bottom-color: ${color["input-border"]};
`;

const AreaDetailText = styled.View`
    padding-top: 18px;
    padding-bottom: 18px;
    border-bottom-width: ${(props) => (props.lastIndex ? 0 : 1)}px;
    border-bottom-color: ${color["input-border"]};
`;
const Space = styled.View`
    width: 5%;
`;

const AreaButton = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
`;
const areaObj = {
    서울: ["서울 전체", "서울 북구", "서울 남구"],
    경기: [
        "경기 전체",
        "경기 북서부",
        "경기 북동부",
        "경기 남서부",
        "경기 남동부",
    ],
    인천: ["인천광역시"],
    대전: ["대전광역시"],
    울산: ["울산광역시"],
    광주: ["광주광역시"],
    부산: ["부산광역시"],
    강원도: ["강원도"],
    경상: ["경상남북도"],
    충청: ["충청남북도"],
    전라: ["전라남북도"],
    세종: ["세종특별자치시"],
    제주: ["제주특별자치도"],
};

const areaDetailObj = {
    서울: [
        "",
        "은평구 / 도봉구 / 강북구 /\n노원구 / 성북구 / 중랑구 /\n동대문구 / 종로구 / 서대문구 /\n마포구 / 용산구 / 중구 /\n성동구 / 광진구",
        "강서구 / 양천구 / 구로구 /\n영등포구 / 금천구 / 동작구 /\n관악구 / 서초구 / 강남구 /\n송파구 / 강동구",
    ],
    경기: [
        "",
        "김포시 / 부천시 / 파주시 /\n고양시 / 동두천시 / 연천군",
        "의정부시 / 양주시 / 구리시 /\n남양주시 / 포천시 / 가평군",
        "광명시 / 시흥시 / 안산시 /\n안양시 / 과천시 / 의왕시 /\n군포시 / 수원시 / 오산시 /\n화성시 / 평택시",
        "성남시 / 하남시 / 광주시 /\n용인시 / 안성시 / 이천시 /\n여주시 / 양평군",
    ],
    인천: ["", "미추홀구 / 동구 / 연수구 /\n남동구 / 부평구 / 계양구 /\n서구"],
    대전: ["유성구 / 대덕구 / 서구 /\n중구 / 동구"],
    대구: ["달성군 / 달서구 / 수성구 /\n북구 / 동구 / 서구 / 중구/ 남구"],
    울산: ["남구 / 동구 / 북구 /\n중구 / 울주군"],
    광주: ["광산구 / 서구 / 북구 /\n동구 / 남구"],
    부산: [
        "영도구 / 부산진구 / 동래구 /\n남구 / 북구 / 해운대구 /\n사하구 / 금정구 / 강서구 /\n연제구 / 수영구 / 사상구 /\n기장군",
    ],
};

function WorkingArea({ route }) {
    const navigation = useNavigation();
    const { info, setInfo } = useContext(UserContext);
    const [selected, setSelected] = useState([]);

    const [settingMode, setSettingMode] = useState(false);

    useEffect(() => {
        if (route?.params?.modify) setSettingMode(true);
        console.log(info);
    }, []);

    const onNext = async () => {
        if (selected.length < 1) {
            showErrorMessage("작업 지역을 선택해주세요.");
            return;
        }
        /* 
        서울시 => 1 => [0, 0]
        인천시 => 2 => [2, 0]
        경기 북서부 => 3 => [1, 1]
        경기 북동부 => 4 => [1, 2]
        경기 남서부 => 5 => [1, 3]
        경기 남동부 => 6 => [1, 4]
        그 외 지역 => 7 => [3, 0]
        */

        const workRegion = [];

        selected.map((element) => {
            if (element[0] === 0 && element[1] === 0) {
                workRegion.push(1);
            } else if (element[0] === 1) {
                if (element[1] === 0) {
                    workRegion.push(3, 4, 5, 6);
                } else {
                    workRegion.push(element[1] + 2);
                }
            } else if (element[0] === 2 && element[1] === 0) {
                workRegion.push(2);
            } else if (element[0] === 3 && element[1] === 0) {
                workRegion.push(7);
            }
        });

        if (settingMode) {
            try {
                const response = await axios.post(
                    SERVER + "/users/setting/region",
                    {
                        region: workRegion,
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
            return;
        }

        setInfo({ ...info, workRegion });

        const curNavIndex = SIGNUP_NAV[info.userType].indexOf("WorkingArea");
        navigation.navigate(SIGNUP_NAV[info.userType][curNavIndex + 1]);
    };

    const isExist = (cur) =>
        selected.find(
            (element) => element[0] === cur[0] && element[1] === cur[1]
        );

    const select = (areaIndex, detailIndex) => {
        const cur = [areaIndex, detailIndex];

        if (isExist(cur)) {
            const remove = selected.filter(
                (element) => !(element[0] === cur[0] && element[1] === cur[1])
            );

            //경기 전체 > 리스트에서 없앨 경우 나머지 경기 지역들 없애기
            if (areaIndex === 1 && detailIndex === 0) {
                const result = remove.filter(
                    (element) =>
                        !(
                            element[0] === areaIndex &&
                            (element[1] === 1 ||
                                element[1] === 2 ||
                                element[1] === 3 ||
                                element[1] === 4)
                        )
                );
                setSelected(result);
                return;
            }

            //경기 전체 선택 상황에서 나머지 경기 지역을 리스트에서 없앨 경우 경제 전체 체크 해제
            if (areaIndex === 1 && detailIndex !== 0) {
                const result = remove.filter(
                    (element) => !(element[0] === 1 && element[1] === 0)
                );
                setSelected(result);
                return;
            }

            setSelected(remove);
            return;
        }

        const prev = selected;

        //경기 전체 > 리스트에서 추가할 경우 나머지 경기 지역들 추가하기
        if (areaIndex === 1 && detailIndex === 0) {
            const result = [
                [1, 1],
                [1, 2],
                [1, 3],
                [1, 4],
            ];
            setSelected([...prev, cur, ...result]);
            return;
        }

        //경기 지역들 모두 선택 시 경기 전체도 추가하기
        if (areaIndex === 1 && detailIndex !== 0) {
            const tempSelected = [...prev, cur];
            const check = [];
            tempSelected.map((element) => {
                if (
                    element[0] === 1 &&
                    (element[1] === 1 ||
                        element[1] === 2 ||
                        element[1] === 3 ||
                        element[1] === 4)
                )
                    check.push(true);
            });

            if (check.length === 4) {
                const result = [1, 0];

                setSelected([...tempSelected, result]);
                return;
            }
        }

        setSelected([...prev, cur]);
    };

    console.log("seleted : ", selected);

    return (
        <AuthLayout
            bottomButtonProps={{
                title: settingMode ? "등록하기" : "다음으로",
                onPress: onNext,
            }}
        >
            <Container>
                <RegularText>지역을 선택하세요.</RegularText>
                <Table>
                    {Object.keys(areaObj).map((area, areaIndex) => (
                        <Row key={areaIndex}>
                            <Area
                                lastIndex={
                                    areaIndex ===
                                    Object.keys(areaObj).length - 1
                                }
                            >
                                <RegularText style={{ textAlign: "center" }}>
                                    {area}
                                </RegularText>
                            </Area>
                            <Space />
                            <AreaDetail
                                lastIndex={
                                    areaIndex ===
                                    Object.keys(areaObj).length - 1
                                }
                            >
                                {areaObj[area].map((detail, detailIndex) => (
                                    <AreaDetailText
                                        key={detailIndex}
                                        lastIndex={
                                            detailIndex ===
                                            areaObj[area].length - 1
                                        }
                                    >
                                        <AreaButton
                                            onPress={() =>
                                                select(areaIndex, detailIndex)
                                            }
                                        >
                                            <View>
                                                <RegularText
                                                    style={{
                                                        color: isExist([
                                                            areaIndex,
                                                            detailIndex,
                                                        ])
                                                            ? color[
                                                                  "page-color-text"
                                                              ]
                                                            : color[
                                                                  "page-black-text"
                                                              ],
                                                    }}
                                                >
                                                    {detail}
                                                </RegularText>
                                                {areaDetailObj[area] &&
                                                detailIndex >= 0 ? (
                                                    areaDetailObj[area][
                                                        detailIndex
                                                    ].length > 0 ? (
                                                        <RegularText
                                                            style={{
                                                                color: isExist([
                                                                    areaIndex,
                                                                    detailIndex,
                                                                ])
                                                                    ? color[
                                                                          "page-black-text"
                                                                      ]
                                                                    : color[
                                                                          "page-grey-text"
                                                                      ],
                                                            }}
                                                        >
                                                            {
                                                                areaDetailObj[
                                                                    area
                                                                ][detailIndex]
                                                            }
                                                        </RegularText>
                                                    ) : null
                                                ) : null}
                                            </View>
                                            <Image
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                }}
                                                source={
                                                    isExist([
                                                        areaIndex,
                                                        detailIndex,
                                                    ])
                                                        ? require("../../../assets/images/icons/check_circle_ON.png")
                                                        : require("../../../assets/images/icons/check_circle_OFF.png")
                                                }
                                            />
                                        </AreaButton>
                                    </AreaDetailText>
                                ))}
                            </AreaDetail>
                        </Row>
                    ))}
                </Table>
            </Container>
        </AuthLayout>
    );
}

export default WorkingArea;
