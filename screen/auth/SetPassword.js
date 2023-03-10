import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import DefaultLayout from "../../component/layout/DefaultLayout";
import TitleText from "../../component/text/TitleText";
import TitleInputItem from "../../component/item/TitleInputItem";
import { TextInput } from "../../component/input/TextInput";
import PlainText from "../../component/text/PlainText";
import SubmitButton from "../../component/button/SubmitButton";
import PlainButton from "../../component/button/PlainButton";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { checkPassword, showError } from "../../utils";
import axios from "axios";
import { VALID } from "../../constant";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { SERVER } from "../../server";

const AuthContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const PassWordContainer = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const Wrapper = styled.View`
  margin-top: 15px;
`;
function SetPassword() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [pass, setPass] = useState(false);
  const [phone, setPhone] = useState("01090665452"); //TODO: test code
  const passwordRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    register("newPassword", {
      required: true,
    });
    register("newPasswordCheck", {
      required: true,
    });
  }, [register]);

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  const clickAuthButton = () => {
    setPass(true); //TODO: test code
  };

  const onValid = ({ newPassword, newPasswordCheck }) => {
    console.log(newPassword, newPasswordCheck);

    if (newPassword === newPasswordCheck) {
      if (checkPassword(newPassword)) {
        axios
          .post(SERVER + "/users/password", {
            phone,
            password: newPassword,
          })
          .then(({ data }) => {
            const { result, msg } = data;

            if (result === VALID) {
              Toast.show({
                type: "errorToast",
                props: "??????????????? ?????? ???????????????.",
              });
              navigation.navigate("SignIn", {
                reset: true,
              });
            }
          })
          .catch((error) => {
            showError(error);
          })
          .finally(() => {});
      } else {
        Toast.show({
          type: "errorToast",
          props: "??????????????? ????????? ?????? ????????????.",
        });
      }
    } else {
      Toast.show({
        type: "errorToast",
        props: "??????????????? ???????????? ????????????.",
      });
    }
  };

  return (
    <DefaultLayout>
      <TitleText>???????????? ?????????</TitleText>

      {!pass ? (
        <AuthContainer>
          <PlainButton text="?????? ????????????" onPress={clickAuthButton} />
          <PlainText style={{ fontSize: 19 }}>
            ?????? ?????? ??? ???????????? ???????????? ???????????????.
          </PlainText>
        </AuthContainer>
      ) : (
        <PassWordContainer>
          <Wrapper>
            <TitleInputItem title="??? ????????????">
              <TextInput
                returnKeyType="next"
                onSubmitEditing={() => onNext(passwordRef)}
                secureTextEntry={true}
                onChangeText={(text) => setValue("newPassword", text)}
              />
            </TitleInputItem>
            <TitleInputItem title="??? ???????????? ??????">
              <TextInput
                ref={passwordRef}
                returnKeyType="done"
                secureTextEntry={true}
                onChangeText={(text) => setValue("newPasswordCheck", text)}
              />
            </TitleInputItem>
            <PlainText style={{ fontSize: 20 }}>
              * ??????, ????????? ????????? 8??? ????????? ?????????
            </PlainText>
          </Wrapper>
          <SubmitButton
            text="???????????? ?????????"
            onPress={handleSubmit(onValid)}
            disabled={!(watch("newPassword") && watch("newPasswordCheck"))}
          />
        </PassWordContainer>
      )}
    </DefaultLayout>
  );
}

SetPassword.propTypes = {};
export default SetPassword;
