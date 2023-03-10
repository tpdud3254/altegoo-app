import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import PlainText from "../../../component/text/PlainText";
import { Image, TouchableOpacity } from "react-native";
import UserContext from "../../../context/UserContext";
import DefaultLayout from "../../../component/layout/DefaultLayout";
import TitleText from "../../../component/text/TitleText";
import { theme } from "../../../styles";
import SubmitButton from "../../../component/button/SubmitButton";
import Toast from "react-native-toast-message";
import { Modal, Portal, Text, Button, Provider } from "react-native-paper";
import SubTitleText from "../../../component/text/SubTitleText";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
`;

const Title = styled.View`
  margin-bottom: 15px;
`;

const MapContainer = styled.View`
  margin-top: 10px;
  width: 100%;
  min-height: 450px;
  /* border: 1px solid #dddddd; */
  justify-content: center;
  align-items: center;
`;

const Map = styled.View`
  width: 364px;
  height: 482px;
`;

const MapButton = styled.TouchableOpacity`
  position: absolute;
  z-index: 1;
  background-color: #ffffffbb;
  padding: 5px;
  border-radius: 5px;
`;
const GuideTextContainer = styled.View`
  width: 100%;
  align-items: center;
`;

const Help = styled.View``;
const HelpButton = styled.TouchableOpacity``;
const modalStyle = {
  backgroundColor: "white",
  paddingTop: 10,
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 10,
  alignItems: "center",
};
const ModalTop = styled.View`
  width: 100%;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 20px;
  justify-content: space-between;
