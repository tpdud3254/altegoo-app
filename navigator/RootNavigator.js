import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginContext from "../context/LoginContext";
import IntroNavigator from "./Auth/IntroNavigator";
import MainNavigator from "./Main/MainNavigator";
import axios from "axios";
import { SERVER } from "../constant";
import UserContext from "../context/UserContext";
import LoadingLayout from "../component/layout/LoadingLayout";
import { VALID } from "../constant";
import {
    SetAsyncStorageEventPopupShown,
    SetAsyncStorageUid,
    SetAsyncStorageUserType,
    getAsyncStorageToken,
    showError,
} from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootNavigator() {
    const [loading, setLoading] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
    const { setInfo } = useContext(UserContext);

    useEffect(() => {
        async function getStorage() {
            const token = await getAsyncStorageToken();
            console.log("token : ", token);
            if (token) {
                axios
                    .post(SERVER + "/users/user", {
                        token,
                    })
                    .then(({ data }) => {
                        const { result, data: user, msg } = data;
                        if (result === VALID) {
                            setInfo(user.user);
                            setLoading(true);
                            setIsLoggedIn(true);
                            SetAsyncStorageUid(user.user.id);
                            SetAsyncStorageUserType(user.user.userTypeId);
                            SetAsyncStorageEventPopupShown(false);
                        } else {
                            //로그인 정보 가져오지 못할 시 로그인 화면으로 나가게끔 처리
                            setLoading(true);
                            setIsLoggedIn(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        showError(error);
                        setLoading(true);
                        setIsLoggedIn(false);
                    })
                    .finally(() => {});
            } else {
                setLoading(true);
                setIsLoggedIn(false);
            }
        }

        getStorage();

        //로그아웃 테스트 코드
        const logout = async () => {
            setLoading(true);
            setIsLoggedIn(false);
            setInfo({});
            await AsyncStorage.removeItem("token");
        };
        // logout();
    }, []);

    return (
        <>
            {loading ? (
                <NavigationContainer>
                    {isLoggedIn ? <MainNavigator /> : <IntroNavigator />}
                </NavigationContainer>
            ) : (
                <LoadingLayout />
            )}
        </>
    );
}
