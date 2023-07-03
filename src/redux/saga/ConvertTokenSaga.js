import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import * as convertTokenAction from '../action/ConvertTokenAction';
import {postRequestWithHeaderForConvertToken} from '../webservice/webServiceCall';

function* convertTokenModule(data) {
  const {onSuccess, onFailure} = data;
  try {
    const userData = yield call(
      postRequestWithHeaderForConvertToken,
      'https://iid.googleapis.com/iid/v1:batchImport',
      data.payload.obj,
    );
    yield put(convertTokenAction.tokenSuccess(userData));
    onSuccess(userData);
  } catch (error) {
    yield put(convertTokenAction.tokenFailure());
    onFailure(error);
  }
}

export default function* convertTokenSaga() {
  yield takeLatest(ActionType.TOKEN_REQUEST, convertTokenModule);
}
