import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  getApprovedFoodsSuccess,
  getApprovedFoodsFailure,
} from '../action/ApprovedFoodAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* foodListModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.APPROVED_FOOD_LIST,
      data.payload.obj,
    );
    yield put(getApprovedFoodsSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getApprovedFoodsFailure());
    data.onFailure(error);
  }
}

export default function* approvedFoodSaga() {
  yield takeLatest(ActionType.GET_APPROVED_FOODS_REQUEST, foodListModule);
}
