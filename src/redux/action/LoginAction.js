import * as Actions from './index';

// init Login
export function loginRequest(obj, onSuccess, onFailure) {
  console.log('loginrequest=>', obj);
  return {
    type: Actions.LOGIN_USER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// login success
export function loginSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.LOGIN_USER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// login fail
export function loginFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.LOGIN_USER_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// logout action
export function logout() {
  return {
    type: Actions.LOGOUT,
    payload: {},
  };
}

/////
// init Login
export function logoutRequest(obj, onSuccess, onFailure) {
  console.log('logout=>', obj);
  return {
    type: Actions.LOGOUT_USER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// login success
export function logoutSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.LOGOUT_USER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// login fail
export function logoutFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.LOGOUT_USER_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
