import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { FONTS, FONT_OFFSET } from "../../constant";
import { color } from "../../styles";
import { Image } from "react-native";
import MemberInformation from "../../screen/main/setting/MemberInformation";
import PointMain from "../../screen/main/setting/point/PointMain";
import PointBreakdown from "../../screen/main/setting/point/PointBreakdown";
import ChargePoint from "../../screen/main/setting/point/ChargePoint";
import WithdrawalPoint from "../../screen/main/setting/point/WithdrawalPoint";
import RegistPointAccount from "../../screen/main/setting/point/RegistPointAccount";
import RecommandedUser from "../../screen/main/setting/RecommandedUser";
import ChangePassword from "../../screen/main/setting/ChangePassword";
import PaymentDetails from "../../screen/main/setting/PaymentDetails";
import TakePhoto from "../../screen/TakePhoto";
import RegisterVehicle from "../../screen/auth/SignUp/RegisterVehicle";
import WorkingArea from "../../screen/auth/SignUp/WorkingArea";
import RecommandedUserDetail from "../../screen/main/setting/RecommandedUserDetail";
import RemitPoint from "../../screen/main/setting/point/RemitPoint";

const Stack = createStackNavigator();

export default function SettingNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                presentation: "transparentModal",
                headerTintColor: color["header-title-text"],
                headerTitleStyle: {
                    fontSize: 18 + FONT_OFFSET,
                    fontFamily: FONTS.medium,
                },
                headerStyle: {
                    backgroundColor: color["page-background"],
                },
                headerBackImage: () => (
                    <Image
                        source={require(`../../assets/images/icons/btn_prev.png`)}
                        style={{
                            resizeMode: "contain",
                            width: 25,
                            marginLeft: 5,
                        }}
                    />
                ),
            }}
        >
            <Stack.Screen
                name="MemberInformation"
                component={MemberInformation}
                options={{ title: "회원 정보" }}
            />
            <Stack.Screen
                name="PointMain"
                component={PointMain}
                options={{ title: "포인트" }}
            />
            <Stack.Screen
                name="PointBreakdown"
                component={PointBreakdown}
                options={{ title: "포인트 이용내역" }}
            />
            <Stack.Screen
                name="ChargePoint"
                component={ChargePoint}
                options={{ title: "포인트 충전" }}
            />
            <Stack.Screen
                name="RemitPoint"
                component={RemitPoint}
                options={{ title: "포인트 송금" }}
            />
            <Stack.Screen
                name="WithdrawalPoint"
                component={WithdrawalPoint}
                options={{ title: "포인트 출금" }}
            />
            <Stack.Screen
                name="RegistPointAccount"
                component={RegistPointAccount}
                options={{ title: "계좌 등록" }}
            />
            <Stack.Screen
                name="RecommandedUser"
                component={RecommandedUser}
                options={{ title: "추천인" }}
            />
            <Stack.Screen
                name="RecommandedUserDetail"
                component={RecommandedUserDetail}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{ title: "비밀번호 변경" }}
            />
            <Stack.Screen
                name="PaymentDetails"
                component={PaymentDetails}
                options={{
                    title: "결제 내역",
                }}
            />
            <Stack.Screen
                name="SettingRegisterVehicle"
                component={RegisterVehicle}
                options={{
                    title: "내 차 등록",
                }}
            />
            <Stack.Screen
                name="SettingWorkingArea"
                component={WorkingArea}
                options={{
                    title: "작업 지역 선택",
                }}
            />
            <Stack.Screen
                name="SettingTakePhoto"
                component={TakePhoto}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
