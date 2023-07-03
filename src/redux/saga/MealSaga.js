import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  addMealSuccess,
  addMealFailure,
  addMealToFavFailure,
  addMealToFavSuccess,
  favMealListFailure,
  favMealListSuccess,
  removeMealFromFavFailure,
  removeMealFromFavSuccess,
  mealInfoSuccess,
  mealInfoFailure,
  mealUpdateFailure,
  mealUpdateSuccess,
  mealHistorySuccess,
  mealHistoryFailure,
  mealRemoveFailure,
  mealRemoveSuccess,
  getMealsNameFailure,
  getMealsNameSuccess,
} from '../action/MealAction';
import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';

function* addMealModule(data) {
  try {
    const registerData = yield call(
      postRequest,
      ApiConstant.BASE_URL + data.payload.obj.endpoint,
      data.payload.obj,
    );
    yield put(addMealSuccess(registerData));
    data.onSuccess(registerData);
  } catch (error) {
    yield put(addMealFailure());
    data.onFailure(error);
  }
}

function* addMealSaga() {
  yield takeLatest(ActionType.ADD_MEAL_REQUEST, addMealModule);
}
//////////
function* addMealToFavModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_MEAL_TO_FAV_UPDATE,
      data.payload.obj,
    );
    yield put(addMealToFavSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(addMealToFavFailure());
    data.onFailure(error);
  }
}

function* addMealToFavSaga() {
  yield takeLatest(ActionType.ADD_MEAL_TO_FAV_REQUEST, addMealToFavModule);
}

////
function* favMealModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FAV_MEAL_LIST,
      data.payload.obj,
    );
    yield put(favMealListSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(favMealListFailure());
    data.onFailure(error);
  }
}

function* favMealSaga() {
  yield takeLatest(ActionType.FAV_MEAL_LISTING_REQUEST, favMealModule);
}
///////remove meal from fav
////
function* removeMealFromFavModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.REMOVE_MEAL_FROM_FAV,
      data.payload.obj,
    );
    yield put(removeMealFromFavSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(removeMealFromFavFailure());
    data.onFailure(error);
  }
}

function* removeFavMealSaga() {
  yield takeLatest(
    ActionType.REMOVE_MEAL_FROM_FAV_REQUEST,
    removeMealFromFavModule,
  );
}
//meal info
function* mealInfoModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.MEAL_INFO,
      data.payload.obj,
    );
    yield put(mealInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(mealInfoFailure());
    data.onFailure(error);
  }
}

function* mealInfoSaga() {
  yield takeLatest(ActionType.MEAL_INFO_REQUEST, mealInfoModule);
}

//meal update saga
function* mealUpdateModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.MEAL_UPDATE,
      data.payload.obj,
    );
    yield put(mealUpdateSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(mealUpdateFailure());
    data.onFailure(error);
  }
}

function* mealUpdateSaga() {
  yield takeLatest(ActionType.MEAL_UPDATE_REQUEST, mealUpdateModule);
}
//meal history saga
function* mealHostoryModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.MEAL_HISTORY,
      data.payload.obj,
    );
    yield put(mealHistorySuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(mealHistoryFailure());
    data.onFailure(error);
  }
}

function* mealHistorySaga() {
  yield takeLatest(ActionType.MEAL_HISTORY_REQUEST, mealHostoryModule);
}

//meal remove saga
function* mealRemoveModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.MEAL_DELETE,
      data.payload.obj,
    );
    yield put(mealRemoveSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(mealRemoveFailure());
    data.onFailure(error);
  }
}

function* mealRemoveSaga() {
  yield takeLatest(ActionType.MEAL_REMOVE_REQUEST, mealRemoveModule);
}
//get meals name list
function* getMealNamesModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.MEAL_NAMES_LIST,
      data.payload.obj,
    );
    yield put(getMealsNameSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getMealsNameFailure(error));
    data.onFailure(error);
  }
}

function* getMealNamesSaga() {
  yield takeLatest(ActionType.GET_MEAL_NAMELIST_REQUEST, getMealNamesModule);
}
export {
  getMealNamesSaga,
  addMealSaga,
  addMealToFavSaga,
  favMealSaga,
  removeFavMealSaga,
  mealInfoSaga,
  mealUpdateSaga,
  mealHistorySaga,
  mealRemoveSaga,
};
