export const SERVER = "https://altegoo.shop";
export const WSS_SERVER = "wss://altegoo.shop";
// export const SERVER = "https://5f94-218-238-213-154.ngrok-free.app";
// export const WSS_SERVER = "wss://5f94-218-238-213-154.ngrok-free.app";

export const PAYMENT_SERVER =
    "https://master.d1p7wg3e032x9j.amplifyapp.com/payment";

export const VALID = "VALID";

export const NORMAL = "NORMAL";
export const DRIVER = "DRIVER";
export const COMPANY = "COMPANY";

export const TOKEN = "token";
export const UID = "uid";
export const USER_TYPE = "user_type";

export const SIGNUP_NAV = {
    NORMAL: ["Agreements", "Identification", "EnterPassword", "SignUpComplete"],
    DRIVER: [
        "Agreements",
        "Identification",
        "EnterPassword",
        "BusinessLicense",
        "RegisterVehicle",
        "VehicleLicense",
        "WorkingArea",
        "RecommendedMember",
        "SignUpComplete",
    ],
    COMPANY: [
        "Agreements",
        "Identification",
        "CompanyInfomation",
        "EnterPassword",
        "BusinessLicense",
        "RecommendedMember",
        "SignUpComplete",
    ],
};

export const REGIST_NAV = [
    "RegistOrder",
    "SelectDateTime",
    "SearchAddress",
    "AddOtherData",
    "CheckOrderPrice",
    "Payment",
    "RegistCompleted",
];

export const FONTS = {
    bold: "SpoqaHanSansNeo-Bold",
    light: "SpoqaHanSansNeo-Light",
    medium: "SpoqaHanSansNeo-Medium",
    regular: "SpoqaHanSansNeo-Regular",
    thin: "SpoqaHanSansNeo-Thin",
};

export const VEHICLE = ["사다리차", "스카이차"];
export const DIRECTION = ["내림", "올림", "양사"];
export const LADDER_FLOOR = [
    [
        "2층",
        "3층",
        "4층",
        "5층",
        "6층",
        "7층",
        "8층",
        "9층",
        "10층",
        "11층",
        "12층",
        "13층",
        "14층",
        "15층",
        "16층",
        "17층",
        "18층",
        "19층",
        "20층",
        "21층",
        "22층",
        "23층",
        "24층",
        "25층 이상",
    ],
    [
        "2층",
        "3층",
        "4층",
        "5층",
        "6층",
        "7층",
        "8층",
        "9층",
        "10층",
        "11층",
        "12층",
        "13층",
        "14층",
        "15층",
        "16층",
        "17층",
        "18층",
        "19층",
        "20층",
        "21층",
        "22층",
        "23층",
        "24층",
        "25층",
        "26층 이상",
    ],
];

export const SKY_OPTION = [
    "~22m (1톤)",
    "~25m (2.5톤)",
    "~30m (3.5톤)",
    "~45m (5톤)",
    "~54m (8.5톤)",
    "~58m (17.5톤)",
    "~75m (19.5톤)",
];

export const VOLUME = ["물량", "시간"];
export const QUANTITY = [
    "1톤\n(이삿짐 / 1톤 해당하는 짐)",
    "2.5 - 5톤",
    "6톤",
    "7.5톤",
    "8.5 - 10톤",
];
export const TIME = [
    "간단\n(가구/씽크대/가전)",
    "1시간",
    "2시간",
    "3시간",
    "반나절(4시간)",
    "하루",
];
export const SKY_TIME = [
    ["반나절(4시간)", "하루(8시간)", "월임대(협의)"],
    [
        "1시간",
        "2시간",
        "반나절(3시간)",
        "반나절(4시간)",
        "하루(8시간)",
        "월임대(협의)",
    ],
];

export const CALENDAR_LOCALES = {
    monthNames: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ],
    monthNamesShort: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ],
    dayNames: [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
    ],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
    today: "Aujourd'hui",
};

export const CALENDAR_HAND = [
    [
        "2023-01-01",
        "2023-01-10",
        "2023-01-11",
        "2023-01-20",
        "2023-01-21",
        "2023-01-30",
        "2023-01-31",
    ],
    ["2023-02-09", "2023-02-10", "2023-02-19", "2023-02-28"],
    [
        "2023-03-01",
        "2023-03-10",
        "2023-03-11",
        "2023-03-20",
        "2023-03-21",
        "2023-03-30",
        "2023-03-31",
    ],
    ["2023-04-09", "2023-04-10", "2023-04-19", "2023-04-28", "2023-04-29"],
    [
        "2023-05-08",
        "2023-05-09",
        "2023-05-18",
        "2023-05-19",
        "2023-05-28",
        "2023-05-29",
    ],
    ["2023-06-07", "2023-06-08", "2023-06-17", "2023-06-26", "2023-06-27"],
    [
        "2023-07-06",
        "2023-07-07",
        "2023-07-16",
        "2023-07-17",
        "2023-07-26",
        "2023-07-27",
    ],
    ["2023-08-05", "2023-08-06", "2023-08-15", "2023-08-24", "2023-08-25"],
    [
        "2023-09-03",
        "2023-09-04",
        "2023-09-13",
        "2023-09-14",
        "2023-09-23",
        "2023-09-24",
    ],
    [
        "2023-10-03",
        "2023-10-04",
        "2023-10-13",
        "2023-10-14",
        "2023-10-23",
        "2023-10-24",
    ],
    ["2023-11-02", "2023-11-03", "2023-11-12", "2023-11-21", "2023-11-22"],
    [
        "2023-12-01",
        "2023-12-02",
        "2023-12-11",
        "2023-12-12",
        "2023-12-21",
        "2023-12-22",
        "2023-12-31",
    ],
];

export const FONT_OFFSET = -2;
