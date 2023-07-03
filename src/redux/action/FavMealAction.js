import * as Actions from './index';

export function favMealUpdateRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.FAV_MEAL_UPDATE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function favMealUpdateSuccess(userData) {
  return {
    type: Actions.FAV_MEAL_UPDATE_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function favMealUpdateFailure(userData) {
  return {
    type: Actions.FAV_MEAL_UPDATE_FAILURE,
    payload: {
      userData,
    },
  };
}
