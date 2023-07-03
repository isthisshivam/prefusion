import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  changePasswordFailure,
  changePasswordSuccess,
} from '../action/ChangePasswordAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';
import {
  forgotPasswordSuccess,
  forgotPasswordFailure,
} from '../action/ChangePasswordAction';
function* changePasswordModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.CHANGE_PASSWORD,
      data.payload.obj,
    );
    yield put(changePasswordSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(changePasswordFailure());
    data.onFailure(error);
  }
}

function* changePasswordSaga() {
  yield takeLatest(ActionType.CHANGE_PASSWORD_REQUEST, changePasswordModule);
}
//////
function* forgotPasswordModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FORGOT_PASSWORD,
      data.payload.obj,
    );
    yield put(forgotPasswordSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(forgotPasswordFailure());
    data.onFailure(error);
  }
}

function* forgotPasswordSaga() {
  yield takeLatest(ActionType.FORGOT_PASSWORD_REQUEST, forgotPasswordModule);
}
export {forgotPasswordSaga, changePasswordSaga};
