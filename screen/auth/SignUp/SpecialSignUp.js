import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FormLayout from "../../../component/layout/FormLayout";
import TitleText from "../../../component/text/TitleText";
import styled from "styled-components/native";
import { theme } from "../../../styles";
import SubTitleText from "../../../component/text/SubTitleText";
import VerticalDivider from "../../../component/divider/VerticalDivider";
import { COMPANY, PERSON } from "../../../constant";
import TitleInputItem from "../../../component/item/TitleInputItem";
import { TextInput } from "../../../component/input/TextInput";
import PlainText from "../../../component/text/PlainText";
import PlainButton from "../../../component/button/PlainButton";
import { useNavigation } from "@react-navigation/native";
import UserContext, { UserConsumer } from "../../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "../../../component/button/SubmitButton";
import { useForm } from "react-hook-form";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import BorderBox from "../../../component/box/BorderBox";
import HorizontalDivider from "../../../component/divider/HorizontalDivider";
import { SegmentedButtons } from "react-native-paper";

const UserDetailContainer = styled.View`
  margin-bottom: 10px;
`;

const UserDetailWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  height: 60px;
`;

const UserDetailButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 48%;
  height: 100%;
  background-color: ${(props) =>
    props.checked ? theme.btnPointColor + "66" : "white"};
`;

const WorkTypeButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid ${(props) => props.color};
`;

const SelectWorkType = styled.View`
  background-color: ${theme.sub.blue + "33"};
  margin-top: 5px;
`;

const SelectWorkTypeBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 0px 10px 0px;
  margin-left: 20px;
`;

const buttonProps = {
  fontSize: 22,
  color: "#555555",
};

const Password = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LicenseContainer = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const LicenseWrapper = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const LicenseExample = styled.View`
  align-items: center;
  background-color: #dddddd;
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Icon = styled.View`
  justify-content: center;
  align-items: center;
  width: 20%;
`;

const VehicleContainer = styled.View`
  background-color: ${theme.sub.blue + "33"};
  margin: 3px 5px 3px 5px;
  padding-bottom: 15px;
  border-radius: 10px;
  flex: 1;
`;

const VehicleWrapper = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: ${(props) => (props.center ? "center" : "space-evenly")};
  flex: 1;
`;

const VehicleType = styled.View``;
const VehicleWeight = styled.View`
  width: 30%;
`;

const RadioContainer = styled.View`
  flex-direction: row;
`;
const Radio = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AddButtonContainer = styled.View`
  align-items: center;
  margin-top: 10px;
`;
const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border: 2px solid ${theme.btnPointColor + "77"};
  border-radius: 50px;
  padding: 7px 13px 7px 10px;
  justify-content: space-between;
