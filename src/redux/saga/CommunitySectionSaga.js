import * as ActionType from '../action/index';
import {takeLatest, call, put} from 'redux-saga/effects';
import {
  addCommunityPostFailure,
  addCommunityPostSuccess,
  getCommunityPostFailure,
  getCommunityPostSuccess,
  getCommunityPostBySectionSuccess,
  getCommunityPostBySectionFailure,
  getRepliesCommunityPostFailure,
  getRepliesCommunityPostSuccess,
  addCommentCommunityPostFailure,
  addCommentCommunityPostSuccess,
  addLikeDislikeCommunityPostFailure,
  addLikeDislikeCommunityPostSuccess,
  repliedCommentsPostFailure,
  repliedCommentsPostSuccess,
} from '../action/CommunitySectionAction';
import ApiConstant from '../../constants/api';
import {postRequest, postRequestFormData} from '../webservice/webServiceCall';

function* addCommunityPostModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_COMMUNITY_POST,
      data.payload.obj,
    );
    yield put(addCommunityPostSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(addCommunityPostFailure(error));
    data.onFailure(error);
  }
}
function* addCommunityPostSaga() {
  yield takeLatest(
    ActionType.ADD_COMMUNITY_POST_REQUEST,
    addCommunityPostModule,
  );
}
//get community post list
function* getCommunityPostModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.COMMUNITY_POST_LIST,
      data.payload.obj,
    );
    yield put(getCommunityPostSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getCommunityPostFailure(error));
    data.onFailure(error);
  }
}

function* getCommunityPostSaga() {
  yield takeLatest(
    ActionType.GET_COMMUNITY_POST_REQUEST,
    getCommunityPostModule,
  );
}
//get community post section  list
function* getCommunityPostBySectionModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.COMMUNITY_POST_LIST_BY_SECTION,
      data.payload.obj,
    );
    yield put(getCommunityPostBySectionSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getCommunityPostBySectionFailure(error));
    data.onFailure(error);
  }
}

function* getCommunityPostBySectionSaga() {
  yield takeLatest(
    ActionType.GET_COMMUNITY_POST_BY_SECTION_REQUEST,
    getCommunityPostBySectionModule,
  );
}

//get replies list
function* getCommunityPostRepliesModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.GET_COMM_BOARD_REPLIS,
      data.payload.obj,
    );
    yield put(getRepliesCommunityPostSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(getRepliesCommunityPostFailure(error));
    data.onFailure(error);
  }
}

function* getCommunityPostRepliesSaga() {
  yield takeLatest(
    ActionType.GET_COMMUNITY_POST_REPLIES_REQUEST,
    getCommunityPostRepliesModule,
  );
}

//add comment to replies
function* addCommentCommunityPostModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.ADD_COMMENT_COMM_POST_COMMENT,
      data.payload.obj,
    );
    yield put(addCommentCommunityPostSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(addCommentCommunityPostFailure(error));
    data.onFailure(error);
  }
}

function* addCommentCommunityPostSaga() {
  yield takeLatest(
    ActionType.ADD_COMMENT_COMMUNITY_POST_REQUEST,
    addCommentCommunityPostModule,
  );
}
//add like dislike
function* addLikeDislikeCommunityPostModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.LIKE_DISLIKE_COMM_POST_COMMENT,
      data.payload.obj,
    );
    yield put(addLikeDislikeCommunityPostSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(addLikeDislikeCommunityPostFailure(error));
    data.onFailure(error);
  }
}

function* addLikeDislikeCommunityPostSaga() {
  yield takeLatest(
    ActionType.LIKE_DISLIKE_COMMUNITY_POST_REQUEST,
    addLikeDislikeCommunityPostModule,
  );
}

//get replied commments
function* getRepliedCommentsModule(data) {
  try {
    const Data = yield call(
      postRequest,
      ApiConstant.BASE_URL + ApiConstant.GET_REPLIED_COMMENTS,
      data.payload.obj,
    );
    yield put(repliedCommentsPostSuccess(Data));
    data.onSuccess(Data);
  } catch (error) {
    yield put(repliedCommentsPostFailure(error));
    data.onFailure(error);
  }
}

function* getRepliedCommentsSaga() {
  yield takeLatest(
    ActionType.GET_REPLIED_COMMENTS_REQUEST,
    getRepliedCommentsModule,
  );
}

export {
  addCommunityPostSaga,
  getCommunityPostSaga,
  getCommunityPostBySectionSaga,
  getCommunityPostRepliesSaga,
  addCommentCommunityPostSaga,
  addLikeDislikeCommunityPostSaga,
  getRepliedCommentsSaga,
};
