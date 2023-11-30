import React from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import * as Linking from "expo-linking";

const Container = styled.TouchableOpacity`
    position: absolute;
    bottom: 60px;
    right: 0px;
`;

function KakaoButton() {
    const { height } = useWindowDimensions();
    const goToKakaoChat = () => {
        Linking.openURL("http://pf.kakao.com/_QxgmlG");
    };

    return (
        <View style={{ height: height, position: "absolute", width: "100%" }}>
            <Container
                onPress={goToKakaoChat}
                style={{
                    width: 170,
                    height: 80,
                    bottom: 120,
                }}
            >
                <Image
                    style={{
                        resizeMode: "contain",
                        width: 170,
                        height: 80,
                    }}
                    source={require(`../../assets/images/icons/btn_kakao_help.png`)}
                />
            </Container>
        </View>
    );
}

export default KakaoButton;
