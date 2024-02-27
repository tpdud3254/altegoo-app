import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";
import UserContext from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SERVER, VALID } from "../../../constant";
import LoginContext from "../../../context/LoginContext";
import * as Location from "expo-location";
import axios from "axios";
import {
    SetAsyncStorageUid,
    SetAsyncStorageUserType,
    setAsyncStorageToken,
    showErrorMessage,
} from "../../../utils";
import LoadingLayout from "../../../component/layout/LoadingLayout";

const Container = styled.View`
    align-items: center;
    flex: 1;
    background-color: white;
`;

function SignUpComplete() {
    const navigation = useNavigation();
    const { info, setInfo } = useContext(UserContext);
    const { setIsLoggedIn, setFirstLogin } = useContext(LoginContext);

    useEffect(() => {
        console.log(info);
        createAccount();
    }, []);

    const createAccount = async () => {
        //로그인지역 가져오기
        let accessedRegion = "조회 실패";
        // const {
        //     coords: { latitude, longitude },
        // } = await Location.getCurrentPositionAsync({
        //     accuracy: 5,
        // });

        // try {
        //     //DEVELOP: 연동 부분 이렇게 바꾸기
        //     const response = await axios.get(
        //         `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
        //         {
        //             headers: {
        //                 Authorization:
        //                     "KakaoAK 86e0df46fbae745bb4c658276b280088",
        //             },
        //         }
        //     );

        //     console.log(response.data);
        //     const {
        //         data: {
        //             documents,
        //             meta: { total_count },
        //         },
        //     } = response;

        //     if (total_count > 0)
        //         accessedRegion = `${documents[0].address.region_1depth_name}>${documents[0].address.region_2depth_name}`;
        // } catch (error) {
        //     console.log(error);
        // }

        let uploadedLicense = null;
        let uploadedVehiclePermission = null;

        if (info.licenseUrl) {
            uploadedLicense = await uploadLicense(info.licenseUrl);
        }

        if (info.vehiclePermissionUrl) {
            uploadedVehiclePermission = await uploadVehiclePermission(
                info.vehiclePermissionUrl
            );
        }

        const sendingData = {
            userType: info.userType || null,
            name: info.name || null,
            phone: info.phone || null,
            password: info.password || null,
            birth: info.birth || null,
            gender: info.gender || null,
            sms: info.sms || false,
            license: uploadedLicense || null,
            recommendUserId: info.recommendUserId || null,
            companyName: info.companyName || null,
            companyPersonName: info.companyPersonName || null,
            workCategory: info.workCategory || null,
            vehicle: info.vehicle ? [info.vehicle] : [],
            vehiclePermission: uploadedVehiclePermission || null,
            workRegion: info.workRegion || null,
            accessedRegion: accessedRegion,
            status: "정상", //고정값
            grade: 1, //고정값
        };

        console.log(sendingData);

        try {
            const response = await axios.post(SERVER + "/users/create", {
                ...sendingData,
            });

            const {
                data: { data, result },
            } = response;

            console.log(data);
            console.log(result);
            if (result === VALID) {
                signIn(info.phone, info.password);
                setInfo({ ...data });
            } else {
                navigation.goBack();
                showErrorMessage("회원가입에 실패하였습니다.");
            }
        } catch (e) {
            navigation.goBack();
            showErrorMessage("회원가입에 실패하였습니다.");
        }
    };

    const uploadLicense = (fileName) => {
        return new Promise((resolve, reject) => {
            const localUri = fileName;
            const filename = localUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename ?? "");
            const type = match ? `image/${match[1]}` : `image`;
            const formData = new FormData();
            console.log(filename, type);
            formData.append("file", { uri: localUri, name: filename, type });

            axios
                .post(
                    SERVER + "/users/license",
                    {
                        formData,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        transformRequest: [
                            function () {
                                return formData;
                            },
                        ],
                    }
                )
                .then(({ data }) => {
                    const {
                        data: { location },
                        result,
                    } = data;
                    if (result === VALID) {
                        console.log("license url : ", location);
                        resolve(location);
                    }
                })
                .catch((error) => {
                    //DEVELOP: showError 함수 삭제
                    showErrorMessage(error);
                })
                .finally(() => {});
        });
    };

    const uploadVehiclePermission = (fileName) => {
        return new Promise((resolve, reject) => {
            const localUri = fileName;
            const filename = localUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename ?? "");
            const type = match ? `image/${match[1]}` : `image`;
            const formData = new FormData();
            console.log(filename, type);
            formData.append("file", { uri: localUri, name: filename, type });

            axios
                .post(
                    SERVER + "/users/permission",
                    {
                        formData,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        transformRequest: [
                            function () {
                                return formData;
                            },
                        ],
                    }
                )
                .then(({ data }) => {
                    const {
                        data: { location },
                        result,
                    } = data;
                    if (result === VALID) {
                        resolve(location);
                    }
                })
                .catch((error) => {
                    showErrorMessage(error);
                })
                .finally(() => {});
        });
    };

    const signIn = async (phone, password) => {
        try {
            const response = await axios.post(SERVER + "/users/login", {
                phone,
                password,
            });

            console.log("signIn : ", response.data);
            const {
                data: {
                    result,
                    data: { token, user },
                },
            } = response;

            if (result === VALID) {
                console.log("Current User : ", user);
                console.log("Token : ", token);
                setInfo(user);
                await setAsyncStorageToken(token);
                await SetAsyncStorageUid(user.id);
                await SetAsyncStorageUserType(user.userTypeId);
                setIsLoggedIn(true);
                setFirstLogin(true);
            } else {
                navigation.navigate("SignInNavigator");
                showErrorMessage("자동 로그인에 실패하였습니다.");
            }
        } catch (error) {
            console.log(error);
            navigation.navigate("SignInNavigator");
            showErrorMessage("자동 로그인에 실패하였습니다.");
        }
    };

    return (
        <Container>
            <LoadingLayout />
        </Container>
    );
}

export default SignUpComplete;
