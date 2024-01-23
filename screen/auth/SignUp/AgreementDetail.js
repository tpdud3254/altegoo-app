import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import AuthLayout from "../../../component/layout/AuthLayout";
import { Image, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COMPANY, DRIVER, NORMAL } from "../../../constant";

const Container = styled.View``;

const IMG_WIDTH = 1190;
const IMG_HEIGHT = 1684;

const TERMS_01_COMPANY = [
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_1.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_2.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_3.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_4.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_5.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_6.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_7.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_8.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_9.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_10.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_11.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_12.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_13.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_14.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_15.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_16.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_17.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_18.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_19.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_20.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_21.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_22.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_company/terms01_company_23.png",
];

const TERMS_01_DRIVER = [
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_1.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_2.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_3.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_4.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_5.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_6.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_7.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_8.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_9.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_10.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_11.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_12.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_13.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_14.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_15.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_16.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_17.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_18.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_19.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_20.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_21.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_22.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_23.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_driver/terms01_driver_24.png",
];

const TERMS_01_NORMAL = [
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_1.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_2.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_3.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_4.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_5.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_6.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_7.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_8.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_9.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_10.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_11.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_12.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_13.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_14.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_15.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_16.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_17.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_18.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_19.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_20.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_21.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_22.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/01_normal/terms01_person_23.png",
];

const TERMS_02 = [
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_1.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_2.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_3.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_4.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_5.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_6.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_7.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_8.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_9.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_10.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_11.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_12.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_13.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/02/terms02_14.png",
];

const TERMS_03 = [
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_1.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_2.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_3.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_4.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_5.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_6.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_7.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_8.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_9.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_10.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_11.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_12.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_13.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_14.png",
    "https://altegoo-bucket.s3.ap-northeast-2.amazonaws.com/terms/03/terms03_15.png",
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
                {/* 서비스 이용약관 */}
                {route?.params?.index === 1
                    ? //기업
                      route?.params?.type === COMPANY
                        ? TERMS_01_COMPANY.map((uri, index) => (
                              <Image
                                  key={index}
                                  source={{ uri }}
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
                        ? TERMS_01_DRIVER.map((uri, index) => (
                              <Image
                                  key={index}
                                  source={{ uri }}
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
                        ? TERMS_01_NORMAL.map((uri, index) => (
                              <Image
                                  key={index}
                                  source={{ uri }}
                                  style={{
                                      width: width - 32,
                                      height: height - 110,
                                  }}
                              />
                          ))
                        : null
                    : null}

                {/* 개인정보 처리방침 */}
                {route?.params?.index === 2
                    ? TERMS_02.map((uri, index) => (
                          <Image
                              key={index}
                              source={{ uri }}
                              style={{
                                  width: width - 32,
                                  height: height - 100,
                              }}
                          />
                      ))
                    : null}

                {/* 위치서비스기반 */}
                {route?.params?.index === 3
                    ? TERMS_03.map((uri, index) => (
                          <Image
                              key={index}
                              source={{ uri }}
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
