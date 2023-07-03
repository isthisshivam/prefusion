import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  prevMealListFailure,
  prevMealListRequest,
  prevMealListSuccess,
} from '../action/PreviousMealAction';
import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';

function* prevoiusMealModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.PREVIOUS_MEAL,
      data.payload.obj,
    );
    yield put(prevMealListSuccess(Data));
    data.onSuccess(Data);
  } catch (e) {
    yield put(prevMealListFailure(e));
    data.onFailure(e);
  }
}
function* PreviousMealSaga() {
  yield takeLatest(
    ActionType.PREVIOUS_MEAL_LISTING_REQUEST,
    prevoiusMealModule,
  );
}
export default PreviousMealSaga;
