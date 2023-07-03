import * as ActionType from '../action/index';
// import Utils from "../../utilities/Utils";
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  userProfileInfoFailure,
  userProfileInfoSuccess,
  uploadUserImageSuccess,
  uploadUserImageFailure,
  updateUserInformationFailure,
  updateUserInformationSuccess,
  deleteUserAccountFailure,
  deleteUserAccountSuccess,
} from '../action/UserProfileInfo';
import ApiConstant from '../../constants/api';
import {
  getRequest,
  postRequestFormData,
  postRequest,
} from '../webservice/webServiceCall';
import RequestCreator from '../webservice/api_manager/RequestCreater';

function* userInfoModule(data) {
  console.log(
    'userInfoModule=>',
    ApiConstant.BASE_URL + ApiConstant.PROFILE,
    data.payload.obj,
  );
  try {
    const profileData = yield call(
      getRequest,
      ApiConstant.BASE_URL + ApiConstant.PROFILE,
      data.payload.obj,
    );
    yield put(userProfileInfoSuccess(profileData));
    data.onSuccess(profileData);
  } catch (error) {
    yield put(userProfileInfoFailure());
    data.onFailure(error);
  }
}

function* userProfileInfoSaga() {
  yield takeLatest(ActionType.USER_PROFILE_INFO_REQUEST, userInfoModule);
}

function* uplaodUserInformationModule(data) {
  try {
    const updateUserData = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.UPDATE_USER_INFORMATION,
      data.payload.obj,
    );

    yield put(updateUserInformationSuccess(updateUserData));
    data.onSuccess(updateUserData);
  } catch (error) {
    yield put(updateUserInformationFailure());
    data.onFailure(error);
  }
}

function* uplaodUserInformationSaga() {
  yield takeLatest(
    ActionType.UPDATE_USER_INFO_REQUEST,
    uplaodUserInformationModule,
  );
}
//////
function* deleteUserModule(data) {
  try {
    const deleteUserData = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.DELETE_USER,
      data.payload.obj,
    );

    yield put(deleteUserAccountSuccess(deleteUserData));
    data.onSuccess(deleteUserData);
  } catch (error) {
    yield put(deleteUserAccountFailure());
    data.onFailure(error);
  }
}

function* deleteUserAccountSaga() {
  yield takeLatest(ActionType.DELETE_USER_REQUEST, deleteUserModule);
}

// UPLOAD USER PROFILE SAGA
function* uplaodUserProfileModule(data) {
  console.log('uplaodUserProfileModule.data=>', JSON.stringify(data));
  try {
    const profileImageData = yield call(
      postRequestFormData,
      ApiConstant.BASE_URL + ApiConstant.UPLOAD_USER_IMAGE,
      data.payload,
    );

    yield put(uploadUserImageSuccess(profileImageData));
    data.onSuccess(profileImageData);
  } catch (error) {
    yield put(uploadUserImageFailure());
    data.onFailure(error);
  }
}

function* userProfileImageSaga() {
  yield takeLatest(
    ActionType.UPLOAD_USER_PROFILE_IMAGE_REQUEST,
    uplaodUserProfileModule,
  );
}
export {
  userProfileImageSaga,
  userProfileInfoSaga,
  uplaodUserInformationSaga,
  deleteUserAccountSaga,
};
