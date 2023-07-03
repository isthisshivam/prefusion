import * as Actions from './index';

// init weekely data info
export function weekelyDataRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.HOME_DATA_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

//  weekely data info success
export function weekelyDataSuccess(userData) {
  return {
    type: Actions.HOME_DATA_SUCCESS,
    payload: {
      userData,
    },
  };
}

//  weekely data info fail
export function weekelyDataFailure(userData) {
  return {
    type: Actions.HOME_DATA_FAILURE,
    payload: {
      userData,
    },
  };
}
//////////////////////
// init weekelyList list info
export function weekelyListRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.WEEKELY_INFORMATION_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

//  weekelyList info success
export function weekelyListSuccess(userData) {
  return {
    type: Actions.WEEKELY_INFORMATION_SUCCESS,
    payload: {
      userData,
    },
  };
}

//  weekelyList info fail
export function weekelyListFailure(userData) {
  return {
    type: Actions.WEEKELY_INFORMATION_FAILURE,
    payload: {
      userData,
    },
  };
}
