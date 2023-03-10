import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import FormLayout from "../../../component/layout/FormLayout";
import TitleText from "../../../component/text/TitleText";
import TitleInputItem from "../../../component/item/TitleInputItem";
import { TextInput } from "../../../component/input/TextInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import PlainText from "../../../component/text/PlainText";
import SubmitButton from "../../../component/button/SubmitButton";
import { useForm } from "react-hook-form";
import { checkPassword, getAsyncStorageToken, showError } from "../../../utils";
import Toast from "react-native-toast-message";
import PlainButton from "../../../component/button/PlainButton";
import axios from "axios";
import { SERVER } from "../../../server";
import { VALID } from "../../../constant";
import { theme } from "../../../styles";

const Container = styled.View`
  flex: 1;
`;
const Title = styled.View`
  margin-bottom: 15px;
`;

const InputContainer = styled.View``;

const ButtonContainer = styled.View``;

const Password = styled.View`
  flex-direction: row;
  align-items: center;
`;

function OrdinarySignUp() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [textSecure, setTextSecure] = useState(true);
  const [phoneAuth, setPhoneAuth] = useState(false);
  const { info, setInfo } = useContext(UserContext);
  const navigation = useNavigation();

  const passwordRef = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    console.log(info);
    register("name", {
      required: true,
    });
    register("password", {
      required: true,
    });
    register("phone", {
      required: true,
    });
  }, [register]);

  const showPassword = () => {
    setTextSecure((prev) => !prev);
  };

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const onNextStep = ({ name, password, phone }) => {
    const authData = {
      userName: "?????????",
      gender: "???",
      birth: "580820",
    };
    const newData = { name, password, phone };
    setInfo({ ...newData, ...info, ...authData });
    navigation.navigate("SignUpStep3");
  };

  const getPhoneAuth = ({ phone }) => {
    console.log("????????????");
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
  const onValid = ({ name, password, phone }) => {
    if (name.length < 2) {
      Toast.show({
        type: "errorToast",
        props: "????????? 2?????? ?????? ??????????????????.",
      });
      return;
    }

    if (password.length < 8) {
      Toast.show({
        type: "errorToast",
        props: "??????????????? 8?????? ?????? ??????????????????.",
      });

      return;
    }

    if (!checkPassword(password)) {
      Toast.show({
        type: "errorToast",
        props: "??????????????? ????????? ?????? ????????????.",
      });

      return;
    }

    if (!phoneAuth) {
      Toast.show({
        type: "errorToast",
        props: "?????? ????????? ??????????????????.",
      });

      return;
    }

    onNextStep({ name, password, phone });
  };

  return (
    <FormLayout>
      <Container>
        <Title>
          <TitleText>????????????</TitleText>
        </Title>
        <InputContainer>
          <View>
            <TitleInputItem title="??????">
              <TextInput
                placeholder="?????? (2?????? ??????)"
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
                  onSubmitEditing={() => onNext(phoneRef)}
                  onChangeText={(text) => setValue("password", text)}
                  width="87%"
                />
                <TouchableOpacity onPress={showPassword}>
                  <PlainText>??????</PlainText>
                </TouchableOpacity>
              </Password>
            </TitleInputItem>
          </View>
          <PlainText style={{ fontSize: 20, marginTop: -5 }}>
            * ??????, ????????? ????????? 8??? ????????? ?????????
          </PlainText>
          <TitleInputItem title="???????????????">
            {/* TODO: ????????? API ????????? ?????? ????????? ??? ?????? */}
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
            style={{
              ...(phoneAuth ? { backgroundColor: theme.sub.blue } : null),
            }}
          />
          {/* TODO: ???????????? ?????? ????????? ?????? */}
        </InputContainer>
      </Container>
      <ButtonContainer>
        <SubmitButton
          text="????????????"
          disabled={!(watch("name") && watch("password") && watch("phone"))}
          onPress={handleSubmit(onValid)}
        />
      </ButtonContainer>
    </FormLayout>
  );
}

export default OrdinarySignUp;
