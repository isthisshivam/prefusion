import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  weekelyDataSuccess,
  weekelyDataFailure,
  weekelyListFailure,
  weekelyListSuccess,
} from '../action/WeekelyDataAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* weeklyDataModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.WEEKELY_DATA_INFO,
      data.payload.obj,
    );
    yield put(weekelyDataSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(weekelyDataFailure());
    data.onFailure(error);
  }
}

function* weekelyDataSaga() {
  yield takeLatest(ActionType.HOME_DATA_REQUEST, weeklyDataModule);
}
/////////////
function* weeklyListModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.WEEKELY_LIST,
      data.payload,
    );
    yield put(weekelyListSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(weekelyListFailure());
    data.onFailure(error);
  }
}

function* weekelyListSaga() {
  yield takeLatest(ActionType.WEEKELY_INFORMATION_REQUEST, weeklyListModule);
}
export {weekelyListSaga, weekelyDataSaga};
