import React from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import * as Linking from "expo-linking";
import axios from "axios";
import { SERVER, VALID } from "../../constant";
import { showError, showMessage } from "../../utils";

const Container = styled.TouchableOpacity`
    position: absolute;
    bottom: 60px;
    right: 0px;
`;

function KakaoButton() {
    const { height } = useWindowDimensions();
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
                    }
                } else {
                    showMessage("해당 기능은 추후에 제공 예정입니다.");
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
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
