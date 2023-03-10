import React, { useContext, useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import styled from "styled-components/native";
import MainLayout from "../../../component/layout/MainLayout";
import PlainText from "../../../component/text/PlainText";
import { theme } from "../../../styles";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import VerticalDivider from "../../../component/divider/VerticalDivider";
import HorizontalDivider from "../../../component/divider/HorizontalDivider";
import PlainButton from "../../../component/button/PlainButton";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import RegistContext from "../../../context/RegistContext";
import KakaoButton, {
    ButtonContainer,
} from "../../../component/button/KakaoButton";
import { REGIST_NAV } from "../../../constant";
import UpIcon from "../../../component/icon/UpIcon";
import DownIcon from "../../../component/icon/DownIcon";

const Container = styled.View`
    flex: 1;
`;
const VehicleContainer = styled.View`
    background-color: white;
    border-radius: 10px;
    padding: 10px;
`;
const VehicleWrapper = styled.View`
    align-items: center;
    flex-direction: row;
    justify-content: space-evenly;
`;
const Radio = styled.TouchableOpacity`
    background-color: white;
    flex-direction: row;
    align-items: center;
`;

const TypeContainer = styled(VehicleContainer)`
    margin-top: 15px;
`;
const TypeWrapper = styled.View`
    flex-direction: row;
    justify-content: space-evenly;
`;
const STypeButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    background-color: ${(props) => (props.selected ? "aliceblue" : "white")};
    padding: 5px 20px;
`;
const Icon = styled.View``;

const BothContainer = styled(TypeContainer)``;
const BothWrapper = styled.TouchableOpacity`
    padding: 10px;
    background-color: ${(props) => (props.selected ? "aliceblue" : "white")};
    margin: 5px 0px;
`;
const Both = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const HelpContainer = styled.View`
    flex-direction: row;
    margin-bottom: 10px;
    align-items: center;
`;

function SelectWorkType({ navigation }) {
    const { setRegistInfo } = useContext(RegistContext);
    const [vehicleType, setVehicleType] = useState(null);
    const [upDown, setUpDown] = useState(null);
    const [both, setBoth] = useState(null);
    const [cur, setCur] = useState(-1);

    useEffect(() => {
        if (!vehicleType) {
            setCur(1);
        } else if (!upDown) {
            setCur(2);
        } else {
            if (upDown === "both" && !both) {
                setCur(3);
            } else {
                setCur(0);
            }
        }
    }, [vehicleType, upDown, both]);

    const onNextStep = () => {
        if (cur !== 0) {
            Toast.show({
                type: "errorToast",
                props: "?????? ?????? ?????? ????????? ??????????????????.",
            });
            return;
        }

        setRegistInfo({
            vehicleType: vehicleType === 1 ? "?????????" : "?????????",
            upDown:
                upDown === "up" ? "??????" : upDown === "down" ? "??????" : "??????",
            bothType: both,
        });

        navigation.navigate(REGIST_NAV[1]);
    };

    const Help = ({ number, cur, text }) => (
        <HelpContainer>
            <MaterialCommunityIcons
                name={`numeric-${number}-circle-outline`}
                size={30}
                color={cur ? theme.sub.blue : "#777777"}
            />
            <PlainText
                style={{ marginLeft: 5, color: cur ? "black" : "#777777" }}
            >
                {text}
            </PlainText>
        </HelpContainer>
    );

    const TypeButton = ({ type, selected, onPress }) => (
        <STypeButton onPress={onPress} selected={selected}>
            {type === "both" ? (
                <Icon>
                    <UpIcon />
                    <DownIcon />
                </Icon>
            ) : (
                <Icon>{type === "up" ? <UpIcon /> : <DownIcon />}</Icon>
            )}

            <PlainText>
                {type === "up" ? "??????" : type === "down" ? "??????" : "??????"}
            </PlainText>
        </STypeButton>
    );

    return (
        <MainLayout>
            <Container>
                <VehicleContainer>
                    <Help
                        number="1"
                        cur={cur === 1}
                        text="'?????????', '?????????' ??? ??????????????????."
                    />
                    <RadioButton.Group
                        onValueChange={(newValue) => setVehicleType(newValue)}
                        value={vehicleType}
                    >
                        <VehicleWrapper>
                            <Radio>
                                <RadioButton value={1} color={theme.sub.blue} />
                                <PlainText>?????????</PlainText>
                            </Radio>
                            <Radio>
                                <RadioButton value={2} color={theme.sub.blue} />
                                <PlainText>?????????</PlainText>
                            </Radio>
                        </VehicleWrapper>
                    </RadioButton.Group>
                </VehicleContainer>
                <TypeContainer>
                    <Help
                        number="2"
                        cur={cur === 2}
                        text="?????? ????????? ??????????????????."
                    />
                    <TypeWrapper>
                        <TypeButton
                            type="down"
                            selected={upDown === "down"}
                            onPress={() => setUpDown("down")}
                        />
                        <VerticalDivider color="#dddddd" />
                        <TypeButton
                            type="up"
                            selected={upDown === "up"}
                            onPress={() => setUpDown("up")}
                        />
                        <VerticalDivider color="#dddddd" />
                        <TypeButton
                            type="both"
                            selected={upDown === "both"}
                            onPress={() => setUpDown("both")}
                        />
                    </TypeWrapper>
                </TypeContainer>
                {upDown === "both" ? (
                    <BothContainer>
                        <Help
                            number="3"
                            cur={cur === 3}
                            text="?????? ????????? ??????????????????."
                        />
                        <BothWrapper
                            onPress={() => setBoth(1)}
                            selected={both === 1}
                        >
                            <Both>
                                <DownIcon />
                                <PlainText>??????</PlainText>
                                <Feather
                                    name="chevrons-right"
                                    size={24}
                                    color="black"
                                    style={{ marginLeft: 10, marginRight: 10 }}
                                />
                                <UpIcon />
                                <PlainText>??????</PlainText>
                            </Both>
                        </BothWrapper>
                        <HorizontalDivider color="#dddddd" />
                        <BothWrapper
                            onPress={() => setBoth(2)}
                            selected={both === 2}
                        >
                            <Both>
                                <UpIcon />
                                <PlainText>??????</PlainText>
                                <Feather
                                    name="chevrons-right"
                                    size={24}
                                    color="black"
                                    style={{ marginLeft: 10, marginRight: 10 }}
                                />

                                <DownIcon />
                                <PlainText>??????</PlainText>
                            </Both>
                        </BothWrapper>
                    </BothContainer>
                ) : null}
            </Container>
            <ButtonContainer>
                <PlainButton
                    text="????????????"
                    style={{ width: "80%" }}
                    onPress={onNextStep}
                />
                <KakaoButton />
            </ButtonContainer>
        </MainLayout>
    );
}

export default SelectWorkType;
