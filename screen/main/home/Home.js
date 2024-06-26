import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../../context/UserContext";
import { COMPANY, DRIVER, VALID } from "../../../constant";
import axios from "axios";
import { SERVER } from "../../../constant";
import {
    CheckLoading,
    Filter,
    GetAsyncStorageEventPopupShown,
    GetAsyncStorageEventPopupTime,
    GetCurrentDateTime,
    GoToOrderPage,
    IsGugupackMember,
    SetAsyncStorageEventPopupShown,
    getAsyncStorageToken,
    numberWithComma,
    showError,
    showMessage,
} from "../../../utils";
import {
    FlatList,
    Image,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import MediumText from "../../../component/text/MediumText";
import { color } from "../../../styles";
import Layout, { LAYOUT_PADDING_X } from "../../../component/layout/Layout";
import BoldText from "../../../component/text/BoldText";
import { shadowProps } from "../../../component/Shadow";
import RegularText from "../../../component/text/RegularText";
import { Order } from "../../../component/order/OrderComponent";

import LoginContext from "../../../context/LoginContext";
import { Row } from "../../../component/Row";
import SelectFilter from "../../../component/selectBox/SelectFilter";
import LoadingLayout from "../../../component/layout/LoadingLayout";
import * as Linking from "expo-linking";
import { Support } from "../../../component/icon/Support";
import { EventPopup } from "../../../component/popup/EventPopup";
import { Insurance } from "../../../component/icon/Insurance";
import useInterval from "../../../hooks/useInterval";

const Item = styled.View`
    width: 100%;
    margin-bottom: 30px;
`;

const ItemRow = styled(Item)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Banner = styled.View`
    width: 100%;
    margin-top: -15px;
    margin-bottom: ${(props) => (props.gugupack ? 20 : 40)}px;
`;

const PointButton = styled.TouchableOpacity`
    background-color: ${color["button-accent-background"]};
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    justify-content: center;
    padding: 8px 13px;
    border-radius: 12px;
    margin-top: -20px;
    margin-right: 7px;
    height: 40px;
`;

const ChargeButton = styled(PointButton)`
    background-color: ${color.btnDefault};
    border: 1px solid ${color["image-area-background"]};
`;

const GugupackButton = styled(PointButton)`
    background-color: ${color["point-green"] + "22"};
    border: 1.5px solid ${color["point-green"]};
    width: 100%;
    height: 60px;
`;

const Wrapper = styled.View`
    background-color: white;
    padding: 16px 16px;
    border-radius: 14px;
    border: ${(props) => (props.border ? "1" : "0")}px solid
        ${(props) => (props.borderColor ? props.borderColor : color.blue)};
`;
const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
const Orders = styled.View`
    margin-top: 30px;
`;
const NoOrder = styled.View`
    align-items: center;
    padding: 40px;
    margin-bottom: 10px;
`;

const Indicators = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: 3px;
    /* margin-bottom: 35px; */
`;

const Indicator = styled.TouchableOpacity`
    width: ${(props) => (props.cur ? "10px" : "5px")};
    height: 5px;
    background-color: ${(props) => props.color || color.main};
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    margin: 0px 3px 0px 3px;
`;

const PERIOD = ["1주일", "1개월", "3개월"];
function Home({ navigation, route }) {
    const { width, height } = useWindowDimensions();
    const { info } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    const [point, setPoint] = useState(-1);
    const [orders, setOrders] = useState(-1);
    const [completedOrders, setCompletedOrders] = useState(-1);
    const [acceptOrders, setAcceptOrders] = useState(-1);
    const [standByOrders, setStandByOrders] = useState(-1);
    const [period, setPeriod] = useState(1);

    const bannerRef = useRef();
    const [bannerIndex, setBannerIndex] = useState(0);
    const [bannerImageArr, setBannerImageArr] = useState([]);
    const [bannerLinkArr, setBannerLinkArr] = useState([]);

    const [popupImageUrl, setPopupImageUrl] = useState("");
    const [showEventPopup, setShowEventPopup] = useState(false);

    const { firstLogin, setFirstLogin } = useContext(LoginContext); //NEXT: 앱 처음 로그인 시 가이드 말풍선 만들기
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPopupUrl(); //팝업 가져오기
        getBannerList(); //배너 가져오기
        getPoint(); //포인트
        getOrders(); //작업리스트
        getStandByOrders(); //입금 대기중 작업리스트

        if (info.userType === DRIVER) getAcceptOrders();

        const focusSubscription = navigation.addListener("focus", () => {
            setLoading(true);
            getPoint(); //포인트
            getOrders(); //작업리스트
            getStandByOrders(); //입금 대기중 작업리스트

            if (info.userType === DRIVER) getAcceptOrders();
        });

        return () => {
            focusSubscription();
        };
    }, [route?.params?.refresh]);

    useEffect(() => {
        if (info.userType === DRIVER) {
            if (CheckLoading({ point, orders, acceptOrders, standByOrders })) {
                setLoading(false);
            }
        } else {
            if (CheckLoading({ point, orders, standByOrders })) {
                setLoading(false);
            }
        }
    }, [point, orders, acceptOrders, standByOrders]);

    useEffect(() => {
        getOrders();
    }, [period]);

    const getPopupUrl = async () => {
        axios
            .get(SERVER + "/admin/popup")
            .then(({ data }) => {
                const {
                    result,
                    data: { popup },
                } = data;

                console.log("popupImageUrl: ", popup[0].popupUrl);

                if (popup[0].popupUrl && popup[0].popupUrl.length > 0) {
                    setPopupImageUrl(popup[0].popupUrl);
                    openPopup();
                } else setPopupImageUrl("");
            })
            .catch((error) => {
                setPopupImageUrl("");
            })
            .finally(() => {});
    };

    const openPopup = async () => {
        const popupShown = await GetAsyncStorageEventPopupShown();
        const popupTime = await GetAsyncStorageEventPopupTime();

        const now = GetCurrentDateTime();
        const datetime = new Date(popupTime);

        if (
            popupShown === "false" &&
            (popupTime === null || popupTime.length === 0 || now > datetime)
        ) {
            setShowEventPopup(true);
        } else {
            setShowEventPopup(false);
        }
    };

    const closePopup = () => {
        setShowEventPopup(false);
        SetAsyncStorageEventPopupShown(true);
    };

    const getBannerList = async () => {
        axios
            .get(SERVER + "/admin/banner")
            .then(({ data }) => {
                const {
                    result,
                    data: { list },
                } = data;
                // console.log("result: ", result);

                const imageArr = [];
                const linkArr = [];

                list.map((value) => {
                    imageArr.push(value.imageUrl);
                    linkArr.push(value.link);
                });

                setBannerImageArr(imageArr);
                setBannerLinkArr(linkArr);

                // console.log("banner list: ", imageArr);
                // console.log("banner link: ", linkArr);
            })
            .catch((error) => {
                setBannerImageArr([]);
                setBannerLinkArr([]);
                showError(error);
            })
            .finally(() => {});
    };

    const getPoint = async () => {
        axios
            .get(SERVER + "/users/point", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            })
            .then(({ data }) => {
                const {
                    result,
                    data: { point },
                } = data;
                // console.log("result: ", result);
                // console.log("point: ", point);

                setPoint(point?.curPoint);
            })
            .catch((error) => {
                setPoint(0);
                showError(error);
            })
            .finally(() => {});
    };

    const getOrders = async () => {
        axios
            .get(SERVER + "/orders/mylist", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order },
                    } = data;

                    // console.log("getOrders : ", order);
                    setOrders(
                        Filter({
                            data: order,
                            period: PERIOD[period - 1],
                            orderBy: "createdAt",
                        })
                    );
                } else {
                    setOrders([]);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const getAcceptOrders = async () => {
        axios
            .get(SERVER + "/orders/accept", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order },
                    } = data;

                    console.log("acceptOrders : ", order);
                    setAcceptOrders(order || []);
                } else {
                    setAcceptOrders([]);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const getStandByOrders = async () => {
        axios
            .get(SERVER + "/orders/vbank/list", {
                headers: {
                    auth: await getAsyncStorageToken(),
                },
            })
            .then(({ data }) => {
                const { result } = data;

                if (result === VALID) {
                    const {
                        data: { order },
                    } = data;

                    // console.log("getStandByOrders : ", order);
                    setStandByOrders(order || []);
                } else {
                    setStandByOrders([]);
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const goToPoint = () => {
        navigation.navigate("SettingNavigator", { screen: "PointMain" });

        // navigation.navigate("Welcome", {
        // screen: "Welcome",
        // params: {
        //     orderId: 1295,
        //     dateTime: "2023-10-21T15:06:00.856Z",
        // },
        // });
    };

    const goToPointCharge = () => {
        navigation.navigate("SettingNavigator", { screen: "ChargePoint" });
    };

    const goToJoinGugupack = async () => {
        try {
            const response = await axios.get(
                SERVER + "/users/gugupack/waiting",
                {
                    headers: {
                        auth: await getAsyncStorageToken(),
                    },
                }
            );

            const {
                data: {
                    result,
                    data: { isExist },
                },
            } = response;

            console.log("gugupack isExist :  ", isExist);
            if (result === VALID) {
                if (isExist) {
                    showMessage("구구팩 승인 대기중입니다.");
                } else {
                    navigation.navigate("JoinGugupack");
                }
            } else
                showMessage(
                    "구구팩 신청에 실패하였습니다.\n고객센터로 문의해주세요."
                );
        } catch (error) {
            showMessage(
                "구구팩 신청에 실패하였습니다.\n고객센터로 문의해주세요."
            );
        }
    };

    const goToKakaoChat = async () => {
        axios
            .get(SERVER + "/admin/kakao")
            .then(({ data }) => {
                const {
                    data: { url },
                    result,
                } = data;

                if (result === VALID) {
                    if (url) {
                        // console.log(data);
                        Linking.openURL(url);
                    } else {
                        showMessage("해당 기능은 추후에 제공 예정입니다.");
                    }
                } else {
                    showMessage("해당 기능은 추후에 제공 예정입니다.");
                }
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {});
    };

    const renderIntro = ({ item }) => (
        <TouchableOpacity
            style={{
                width: width - LAYOUT_PADDING_X * 2,
                height: (width - LAYOUT_PADDING_X * 2) / 3,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -10,
                marginBottom: -10,
            }}
            onPress={() => {
                Linking.openURL(bannerLinkArr[bannerIndex]);
            }}
        >
            <Image
                source={{
                    uri: item,
                }}
                style={{
                    width: "100%",
                    height: 78,
                    resizeMode: "contain",
                    borderRadius: 12,
                    borderWidth: 0.5,
                    borderColor: "white",
                }}
            />
        </TouchableOpacity>
    );

    const autoBannerScroll = () => {
        bannerRef.current?.scrollToOffset({
            animated: true,
            offset: (width - LAYOUT_PADDING_X * 2) * (bannerIndex + 1),
        });

        if (bannerIndex === 2) {
            setBannerIndex(0);
            bannerRef.current?.scrollToOffset({
                animated: true,
                offset: 0,
            });
        } else setBannerIndex((prev) => prev + 1);
    };

    useInterval(autoBannerScroll, 5000);

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <Layout
                    headerShown={false}
                    registBtnShown={true}
                    touchableElement={() => (
                        <>
                            <ItemRow style={{ alignItems: "flex-start" }}>
                                <BoldText
                                    style={{
                                        fontSize: 23,
                                        maxWidth: "60%",
                                    }}
                                >
                                    안녕하세요!{"\n"}
                                    {info.nickname ? info.nickname : info.name}
                                    님.
                                </BoldText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <TouchableOpacity onPress={goToKakaoChat}>
                                        <Image
                                            source={require("../../../assets/images/icons/icon_kakao.png")}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginRight: 10,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ marginRight: 10 }}>
                                        <Support />
                                    </View>
                                    <Insurance
                                        onPress={() =>
                                            showMessage("지원 예정 기능입니다.")
                                        }
                                    />
                                    {/* <Notification
                                        onPress={() =>
                                            showMessage("지원 예정 기능입니다.")
                                        }
                                    />
                                    */}
                                </View>
                            </ItemRow>
                            <Item>
                                <Row>
                                    <PointButton onPress={goToPoint}>
                                        <Image
                                            source={require("../../../assets/images/icons/icon_point.png")}
                                            style={{ width: 23, height: 23 }}
                                            resizeMode="contain"
                                        />
                                        <BoldText
                                            style={{
                                                fontSize: 18,
                                                color: "white",
                                            }}
                                        >
                                            {" " + numberWithComma(point || 0)}
                                            <BoldText
                                                style={{
                                                    fontSize: 14,
                                                    color: "white",
                                                }}
                                            >
                                                {" "}
                                                P
                                            </BoldText>
                                        </BoldText>
                                    </PointButton>
                                    <ChargeButton onPress={goToPointCharge}>
                                        <Image
                                            source={require("../../../assets/images/icons/icon_charge.png")}
                                            style={{
                                                width: 25,
                                                height: 23,
                                                marginRight: 5,
                                            }}
                                            resizeMode="contain"
                                        />
                                        <MediumText
                                            style={{
                                                fontSize: 15,
                                            }}
                                        >
                                            충전
                                        </MediumText>
                                    </ChargeButton>
                                </Row>
                            </Item>
                            <Banner gugupack={IsGugupackMember(info)}>
                                <FlatList
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    data={bannerImageArr}
                                    renderItem={renderIntro}
                                    ref={bannerRef}
                                    onMomentumScrollEnd={(event) => {
                                        const index = Math.floor(
                                            Math.floor(
                                                event.nativeEvent.contentOffset
                                                    .x
                                            ) /
                                                Math.floor(
                                                    event.nativeEvent
                                                        .layoutMeasurement.width
                                                )
                                        );
                                        setBannerIndex(index);
                                    }}
                                />
                                <Indicators>
                                    {bannerImageArr.map((__, index) => (
                                        <Indicator
                                            key={index}
                                            // onPress={() =>
                                            //     scrollToIntroImage(index)
                                            // }
                                            color={
                                                bannerIndex === index
                                                    ? color.btnAccent
                                                    : color.btnDisable
                                            }
                                            cur={bannerIndex === index}
                                        />
                                    ))}
                                </Indicators>
                            </Banner>
                            {info.userType === COMPANY && !info.gugupack ? (
                                <View style={{ marginBottom: 20 }}>
                                    <GugupackButton onPress={goToJoinGugupack}>
                                        <Image
                                            source={require("../../../assets/images/icons/gugu_badge.png")}
                                            style={{ width: 35, height: 35 }}
                                            resizeMode="contain"
                                        />
                                        <MediumText
                                            style={{
                                                fontSize: 17,
                                                marginLeft: 1.5,
                                                color: color["page-grey-text"],
                                            }}
                                        >
                                            팩 신청하기
                                        </MediumText>
                                    </GugupackButton>
                                </View>
                            ) : null}
                        </>
                    )}
                >
                    {/*NEXT: 홈> 추천인 수익
                    <Item>
            <Wrapper style={shadowProps}>
                <Header>
                    <MediumText>
                        이번 달{" "}
                        <MediumText
                            style={{ color: color["page-color-text"] }}
                        >
                            추천인
                        </MediumText>{" "}
                        수익
                    </MediumText>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <MediumText style={{ fontSize: 22 }}>
                            1,234,000{" "}
                            <MediumText style={{ fontSize: 12 }}>
                                P
                            </MediumText>
                        </MediumText>
                        <Image
                            source={RightArrow}
                            style={{ width: 30, height: 30 }}
                        />
                    </View>
                </Header>
            </Wrapper>
        </Item> */}
                    {orders.length > 0
                        ? orders.map((order, index) => {
                              if (order.orderStatusId !== 5) return;

                              return (
                                  <Item key={index}>
                                      <Wrapper
                                          style={shadowProps}
                                          border={true}
                                          borderColor="#EB1D36"
                                      >
                                          <Header>
                                              <MediumText
                                                  style={{
                                                      fontSize: 18,
                                                      marginTop: 5,
                                                      color: color.main,
                                                  }}
                                              >
                                                  작업 완료 요청
                                              </MediumText>
                                          </Header>
                                          <Orders>
                                              <Order.Items>
                                                  <Order.Item
                                                      data={order}
                                                      nextPage={GoToOrderPage(
                                                          info,
                                                          order
                                                      )}
                                                  />
                                              </Order.Items>
                                          </Orders>
                                      </Wrapper>
                                  </Item>
                              );
                          })
                        : null}

                    {info.userTypeId === 2 && acceptOrders.length > 0
                        ? acceptOrders.map((order, index) => {
                              if (
                                  order.orderStatusId !== 2 &&
                                  order.orderStatusId !== 3 &&
                                  order.orderStatusId !== 4
                              )
                                  return;

                              return (
                                  <Item key={index}>
                                      <Wrapper
                                          style={shadowProps}
                                          border={true}
                                      >
                                          <Header>
                                              <MediumText
                                                  style={{
                                                      fontSize: 18,
                                                      marginTop: 5,
                                                  }}
                                              >
                                                  {order.orderStatusId === 2
                                                      ? "예약된 작업"
                                                      : null}
                                                  {order.orderStatusId === 3 ||
                                                  order.orderStatusId === 4
                                                      ? "진행중 작업"
                                                      : null}
                                              </MediumText>
                                          </Header>
                                          <Orders>
                                              <Order.Items>
                                                  <Order.Item
                                                      data={order}
                                                      nextPage={GoToOrderPage(
                                                          info,
                                                          order
                                                      )}
                                                  />
                                              </Order.Items>
                                          </Orders>
                                      </Wrapper>
                                  </Item>
                              );
                          })
                        : null}

                    {standByOrders.length > 0 ? (
                        <Item>
                            <Wrapper
                                style={shadowProps}
                                border={true}
                                borderColor={color["standby-border"]}
                            >
                                <Header>
                                    <MediumText
                                        style={{
                                            fontSize: 18,
                                            marginTop: 5,
                                        }}
                                    >
                                        입금 대기 중
                                    </MediumText>
                                </Header>

                                <Orders>
                                    <Order.Items>
                                        {standByOrders.map((order, index) => (
                                            <Order.Item
                                                key={index}
                                                data={order}
                                                nextPage={GoToOrderPage(
                                                    info,
                                                    order,
                                                    { isStandByOrder: true }
                                                )}
                                                showBadge={false}
                                            />
                                        ))}
                                    </Order.Items>
                                </Orders>
                            </Wrapper>
                        </Item>
                    ) : null}
                    <Item>
                        <Wrapper style={shadowProps}>
                            <Header>
                                <MediumText
                                    style={{
                                        fontSize: 18,
                                        maxWidth: "65%",
                                    }}
                                >
                                    최근 등록 작업
                                </MediumText>
                                <SelectFilter
                                    data={PERIOD}
                                    onSelect={(index) => setPeriod(index + 1)}
                                />
                            </Header>
                            {orders.length === 0 ? (
                                <NoOrder>
                                    <RegularText
                                        style={{
                                            fontSize: 18,
                                            color: color["page-bluegrey-text"],
                                        }}
                                    >
                                        최근 등록된 작업이 없습니다.
                                    </RegularText>
                                </NoOrder>
                            ) : (
                                <Orders>
                                    <Order.Items>
                                        {orders.map((order, index) => (
                                            <Order.Item
                                                key={index}
                                                data={order}
                                                nextPage={GoToOrderPage(
                                                    info,
                                                    order
                                                )}
                                            />
                                        ))}
                                    </Order.Items>
                                </Orders>
                            )}
                        </Wrapper>
                    </Item>
                    <EventPopup
                        visible={showEventPopup}
                        onClose={closePopup}
                        url={popupImageUrl}
                        width={width}
                        height={height}
                    />
                </Layout>
            )}
        </>
    );
}

export default Home;
