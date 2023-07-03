import * as Actions from './index';

// init addWater
export function addWaterRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.ADD_WATER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// addWater success
export function addWaterSuccess(userData) {
  return {
    type: Actions.ADD_WATER_SUCCESS,
    payload: {
      userData,
    },
  };
}

// addWater fail
export function addWaterFailure(userData) {
  return {
    type: Actions.ADD_WATER_FAILURE,
    payload: {
      userData,
    },
  };
}

////////////////
// init removeWater
export function removeWaterRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.REMOVE_WATER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// removeWater success
export function removeWaterSuccess(userData) {
  return {
    type: Actions.REMOVE_WATER_SUCCESS,
    payload: {
      userData,
    },
  };
}

// removeWater fail
export function removeWaterFailure(userData) {
  return {
    type: Actions.REMOVE_WATER_FAILURE,
    payload: {
      userData,
    },
  };
}
//////////
/////////
////////
// init WaterInfo
export function waterInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.WATER_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// WaterInfo success
export function waterInfoSuccess(userData) {
  return {
    type: Actions.WATER_INFO_SUCCESS,
    payload: {
      userData,
    },
  };
}

// WaterInfo fail
export function waterInfoFailure(userData) {
  return {
    type: Actions.WATER_INFO_FAILURE,
    payload: {
      userData,
    },
  };
}
