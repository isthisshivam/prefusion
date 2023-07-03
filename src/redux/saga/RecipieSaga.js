import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  getRecipiesSuccess,
  getRecipiesFailure,
  getRecipieInfoFailure,
  getRecipieInfoSuccess,
  addRecipieToFavFailure,
  addRecipieToFavSuccess,
  removeRecipieToFavFailure,
  removeRecipieToFavSuccess,
} from '../action/RecipieAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* recipieModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.RECIPIE_LIST,
      data.payload.obj,
    );
    yield put(getRecipiesSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getRecipiesFailure());
    data.onFailure(error);
  }
}

function* recipieSaga() {
  yield takeLatest(ActionType.RECIPIE_LIST_REQUEST, recipieModule);
}
////////////////

function* recipieInfoModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.RECIPIES_INFO,
      data.payload.obj,
    );
    yield put(getRecipieInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getRecipieInfoFailure());
    data.onFailure(error);
  }
}

function* recipieInfoSaga() {
  yield takeLatest(ActionType.RECIPIE_INFO_REQUEST, recipieInfoModule);
}
//////////
function* favoriteModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_RECIPIE_TO_FAV,
      data.payload.obj,
    );
    yield put(addRecipieToFavSuccess(Data));
  } catch (error) {
    yield put(addRecipieToFavFailure());
  }
}

function* addRecipieToFavSaga() {
  yield takeLatest(ActionType.ADD_RECIPIE_TO_FAV_REQUEST, favoriteModule);
}

function* favoriteRemoveModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.REMOVE_RECIPIE_FAV,
      data.payload.obj,
    );
    yield put(removeRecipieToFavSuccess(Data));
  } catch (error) {
    yield put(removeRecipieToFavFailure());
  }
}

function* removeRecipieFromFavSaga() {
  yield takeLatest(
    ActionType.REMOVE_RECIPIE_TO_FAV_REQUEST,
    favoriteRemoveModule,
  );
}

export {
  recipieInfoSaga,
  recipieSaga,
  removeRecipieFromFavSaga,
  addRecipieToFavSaga,
};
