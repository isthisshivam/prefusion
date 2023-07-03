import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  progressInfoSuccess,
  progressInfoFailure,
  progressDataFailure,
  progressDataSuccess,
  compareProgressPhotosFailure,
  compareProgressPhotosSuccess,
} from '../action/ProgressReportAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* progressReportInfoModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.PROGRESS_REPORT_INFO,
      data.payload.obj,
    );
    yield put(progressInfoSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(progressInfoFailure());
    data.onFailure(error);
  }
}

function* progressReportInfoSaga() {
  yield takeLatest(
    ActionType.PROGRESS_INFORMATION_REQUEST,
    progressReportInfoModule,
  );
}
////
function* progressDataModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.PROGRESS_DATA,
      data.payload.obj,
    );
    yield put(progressDataSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(progressDataFailure());
    data.onFailure(error);
  }
}

function* progressDataSaga() {
  yield takeLatest(ActionType.PROGRESS_DATA_REQUEST, progressDataModule);
}
//compare prgress photos
function* compareProgressPhotosModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.COMPARE_PHOTOS,
      data.payload.obj,
    );
    yield put(compareProgressPhotosSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(compareProgressPhotosFailure(error));
    data.onFailure(error);
  }
}

function* compareProgressPhotosSaga() {
  yield takeLatest(
    ActionType.COMPARE_PROGRESS_PHOTOS_REQUEST,
    compareProgressPhotosModule,
  );
}
export {progressReportInfoSaga, progressDataSaga, compareProgressPhotosSaga};
