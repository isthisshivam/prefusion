import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  addVeggiesFailure,
  addVeggiesSuccess,
  removeVeggiesFailure,
  removeVeggiesSuccess,
  veggiesInfoFailure,
  veggiesInfoSuccess,
} from '../action/VeggiesAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';
///add veggies saga
function* addVeggiesModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_VEGGIES,
      data.payload.obj,
    );
    yield put(addVeggiesSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(removeVeggiesFailure());
    data.onFailure(error);
  }
}

function* addVeggiesSaga() {
  yield takeLatest(ActionType.ADD_VEGGIES_REQUEST, addVeggiesModule);
}
///remove veggies saga
function* removeVeggiesModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.REMOVE_VEGGIES,
      data.payload.obj,
    );
    yield put(removeVeggiesSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(removeVeggiesFailure());
    data.onFailure(error);
  }
}

function* removeVeggiesSaga() {
  yield takeLatest(ActionType.REMOVE_VEGGIES_REQUEST, removeVeggiesModule);
}
//////////
///////////
///////////
//veggiees info saga
function* veggiesInfoModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.VEGGIES_INFO,
      data.payload.obj,
    );
    yield put(veggiesInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(veggiesInfoFailure());
    data.onFailure(error);
  }
}

function* veggiesInfoSaga() {
  yield takeLatest(ActionType.VEGGIES_INFO_REQUEST, veggiesInfoModule);
}
export {addVeggiesSaga, removeVeggiesSaga, veggiesInfoSaga};