`;
const ModalTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;
const modalTitleStyle = { marginLeft: 5, marginRight: 5 };
const modalSubTitleStyle = { fontSize: 22, color: theme.main, marginBottom: 3 };
const modalTextStyle = { marginBottom: 20 };

const imageSize = {
  //?????? ????????? ??????
  1: [231, 190],
  2: [113, 197],
  3: [396, 631],
  4: [415, 504],
  5: [294, 445],
  6: [492, 576],
};

function SignUpStep2() {
  const [adjustedImage, setAdjustedImage] = useState({}); //????????? ????????? ??????
  const [imageResized, setImageResized] = useState(false); //????????? resize ??????
  const [helpVisible, setHelpVisible] = useState(false);
  const [regionArr, setRegionArr] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const { info, setInfo } = useContext(UserContext);
  const navigation = useNavigation();

  console.log(info);

  useEffect(() => {
    const firstImageWidth = 180;

    let widthArr = [];

    for (let i = 0; i < 6; i++) {
      const width = (firstImageWidth * imageSize[i + 1][0]) / imageSize[3][0];
      widthArr.push(width);
    }

    let height = [];

    widthArr.map((value, index) => {
      const size = (imageSize[index + 1][1] * value) / imageSize[index + 1][0];

      height.push(size);
    });

    const adjustedObj = { width: widthArr, height: height };

    setAdjustedImage(adjustedObj);
    setImageResized(true);
  }, []);

  const showModal = () => setHelpVisible(true);
  const hideModal = () => setHelpVisible(false);

  const onNextStep = () => {
    const workRegion = [];

    regionArr.map((value, index) => {
      if (value) {
        workRegion.push(index + 1);
      }
    });

    if (workRegion.length < 1) {
      Toast.show({
        type: "errorToast",
        props: "?????? ????????? ??????????????????.",
      });

      return;
    }
    setInfo({ workRegion, ...info });

    navigation.navigate("SignUpStep3");
  };

  const onPress = (index) => {
    const prevArr = [...regionArr];

    prevArr[index] = !prevArr[index];

    setRegionArr(prevArr);
  };

  const HelpModal = () => (
    <Portal>
      <Modal
        visible={helpVisible}
        onDismiss={hideModal}
        contentContainerStyle={modalStyle}
      >
        <ModalTop>
          <Ionicons name="close" size={30} color="white" />
          <ModalTitle>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={theme.sub.yellow}
            />
            <SubTitleText style={modalTitleStyle}>?????? ?????? ??????</SubTitleText>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={theme.sub.yellow}
            />
          </ModalTitle>
          <TouchableOpacity
            style={{ marginTop: -10, marginRight: -10 }}
            onPress={hideModal}
          >
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>
        </ModalTop>
        <PlainText style={modalSubTitleStyle}>[?????? ?????????]</PlainText>
        <PlainText style={modalTextStyle}>
          ????????? / ????????? / ????????? / ????????? / ???????????? / ?????????
        </PlainText>
        <PlainText style={modalSubTitleStyle}>[?????? ?????????]</PlainText>
        <PlainText style={modalTextStyle}>
          ???????????? / ????????? / ????????? / ???????????? / ????????? / ?????????
        </PlainText>
        <PlainText style={modalSubTitleStyle}>[?????? ?????????]</PlainText>
        <PlainText style={modalTextStyle}>
          ????????? / ????????? / ????????? / ????????? / ????????? / ????????? / ????????? / ?????????
          / ????????? / ????????? / ?????????
        </PlainText>
        <PlainText style={modalSubTitleStyle}>[?????? ?????????]</PlainText>
        <PlainText style={modalTextStyle}>
          ????????? / ????????? / ????????? / ????????? / ????????? / ????????? / ????????? / ?????????
        </PlainText>
      </Modal>
    </Portal>
  );
  return (
    <DefaultLayout>
      <Provider>
        <HelpModal />
        <Container>
          <Title>
            <TitleText>???????????? ????????????</TitleText>
          </Title>
          <Help>
            <HelpButton onPress={showModal}>
              <PlainText
                style={{
                  textDecorationLine: "underline",
                  textAlign: "right",
                  color: theme.boxColor,
                }}
              >
                ???????????? ?????????
              </PlainText>
            </HelpButton>
          </Help>
          <MapContainer>
            {imageResized ? (
              <Map>
                <MapButton
                  style={{
                    top: 245,
                    left: 103,
                  }}
                  onPress={() => {
                    onPress(0);
                  }}
                >
                  <PlainText style={{ fontSize: 20 }}>?????????</PlainText>
                </MapButton>
                <Image //??????
                  style={{
                    resizeMode: "contain",
                    width: adjustedImage.width[0],
                    height: adjustedImage.height[0],
                    position: "absolute",
                    top: 206,
                    left: 75,
                  }}
                  source={
                    regionArr[0]
                      ? require(`../../../assets/images/map/selected1.png`)
                      : require(`../../../assets/images/map/unselected1.png`)
                  }
                />
                <MapButton
                  style={{
                    top: 259,
                    left: 15,
                  }}
                  onPress={() => {
                    onPress(1);
                  }}
                >
                  <PlainText style={{ fontSize: 20 }}>?????????</PlainText>
                </MapButton>
                <Image //??????
                  style={{
                    resizeMode: "contain",
                    width: adjustedImage.width[1],
                    height: adjustedImage.height[1],
                    position: "absolute",
                    top: 229,
                    left: 21,
                  }}
                  source={
                    regionArr[1]
                      ? require(`../../../assets/images/map/selected2.png`)
                      : require(`../../../assets/images/map/unselected2.png`)
                  }
                />
                <MapButton
                  style={{
                    top: 150,
                    left: 10,
                  }}
                  onPress={() => {
                    onPress(2);
                  }}
                >
                  <PlainText style={{ fontSize: 20 }}>?????? ?????????</PlainText>
                </MapButton>
                <Image //?????????
                  style={{
                    resizeMode: "contain",
                    width: adjustedImage.width[2],
                    height: adjustedImage.height[2],
                    position: "absolute",
                    left: 2,
                    top: -1,
                  }}
                  source={
                    regionArr[2]
                      ? require(`../../../assets/images/map/selected3.png`)
                      : require(`../../../assets/images/map/unselected3.png`)
                  }
                />
                <MapButton
                  style={{
                    top: 160,
                    left: 160,
                  }}
                  onPress={() => {
                    onPress(3);
                  }}
                >
                  <PlainText style={{ fontSize: 20 }}>?????? ?????????</PlainText>
                </MapButton>
                <Image //?????????
                  style={{
                    resizeMode: "contain",
                    width: adjustedImage.width[3],
                    height: adjustedImage.height[3],
                    position: "absolute",
                    left: 110,
                    top: 37,
                  }}
                  source={
                    regionArr[3]
                      ? require(`../../../assets/images/map/selected4.png`)
                      : require(`../../../assets/images/map/unselected4.png`)
                  }
                />
                <MapButton
                  style={{
                    top: 357,
                    left: 61,
                  }}
                  onPress={() => {
                    onPress(4);
                  }}
                >
                  <PlainText style={{ fontSize: 20 }}>?????? ?????????</PlainText>
                </MapButton>
                <Image //?????????
                  style={{
                    resizeMode: "contain",
                    width: adjustedImage.width[4],
                    height: adjustedImage.height[4],
                    position: "absolute",
                    top: 276,
                    left: 41,
                  }}
                  source={
                    regionArr[4]
                      ? require(`../../../assets/images/map/selected5.png`)
                      : require(`../../../assets/images/map/unselected5.png`)
                  }
                />
                <MapButton
                  style={{
                    top: 318,
                    left: 200,
                  }}
                  onPress={() => {
                    onPress(5);
                  }}
                >
                  <PlainText style={{ fontSize: 20 }}>?????? ?????????</PlainText>
                </MapButton>
                <Image //?????????
                  style={{
                    resizeMode: "contain",
                    width: adjustedImage.width[5],
                    height: adjustedImage.height[5],
                    position: "absolute",
                    top: 218,
                    left: 140,
                  }}
                  source={
                    regionArr[5]
                      ? require(`../../../assets/images/map/selected6.png`)
                      : require(`../../../assets/images/map/unselected6.png`)
                  }
                />
              </Map>
            ) : null}
          </MapContainer>
          <GuideTextContainer>
            <PlainText
              style={{
                fontSize: 20,
                color: theme.darkFontColor,
              }}
            >
              ??????????????? ???????????? ??????, ?????? ??? ????????? ???????????????.{"\n"}
              ????????? ??????????????? ????????? ????????? ?????????.
            </PlainText>
          </GuideTextContainer>
        </Container>
        <SubmitButton text="????????????" onPress={onNextStep} />
      </Provider>
    </DefaultLayout>
  );
}

export default SignUpStep2;
