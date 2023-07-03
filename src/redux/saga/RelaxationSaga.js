import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  relaxationInfoSuccess,
  relaxationInfoFailure,
} from '../action/RelaxationAction';
import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';

function* relaxationInfoModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.RELAXATION_TECH,
      data.payload.obj,
    );
    yield put(relaxationInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(relaxationInfoFailure());
    data.onFailure(error);
  }
}

export default function* relaxationInfoSaga() {
  yield takeLatest(ActionType.RELAXATION_INFO_REQUEST, relaxationInfoModule);
}
