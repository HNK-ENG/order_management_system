import axios from 'axios';

const USER_REGISTER = '/rhs/customer/save'
const USER_AUTHENTICATE = '/authenticate';
const SALES_ORDER_HISTORY = '/rhs/salesOrder/orderHistory';
const SALES_ORDER_CANCEL = '/rhs/salesOrder/cancel';
const SALES_ORDER_CONFIRM = '/rhs/salesOrder/confirm';
const SALES_ORDER_DISPATCHED = '/rhs/salesOrder/dispatched';
const SALES_ITEMS = '/rhs/metaData/itemsDropDown';
const PLACE_NEW_ORDER = '/rhs/salesOrder/createOrder';
const DISTRICTS = '/rhs/metaData/district-drop-down';
const CITIES = '/rhs/metaData/city-drop-down';

const Axios = axios.create({
    baseURL: 'http://localhost:7001'
});

const SetAuthToken = (token) => {
    if (token) {
        Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else
        delete Axios.defaults.headers.common["Authorization"];
}

export {Axios, SetAuthToken};

export {
    USER_REGISTER,
    USER_AUTHENTICATE,
    SALES_ORDER_HISTORY,
    SALES_ORDER_CANCEL,
    SALES_ORDER_CONFIRM,
    SALES_ORDER_DISPATCHED,
    SALES_ITEMS,
    PLACE_NEW_ORDER,
    DISTRICTS,
    CITIES
}