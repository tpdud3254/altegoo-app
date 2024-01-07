import React, { useEffect } from "react";
import styled from "styled-components/native";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import { company_terms, driver_terms, normal_terms, terms } from "./terms";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COMPANY, DRIVER, NORMAL } from "../../../constant";

const Container = styled.View``;
function AgreementDetail({ route, navigation }) {
    useEffect(() => {
        console.log(route?.params?.type);
        console.log(route?.params?.index);
        navigation.setOptions({
            title: route?.params?.title,
            headerRight: () => (
                <TouchableOpacity onPress={goBack}>
                    <Image
                        style={{ width: 25, marginRight: 12 }}
                        resizeMode="contain"
                        source={require(`../../../assets/images/icons/BTN_Close.png`)}
                    />
                </TouchableOpacity>
            ),
        });
    }, []);

    const goBack = () => {
        navigation.goBack();
    };
    return (
        <AuthLayout>
            <Container>
                <RegularText style={{ lineHeight: 20, fontSize: 15 }}>
                    {route?.params?.type === NORMAL
                        ? normal_terms[route?.params?.index - 1]
                        : null}
                    {route?.params?.type === DRIVER
                        ? driver_terms[route?.params?.index - 1]
                        : null}
                    {route?.params?.type === COMPANY
                        ? company_terms[route?.params?.index - 1]
                        : null}
                </RegularText>
            </Container>
        </AuthLayout>
    );
}

export default AgreementDetail;
