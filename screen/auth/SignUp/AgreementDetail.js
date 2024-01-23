import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import AuthLayout from "../../../component/layout/AuthLayout";
import RegularText from "../../../component/text/RegularText";
import { company_terms, driver_terms, normal_terms, terms } from "./terms";
import { FlatList, Image, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COMPANY, DRIVER, NORMAL } from "../../../constant";

const Container = styled.View``;

const IMG_WIDTH = 1190;
const IMG_HEIGHT = 1684;

const TERMS_01_COMPANY = [
    require("../../../assets/images/terms/01/terms01_company_1.png"),
    require("../../../assets/images/terms/01/terms01_company_2.png"),
    require("../../../assets/images/terms/01/terms01_company_3.png"),
    require("../../../assets/images/terms/01/terms01_company_4.png"),
    require("../../../assets/images/terms/01/terms01_company_5.png"),
    require("../../../assets/images/terms/01/terms01_company_6.png"),
    require("../../../assets/images/terms/01/terms01_company_7.png"),
    require("../../../assets/images/terms/01/terms01_company_8.png"),
    require("../../../assets/images/terms/01/terms01_company_9.png"),
    require("../../../assets/images/terms/01/terms01_company_10.png"),
    require("../../../assets/images/terms/01/terms01_company_11.png"),
    require("../../../assets/images/terms/01/terms01_company_12.png"),
    require("../../../assets/images/terms/01/terms01_company_13.png"),
    require("../../../assets/images/terms/01/terms01_company_14.png"),
    require("../../../assets/images/terms/01/terms01_company_15.png"),
    require("../../../assets/images/terms/01/terms01_company_16.png"),
    require("../../../assets/images/terms/01/terms01_company_17.png"),
    require("../../../assets/images/terms/01/terms01_company_18.png"),
    require("../../../assets/images/terms/01/terms01_company_19.png"),
    require("../../../assets/images/terms/01/terms01_company_20.png"),
    require("../../../assets/images/terms/01/terms01_company_21.png"),
    require("../../../assets/images/terms/01/terms01_company_22.png"),
    require("../../../assets/images/terms/01/terms01_company_23.png"),
];

const TERMS_01_DRIVER = [
    require("../../../assets/images/terms/01/terms01_driver_1.png"),
    require("../../../assets/images/terms/01/terms01_driver_2.png"),
    require("../../../assets/images/terms/01/terms01_driver_3.png"),
    require("../../../assets/images/terms/01/terms01_driver_4.png"),
    require("../../../assets/images/terms/01/terms01_driver_5.png"),
    require("../../../assets/images/terms/01/terms01_driver_6.png"),
    require("../../../assets/images/terms/01/terms01_driver_7.png"),
    require("../../../assets/images/terms/01/terms01_driver_8.png"),
    require("../../../assets/images/terms/01/terms01_driver_9.png"),
    require("../../../assets/images/terms/01/terms01_driver_10.png"),
    require("../../../assets/images/terms/01/terms01_driver_11.png"),
    require("../../../assets/images/terms/01/terms01_driver_12.png"),
    require("../../../assets/images/terms/01/terms01_driver_13.png"),
    require("../../../assets/images/terms/01/terms01_driver_14.png"),
    require("../../../assets/images/terms/01/terms01_driver_15.png"),
    require("../../../assets/images/terms/01/terms01_driver_16.png"),
    require("../../../assets/images/terms/01/terms01_driver_17.png"),
    require("../../../assets/images/terms/01/terms01_driver_18.png"),
    require("../../../assets/images/terms/01/terms01_driver_19.png"),
    require("../../../assets/images/terms/01/terms01_driver_20.png"),
    require("../../../assets/images/terms/01/terms01_driver_21.png"),
    require("../../../assets/images/terms/01/terms01_driver_22.png"),
    require("../../../assets/images/terms/01/terms01_driver_23.png"),
    require("../../../assets/images/terms/01/terms01_driver_24.png"),
];

const TERMS_01_NORMAL = [
    require("../../../assets/images/terms/01/terms01_person_1.png"),
    require("../../../assets/images/terms/01/terms01_person_2.png"),
    require("../../../assets/images/terms/01/terms01_person_3.png"),
    require("../../../assets/images/terms/01/terms01_person_4.png"),
    require("../../../assets/images/terms/01/terms01_person_5.png"),
    require("../../../assets/images/terms/01/terms01_person_6.png"),
    require("../../../assets/images/terms/01/terms01_person_7.png"),
    require("../../../assets/images/terms/01/terms01_person_8.png"),
    require("../../../assets/images/terms/01/terms01_person_9.png"),
    require("../../../assets/images/terms/01/terms01_person_10.png"),
    require("../../../assets/images/terms/01/terms01_person_11.png"),
    require("../../../assets/images/terms/01/terms01_person_12.png"),
    require("../../../assets/images/terms/01/terms01_person_13.png"),
    require("../../../assets/images/terms/01/terms01_person_14.png"),
    require("../../../assets/images/terms/01/terms01_person_15.png"),
    require("../../../assets/images/terms/01/terms01_person_16.png"),
    require("../../../assets/images/terms/01/terms01_person_17.png"),
    require("../../../assets/images/terms/01/terms01_person_18.png"),
    require("../../../assets/images/terms/01/terms01_person_19.png"),
    require("../../../assets/images/terms/01/terms01_person_20.png"),
    require("../../../assets/images/terms/01/terms01_person_21.png"),
    require("../../../assets/images/terms/01/terms01_person_22.png"),
    require("../../../assets/images/terms/01/terms01_person_23.png"),
];

