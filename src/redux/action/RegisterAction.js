import * as Actions from './index';
// init register
export function registerRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.REGISTER_USER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}
// register success
export function registerSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.REGISTER_USER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
// register fail
export function registerFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.REGISTER_USER_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
