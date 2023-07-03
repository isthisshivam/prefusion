import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  addWaterSuccess,
  addWaterFailure,
  removeWaterFailure,
  removeWaterSuccess,
  waterInfoFailure,
  waterInfoSuccess,
} from '../action/WaterAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';
///add water saga
function* addWaterModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_WATER,
      data.payload.obj,
    );
    yield put(addWaterSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(addWaterFailure());
    data.onFailure(error);
  }
}

function* addWaterSaga() {
  yield takeLatest(ActionType.ADD_WATER_REQUEST, addWaterModule);
}
///remove water saga
function* removeWaterModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.REMOVE_WATER,
      data.payload.obj,
    );
    yield put(removeWaterSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(removeWaterFailure());
    data.onFailure(error);
  }
}

function* removeWaterSaga() {
  yield takeLatest(ActionType.REMOVE_WATER_REQUEST, removeWaterModule);
}

///////////
//////////
/////////
///info water saga
function* waterInfoModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.WATER_INFO,
      data.payload.obj,
    );
    yield put(waterInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(waterInfoFailure());
    data.onFailure(error);
  }
}

function* waterInfoSaga() {
  yield takeLatest(ActionType.WATER_INFO_REQUEST, waterInfoModule);
}
export {addWaterSaga, removeWaterSaga, waterInfoSaga};
