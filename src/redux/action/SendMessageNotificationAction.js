import * as Actions from './index';
// init sendMsgNotification
export function sendMsgNotificationRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.SEND_MSG_NOTIFICATION_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// sendMsgNotification success
export function sendMsgNotificationSuccess(userData, onSuccess, onFailure) {
  return {
    type: Actions.SEND_MSG_NOTIFICATION_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// sendMsgNotification fail
export function sendMsgNotificationFailure(userData, onSuccess, onFailure) {
  return {
    type: Actions.SEND_MSG_NOTIFICATION_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
