import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { Image, StatusBar, useWindowDimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { color } from "../styles";
import UserContext from "../context/UserContext";
import MediumText from "../component/text/MediumText";
import InfoIcon from "../assets/images/icons/icon_info2.png";
import { Popup } from "../component/popup/Popup";
import RegularText from "../component/text/RegularText";
import Button from "../component/button/Button";
import { SERVER, VALID } from "../constant";
import axios from "axios";
import { getAsyncStorageToken, showErrorMessage } from "../utils";
import LoadingLayout from "../component/layout/LoadingLayout";

const Container = styled.View`
    flex: 1;
    background-color: white;
`;

const Actions = styled.View`
    flex: 0.35;
    padding: 0px 30px;
    align-items: center;
    justify-content: space-around;
`;

const TakePhotoBtn = styled.TouchableOpacity`
    width: 90px;
    height: 90px;
    border-radius: 90px;
    border: 4px solid ${color.btnAccent + "55"};
    justify-content: center;
    align-items: center;
`;

const CloseBtn = styled.TouchableOpacity`
    top: 20px;
    left: 20px;
    background-color: #00000055;
    align-self: flex-start;
    border-radius: 100px;
`;

const PhotoActions = styled(Actions)`
    flex-direction: row;
`;

const PopupTitle = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
`;

const LicenseExample = styled.View`
    align-items: center;
    margin: 15px 0px;
`;

function TakePhoto({ navigation, route }) {
    const { width: windowWidth } = useWindowDimensions();
    const camera = useRef();
    const [granted, setGranted] = useState(false);
    const [mediaLibraryGranted, setMediaLibraryGranted] = useState(false);
    const [takenPhoto, setTakenPhoto] = useState("");
    const [cameraType] = useState(Camera.Constants.Type.back);
    const [cameraReady, setCameraReady] = useState(false);
    const { info, setInfo } = useContext(UserContext);
    const [showExample, setShowExample] = useState(true);

    const [settingMode, setSettingMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    const hideModal = () => setShowExample(false);

    const getCameraPermissions = async () => {
        const { granted } = await Camera.requestCameraPermissionsAsync(
            setGranted(granted)
        );

        if (granted) {
            setGranted(granted);
        }
    };

    const getMediaLibraryPermissions = async () => {
        const { granted } = await MediaLibrary.requestPermissionsAsync();

        if (granted) {
            setMediaLibraryGranted(granted);
        }
    };

    useEffect(() => {
        if (route?.params?.modify) setSettingMode(true);

        getCameraPermissions();
        getMediaLibraryPermissions();
    }, []);

    const onCameraReady = () => setCameraReady(true);

    const takePhoto = async () => {
        if (camera.current && cameraReady) {
            const { uri } = await camera.current.takePictureAsync({
                quality: 0.5,
                exif: false,
                skipProcessing: true,
            });

            setTakenPhoto(uri);
            // const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.saveToLibraryAsync(uri);
        }
    };

    const onDismiss = () => setTakenPhoto("");

    const onUpload = () => {
        const newData =
            route?.params?.type === "vehicle"
                ? { vehiclePermissionUrl: takenPhoto }
                : { licenseUrl: takenPhoto };
        setInfo({ ...info, ...newData });

        goBack();
    };

    const goBack = () => {
        if (settingMode) {
            navigation.goBack();
        } else {
            navigation.navigate(
                route?.params?.type === "vehicle"
                    ? "VehicleLicense"
                    : "BusinessLicense"
            );
        }
    };

    const registLicense = async () => {
        setUploading(true);
        let uploadedUrl = null;

        if (route?.params?.type === "license") {
            uploadedUrl = await uploadLicense(takenPhoto);
        } else {
            uploadedUrl = await uploadVehiclePermission(takenPhoto);
        }

        try {
            const response = await axios.post(
                SERVER +
                    `/users/setting/${
                        route?.params?.type === "license"
                            ? "license"
                            : "permission"
                    }`,
                {
                    url: uploadedUrl,
                },
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: { result },
            } = response;

            if (result === VALID) {
                const {
                    data: {
                        data: { user },
                    },
                } = response;

                setInfo(user);
                navigation.goBack();
            }
        } catch (error) {
            console.log(error);
            navigation.goBack();
            showErrorMessage("등록에 실패하였습니다.");
        } finally {
            setUploading(false);
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
                    //DEVELOP: erroe 관련 toast 다시,,
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

    const isFocusd = useIsFocused();

    return (
        <Container>
            {uploading ? (
                <LoadingLayout />
            ) : (
                <>
                    {isFocusd ? <StatusBar hidden={true} /> : null}
                    {isFocusd ? (
                        granted && mediaLibraryGranted ? (
                            takenPhoto === "" ? (
                                <Camera
                                    style={{ flex: 1 }}
                                    type={cameraType}
                                    ref={camera}
                                    onCameraReady={onCameraReady}
                                    autoFocus="on"
                                >
                                    <CloseBtn onPress={goBack}>
                                        <Ionicons
                                            name="close"
                                            color="white"
                                            size={40}
                                        />
                                    </CloseBtn>
                                </Camera>
                            ) : (
                                <Image
                                    source={{ uri: takenPhoto }}
                                    style={{ flex: 1 }}
                                />
                            )
                        ) : null
                    ) : null}

                    {granted ? (
                        takenPhoto === "" ? (
                            <Actions>
                                <TakePhotoBtn onPress={takePhoto}>
                                    <Ionicons
                                        name="camera"
                                        size={50}
                                        color={color.main}
                                    />
                                </TakePhotoBtn>
                            </Actions>
                        ) : (
                            <PhotoActions>
                                <Button
                                    onPress={onDismiss}
                                    style={{ width: windowWidth * 0.35 }}
                                    text="재촬영"
                                />
                                <Button
                                    onPress={
                                        settingMode ? registLicense : onUpload
                                    }
                                    type="accent"
                                    style={{ width: windowWidth * 0.35 }}
                                    text={settingMode ? "등록하기" : "저장"}
                                />
                            </PhotoActions>
                        )
                    ) : null}
                    <Popup
                        visible={showExample}
                        onTouchOutside={hideModal}
                        onClick={hideModal}
                        width={windowWidth * 0.9}
                    >
                        <PopupTitle>
                            <Image
                                source={InfoIcon}
                                style={{ width: 20, height: 20 }}
                            />
                            <RegularText
                                style={{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    fontSize: 20,
                                }}
                            >
                                사진 예시
                            </RegularText>
                            <Image
                                source={InfoIcon}
                                style={{ width: 20, height: 20 }}
                            />
                        </PopupTitle>
                        <MediumText
                            style={{
                                color: color["page-grey-text"],
                                textAlign: "center",
                            }}
                        >
                            다음과 같이 촬영해주세요.
                        </MediumText>
                        <LicenseExample>
                            <Image
                                style={{
                                    resizeMode: "contain",
                                    width: windowWidth * 0.8,
                                    height: windowWidth * 0.8 * 1.2,
                                    borderColor: "#dddddd",
                                    borderWidth: 1,
                                }}
                                source={require(`../assets/images/license.png`)}
                            />
                        </LicenseExample>
                    </Popup>
                </>
            )}
        </Container>
    );
}

TakePhoto.propTypes = {};
export default TakePhoto;
