import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

const communitySectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_COMMUNITY_POST_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.ADD_COMMUNITY_POST_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.ADD_COMMUNITY_POST_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    //get community post list
    case ActionType.GET_COMMUNITY_POST_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_COMMUNITY_POST_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.GET_COMMUNITY_POST_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    //
    //get community post list
    case ActionType.GET_COMMUNITY_POST_BY_SECTION_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_COMMUNITY_POST_BY_SECTION_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.GET_COMMUNITY_POST_BY_SECTION_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    //get replies list
    case ActionType.GET_COMMUNITY_POST_REPLIES_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_COMMUNITY_POST_REPLIES_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.GET_COMMUNITY_POST_REPLIES_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    //get  replied comment list
    case ActionType.GET_REPLIED_COMMENTS_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_REPLIED_COMMENTS_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.GET_REPLIED_COMMENTS_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    default:
      return state;
  }
};

export default communitySectionReducer;
