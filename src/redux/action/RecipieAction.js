import * as Actions from './index';

export function getRecipiesRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.RECIPIE_LIST_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getRecipiesSuccess(userData) {
  return {
    type: Actions.RECIPIE_LIST_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getRecipiesFailure(userData) {
  return {
    type: Actions.RECIPIE_LIST_FAILURE,
    payload: {
      userData,
    },
  };
}

///////////////////////
export function getRecipieInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.RECIPIE_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getRecipieInfoSuccess(userData) {
  return {
    type: Actions.RECIPIE_INFO_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getRecipieInfoFailure(userData) {
  return {
    type: Actions.RECIPIE_INFO_FAILURE,
    payload: {
      userData,
    },
  };
}

///////////////////////
export function addRecipieToFavRequest(obj) {
  return {
    type: Actions.ADD_RECIPIE_TO_FAV_REQUEST,
    payload: {
      obj,
    },
  };
}

export function addRecipieToFavSuccess(userData) {
  return {
    type: Actions.ADD_RECIPIE_TO_FAV_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function addRecipieToFavFailure(userData) {
  return {
    type: Actions.ADD_RECIPIE_TO_FAV_FAILURE,
    payload: {
      userData,
    },
  };
}
//remove section
export function removeRecipieToFavRequest(obj) {
  return {
    type: Actions.REMOVE_RECIPIE_TO_FAV_REQUEST,
    payload: {
      obj,
    },
  };
}

export function removeRecipieToFavSuccess(userData) {
  return {
    type: Actions.REMOVE_RECIPIE_TO_FAV_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function removeRecipieToFavFailure(userData) {
  return {
    type: Actions.REMOVE_RECIPIE_TO_FAV_FAILURE,
    payload: {
      userData,
    },
  };
}
