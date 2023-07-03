import * as Actions from './index';

// init addFeedback
export function addFeedbackRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.ADD_FEEDBACK_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// addFeedback success
export function addFeedbackSuccess(userData) {
  return {
    type: Actions.ADD_FEEDBACK_SUCCESS,
    payload: {
      userData,
    },
  };
}

// addFeedback fail
export function addFeedbackFailure(userData) {
  return {
    type: Actions.ADD_FEEDBACK_FAILURE,
    payload: {
      userData,
    },
  };
}

//feedbackInfo info actions

export function feedbackInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.FEEDBACK_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// feedbackInfo success
export function feedbackInfoSuccess(userData) {
  return {
    type: Actions.FEEDBACK_INFO_SUCCESS,
    payload: {
      userData,
    },
  };
}

// feedbackInfo fail
export function feedbackInfoFailure(userData) {
  return {
    type: Actions.FEEDBACK_INFO_FAILURE,
    payload: {
      userData,
    },
  };
}
