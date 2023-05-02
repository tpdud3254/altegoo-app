import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import LoadingLayout from "../../component/layout/LoadingLayout";
import { VALID } from "../../constant";
import LoginContext from "../../context/LoginContext";
import Charge from "../../screen/main/Charge";
import CompleteOrder from "../../screen/main/CompleteOrder";
import OrderDetail from "../../screen/main/OrderDetail";
import OrderProgress from "../../screen/main/OrderProgress";
import OrdinaryOrderDetail from "../../screen/main/OrdinaryOrderDetail";
import Payment from "../../screen/main/Payment";
import Welcome from "../../screen/main/Welcome";
import { SERVER } from "../../constant";
import { getAsyncStorageToken } from "../../utils";
import TabsNavigator from "./TabsNavigator";

const Stack = createStackNavigator();

export default function MainNavigator() {
  const [loading, setLoading] = useState(true);
  const { firstLogin } = useContext(LoginContext);
  const [acceptOrderList, setAcceptOrderList] = useState([]);
  const [registOrderList, setRegistOrderList] = useState([]);

  useEffect(() => {
    //init
    setAcceptOrderList([]);
    setRegistOrderList([]);
    setLoading(true);

    //작업 예약 중인 리스트 먼저 받아오기
    getAcceptOrderList();
  }, []);

  //TODO: - 기사/기업 회원 예약중인 작업이 있을 시 예약시간 30분 전부터 gps 측정 시작 (5분마다 재 측정) > 거리 500m 이하 일시 (추후 추가)
  console.log("acceptOrderList : ", acceptOrderList);
  const getAcceptOrderList = async () => {
    try {
      const response = await axios.get(SERVER + "/works/mylist/accept", {
        headers: {
          auth: await getAsyncStorageToken(),
        },
      });

      // console.log(response.data);

      const {
        data: { result },
      } = response;

      if (result === VALID) {
        const {
          data: {
            data: { list },
          },
        } = response;

        console.log(list);
        const newList = [];
        list.map((order, index) => {
          if (
            order.orderStatusId === 2 ||
            order.orderStatusId === 3 ||
            order.orderStatusId === 4
          ) {
            newList.push(order);
          }
        });

        setAcceptOrderList(newList);

        console.log("acceptOrderList : ", newList);
        if (newList.length < 1) getRegistOrderList();
        else setLoading(false);
      } else {
        const {
          data: { msg },
        } = response;

        console.log(msg);
        getRegistOrderList();
      }
    } catch (error) {
      console.log(error);
      getRegistOrderList();
    }
  };

  const getRegistOrderList = async () => {
    try {
      const response = await axios.get(SERVER + "/works/mylist/regist", {
        headers: {
          auth: await getAsyncStorageToken(),
        },
      });

      // console.log(response.data);

      const {
        data: { result },
      } = response;

      if (result === VALID) {
        const {
          data: {
            data: { list },
          },
        } = response;

        console.log("registlist:", list);

        setRegistOrderList(list);
        setLoading(false);
      } else {
        const {
          data: { msg },
        } = response;

        console.log(msg);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <LoadingLayout />
      ) : (
        <Stack.Navigator
          screenOptions={{
            presentation: "modal",
            headerShown: false,
          }}
        >
          {firstLogin ? (
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
                headerTitleAlign: "center",
              }}
            />
          ) : null}

          {acceptOrderList.length > 0 ? (
            <Stack.Screen
              name="IntroOrderProgress"
              component={OrderProgress}
              options={{
                headerShown: true,
                headerTitleAlign: "center",
              }}
              initialParams={{
                orderData: { ...acceptOrderList[0] },
              }}
            />
          ) : null}

          {registOrderList.length > 0 ? (
            <Stack.Screen
              name="IntroCompleteOrder"
              component={CompleteOrder}
              options={{
                title: "작업 완료 요청",
                headerShown: true,
                headerTitleAlign: "center",
              }}
              initialParams={{
                orderData: { ...registOrderList[0] },
              }}
            />
          ) : null}
          <Stack.Screen name="TabsNavigator" component={TabsNavigator} />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetail}
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: "작업 상세 보기",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="OrderProgress"
            component={OrderProgress}
            options={{
              headerShown: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="CompleteOrder"
            component={CompleteOrder}
            options={{
              title: "작업 완료 요청",
              headerShown: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="OrdinaryOrderDetail"
            component={OrdinaryOrderDetail}
            options={{
              title: "상세 보기",
              headerShown: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{
              title: "결제하기",
              headerShown: false,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Charge"
            component={Charge}
            options={{
              title: "결제하기",
              headerShown: false,
              headerTitleAlign: "center",
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
}
