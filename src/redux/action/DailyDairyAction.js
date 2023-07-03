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

// init WaterInfo
export function dailyDiryInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.DAILY_ADIRY_INFORMATION_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// WaterInfo success
export function dailyDiryInfoSuccess(userData) {
  return {
    type: Actions.DAILY_ADIRY_INFORMATION_SUCCESS,
    payload: {
      userData,
    },
  };
}

// WaterInfo fail
export function dailyDiryInfoFailure(userData) {
  return {
    type: Actions.DAILY_ADIRY_INFORMATION_FAILURE,
    payload: {
      userData,
    },
  };
}
