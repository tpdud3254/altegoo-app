import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import {
    Image,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import Layout from "../../../../component/layout/Layout";
import MediumText from "../../../../component/text/MediumText";
import { Row, RowAround, RowBetween } from "../../../../component/Row";
import { shadowProps } from "../../../../component/Shadow";
import BoldText from "../../../../component/text/BoldText";
import LightText from "../../../../component/text/LightText";
import {
    CheckLoading,
    Filter,
    GetDate,
    GetDayOfWeek,
    getAsyncStorageToken,
    numberWithComma,
    numberWithZero,
    showError,
} from "../../../../utils";
import RegularText from "../../../../component/text/RegularText";
import { color } from "../../../../styles";
import SelectFilter from "../../../../component/selectBox/SelectFilter";
import axios from "axios";
import { SERVER } from "../../../../constant";
import LoadingLayout from "../../../../component/layout/LoadingLayout";

const Box = styled.View`
    background-color: white;
    padding: 25px 23px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 11px;
`;

const PERIOD = ["최근 6개월", "최근 12개월"];
const FILTER = ["전체 내역", "지급", "차감", "출금", "충전"];

function PointBreakdown() {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);

    const [breakdown, setBreakdown] = useState(-1);

    const [period, setPeriod] = useState(1);
    const [filter, setFilter] = useState(1);

    useEffect(() => {
        setBreakdown(-1);
        getBreakdown();
    }, [period, filter]);

    useEffect(() => {
        if (CheckLoading({ breakdown })) {
            setLoading(false);
        }
    }, [breakdown]);

    const getBreakdown = async () => {
        try {
            const response = await axios.get(SERVER + "/points/breakdown", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            });

            const {
                data: {
                    data: { points },
                    result,
                },
            } = response;

            console.log(points);
            if (points && points.length > 0) {
                const filterd = Filter({
                    data: points,
                    period: period === 1 ? "6개월" : "12개월",
                    orderBy: "date",
                });

                const filterdWithType = sortByType(filterd);
                const classify = getClassifyData(filterdWithType);

                console.log("classify : ", classify);
                setBreakdown(classify);
            } else setBreakdown([]);
        } catch (error) {
            console.lor(error);
            showError(error);
        }
    };

    const getClassifyData = (breakdown) => {
        const result = {};

        breakdown.map((value) => {
            const dateTime = new Date(value.date);

            const key = `${dateTime
                .getUTCFullYear()
                .toString()
                .substring(2, 4)}년 ${dateTime.getUTCMonth() + 1}월`;

            if (!result[key]) result[key] = [];

            result[key].push(value);
        });

        return result;
    };

    const sortByType = (breakdown) => {
        if (filter === 1) return breakdown;

        const newList = [];

        breakdown.map((value) => {
            if (value.type === FILTER[filter - 1]) newList.push(value);
        });

        return newList;
    };

    const Title = ({ children }) => (
        <BoldText style={{ fontSize: 26, marginBottom: 30 }}>
            {children}
        </BoldText>
    );

    const Line = () => (
        <View
            style={{
                height: 1,
                backgroundColor: color["image-area-background"],
                marginTop: 18,
                marginBottom: 18,
            }}
        ></View>
    );

    const Item = ({ data }) => (
        <View>
            <LightText style={{ marginBottom: 15 }}>
                {`${GetDate(data.date)} ${GetDayOfWeek(data.date)}요일`}
            </LightText>
            <RowBetween style={{ marginBottom: 10 }}>
                <MediumText>{data.content}</MediumText>
            </RowBetween>
            <RowBetween style={{ marginBottom: 10 }}>
                <BoldText
                    style={{
                        color: data.type === "지급" ? color.blue : "#EB1D36",
                    }}
                >
                    {numberWithComma(data.point)}
                    <RegularText style={{ fontSize: 14 }}>{"  "}P</RegularText>
                </BoldText>
                <RegularText
                    style={{
                        color: data.type === "지급" ? color.blue : "#EB1D36",
                        fontSize: 15,
                    }}
                >
                    {data.type}
                </RegularText>
            </RowBetween>
            <RowBetween>
                <RegularText style={{ fontSize: 14 }}>
                    잔액{" " + numberWithComma(data.restPoint)}
                    <RegularText style={{ fontSize: 12 }}>{"  "}P</RegularText>
                </RegularText>
            </RowBetween>
            <Line />
        </View>
    );

    const More = () => (
        <TouchableOpacity style={{ marginTop: 10 }}>
            <Row style={{ justifyContent: "center" }}>
                <Image
                    source={require("../../../../assets/images/icons/icon_more.png")}
                    style={{ width: 25, height: 25, marginRight: 5 }}
                />
                <RegularText style={{ fontSize: 16 }}>더보기</RegularText>
            </Row>
        </TouchableOpacity>
    );

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout>
                    <RowAround>
                        <SelectFilter
                            data={PERIOD}
                            onSelect={(index) => setPeriod(index + 1)}
                            width={`${width / 2 - 30}px`}
                        />
                        <SelectFilter
                            data={FILTER}
                            onSelect={(index) => setFilter(index + 1)}
                            width={`${width / 2 - 30}px`}
                        />
                    </RowAround>

                    {Object.keys(breakdown).map((value, index) => (
                        <Box style={shadowProps} key={index}>
                            <Title>{value}</Title>
                            {breakdown[value].map((item, index) => (
                                <Item data={item} key={index} />
                            ))}

                            {/* {false ? (
                                <More />
                            ) : (
                                <RegularText
                                    style={{
                                        fontSize: 17,
                                        textAlign: "center",
                                        marginTop: 10,
                                    }}
                                >
                                    더 이상 내역이 없습니다.
                                </RegularText>
                            )} */}
                        </Box>
                    ))}
                </Layout>
            )}
        </>
    );
}

PointBreakdown.propTypes = {};
export default PointBreakdown;
