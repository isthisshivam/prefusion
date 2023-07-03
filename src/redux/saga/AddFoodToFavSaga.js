import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  addFoodToFavFailure,
  addFoodToFavSuccess,
  removeFoodToFavSuccess,
  removeFoodToFavFailure,
} from '../action/AddFoodToFavAction';
import {
  getFavouriteFoodsSuccess,
  getFavouriteFoodsFailure,
} from '../action/FavoriteFoodsAction';
import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';
function* favoriteModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_FOOD_TO_FAV,
      data.payload.obj,
    );
    yield put(addFoodToFavSuccess(Data));
  } catch (error) {
    yield put(addFoodToFavFailure());
  }
}

function* addFoodToFavSaga() {
  yield takeLatest(ActionType.ADD_FOOD_TO_FAV_REQUEST, favoriteModule);
}

function* favoriteRemoveModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.REMOVE_FAV,
      data.payload.obj,
    );
    yield put(removeFoodToFavSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(removeFoodToFavFailure());
    data.onFailure(error);
  }
}

function* removeFoodToFavSaga() {
  yield takeLatest(ActionType.REMOVE_FOOD_TO_FAV_REQUEST, favoriteRemoveModule);
}
//

function* favoriteFoodModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FAVORITE_FOODS,
      data.payload.obj,
    );
    yield put(getFavouriteFoodsSuccess(Data));
  } catch (error) {
    yield put(getFavouriteFoodsFailure());
  }
}

function* favFoodListingSaga() {
  yield takeLatest(ActionType.GET_FAVORITE_FOODS_REQUEST, favoriteFoodModule);
}

export {removeFoodToFavSaga, addFoodToFavSaga, favFoodListingSaga};
