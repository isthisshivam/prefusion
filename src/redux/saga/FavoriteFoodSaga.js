import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  getFavouriteFoodsFailure,
  getFavouriteFoodsSuccess,
} from '../action/FavoriteFoodsAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* favoriteModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FAVORITE_FOODS,
      data.payload.obj,
    );
    yield put(getFavouriteFoodsSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getFavouriteFoodsFailure());
    data.onFailure(error);
  }
}

export default function* favoriteFoodSaga() {
  yield takeLatest(ActionType.GET_FAVORITE_FOODS_REQUEST, favoriteModule);
}
