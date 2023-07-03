import * as Actions from './index';

export function getApprovedFoodsRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_APPROVED_FOODS_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getApprovedFoodsSuccess(userData) {
  return {
    type: Actions.GET_APPROVED_FOODS_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getApprovedFoodsFailure(userData) {
  return {
    type: Actions.GET_APPROVED_FOODS_FAILURE,
    payload: {
      userData,
    },
  };
}
