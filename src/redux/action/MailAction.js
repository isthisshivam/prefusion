import * as Actions from './index';

// mail Login
export function mailRequest(obj, onSuccess, onFailure) {
  console.log('mailRequest=>', obj);
  return {
    type: Actions.SEND_MAIL_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// mail success
export function mailSuccess(userData) {
  return {
    type: Actions.SEND_MAIL_SUCCESS,
    payload: {
      userData,
    },
  };
}

// mail fail
export function mailFailure(userData) {
  return {
    type: Actions.SEND_MAIL_FAILURE,
    payload: {
      userData,
    },
  };
}
///
// mail Login
export function sendAutoResponseRequest(obj, onSuccess, onFailure) {
  console.log('sendAutoResponseRequest=>', obj);
  return {
    type: Actions.SEND_AUTO_RESPONSE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// mail success
export function sendAutoResponseSuccess(userData) {
  return {
    type: Actions.SEND_AUTO_RESPONSE_SUCCESS,
    payload: {
      userData,
    },
  };
}

// mail fail
export function sendAutoResponseFailure(userData) {
  return {
    type: Actions.SEND_AUTO_RESPONSE_FAILURE,
    payload: {
      userData,
    },
  };
}
