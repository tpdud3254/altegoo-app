import React from "react";
import styled from "styled-components/native";
import BoldText from "../component/text/BoldText";
import { color } from "../styles";
import { Image, ScrollView, View } from "react-native";
import RegularText from "../component/text/RegularText";

const Container = styled.View`
    flex: 1;
    width: 100%;
    background-color: white;
`;

const Wrapper = styled.View`
    flex: 12;
    padding: 16px;
`;

const Content = styled.View``;

const Top = styled.View`
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: ${color["box-border"]};
    margin-top: 50px;
    align-items: center;
    padding-bottom: 20px;
`;

const TopText = styled.View`
    align-items: center;
`;

const Bottom = styled.View`
    margin-top: 20px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: ${color["box-border"]};
    padding-bottom: 10px;
`;

const Item = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
`;

const ItemText = styled.View`
    margin-left: 10px;
`;

const Noti = styled.View`
    margin-top: 20px;
`;
const Button = styled.TouchableOpacity`
    flex: 1;
    background-color: ${color.main};
    align-items: center;
    justify-content: center;
`;

function Permission({ onPress }) {
    return (
        <Container>
            <Wrapper>
                <ScrollView>
                    <Content>
                        <Top>
                            <Image
                                source={require("../assets/app_icon.png")}
                                style={{
                                    width: 50,
                                    height: 50,
                                    marginBottom: 10,
                                }}
                                resizeMode="contain"
                            />
                            <TopText>
                                <BoldText style={{ marginBottom: 10 }}>
                                    앱 접근 권한 안내
                                </BoldText>
                                <RegularText
                                    style={{
                                        textAlign: "center",
                                        fontSize: 17,
                                    }}
                                >
                                    알테구에서는 앱 이용 시 다음 권한들을
                                    사용하오니 확인 부탁드립니다.
                                </RegularText>
                            </TopText>
                        </Top>
                        <Bottom>
                            <BoldText
                                style={{
                                    color: color.main,
                                    marginBottom: 10,
                                    fontSize: 18,
                                }}
                            >
                                필수적 접근 권한
                            </BoldText>
                            <Item>
                                <Image
                                    style={{ width: 40, height: 40 }}
                                    source={require("../assets/images/icons/icon_location.png")}
                                />
                                <ItemText>
                                    <BoldText style={{ fontSize: 18 }}>
                                        위치 정보
                                    </BoldText>
                                    <RegularText
                                        style={{
                                            color: color.textDark,
                                            fontSize: 17,
                                        }}
                                    >
                                        실시간 위치 확인
                                    </RegularText>
                                </ItemText>
                            </Item>
                            <Item>
                                <Image
                                    style={{ width: 40, height: 35 }}
                                    source={require("../assets/images/icons/btn_notifcation.png")}
                                />
                                <ItemText>
                                    <BoldText style={{ fontSize: 18 }}>
                                        알림
                                    </BoldText>
                                    <RegularText
                                        style={{
                                            color: color.textDark,
                                            fontSize: 17,
                                        }}
                                    >
                                        푸시 알림 등록 및 수신
                                    </RegularText>
                                </ItemText>
                            </Item>
                        </Bottom>
                        <Noti>
                            <RegularText
                                style={{
                                    color: color.textDark,
                                    fontSize: 15,
                                }}
                            >
                                * 위치정보 :{" "}
                                <BoldText
                                    style={{
                                        color: color.red,
                                        fontSize: 15,
                                        marginTop: 10,
                                    }}
                                >
                                    [앱 사용 중에만 허용], [항상 허용]
                                </BoldText>
                                {"\n"}
                                알림 :{" "}
                                <BoldText
                                    style={{
                                        color: color.red,
                                        fontSize: 15,
                                        marginTop: 10,
                                    }}
                                >
                                    [허용]
                                </BoldText>
                                으로 선택하셔야 정상적인 앱 이용이 가능합니다.
                            </RegularText>
                            <RegularText
                                style={{
                                    color: color.textDark,
                                    fontSize: 15,
                                    marginTop: 10,
                                }}
                            >
                                * 권한 거절을 했거나 확인 버튼을 눌러도 동작
                                안할 시{" "}
                                <BoldText
                                    style={{
                                        color: color.red,
                                        fontSize: 15,
                                        marginTop: 10,
                                    }}
                                >
                                    [설정 {">"} 애플리케이션 {"> "}
                                    알테구]
                                </BoldText>
                                에서 알림과 위치 설정을 변경해주세요.
                            </RegularText>
                        </Noti>
                    </Content>
                </ScrollView>
            </Wrapper>
            <Button onPress={onPress}>
                <BoldText style={{ color: "white" }}>확인</BoldText>
            </Button>
        </Container>
    );
}

export default Permission;
