import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  addCustomFoodFailure,
  addCustomFoodSuccess,
  customFoodInfoSuccess,
  customFoodInfoFailure,
  deleteCustomFoodSuccess,
  deleteCustomFoodFailure,
} from '../action/CustomFoodAction';
import ApiConstant from '../../constants/api';
import {postRequest, getRequest} from '../webservice/webServiceCall';
function* addCustomFoodModule(data) {
  const {obj} = data.payload;
  const {onSuccess, onFailure} = data;
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_CUSTOM_FOOD,
      obj,
    );
    yield put(addCustomFoodSuccess(Data));
    onSuccess(Data);
  } catch (error) {
    yield put(addCustomFoodFailure());
    onFailure(error);
  }
}

function* addCustomFoodSaga() {
  yield takeLatest(ActionType.ADD_CUSTOM_FOOD_REQUEST, addCustomFoodModule);
}
///////////
function* customFoodInfoModule(data) {
  const {obj} = data.payload;
  const {onSuccess, onFailure} = data;
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.MEAL_REVIEW,
      obj,
    );
    yield put(customFoodInfoSuccess(Data));
    onSuccess(Data);
  } catch (error) {
    yield put(customFoodInfoFailure());
    onFailure(error);
  }
}

function* customFoodInfoSaga() {
  yield takeLatest(
    ActionType.GET_CUSTOM_FOOD_INFO_REQUEST,
    customFoodInfoModule,
  );
}
function* deleteCustomFoodInfoModule(data) {
  const {obj} = data.payload;
  console.log('deletecustomfoodrequest==', JSON.stringify(obj));
  const {onSuccess, onFailure} = data;
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FOOD_DELETE,
      obj,
    );
    yield put(deleteCustomFoodSuccess(Data));
    onSuccess(Data);
  } catch (error) {
    yield put(deleteCustomFoodFailure());
    onFailure(error);
  }
}
function* deleteCustomFoodSaga() {
  yield takeLatest(
    ActionType.DELETE_CUSTOM_FOOD_REQUEST,
    deleteCustomFoodInfoModule,
  );
}

export {addCustomFoodSaga, customFoodInfoSaga, deleteCustomFoodSaga};
