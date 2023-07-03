import * as Actions from './index';

export function addCommunityPostRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.ADD_COMMUNITY_POST_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function addCommunityPostSuccess(userData) {
  return {
    type: Actions.ADD_COMMUNITY_POST_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function addCommunityPostFailure(userData) {
  return {
    type: Actions.ADD_COMMUNITY_POST_FAILURE,
    payload: {
      userData,
    },
  };
}
//get community posts
export function getCommunityPostRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_COMMUNITY_POST_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getCommunityPostSuccess(userData) {
  return {
    type: Actions.GET_COMMUNITY_POST_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getCommunityPostFailure(userData) {
  return {
    type: Actions.GET_COMMUNITY_POST_FAILURE,
    payload: {
      userData,
    },
  };
}

//
//get community posts
export function getCommunityPostBySectionRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_COMMUNITY_POST_BY_SECTION_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getCommunityPostBySectionSuccess(userData) {
  return {
    type: Actions.GET_COMMUNITY_POST_BY_SECTION_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getCommunityPostBySectionFailure(userData) {
  return {
    type: Actions.GET_COMMUNITY_POST_BY_SECTION_FAILURE,
    payload: {
      userData,
    },
  };
}

//get replies
export function getRepliesCommunityPostRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_COMMUNITY_POST_REPLIES_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function getRepliesCommunityPostSuccess(userData) {
  return {
    type: Actions.GET_COMMUNITY_POST_REPLIES_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function getRepliesCommunityPostFailure(userData) {
  return {
    type: Actions.GET_COMMUNITY_POST_REPLIES_FAILURE,
    payload: {
      userData,
    },
  };
}
//add like dislike
export function addLikeDislikeCommunityPostRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.LIKE_DISLIKE_COMMUNITY_POST_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function addLikeDislikeCommunityPostSuccess(userData) {
  return {
    type: Actions.LIKE_DISLIKE_COMMUNITY_POST_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function addLikeDislikeCommunityPostFailure(userData) {
  return {
    type: Actions.LIKE_DISLIKE_COMMUNITY_POST_FAILURE,
    payload: {
      userData,
    },
  };
}

//add comment to post
export function addCommentCommunityPostRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.ADD_COMMENT_COMMUNITY_POST_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function addCommentCommunityPostSuccess(userData) {
  return {
    type: Actions.ADD_COMMENT_COMMUNITY_POST__SUCCESS,
    payload: {
      userData,
    },
  };
}

export function addCommentCommunityPostFailure(userData) {
  return {
    type: Actions.ADD_COMMENT_COMMUNITY_POST__FAILURE,
    payload: {
      userData,
    },
  };
}

//get replied comments
export function repliedCommentsPostRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_REPLIED_COMMENTS_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

export function repliedCommentsPostSuccess(userData) {
  return {
    type: Actions.GET_REPLIED_COMMENTS_SUCCESS,
    payload: {
      userData,
    },
  };
}

export function repliedCommentsPostFailure(userData) {
  return {
    type: Actions.GET_REPLIED_COMMENTS_FAILURE,
    payload: {
      userData,
    },
  };
}
