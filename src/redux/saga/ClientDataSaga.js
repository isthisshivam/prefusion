import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {clientInfoFailure, clientInfoSuccess} from '../action/ClientDataAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* clientInfoModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.CLIENT_DATA,
      data.payload.obj,
    );
    yield put(clientInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(clientInfoFailure());
    data.onFailure(error);
  }
}

export default function* clientInfoSaga() {
  yield takeLatest(ActionType.CLIENT_INFORMATION_REQUEST, clientInfoModule);
}
