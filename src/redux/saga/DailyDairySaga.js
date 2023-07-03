import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  dailyDiryInfoFailure,
  dailyDiryInfoSuccess,
} from '../action/DailyDairyAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* dailyDairyModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.DAILY_DAIRY,
      data.payload.obj,
    );
    yield put(dailyDiryInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(dailyDiryInfoFailure());
    data.onFailure(error);
  }
}

export default function* dailyDairyInfoSaga() {
  yield takeLatest(
    ActionType.DAILY_ADIRY_INFORMATION_REQUEST,
    dailyDairyModule,
  );
}
