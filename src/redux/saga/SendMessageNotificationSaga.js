import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import * as sendMessageNotificationAction from '../action/SendMessageNotificationAction';
import {postRequestWithHeader} from '../webservice/webServiceCall';
import api from '../../constants/api';
function* sendMsgNotificationModule(data) {
  const {onSuccess, onFailure} = data;
  try {
    const userData = yield call(
      postRequestWithHeader,
      api.SEND_MESSAGE_NOTIFICATION,
      data.payload.obj,
    );
    yield put(
      sendMessageNotificationAction.sendMsgNotificationSuccess(userData),
    );
    onSuccess(userData);
  } catch (error) {
    yield put(sendMessageNotificationAction.sendMsgNotificationFailure());
    onFailure(error);
  }
}

export default function* sendMsgNotificationModuleSaga() {
  yield takeLatest(
    ActionType.SEND_MSG_NOTIFICATION_REQUEST,
    sendMsgNotificationModule,
  );
}
