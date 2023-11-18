import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { FONTS, FONT_OFFSET, REGIST_NAV } from "../../constant";
import Address from "../../screen/Address";
import Payment from "../../screen/main/Payment";
import AddOtherData from "../../screen/main/regist/AddOtherData";
import RegistCompleted from "../../screen/main/regist/RegistCompleted";
import SearchAddress from "../../screen/main/regist/SearchAddress";
import SelectDateTime from "../../screen/main/regist/SelectDateTime";
import { color } from "../../styles";
import { Image } from "react-native";
import RegistOrder from "../../screen/main/regist/RegistOrder";
import CheckOrderPrice from "../../screen/main/regist/CheckOrderPrice";

const Stack = createStackNavigator();

export default function RegistNavigator() {
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
                name={REGIST_NAV[0]}
                component={RegistOrder}
                options={{ headerTitle: "작업 등록" }}
            />
            <Stack.Screen
                name={REGIST_NAV[1]}
                component={SelectDateTime}
                options={{ headerTitle: "작업 일시" }}
            />
            <Stack.Screen
                name={REGIST_NAV[2]}
                component={SearchAddress}
                options={{ headerTitle: "주소 입력" }}
            />
            <Stack.Screen
                name={REGIST_NAV[3]}
                component={AddOtherData}
                options={{ headerTitle: "작업 정보 보기" }}
            />
            <Stack.Screen
                name={REGIST_NAV[4]}
                component={CheckOrderPrice}
                options={{ headerTitle: "결제 금액 확인" }}
            />
            <Stack.Screen
                name={REGIST_NAV[5]}
                component={Payment}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={REGIST_NAV[6]}
                component={RegistCompleted}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Address"
                component={Address}
                options={{ headerTitle: "주소 검색" }}
            />
        </Stack.Navigator>
    );
}
