import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import SetPassword from "../../screen/auth/SetPassword";
import SignIn from "../../screen/auth/SignIn";

const Stack = createStackNavigator();

export default function SignInNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                presentation: "modal",
            }}
        >
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    title: "",
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="SetPassword"
                component={SetPassword}
                options={{
                    title: "비밀번호 재설정",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                }}
            />
        </Stack.Navigator>
    );
}
