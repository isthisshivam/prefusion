import * as Actions from './index';

// init userProfileInfo
export function userProfileInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.USER_PROFILE_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// userProfileInfo success
export function userProfileInfoSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.USER_PROFILE_INFO_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// userProfileInfo fail
export function userProfileInfoFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.USER_PROFILE_INFO_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// UPLOAD USER PROFILE IMAGE
// init UserImage
export function uploadUserImageRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.UPLOAD_USER_PROFILE_IMAGE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// UserImage success
export function uploadUserImageSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.UPLOAD_USER_PROFILE_INFO_IMAGE_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// UserImage fail
export function uploadUserImageFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.UPLOAD_USER_PROFILE_INFO_IMAGE_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

//update user information
// init update user information
export function updateUserInformationRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.UPDATE_USER_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// update user information success
export function updateUserInformationSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.UPDATE_USER_INFO_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// update user information fail
export function updateUserInformationFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.UPDATE_USER_INFO_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

//////////////delete user account
export function deleteUserAccountRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.DELETE_USER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// deleteUserAccount success
export function deleteUserAccountSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.DELETE_USER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// deleteUserAccount fail
export function deleteUserAccountFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.DELETE_USER_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
