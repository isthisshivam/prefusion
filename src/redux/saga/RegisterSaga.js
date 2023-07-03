import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {registerFailure, registerSuccess} from '../action/RegisterAction';
import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';

function* registerModule(data) {
  try {
    const registerData = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.REGISTER,
      data.payload.obj,
    );
    yield put(registerSuccess(registerData));
    data.onSuccess(registerData);
  } catch (error) {
    yield put(registerFailure());
    data.onFailure(error);
  }
}

export default function* registerSaga() {
  yield takeLatest(ActionType.REGISTER_USER_REQUEST, registerModule);
}
