import * as Actions from './index';

// init progressReportInfo
export function progressInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.PROGRESS_INFORMATION_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// progressReportInfo success
export function progressInfoSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.PROGRESS_INFORMATION_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// progressReportInfo fail
export function progressInfoFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.PROGRESS_INFORMATION_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// init progressDATAInfo
export function progressDataRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.PROGRESS_DATA_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// progressDATA success
export function progressDataSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.PROGRESS_DATA_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

//progressDATA fail
export function progressDataFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.PROGRESS_DATA_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// init compare photos
export function compareProgressPhotosRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.COMPARE_PROGRESS_PHOTOS_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// compare photos  success
export function compareProgressPhotosSuccess(userData) {
  return {
    type: Actions.COMPARE_PROGRESS_PHOTOS_SUCCESS,
    payload: {
      userData,
    },
  };
}

// compare photos fail
export function compareProgressPhotosFailure(userData) {
  return {
    type: Actions.COMPARE_PROGRESS_PHOTOS_FAILURE,
    payload: {
      userData,
    },
  };
}
