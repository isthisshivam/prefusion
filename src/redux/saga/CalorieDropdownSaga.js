import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  getCalorieDropdownDataFailure,
  getCalorieDropdownDataSuccess,
  uploadUserCalorieDataFailure,
  uploadUserCalorieDataSuccess,
  changeCalorieCounterSuccess,
  changeCalorieCounterFailure,
} from '../action/CalorieDropdownAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* calorieDropdownModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.DROPDOWN,
      data.payload.obj,
    );
    yield put(getCalorieDropdownDataSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getCalorieDropdownDataFailure());
    data.onFailure(error);
  }
}

function* calorieDropdownSaga() {
  yield takeLatest(ActionType.DROPWODN_DATA_REQUEST, calorieDropdownModule);
}

function* uploadCalorieDataModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.UPLOAD_CALORIE_DATA,
      data.payload.obj,
    );
    yield put(uploadUserCalorieDataSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(uploadUserCalorieDataFailure());
    data.onFailure(error);
  }
}

function* uploadCalorieDataSaga() {
  yield takeLatest(
    ActionType.UPLOAD_USER_CALORIE_DATA_REQUEST,
    uploadCalorieDataModule,
  );
}

function* changeCalorieDataModule(data) {
  const {obj} = data.payload;
  const {onSuccess, onFailure} = data;
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.CALORIES_COUNTER,
      obj,
    );

    yield put(changeCalorieCounterSuccess(Data));
    onSuccess(Data);
  } catch (error) {
    yield put(changeCalorieCounterFailure());
    onFailure(error);
  }
}

function* changeCalorieCounterSaga() {
  yield takeLatest(
    ActionType.CHANGE_CALORIE_DATA_REQUEST,
    changeCalorieDataModule,
  );
}

export {uploadCalorieDataSaga, calorieDropdownSaga, changeCalorieCounterSaga};
