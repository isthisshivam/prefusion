import * as Actions from './index';
// init token
export function tokenRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.TOKEN_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// token success
export function tokenSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.TOKEN_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// token fail
export function tokenFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.TOKEN_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
