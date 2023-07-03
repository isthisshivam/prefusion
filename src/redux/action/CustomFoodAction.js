import * as Actions from './index';

// init addCustomFood
export function addCustomFoodRequest(obj, onSuccess, onFailure) {
  //console.log('obj.payload====', JSON.stringify(obj));
  return {
    type: Actions.ADD_CUSTOM_FOOD_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// addCustomFood success
export function addCustomFoodSuccess(userData) {
  return {
    type: Actions.ADD_CUSTOM_FOOD_SUCCESS,
    payload: {
      userData,
    },
  };
}

// addCustomFood fail
export function addCustomFoodFailure(userData) {
  return {
    type: Actions.ADD_CUSTOM_FOOD_FAILURE,
    payload: {
      userData,
    },
  };
}
////////
export function customFoodInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_CUSTOM_FOOD_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// addCustomFood success
export function customFoodInfoSuccess(userData) {
  return {
    type: Actions.GET_CUSTOM_FOOD_INFO_SUCCESS,
    payload: {
      userData,
    },
  };
}

// addCustomFood fail
export function customFoodInfoFailure(userData) {
  return {
    type: Actions.GET_CUSTOM_FOOD_INFO_FAILURE,
    payload: {
      userData,
    },
  };
}
///delete custom fod req
export function deleteCustomFoodRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.DELETE_CUSTOM_FOOD_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}
// delete custom food success
export function deleteCustomFoodSuccess(obj) {
  return {
    type: Actions.DELETE_CUSTOM_FOOD_SUCCESS,
    payload: {
      obj,
    },
  };
}

// delete custom food fail
export function deleteCustomFoodFailure(obj) {
  return {
    type: Actions.DELETE_CUSTOM_FOOD_FAILURE,
    payload: {
      obj,
    },
  };
}
