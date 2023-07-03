import * as Actions from './index';

// init client
export function relaxationInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.RELAXATION_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// client success
export function relaxationInfoSuccess(userData) {
  return {
    type: Actions.RELAXATION_INFO_SUCCESS,
    payload: {
      userData,
    },
  };
}

// client fail
export function relaxationInfoFailure(userData) {
  return {
    type: Actions.RELAXATION_INFO_FAILURE,
    payload: {
      userData,
    },
  };
}
