import {
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from "react-native";
import styled from "styled-components/native";
import MediumText from "../text/MediumText";
import { color } from "../../styles";
import { Fragment, useEffect, useState } from "react";
import RegularText from "../text/RegularText";
import HorizontalDivider from "../divider/HorizontalDivider";
import { shadowProps } from "../Shadow";
import { SelectPopup } from "./SelectPopup";

const Container = styled.View`
    width: ${(props) => (props.width ? props.width : "100%")};
`;

const OptionsContainer = styled.View`
    width: 100%;
    align-items: center;
`;
const Options = styled.View`
    width: 90%;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    padding-top: 30px;
    padding-bottom: 30px;
    background-color: white;
    max-height: 500px;
`;

const Option = styled.TouchableOpacity`
    align-items: center;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
`;

function SelectBox({
    title,
    titleProps,
    onSelect,
    data,
    width,
    placeholder,
    selectedIndex,
}) {
    const [showOptions, setShowOptions] = useState(false);
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        if (selectedIndex) setSelected(selectedIndex);
    }, [selectedIndex]);

    const show = () => {
        setShowOptions(true);
    };

    const hide = () => {
        setShowOptions(false);
    };

    const clickOption = (index) => {
        onSelect(index);
        setSelected(index);
        hide();
    };

    return (
        <TouchableWithoutFeedback onPress={hide}>
            <Container width={width}>
                {title ? (
                    <MediumText
                        {...titleProps}
                        style={{
                            fontSize: 17,
                            color: color["page-grey-text"],
                            ...titleProps?.style,
                        }}
                    >
                        {title}
                    </MediumText>
                ) : null}
                <TouchableOpacity
                    onPress={data.length > 0 ? show : null}
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
                                selected < 0
                                    ? color["page-lightgrey-text"]
                                    : color["page-black-text"],
                        }}
                    >
                        {selected < 0
                            ? placeholder
                                ? placeholder
                                : "선택하세요."
                            : data[selected]}
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
                            source={require(`../../assets/images/icons/allow_down.png`)}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                            }}
                        />
                    </View>
                </TouchableOpacity>
                <SelectPopup
                    visible={showOptions}
                    onTouchOutside={hide}
                    onClick={hide}
                >
                    <OptionsContainer>
                        <Options style={shadowProps}>
                            <ScrollView
                                style={{
                                    width: "100%",
                                }}
                                contentContainerStyle={{
                                    alignItems: "center",
                                }}
                            >
                                {data.map((value, index) => (
                                    <Fragment key={index}>
                                        <Option
                                            onPress={() => clickOption(index)}
                                        >
                                            <RegularText
                                                style={{
                                                    color: color[
                                                        "page-dark-text"
                                                    ],
                                                    textAlign: "center",
                                                }}
                                            >
                                                {value === "물량"
                                                    ? "물량\n(이삿짐 / 화물짐 / 기타)"
                                                    : value === "시간"
                                                    ? "시간\n(가구 / 씽크대 / 에어컨 / 철거 / 공사현장 / 샷시 등)"
                                                    : value}
                                            </RegularText>
                                        </Option>
                                        {index < data.length - 1 ? (
                                            <HorizontalDivider
                                                color={
                                                    color["box-border"] + "55"
                                                }
                                                width="90%"
                                            />
                                        ) : null}
                                    </Fragment>
                                ))}
                            </ScrollView>
                        </Options>
                    </OptionsContainer>
                </SelectPopup>
            </Container>
        </TouchableWithoutFeedback>
    );
}

export default SelectBox;