`;

const vehicleWeightArr = ["1t", "2.5t", "3.5t", "5t"];
const workTypeArr = [
  "건설 계열",
  "가구 계열",
  "가전 계열",
  "청소 / 인력 계열",
  "이사 계열",
  "기타",
];

function SpecialSignUp({ route }) {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const navigation = useNavigation();
  const { info, setInfo } = useContext(UserContext);

  const [userDetailType, setUserDetailType] = useState(""); //기사회원, 기업회원
  const [phoneAuth, setPhoneAuth] = useState(false); //휴대폰 본인인증
  const [vehicleType, setVehicleType] = useState(0);
  const [vehicleWeight, setVehicleWeight] = useState(0);
  const [vehicleList, setVehicleList] = useState([]);
  const [workType, setWorkType] = useState(-1);

  const [textSecure, setTextSecure] = useState(true);
  const [registVehicleVisible, setRegistVehicleVisible] = useState(false);
  const [workTypevisible, setWorkTypevisible] = useState(false);

  const passwordRef = useRef();
  const phoneRef = useRef();
  const vehicleWeightRef = useRef();

  useEffect(() => {
    setVehicleList([]);
    addVehicleList();
  }, []);

  useEffect(() => {
    register("name", {
      // required: true,
    });
    register("password", {
      // required: true,
    });
    register("phone", {
      // required: true,
    });
    register("recommendUserPhone");
    register("vehicleNum", {
      // required: true,
    });
  }, [register]);

  useEffect(() => {
    closeWorkTypeMenu();
  }, [workType]);
  const openWorkTypeMenu = () => setWorkTypevisible(true);

  const closeWorkTypeMenu = () => setWorkTypevisible(false);

  const addVehicleList = () => {
    const obj = { vehicleType: 0, vehicleWeight: 0, vehicleNum: "" };

    setVehicleList((prev) => [obj, ...prev]);
  };

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const takePicture = (type) => {
    navigation.navigate("TakePhoto", { type });
  };

  const getPhoneAuth = () => {
    console.log("본인인증");
    setPhoneAuth(true); //TODO:test code
  };

  const onValid = (data) => {
    console.log(data);
  };

  const next = () => {
    navigation.navigate("SignUpStep2");
  }; //TODO: test code

  const UserInfoContainer = () => (
    <>
      {userDetailType === COMPANY ? (
        <>
          <WorkTypeButton
            onPress={workTypevisible ? closeWorkTypeMenu : openWorkTypeMenu}
            color={workType > 0 ? theme.btnPointColor : theme.textBoxColor}
          >
            <Ionicons
              name={"checkmark-circle"}
              size={30}
              color={"rgba(1,1,1,0.0)"}
            />
            <SubTitleText style={{ fontSize: 18 }}>
              {workType < 0
                ? "사업 종류 선택"
                : `사업 종류 : ${workTypeArr[workType]}`}
            </SubTitleText>
            <Ionicons
              name={"checkmark-circle"}
              size={30}
              color={workType > 0 ? theme.btnPointColor : theme.textBoxColor}
            />
          </WorkTypeButton>
          {workTypevisible ? (
            <SelectWorkType>
              {workTypeArr.map((value, index) => (
                <View key={index}>
                  <SelectWorkTypeBtn onPress={() => setWorkType(index)}>
                    <PlainText>
                      {value}
                      {index === 0 ? " (철거, 인테리어, 샷시 등)" : null}
                    </PlainText>
                    <Ionicons
                      name="checkmark"
                      size={30}
                      color={theme.sub.blue}
                      style={{ opacity: index === workType ? 1 : 0 }}
                    />
                  </SelectWorkTypeBtn>
                  {index === workTypeArr.length - 1 ? null : (
                    <HorizontalDivider color={"#dddddd"} />
                  )}
                </View>
              ))}
            </SelectWorkType>
          ) : null}
        </>
      ) : null}
      <TitleInputItem title="이름/상호명">
        <TextInput
          placeholder="이름/상호명 (2자리 이상)"
          returnKeyType="next"
          onSubmitEditing={() => onNext(passwordRef)}
          onChangeText={(text) => setValue("name", text)}
        />
      </TitleInputItem>
      <TitleInputItem title="비밀번호">
        <Password>
          <TextInput
            ref={passwordRef}
            placeholder="비밀번호 (8자리 이상)"
            secureTextEntry={textSecure}
            returnKeyType="next"
            onChangeText={(text) => setValue("password", text)}
            onSubmitEditing={() => onNext(phoneRef)}
            width="87%"
          />
          <TouchableOpacity onPress={() => setTextSecure((prev) => !prev)}>
            <PlainText>보기</PlainText>
          </TouchableOpacity>
        </Password>
      </TitleInputItem>
      <TitleInputItem title="휴대폰번호">
        {/* TODO: 휴대폰 API 리턴값 따라 달라질 수 있음  */}
        <TextInput
          ref={phoneRef}
          onChangeText={(text) => setValue("phone", text)}
          placeholder="숫자만 적어주세요"
          keyboardType="number-pad"
          returnKeyType="done"
        />
      </TitleInputItem>
      <PlainButton text="본인인증하기" onPress={getPhoneAuth} />
      {/* TODO: 본인인증 완료 텍스트 추가 */}
      <LicenseContainer>
        <LicenseWrapper>
          <TitleInputItem title="사업자 등록증">
            <PlainText
              style={{
                fontSize: 20,
                padding: 10,
              }}
              numberOfLines={1}
            >
              <UserConsumer>
                {(data) => {
                  if (data?.info?.licenseUrl) {
                    const uri = data.info.licenseUrl;

                    const uriArr = uri.split("/");

                    return uriArr[uriArr.length - 1];
                  }
                  return "사진을 등록해주세요.";
                }}
              </UserConsumer>
            </PlainText>
          </TitleInputItem>
          <PlainButton text="촬영" onPress={() => takePicture("license")} />
        </LicenseWrapper>
        <LicenseExample>
          <Image
            style={{
              resizeMode: "contain",
              width: 120,
              height: 130,
              borderColor: "#dddddd",
              borderWidth: 1,
            }}
            source={require(`../../../assets/images/license.png`)}
          />
          <PlainText style={{ fontSize: 15 }}>예시</PlainText>
        </LicenseExample>
      </LicenseContainer>
      <TitleInputItem title="추천회원님 정보">
        <RowContainer>
          <TextInput
            placeholder="휴대폰 번호"
            returnKeyType="done"
            width="80%"
            onChangeText={(text) => {
              setValue("recommendUserPhone", text);
              // checkRecommnedUser(text);
            }}
            keyboardType="number-pad"
          />
          <Icon>
            {/* {checked ? (
                            checkUser ? (
                                <Ionicons
                                    name={"checkmark-circle"}
                                    size={40}
                                    color={"#33aa11"}
                                />
                            ) : (
                                <Ionicons
                                    name={"close-circle"}
                                    size={41}
                                    color={"#cc2222"}
                                />
                            )
                        ) : (
                            <Ionicons
                                name={"checkmark-circle"}
                                size={40}
                                color={"#33aa1155"}
                            />
                        )} */}
            <Ionicons name={"checkmark-circle"} size={40} color={"#33aa1155"} />
          </Icon>
        </RowContainer>
      </TitleInputItem>
      {userDetailType === COMPANY ? (
        <TitleInputItem title="차량번호">
          <TextInput
            placeholder="123가 0124"
            onChangeText={(text) => setValue("vehicleNum", text)}
          />
        </TitleInputItem>
      ) : null}
      <SubmitButton
        text={
          userDetailType === "" ||
          userDetailType === PERSON ||
          (userDetailType === COMPANY && watch("vehicleNum"))
            ? "차량등록하러 가기"
            : "작업지역 선택"
        }
        // disabled={
        //     !(
        //         watch("name") &&
        //         watch("password") &&
        //         watch("phone")
        //     )
        // }
        // onPress={handleSubmit(onValid)}
        onPress={() =>
          userDetailType === COMPANY && !watch("vehicleNum")
            ? next()
            : setRegistVehicleVisible(true)
        }
        style={{ marginTop: 20 }}
      />
    </>
  );

  const RegistVehicle = () => (
    <>
      <View style={{ marginBottom: 20 }}>
        <SubTitleText style={{ paddingBottom: 5 }}>차량 등록</SubTitleText>
        {vehicleList.map((value, index) => (
          <VehicleContainer key={index}>
            <VehicleWrapper>
              <VehicleType>
                <RadioButton.Group
                  onValueChange={(newValue) => setVehicleType(newValue)}
                  value={vehicleType}
                >
                  <RadioContainer>
                    <Radio>
                      <RadioButton value={1} color={theme.sub.blue} />
                      <PlainText>사다리</PlainText>
                    </Radio>
                    <Radio>
                      <RadioButton value={2} color={theme.sub.blue} />
                      <PlainText>스카이</PlainText>
                    </Radio>
                  </RadioContainer>
                </RadioButton.Group>
                {/* <SegmentedButtons
                  value={vehicleType}
                  onValueChange={setVehicleType}
                  buttons={[
                    {
                      value: "walk",
                      label: "Walking",
                    },
                    {
                      value: "train",
                      label: "Transit",
                    },
                    { value: "drive", label: "Driving" },
                  ]}
                /> */}
              </VehicleType>
              <VehicleWeight>
                <Picker //TODO: Picker style
                  ref={vehicleWeightRef}
                  selectedValue={vehicleWeightArr[vehicleWeight]}
                  onValueChange={(itemValue, itemIndex) =>
                    setVehicleWeight(itemIndex)
                  }
                  style={{
                    width: "100%",
                    backgroundColor: "#ffffffcc",
                    margin: 10,
                  }}
                >
                  {vehicleWeightArr.map((value, index) => (
                    <Picker.Item
                      key={index}
                      label={value}
                      value={value}
                      style={{
                        fontSize: 18,
                      }}
                    />
                  ))}
                </Picker>
              </VehicleWeight>
            </VehicleWrapper>
            <VehicleWrapper center={true}>
              <PlainText
                style={{
                  marginRight: 10,
                }}
              >
                차량번호
              </PlainText>
              <BorderBox>
                {/*TODO: 기업회원인 경우 첛번째 차량번호에 받은 값 자동으로 넣기 */}
                <TextInput
                  placeholder="123아 0124"
                  onChangeText={(text) => setValue("vehicleNum", text)}
                  width="255px"
                />
              </BorderBox>
            </VehicleWrapper>
          </VehicleContainer>
        ))}
        <AddButtonContainer>
          <AddButton onPress={() => addVehicleList()}>
            <Ionicons name="add" size={35} color={theme.btnPointColor} />

            <PlainText>차량추가</PlainText>
          </AddButton>
        </AddButtonContainer>
      </View>
      <LicenseContainer>
        <LicenseWrapper>
          <TitleInputItem title="화물자동차 운송사업 허가증">
            <PlainText
              style={{
                fontSize: 20,
                padding: 10,
              }}
              numberOfLines={1}
            >
              <UserConsumer>
                {(data) => {
                  if (data?.info?.vehiclePermissionUrl) {
                    const uri = data.info.vehiclePermissionUrl;

                    const uriArr = uri.split("/");

                    return uriArr[uriArr.length - 1];
                  }
                  return "사진을 등록해주세요.";
                }}
              </UserConsumer>
            </PlainText>
          </TitleInputItem>
          <PlainButton text="촬영" onPress={() => takePicture("vehicle")} />
        </LicenseWrapper>
        <LicenseExample>
          <Image
            style={{
              resizeMode: "contain",
              width: 120,
              height: 130,
              borderColor: "#dddddd",
              borderWidth: 1,
            }}
            source={require(`../../../assets/images/vehiclePermission.jpg`)}
          />
          <PlainText style={{ fontSize: 15 }}>예시</PlainText>
        </LicenseExample>
      </LicenseContainer>
      <SubmitButton
        text="작업지역 선택"
        // disabled={
        //     !(
        //         watch("name") &&
        //         watch("password") &&
        //         watch("phone")
        //     )
        // }
        // onPress={handleSubmit(onValid)}
        onPress={next}
        style={{ marginTop: 20 }}
      />
    </>
  );

  return (
    <FormLayout>
      <TitleText>회원가입</TitleText>
      <ScrollView>
        <TouchableWithoutFeedback>
          <View style={{ marginBottom: 10 }}>
            <UserDetailContainer>
              <UserDetailWrapper>
                <UserDetailButton
                  onPress={() => {
                    setUserDetailType(PERSON);
                  }}
                  checked={userDetailType === PERSON ? true : false}
                >
                  <SubTitleText style={buttonProps}>기사회원</SubTitleText>
                </UserDetailButton>
                <VerticalDivider color="#cccccc" />
                <UserDetailButton
                  onPress={() => {
                    setUserDetailType(COMPANY);
                  }}
                  checked={userDetailType === COMPANY ? true : false}
                >
                  <SubTitleText style={buttonProps}>기업회원</SubTitleText>
                </UserDetailButton>
              </UserDetailWrapper>
            </UserDetailContainer>
            {!registVehicleVisible ? UserInfoContainer() : RegistVehicle()}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </FormLayout>
  );
}

export default SpecialSignUp;
