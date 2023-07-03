import * as ActionType from '../action/index';
// import Utils from "../../utilities/Utils";
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  mailFailure,
  mailSuccess,
  sendAutoResponseSuccess,
  sendAutoResponseFailure,
} from '../action/MailAction';
import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';

function* mailModule(data) {
  try {
    const info = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.SEND_MAIL,
      data.payload.obj,
    );

    yield put(mailSuccess(info));
    data.onSuccess(info);
  } catch (error) {
    yield put(mailFailure(error));
    data.onFailure(error);
  }
}
function* mailSaga() {
  yield takeLatest(ActionType.SEND_MAIL_REQUEST, mailModule);
}
//
function* sendAutoResponseModule(data) {
  try {
    const info = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.SEND_AUTO_RESPONSE,
      data.payload.obj,
    );

    yield put(sendAutoResponseSuccess(info));
    data.onSuccess(info);
  } catch (error) {
    yield put(sendAutoResponseFailure(error));
    data.onFailure(error);
  }
}
function* sendAutoResponseSaga() {
  yield takeLatest(
    ActionType.SEND_AUTO_RESPONSE_REQUEST,
    sendAutoResponseModule,
  );
}
export {mailSaga, sendAutoResponseSaga};
