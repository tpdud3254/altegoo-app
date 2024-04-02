import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";
import { Image, TouchableOpacity, View } from "react-native";
import MediumText from "../../../component/text/MediumText";
import UserContext from "../../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginContext from "../../../context/LoginContext";
import Layout from "../../../component/layout/Layout";
import RegularText from "../../../component/text/RegularText";
import { GetPhoneNumberWithDash, IsRpackMember } from "../../../utils";
import { color } from "../../../styles";
import { shadowProps } from "../../../component/Shadow";
import LightText from "../../../component/text/LightText";
import { Row } from "../../../component/Row";
import { TOKEN, UID, USER_TYPE } from "../../../constant";

const Continer = styled.View`
    justify-content: space-between;
    height: 100%;
`;
const Items = styled.View`
    background-color: white;
    padding: 25px 23px 15px 23px;
    margin-top: 8px;
    margin-bottom: 8px;
    border-radius: 11px;
`;

const SItem = styled.View`
    flex-direction: row;
    margin-bottom: 15px;
    align-items: center;
`;

const Line = styled.View`
    height: 1px;
    border: 1px dashed ${color["image-area-background"]};
    margin: 10px 0px 25px 0px;
`;

const Button = styled.TouchableOpacity`
    border: 1px solid ${color["box-border"]};
    width: ${(props) => (props.width ? props.width : 100)}px;
    align-items: center;
    padding: 10px 0px;
    border-radius: 10px;
`;
function MemberInformation({ navigation }) {
    const { setIsLoggedIn } = useContext(LoginContext);
    const { info, setInfo } = useContext(UserContext);

    useEffect(() => {
        console.log("info : ", info);
    }, []);

    const logout = async () => {
        setIsLoggedIn(false);
        setInfo({});
        await AsyncStorage.removeItem(TOKEN);
        await AsyncStorage.removeItem(UID);
        await AsyncStorage.removeItem(USER_TYPE);
    };

    const goToRegisterVehicle = () => {
        navigation.navigate("SettingRegisterVehicle", { modify: true });
    };

    const goToRegisterRegion = () => {
        navigation.navigate("SettingWorkingArea", { modify: true });
    };

    const goToRegisterLicense = () => {
        navigation.navigate("SettingTakePhoto", {
            modify: true,
            type: "license",
        });
    };

    const goToRegisterPermission = () => {
        navigation.navigate("SettingTakePhoto", {
            modify: true,
            type: "permission",
        });
    };

    const goToCancelRPack = () => {
        navigation.navigate("CancelRPack");
    };

    const Title = ({ children, onPress }) => (
        <View
            style={{
                marginBottom: 25,
                ...(onPress && {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }),
            }}
        >
            <RegularText style={{ fontSize: 22 }}>{children}</RegularText>
            {onPress ? (
                <Button onPress={onPress} width={55}>
                    <MediumText style={{ fontSize: 15 }}>수정</MediumText>
                </Button>
            ) : null}
        </View>
    );

    const Item = ({ children, title }) => (
        <SItem>
            <LightText style={{ width: "32%" }}>{title}</LightText>
            <View style={{ width: "68%" }}>{children}</View>
        </SItem>
    );

    const Before = ({ onPress, value, title }) => (
        <View style={{ alignItems: "flex-end", marginBottom: 15 }}>
            <Item title={title ? title : value}>
                <Button onPress={onPress}>
                    <MediumText style={{ fontSize: 15 }}>등록하기</MediumText>
                </Button>
            </Item>
            <RegularText
                style={{
                    fontSize: 15,
                    color: color.main,
                    width: "68%",
                    marginTop: -5,
                }}
            >
                {value}을 등록해주세요.
            </RegularText>
        </View>
    );

    const Checking = ({ value }) => (
        <Item title={value}>
            <MediumText style={{ color: color.blue }}>
                등록 확인중입니다.
            </MediumText>
        </Item>
    );

    const Completed = ({ value }) => (
        <Item title={value}>
            <Row>
                <Image
                    source={require("../../../assets/images/icons/icon_certification.png")}
                    style={{ width: 23, height: 23, marginRight: 5 }}
                />
                <MediumText style={{ color: color["page-bluegrey-text"] }}>
                    등록완료
                </MediumText>
            </Row>
        </Item>
    );
    return (
        <Layout scroll={info.userTypeId === 2 ? true : false}>
            <Continer>
                <View>
                    <Items style={shadowProps}>
                        <Title>기본 정보</Title>
                        <Item title="이름">
                            <MediumText>{info.name}</MediumText>
                        </Item>
                        <Item title="휴대전화">
                            <MediumText>
                                {GetPhoneNumberWithDash(info.phone)}
                            </MediumText>
                        </Item>
                    </Items>
                    {info.userTypeId === 3 ? (
                        <Items style={shadowProps}>
                            <Title>회사 정보</Title>
                            <Item title="사업 종류">
                                <MediumText>
                                    {info.workCategory.name} 계열
                                </MediumText>
                            </Item>
                            <Item title="상호명">
                                <MediumText>{info.companyName}</MediumText>
                            </Item>
                            <Item title="담당자">
                                <MediumText>
                                    {info.companyPersonName
                                        ? info.companyPersonName
                                        : "없음"}
                                </MediumText>
                            </Item>
                            <Line />
                            {info.license ? (
                                <Completed value="사업자등록증" />
                            ) : (
                                <Before
                                    value="사업자등록증"
                                    onPress={goToRegisterLicense}
                                />
                            )}
                            {/* NEXT: 사업자 등록증 체크
                                <Checking value="사업자등록증" />
                                 */}
                        </Items>
                    ) : null}
                    {info.userTypeId === 2 ? (
                        <>
                            <Items style={shadowProps}>
                                <Title>내 차 정보</Title>
                                {info.vehicle ? (
                                    <>
                                        <Item title="차량 종류">
                                            <MediumText>
                                                {info.vehicle[0].type.type}차
                                            </MediumText>
                                        </Item>
                                        {info.vehicle[0].type.type ===
                                        "사다리" ? (
                                            <Item title="최대작업층">
                                                <MediumText>
                                                    {
                                                        info.vehicle[0].floor
                                                            .floor
                                                    }
                                                </MediumText>
                                            </Item>
                                        ) : (
                                            <Item title="최대 물량">
                                                <MediumText>
                                                    {
                                                        info.vehicle[0].weight
                                                            .weight
                                                    }
                                                </MediumText>
                                            </Item>
                                        )}

                                        <Item title="차량번호">
                                            <MediumText>
                                                {info.vehicle[0].number}
                                            </MediumText>
                                        </Item>
                                    </>
                                ) : (
                                    <Before
                                        value="차량 종류"
                                        onPress={goToRegisterVehicle}
                                    />
                                )}

                                <Line />
                                {info.license ? (
                                    <Completed value="사업자등록증" />
                                ) : (
                                    <Before
                                        value="사업자등록증"
                                        onPress={goToRegisterLicense}
                                    />
                                )}
                                {/* NEXT: 사업자 등록증 체크
                                <Checking value="사업자등록증" />
                                 */}
                                <Line />
                                {info.vehiclePermission ? (
                                    <Completed value="화물자동차 운송사업 허가증" />
                                ) : (
                                    <Before
                                        title="화물자동차 운송사업 허가증"
                                        value="허가증"
                                        onPress={goToRegisterPermission}
                                    />
                                )}
                            </Items>
                            <Items style={shadowProps}>
                                <Title onPress={goToRegisterRegion}>
                                    작업 지역 정보
                                </Title>
                                {info.workRegion.map((region, index) => (
                                    <Item
                                        title={`${index + 1}차 지역`}
                                        key={index}
                                    >
                                        <MediumText>{region.region}</MediumText>
                                    </Item>
                                ))}
                            </Items>
                        </>
                    ) : null}
                    {IsRpackMember(info) ? (
                        <TouchableOpacity onPress={goToCancelRPack}>
                            <MediumText
                                style={{
                                    color: color["page-bluegrey-text"],
                                    textAlign: "center",
                                    marginTop: 10,
                                    fontSize: 16,
                                }}
                            >
                                알팩 해지하기
                            </MediumText>
                        </TouchableOpacity>
                    ) : null}
                </View>
                <View>
                    <TouchableOpacity onPress={logout}>
                        <MediumText
                            style={{
                                color: color["page-bluegrey-text"],
                                textAlign: "center",
                                marginTop: 20,
                                marginBottom: 13,
                            }}
                        >
                            로그아웃
                        </MediumText>
                    </TouchableOpacity>
                </View>
            </Continer>
        </Layout>
    );
}

MemberInformation.propTypes = {};
export default MemberInformation;
