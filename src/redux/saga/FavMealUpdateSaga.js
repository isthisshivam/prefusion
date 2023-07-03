import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  favMealUpdateSuccess,
  favMealUpdateFailure,
} from '../action/FavMealAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* favoriteMealUpdateModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FAV_MEAL_UPDATE,
      data.payload.obj,
    );
    yield put(favMealUpdateSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(favMealUpdateFailure());
    data.onFailure(error);
  }
}

export default function* favoriteMealUpdateSaga() {
  yield takeLatest(
    ActionType.FAV_MEAL_UPDATE_REQUEST,
    favoriteMealUpdateModule,
  );
}
