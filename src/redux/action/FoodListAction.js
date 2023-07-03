import * as Actions from './index';
export function getFoodsRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_FOODS_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getFoodsSuccess(userData) {
  return {
    type: Actions.GET_FOODS_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getFoodsFailure(userData) {
  return {
    type: Actions.GET_FOODS_FAILURE,
    payload: {
      userData,
    },
  };
}

/////

export function searchFoodsRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.SEARCH_FOOD_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function searchFoodsSuccess(userData) {
  return {
    type: Actions.SEARCH_FOOD_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function searchFoodsFailure(userData) {
  return {
    type: Actions.SEARCH_FOOD_FAILURE,
    payload: {
      userData,
    },
  };
}
// food profile
export function getFoodProfileRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_FOOD_PROFILE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getFoodProfileSuccess(userData) {
  return {
    type: Actions.GET_FOOD_PROFILE_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getFoodProfileFailure(userData) {
  return {
    type: Actions.GET_FOOD_PROFILE_FAILURE,
    payload: {
      userData,
    },
  };
}
//update food profile
export function updateFoodProfileRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.UPDATE_FOOD_PROFILE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function updateFoodProfileSuccess(userData) {
  return {
    type: Actions.UPDATE_FOOD_PROFILE_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function updateFoodProfileFailure(userData) {
  return {
    type: Actions.UPDATE_FOOD_PROFILE_FAILURE,
    payload: {
      userData,
    },
  };
}
