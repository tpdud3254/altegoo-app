import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SelectWorkTheme from "../screen/main/regist/SelectWorkTheme";
import RegistWork from "../screen/main/regist/RegistWork";
import SearchAddress from "../screen/main/regist/SearchAddress";
import RegistDone from "../screen/main/regist/RegistDone";

const Stack = createStackNavigator();

export default function RegistNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SelectWorkTheme"
                component={SelectWorkTheme}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RegistWork"
                component={RegistWork}
                options={{
                    headerBackTitleVisible: false,
                    title: "작업 등록",
                }}
            />
            <Stack.Screen
                name="SearchAddress"
                component={SearchAddress}
                options={{
                    title: "주소 검색",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="RegistDone"
                component={RegistDone}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