const TERMS_02 = [
    require("../../../assets/images/terms/02/terms02_1.png"),
    require("../../../assets/images/terms/02/terms02_2.png"),
    require("../../../assets/images/terms/02/terms02_3.png"),
    require("../../../assets/images/terms/02/terms02_4.png"),
    require("../../../assets/images/terms/02/terms02_5.png"),
    require("../../../assets/images/terms/02/terms02_6.png"),
    require("../../../assets/images/terms/02/terms02_7.png"),
    require("../../../assets/images/terms/02/terms02_8.png"),
    require("../../../assets/images/terms/02/terms02_9.png"),
    require("../../../assets/images/terms/02/terms02_10.png"),
    require("../../../assets/images/terms/02/terms02_11.png"),
    require("../../../assets/images/terms/02/terms02_12.png"),
    require("../../../assets/images/terms/02/terms02_13.png"),
    require("../../../assets/images/terms/02/terms02_14.png"),
];

const TERMS_03 = [
    require("../../../assets/images/terms/03/terms03_1.png"),
    require("../../../assets/images/terms/03/terms03_2.png"),
    require("../../../assets/images/terms/03/terms03_3.png"),
    require("../../../assets/images/terms/03/terms03_4.png"),
    require("../../../assets/images/terms/03/terms03_5.png"),
    require("../../../assets/images/terms/03/terms03_6.png"),
    require("../../../assets/images/terms/03/terms03_7.png"),
    require("../../../assets/images/terms/03/terms03_8.png"),
    require("../../../assets/images/terms/03/terms03_9.png"),
    require("../../../assets/images/terms/03/terms03_10.png"),
    require("../../../assets/images/terms/03/terms03_11.png"),
    require("../../../assets/images/terms/03/terms03_12.png"),
    require("../../../assets/images/terms/03/terms03_13.png"),
    require("../../../assets/images/terms/03/terms03_14.png"),
    require("../../../assets/images/terms/03/terms03_15.png"),
];
function AgreementDetail({ route, navigation }) {
    const { width } = useWindowDimensions();
    const [height, setHeight] = useState(0);

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
        setHeight((width * IMG_HEIGHT) / IMG_WIDTH);
    }, []);

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <AuthLayout>
            <Container>
                {/* <RegularText style={{ lineHeight: 20, fontSize: 15 }}>
                    {route?.params?.type === NORMAL
                        ? normal_terms[route?.params?.index - 1]
                        : null}
                    {route?.params?.type === DRIVER
                        ? driver_terms[route?.params?.index - 1]
                        : null}
                    {route?.params?.type === COMPANY
                        ? company_terms[route?.params?.index - 1]
                        : null}
                </RegularText> */}
                {/* 서비스 이용약관 */}
                {route?.params?.index === 1
                    ? //기업
                      route?.params?.type === COMPANY
                        ? TERMS_01_COMPANY.map((value, index) => (
                              <Image
                                  key={index}
                                  source={value}
                                  style={{
                                      width: width - 32,
                                      height: height - 110,
                                  }}
                              />
                          ))
                        : null
                    : null}
                {route?.params?.index === 1
                    ? //기사
                      route?.params?.type === DRIVER
                        ? TERMS_01_DRIVER.map((value, index) => (
                              <Image
                                  key={index}
                                  source={value}
                                  style={{
                                      width: width - 32,
                                      height: height - 110,
                                  }}
                              />
                          ))
                        : null
                    : null}
                {route?.params?.index === 1
                    ? //기사
                      route?.params?.type === DRIVER
                        ? TERMS_01_DRIVER.map((value, index) => (
                              <Image
                                  key={index}
                                  source={value}
                                  style={{
                                      width: width - 32,
                                      height: height - 110,
                                  }}
                              />
                          ))
                        : null
                    : null}
                {route?.params?.index === 1
                    ? //개인
                      route?.params?.type === NORMAL
                        ? TERMS_01_NORMAL.map((value, index) => (
                              <Image
                                  key={index}
                                  source={value}
                                  style={{
                                      width: width - 32,
                                      height: height - 110,
                                  }}
                              />
                          ))
                        : null
                    : null}

                {route?.params?.index === 2
                    ? TERMS_02.map((value, index) => (
                          <Image
                              key={index}
                              source={value}
                              style={{
                                  width: width - 32,
                                  height: height - 110,
                              }}
                          />
                      ))
                    : null}
                {route?.params?.index === 3
                    ? TERMS_03.map((value, index) => (
                          <Image
                              key={index}
                              source={value}
                              style={{
                                  width: width - 32,
                                  height: height - 110,
                              }}
                          />
                      ))
                    : null}
            </Container>
        </AuthLayout>
    );
}

export default AgreementDetail;
