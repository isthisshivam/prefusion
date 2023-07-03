import * as Actions from './index';

export function addFoodToFavRequest(obj) {
  return {
    type: Actions.ADD_FOOD_TO_FAV_REQUEST,
    payload: {
      obj,
    },
  };
}

export function addFoodToFavSuccess(userData) {
  return {
    type: Actions.ADD_FOOD_TO_FAV_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function addFoodToFavFailure(userData) {
  return {
    type: Actions.ADD_FOOD_TO_FAV_FAILURE,
    payload: {
      userData,
    },
  };
}
//remove section
export function removeFoodToFavRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.REMOVE_FOOD_TO_FAV_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function removeFoodToFavSuccess(userData) {
  return {
    type: Actions.REMOVE_FOOD_TO_FAV_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function removeFoodToFavFailure(userData) {
  return {
    type: Actions.REMOVE_FOOD_TO_FAV_FAILURE,
    payload: {
      userData,
    },
  };
}
