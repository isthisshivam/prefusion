import * as Actions from './index';

export function getCalorieDropdownDataRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.DROPWODN_DATA_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getCalorieDropdownDataSuccess(userData) {
  return {
    type: Actions.DROPWODN_DATA_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getCalorieDropdownDataFailure(userData) {
  return {
    type: Actions.DROPWODN_DATA_FAILURE,
    payload: {
      userData,
    },
  };
}

///////////////
export function uploadUserCalorieDataRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.UPLOAD_USER_CALORIE_DATA_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function uploadUserCalorieDataSuccess(userData) {
  return {
    type: Actions.UPLOAD_USER_CALORIE_DATA_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function uploadUserCalorieDataFailure(userData) {
  return {
    type: Actions.UPLOAD_USER_CALORIE_DATA_FAILURE,
    payload: {
      userData,
    },
  };
}
//////
export function changeCalorieCounterRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.CHANGE_CALORIE_DATA_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}
export function changeCalorieCounterSuccess(userData) {
  return {
    type: Actions.CHANGE_CALORIE_DATA_SUCCESS,
    payload: {
      userData,
    },
  };
}
export function changeCalorieCounterFailure(userData) {
  return {
    type: Actions.CHANGE_CALORIE_DATA_FAILURE,
    payload: {
      userData,
    },
  };
}
