import * as Actions from './index';

// init addVeggies
export function addVeggiesRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.ADD_VEGGIES_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// addVeggies success
export function addVeggiesSuccess(userData) {
  return {
    type: Actions.ADD_VEGGIES_SUCCESS,
    payload: {
      userData,
    },
  };
}

// addVeggies fail
export function addVeggiesFailure(userData) {
  return {
    type: Actions.ADD_VEGGIES_FAILURE,
    payload: {
      userData,
    },
  };
}

///////////////////

// init removeVeggies
export function removeVeggiesRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.REMOVE_VEGGIES_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// removeVeggies success
export function removeVeggiesSuccess(userData) {
  return {
    type: Actions.REMOVE_VEGGIES_SUCCESS,
    payload: {
      userData,
    },
  };
}

// removeVeggies fail
export function removeVeggiesFailure(userData) {
  return {
    type: Actions.REMOVE_VEGGIES_FAILURE,
    payload: {
      userData,
    },
  };
}
//////////////
/////////////
/////////////
// init veggiesInfo
export function veggiesInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.VEGGIES_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// veggiesInfo success
export function veggiesInfoSuccess(userData) {
  return {
    type: Actions.VEGGIES_INFO_SUCCESS,
    payload: {
      userData,
    },
  };
}

// veggiesInfo fail
export function veggiesInfoFailure(userData) {
  return {
    type: Actions.VEGGIES_INFO_FAILURE,
    payload: {
      userData,
    },
  };
}
