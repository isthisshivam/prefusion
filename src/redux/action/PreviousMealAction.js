import * as Actions from '../action/index';
// init prevmeal listing
export function prevMealListRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.PREVIOUS_MEAL_LISTING_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// prevMealList success
export function prevMealListSuccess(userData) {
  return {
    type: Actions.PREVIOUS_MEAL_LISTING_SUCCESS,
    payload: {
      userData,
    },
  };
}

// prevMealList fail
export function prevMealListFailure(userData) {
  return {
    type: Actions.PREVIOUS_MEAL_LISTING_FAILURE,
    payload: {
      userData,
    },
  };
}
