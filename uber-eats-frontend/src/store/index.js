/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-object-spread */
import { createStore } from 'redux';

const initialState = {
  redirectUserReg: false,
  redirectUserLoginHome: '',
  redirectRestReg: false,
  redirectRestLoginHome: '',
  userProfileUpdate: false,
  restProfileUpdate: false,
  userCartVisit: null,
  userCheckoutVisit: false,
  userHomepage: null,
  userRestMenu: null,
  userOrderReceipt: false,
  userFavourites: null,
  userOrders: null,
  restaddMenu: null,
  restMenu: false,
  restMenuUpdated: null,
  restOrders: false,
  restOrderReceipt: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_REGISTERED':
      return {
        redirectUserReg: [action.payload, state.redirectUserReg],
      };
    case 'USER_LOGGED_IN':
      return {
        redirectUserLoginHome: [action.payload, state.redirectUserLoginHome],
      };
    case 'RESTAURANT_REGISTERED':
      return {
        redirectRestReg: [action.payload, state.redirectRestReg],
      };
    case 'RESTAURANT_LOGGED_IN':
      return {
        redirectRestLoginHome: [action.payload, state.redirectRestLoginHome],
      };
    case 'USER_PROFILE_UPDATED':
      return {
        userProfileUpdate: [action.payload, state.userProfileUpdate],
      };
    case 'RESTAURANT_PROFILE_UPDATED':
      return {
        restProfileUpdate: [action.payload, state.restProfileUpdate],
      };
    case 'USER_CART_VISIT':
      return {
        userCartVisit: [action.payload, state.userCartVisit],
      };
    case 'USER_CHECKOUT_VISIT':
      return {
        userCheckoutVisit: [action.payload, state.userCheckoutVisit],
      };
    case 'USER_HOMEPAGE':
      return {
        userHomepage: [action.payload, state.userHomepage],
      };
    case 'USER_RESTAURANT_MENU':
      return {
        userRestMenu: [action.payload, state.userRestMenu],
      };
    case 'USER_ORDER_DETAILS_RECEIPT':
      return {
        userOrderReceipt: [action.payload, state.userOrderReceipt],
      };
    case 'USER_FAVOURITES':
      return {
        userFavourites: [action.payload, state.userFavourites],
      };
    case 'USER_ORDER':
      return {
        userOrders: [action.payload, state.userOrders],
      };
    case 'RESTAURANT_MENU_ADD':
      return {
        restaddMenu: [action.payload, state.restaddMenu],
      };
    case 'RESTAURANT_MENU':
      return {
        restMenu: [action.payload, state.restMenu],
      };
    case 'RESTAURANT_MENU_UPDATED':
      return {
        restMenuUpdated: [action.payload, state.restMenuUpdated],
      };
    case 'RESTAURANT_ORDER_MANAGEMENT':
      return {
        restOrders: [action.payload, state.restOrders],
      };
    case 'RESTAURANT_ORDER_DETAILS_RECEIPT':
      return {
        restOrderReceipt: [action.payload, state.restOrderReceipt],
      };
    default:
      return state;
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
