import * as Actions from './index';

export function getFavouriteFoodsRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_FAVORITE_FOODS_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getFavouriteFoodsSuccess(userData) {
  return {
    type: Actions.GET_FAVORITE_FOODS_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getFavouriteFoodsFailure(userData) {
  return {
    type: Actions.GET_FAVORITE_FOODS_FAILURE,
    payload: {
      userData,
    },
  };
}
