import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  getFoodsFailure,
  getFoodsSuccess,
  searchFoodsSuccess,
  searchFoodsFailure,
  getFoodProfileSuccess,
  getFoodProfileFailure,
  updateFoodProfileSuccess,
  updateFoodProfileFailure,
} from '../action/FoodListAction';
import ApiConstant from '../../constants/api';
import {
  postRequest,
  getRequest,
  getRequesForFood,
} from '../webservice/webServiceCall';

function* foodListModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FOOD_LIST,
      data.payload.obj,
    );
    yield put(getFoodsSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getFoodsFailure());
    data.onFailure(error);
  }
}

function* foodSaga() {
  yield takeLatest(ActionType.GET_FOODS_REQUEST, foodListModule);
}
////////search food module
function* searchFoodModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.SEARCH_FOOD_,
      data.payload.obj,
    );
    yield put(searchFoodsSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(searchFoodsFailure());
    data.onFailure(error);
  }
}

function* searchFoodSaga() {
  yield takeLatest(ActionType.SEARCH_FOOD_REQUEST, searchFoodModule);
}

////////get food profile
function* foodProfileModule(data) {
  try {
    const Data = yield call(
      getRequesForFood,
      ApiConstant.BASE_URL + ApiConstant.FOOD_PROFILE,
      data.payload.obj,
    );
    yield put(getFoodProfileSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getFoodProfileFailure());
    data.onFailure(error);
  }
}

function* foodProfileSaga() {
  yield takeLatest(ActionType.GET_FOOD_PROFILE_REQUEST, foodProfileModule);
}

////////update food profile
function* updateFoodProfileModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FOOD_UPDATE,
      data.payload.obj,
    );
    yield put(updateFoodProfileSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(updateFoodProfileFailure());
    data.onFailure(error);
  }
}

function* updateFoodProfileSaga() {
  yield takeLatest(
    ActionType.UPDATE_FOOD_PROFILE_REQUEST,
    updateFoodProfileModule,
  );
}

export {searchFoodSaga, foodSaga, foodProfileSaga, updateFoodProfileSaga};
