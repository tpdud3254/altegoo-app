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
import { COMPANY, PERSON, VALID } from "../../../constant";
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
import { Toast } from "react-native-toast-message/lib/src/Toast";
import axios from "axios";
import { SERVER } from "../../../server";
import { checkPassword, getAsyncStorageToken, showError } from "../../../utils";

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
const workCategoryArr = [
  "?????? ??????",
  "?????? ??????",
  "?????? ??????",
  "?????? / ?????? ??????",
  "?????? ??????",
  "??????",
];

function SpecialSignUp({ route }) {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const navigation = useNavigation();
  const { info, setInfo } = useContext(UserContext);

  const [userDetailType, setUserDetailType] = useState(""); //????????????, ????????????
  const [phoneAuth, setPhoneAuth] = useState(false); //????????? ????????????
  const [recommendUserId, setRecommendUserId] = useState(0);
  const [checkRecommendUser, setCheckRecommendUser] = useState(false);
  const [vehicleList, setVehicleList] = useState([]);
  const [workCategory, setWorkCategory] = useState(-1);

  const [textSecure, setTextSecure] = useState(true);
  const [registVehicleVisible, setRegistVehicleVisible] = useState(false);
  const [workCategoryVisible, setWorkCategoryVisible] = useState(false);

  const passwordRef = useRef();
  const phoneRef = useRef();
  const vehicleWeightRef = useRef();

  useEffect(() => {
    setVehicleList([]);
    addVehicleList();
  }, []);

  useEffect(() => {
    register("name", {
      required: true,
    });
    register("password", {
      required: true,
    });
    register("phone", {
      required: true,
    });
    register("recommendUserPhone");
    register("vehicleNum");
  }, [register]);

  useEffect(() => {
    closeWorkTypeMenu();
  }, [workCategory]);

  useEffect(() => {
    setRegistVehicleVisible(false);
    setWorkCategoryVisible(false);
  }, [userDetailType]);

  const openWorkTypeMenu = () => setWorkCategoryVisible(true);

  const closeWorkTypeMenu = () => setWorkCategoryVisible(false);

  const addVehicleList = () => {
    const obj = { type: 0, weight: 0, number: "" };

    setVehicleList((prev) => [...prev, obj]);
  };

  const deleteVehicleList = (index) => {
    const newList = vehicleList;

    newList.splice(index, 1);

    setVehicleList([...newList]);
  };

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const takePicture = (type) => {
    navigation.navigate("TakePhoto", { type });
  };

  const setVehicleType = (value, index) => {
    const newList = vehicleList;

    newList[index].type = value;

    setVehicleList([...newList]);
  };

  const setVehicleWeight = (value, index) => {
    const newList = vehicleList;

    newList[index].weight = value;

    setVehicleList([...newList]);
  };

  const setVehicleNumber = (value, index) => {
    const newList = vehicleList;

    newList[index].number = value;

    setVehicleList([...newList]);
  };

  const getPhoneAuth = ({ phone }) => {
    console.log("???????????? : ", phone);

    axios
      .get(SERVER + "/users/search", {
        params: {
          phone,
        },
        headers: {
          token: getAsyncStorageToken(),
        },
      })
      .then(({ data }) => {
        const { result } = data;

        if (result === VALID) {
          Toast.show({
            type: "errorToast",
            props: "?????? ???????????? ??????????????????.",
          });
          setPhoneAuth(false);
        } else {
          setPhoneAuth(true); //TODO:test code
        }
      })
      .catch((error) => {
        showError(error);
        setPhoneAuth(true); //TODO:test code
      })
      .finally(() => {});
  };

  const checkRecommnedUser = async (phone) => {
    axios
      .get(SERVER + "/users/search", {
        params: {
          phone,
        },
        headers: {
          token: getAsyncStorageToken(),
        },
      })
      .then(({ data }) => {
        const { result, userId } = data;

        if (result === VALID) {
          setRecommendUserId(userId);
        } else {
          setRecommendUserId(0);
        }
      })
      .catch((error) => {
        showError(error);

        setRecommendUserId(0);
      })
      .finally(() => {
        setCheckRecommendUser(true);
      });
  };

  const onValidUserInfo = (data) => {
    console.log("data: ", data);
    //????????????, ???????????? ?????? ????????????
    if (userDetailType === "") {
      Toast.show({
        type: "errorToast",
        props: "?????? ????????? ??????????????????.",
      });
      return;
    }

    if (data.name.length < 2) {
      Toast.show({
        type: "errorToast",
        props: "????????? 2?????? ?????? ??????????????????.",
      });
      return;
    }

    if (data.password.length < 8) {
      Toast.show({
        type: "errorToast",
        props: "??????????????? 8?????? ?????? ??????????????????.",
      });

      return;
    }

    if (!checkPassword(data.password)) {
      Toast.show({
        type: "errorToast",
        props: "??????????????? ????????? ?????? ????????????.",
      });

      return;
    }

    if (data.phone.length < 1) {
      //TODO: ??????????????? api ???????????? ?????? ????????? ??? ??????
      Toast.show({
        type: "errorToast",
        props: "?????????????????? ??????????????????.",
      });

      return;
    }

    if (!phoneAuth) {
      Toast.show({
        type: "errorToast",
        props: "????????? ??????????????? ??????????????????.",
      });

      return;
    }

    if (!info.licenseUrl || info.licenseUrl === "") {
      Toast.show({
        type: "errorToast",
        props: "????????? ???????????? ??????????????????.",
      });

      return;
    }

    if (userDetailType === PERSON) {
      //???????????? ????????????
      if (!checkRecommendUser) {
        Toast.show({
          type: "errorToast",
          props: "?????? ????????? ??????????????????.",
        });

        return;
      }

      if (recommendUserId === 0) {
        Toast.show({
          type: "errorToast",
          props: "????????? ?????? ????????? ??????????????????.",
        });

        return;
      }

      setRegistVehicleVisible(true);
    } else {
      //???????????? ????????????
      if (workCategory < 0) {
        Toast.show({
          type: "errorToast",
          props: "?????? ????????? ??????????????????.",
        });

        setWorkCategoryVisible(true);
        return;
      }

      if (!data.vehicleNum || data.vehicleNum.length < 0) {
        //??????????????? ?????? ??????
        onNextStep();
      } else {
        setRegistVehicleVisible(true);
      }
    }
  };

  const onValidRegist = (data) => {
    let vehicleListError = false;

    vehicleList.map((value, index) => {
      if (value.number === "" || value.type === 0 || value.weight === 0)
        vehicleListError = true;
    });

    if (vehicleListError) {
      if (vehicleList.length > 1) {
        Toast.show({
          type: "errorToast",
          props: "????????? ??????????????? ??????????????????.",
        });

        return;
      } else {
        Toast.show({
          type: "errorToast",
          props: "??????????????? ??????????????????.",
        });

        return;
      }
    }

    if (!info.vehiclePermissionUrl || info.vehiclePermissionUrl === "") {
      Toast.show({
        type: "errorToast",
        props: "??????????????? ???????????? ???????????? ??????????????????.",
      });

      return;
    }

    onNextStep();
  };

  const onNextStep = () => {
    const { name, password, phone } = getValues();

    const authData = {
      //TODO:: test code
      userName: "?????????",
      gender: "???",
      birth: "580820",
    };

    const sendingData = {
      userDetailType,
      name,
      password,
      phone,
      license: info.licenseUrl,
      vehicle: vehicleList,
      vehiclePermission: info.vehiclePermissionUrl || null,
      recommendUserId: recommendUserId === 0 ? null : recommendUserId,
      workCategory: workCategory > -1 ? workCategory + 1 : null,
      ...authData,
    };
    setInfo({ ...info, ...sendingData });

    navigation.navigate("SignUpStep2");
  };

  const UserInfoContainer = () => (
    <>
      {userDetailType === COMPANY ? (
        <>
          <WorkTypeButton
            onPress={workCategoryVisible ? closeWorkTypeMenu : openWorkTypeMenu}
            color={workCategory > 0 ? theme.btnPointColor : theme.textBoxColor}
          >
            <Ionicons
              name={"checkmark-circle"}
              size={30}
              color={"rgba(1,1,1,0.0)"}
            />
            <SubTitleText style={{ fontSize: 18 }}>
              {workCategory < 0
                ? "?????? ?????? ??????"
                : `?????? ?????? : ${workCategoryArr[workCategory]}`}
            </SubTitleText>
            <Ionicons
              name={"checkmark-circle"}
              size={30}
              color={
                workCategory > 0 ? theme.btnPointColor : theme.textBoxColor
              }
            />
          </WorkTypeButton>
          {workCategoryVisible ? (
            <SelectWorkType>
              {workCategoryArr.map((value, index) => (
                <View key={index}>
                  <SelectWorkTypeBtn onPress={() => setWorkCategory(index)}>
                    <PlainText>
                      {value}
                      {index === 0 ? " (??????, ????????????, ?????? ???)" : null}
                    </PlainText>
                    <Ionicons
                      name="checkmark"
                      size={30}
                      color={theme.sub.blue}
                      style={{ opacity: index === workCategory ? 1 : 0 }}
                    />
                  </SelectWorkTypeBtn>
                  {index === workCategoryArr.length - 1 ? null : (
                    <HorizontalDivider color={"#dddddd"} />
                  )}
                </View>
              ))}
            </SelectWorkType>
          ) : null}
        </>
      ) : null}
      <TitleInputItem title="??????/?????????">
        <TextInput
          placeholder="??????/????????? (2?????? ??????)"
          returnKeyType="next"
          onSubmitEditing={() => onNext(passwordRef)}
          onChangeText={(text) => setValue("name", text)}
        />
      </TitleInputItem>
      <TitleInputItem title="????????????">
        <Password>
          <TextInput
            ref={passwordRef}
            placeholder="???????????? (8?????? ??????)"
            secureTextEntry={textSecure}
            returnKeyType="next"
            onChangeText={(text) => setValue("password", text)}
            onSubmitEditing={() => onNext(phoneRef)}
            width="87%"
          />
          <TouchableOpacity onPress={() => setTextSecure((prev) => !prev)}>
            <PlainText>??????</PlainText>
          </TouchableOpacity>
        </Password>
      </TitleInputItem>
      <TitleInputItem title="???????????????">
        {/* TODO: ????????? API ????????? ?????? ????????? ??? ??????  */}
        <TextInput
          ref={phoneRef}
          onChangeText={(text) => setValue("phone", text)}
          placeholder="????????? ???????????????"
          keyboardType="number-pad"
          returnKeyType="done"
        />
      </TitleInputItem>
      <PlainButton
        text={phoneAuth ? "??????????????????" : "??????????????????"}
        onPress={handleSubmit(getPhoneAuth)}
        style={{ ...(phoneAuth ? { backgroundColor: theme.sub.blue } : null) }}
      />
      <LicenseContainer>
        <LicenseWrapper>
          <TitleInputItem title="????????? ?????????">
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
                  return "????????? ??????????????????.";
                }}
              </UserConsumer>
            </PlainText>
          </TitleInputItem>
          <PlainButton text="??????" onPress={() => takePicture("license")} />
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
          <PlainText style={{ fontSize: 15 }}>??????</PlainText>
        </LicenseExample>
      </LicenseContainer>
      <TitleInputItem title="??????????????? ??????">
        <RowContainer>
          <TextInput
            placeholder="????????? ??????"
            returnKeyType="done"
            width="80%"
            onChangeText={(text) => {
              setValue("recommendUserPhone", text);
              text.length > 10 ? checkRecommnedUser(text) : null;
            }}
            keyboardType="number-pad"
          />
          <Icon>
            {checkRecommendUser ? (
              recommendUserId !== 0 ? (
                <Ionicons
                  name={"checkmark-circle"}
                  size={40}
                  color={"#33aa11"}
                />
              ) : (
                <Ionicons name={"close-circle"} size={40} color={"#cc2222"} />
              )
            ) : (
              <Ionicons
                name={"checkmark-circle"}
                size={40}
                color={"#33aa1155"}
              />
            )}
          </Icon>
        </RowContainer>
      </TitleInputItem>
      {userDetailType === COMPANY ? (
        <TitleInputItem title="????????????">
          <TextInput
            placeholder="123??? 0124"
            onChangeText={(text) => {
              setValue("vehicleNum", text);
              setVehicleNumber(text, 0);
            }}
          />
        </TitleInputItem>
      ) : null}
      <SubmitButton
        text={
          userDetailType === COMPANY && !watch("vehicleNum")
            ? "???????????? ??????"
            : "?????????????????? ??????"
        }
        disabled={!(watch("name") && watch("password") && watch("phone"))}
        onPress={handleSubmit(onValidUserInfo)}
        style={{ marginTop: 20 }}
      />
    </>
  );

  const RegistVehicle = () => (
    <>
      <View style={{ marginBottom: 20 }}>
        <SubTitleText style={{ paddingBottom: 5 }}>?????? ??????</SubTitleText>
        {vehicleList.map((value, index) => (
          <VehicleContainer key={index}>
            <VehicleWrapper>
              <VehicleType>
                <RadioButton.Group
                  onValueChange={(newValue) => setVehicleType(newValue, index)}
                  value={vehicleList[index].type}
                >
                  <RadioContainer>
                    <Radio>
                      <RadioButton value={1} color={theme.sub.blue} />
                      <PlainText>?????????</PlainText>
                    </Radio>
                    <Radio>
                      <RadioButton value={2} color={theme.sub.blue} />
                      <PlainText>?????????</PlainText>
                    </Radio>
                  </RadioContainer>
                </RadioButton.Group>
              </VehicleType>
              <VehicleWeight>
                <Picker //TODO: Picker style
                  ref={vehicleWeightRef}
                  selectedValue={vehicleWeightArr[vehicleList[index].weight]}
                  onValueChange={(itemValue, itemIndex) =>
                    setVehicleWeight(itemIndex, index)
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
                ????????????
              </PlainText>
              <BorderBox>
                <TextInput
                  placeholder="123??? 0124"
                  onChangeText={(text) => {
                    setVehicleNumber(text, index);
                  }}
                  width="255px"
                  value={
                    userDetailType === COMPANY && index === 0
                      ? vehicleList[0].number
                      : null
                  }
                />
              </BorderBox>
            </VehicleWrapper>
            {index > 0 ? (
              <VehicleWrapper>
                <PlainButton
                  text="??????"
                  onPress={() => deleteVehicleList(index)}
                  style={{ width: 70, height: 40, marginTop: 20 }}
                />
              </VehicleWrapper>
            ) : null}
          </VehicleContainer>
        ))}
        <AddButtonContainer>
          <AddButton onPress={addVehicleList}>
            <Ionicons name="add" size={35} color={theme.btnPointColor} />

            <PlainText>????????????</PlainText>
          </AddButton>
        </AddButtonContainer>
      </View>
      <LicenseContainer>
        <LicenseWrapper>
          <TitleInputItem title="??????????????? ???????????? ?????????">
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
                  return "????????? ??????????????????.";
                }}
              </UserConsumer>
            </PlainText>
          </TitleInputItem>
          <PlainButton text="??????" onPress={() => takePicture("vehicle")} />
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
          <PlainText style={{ fontSize: 15 }}>??????</PlainText>
        </LicenseExample>
      </LicenseContainer>
      <SubmitButton
        text="???????????? ??????"
        onPress={handleSubmit(onValidRegist)}
        style={{ marginTop: 20 }}
      />
    </>
  );

  return (
    <FormLayout>
      <TitleText>????????????</TitleText>
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
                  <SubTitleText style={buttonProps}>????????????</SubTitleText>
                </UserDetailButton>
                <VerticalDivider color="#cccccc" />
                <UserDetailButton
                  onPress={() => {
                    setUserDetailType(COMPANY);
                  }}
                  checked={userDetailType === COMPANY ? true : false}
                >
                  <SubTitleText style={buttonProps}>????????????</SubTitleText>
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
