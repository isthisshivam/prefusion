import * as Actions from './index';

// init changePassword
export function changePasswordRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.CHANGE_PASSWORD_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// changePassword success
export function changePasswordSuccess(userData) {
  return {
    type: Actions.CHANGE_PASSWORD_SUCCESS,
    payload: {
      userData,
    },
  };
}

// changePassword fail
export function changePasswordFailure(userData) {
  return {
    type: Actions.CHANGE_PASSWORD_FAILURE,
    payload: {
      userData,
    },
  };
}

// init forgot password
export function forgotPasswordRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.FORGOT_PASSWORD_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// forgot password success
export function forgotPasswordSuccess(userData) {
  return {
    type: Actions.FORGOT_PASSWORD_SUCCESS,
    payload: {
      userData,
    },
  };
}

// forgot password fail
export function forgotPasswordFailure(userData) {
  return {
    type: Actions.FORGOT_PASSWORD_FAILURE,
    payload: {
      userData,
    },
  };
}
