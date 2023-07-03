import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  addFeedbackSuccess,
  addFeedbackFailure,
  feedbackInfoFailure,
  feedbackInfoSuccess,
} from '../action/FeedbackAction';
import ApiConstant from '../../constants/api';
import {postRequest} from '../webservice/webServiceCall';

function* addFeeddbackModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_FEEDBACK,
      data.payload.obj,
    );
    yield put(addFeedbackSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(addFeedbackFailure());
    data.onFailure(error);
  }
}

function* addFeedbackSaga() {
  yield takeLatest(ActionType.ADD_FEEDBACK_REQUEST, addFeeddbackModule);
}
///
function* feedbackInfoModule(data) {
  const {onSuccess, onFailure} = data;
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.FEEDBACK_VIEW,
      data.payload.obj,
    );
    yield put(feedbackInfoSuccess(Data));
    onSuccess(Data);
  } catch (error) {
    yield put(feedbackInfoFailure());
    onFailure(error);
  }
}

function* feedbackInfoSaga() {
  yield takeLatest(ActionType.FEEDBACK_INFO_REQUEST, feedbackInfoModule);
}
export {addFeedbackSaga, feedbackInfoSaga};
