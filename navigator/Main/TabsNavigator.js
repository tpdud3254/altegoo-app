import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import Home from "../../screen/main/home/Home";
import UserContext from "../../context/UserContext";
import { DRIVER } from "../../constant";
import TabIcon from "../../component/icon/TabIcons";
import OrderList from "../../screen/main/orders/OrderList";
import RealTimeOrder from "../../screen/main/orders/RealTimeOrder";
import DriverOrderList from "../../screen/main/orders/DriverOrderList";
import Menus from "../../screen/main/setting/Menus";
import { IsIOS } from "../../utils";

const Tabs = createBottomTabNavigator();

export default function TabsNavigator() {
    const { info } = useContext(UserContext);

    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingTop: 0,
                    height: IsIOS() ? 90 : 74,
                },
                unmountOnBlur: true,
                presentation: "transparentModal",
            }}
        >
            {info.userType === DRIVER || info.userTypeId === 2 ? (
                <>
                    <Tabs.Screen
                        name="Home"
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    tabName="home"
                                    focused={focused}
                                    iconText="홈"
                                />
                            ),
                        }}
                        component={Home}
                    />
                    <Tabs.Screen
                        name="realTimeOrder"
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    tabName="realTime"
                                    focused={focused}
                                    iconText="실시간 오더"
                                />
                            ),
                        }}
                        component={RealTimeOrder}
                    />
                    <Tabs.Screen
                        name="DriverOrderList"
                        options={{
                            headerShown: true,
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    tabName="list"
                                    focused={focused}
                                    iconText="내 작업"
                                />
                            ),
                        }}
                        component={DriverOrderList}
                    />
                    <Tabs.Screen
                        name="Menus"
                        options={{
                            headerShown: true,
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    tabName="setting"
                                    focused={focused}
                                    iconText="내 정보"
                                />
                            ),
                        }}
                        component={Menus}
                    />
                </>
            ) : (
                <>
                    <Tabs.Screen
                        name="Home"
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    tabName="home"
                                    focused={focused}
                                    iconText="홈"
                                />
                            ),
                        }}
                        component={Home}
                    />
                    <Tabs.Screen
                        name="OrderList"
                        options={{
                            headerShown: true,
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    tabName="list"
                                    focused={focused}
                                    iconText="작업내역"
                                />
                            ),
                        }}
                        component={OrderList}
                    />
                    <Tabs.Screen
                        name="Menus"
                        options={{
                            headerShown: true,
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    tabName="setting"
                                    focused={focused}
                                    iconText="내 정보"
                                />
                            ),
                        }}
                        component={Menus}
                    />
                </>
            )}
        </Tabs.Navigator>
    );
}
