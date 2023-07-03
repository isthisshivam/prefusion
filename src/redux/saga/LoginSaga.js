import * as ActionType from '../action/index';
// import Utils from "../../utilities/Utils";
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  loginFailure,
  loginSuccess,
  logoutSuccess,
  logoutFailure,
} from '../action/LoginAction';

import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';

function* loginModule(data) {
  try {
    const loginData = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.LOGIN,
      data.payload.obj,
    );

    yield put(loginSuccess(loginData));
    data.onSuccess(loginData);
  } catch (error) {
    yield put(loginFailure());
    data.onFailure(error);
  }
}
function* loginSaga() {
  yield takeLatest(ActionType.LOGIN_USER_REQUEST, loginModule);
}

function* logoutModule(data) {
  try {
    const logoutData = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.LOGOUT,
      data.payload.obj,
    );
    yield put(logoutSuccess(logoutData));
    data.onSuccess(logoutData);
  } catch (e) {
    yield put(logoutFailure());
    data.onFailure(e);
  }
}

function* logoutSaga() {
  yield takeLatest(ActionType.LOGOUT_USER_REQUEST, logoutModule);
}
export {logoutSaga, loginSaga};
