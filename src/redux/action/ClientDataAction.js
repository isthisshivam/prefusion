import * as Actions from './index';

// init client
export function clientInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.CLIENT_INFORMATION_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// client success
export function clientInfoSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.CLIENT_INFORMATION_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// client fail
export function clientInfoFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.CLIENT_INFORMATION_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
