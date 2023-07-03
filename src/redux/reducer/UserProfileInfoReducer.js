import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};
//reducers
const userProfileInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.USER_PROFILE_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.USER_PROFILE_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.USER_PROFILE_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    /////
    case ActionType.UPDATE_USER_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.UPDATE_USER_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.UPDATE_USER_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    //////DELETE USER ACCOUNT
    /////
    case ActionType.DELETE_USER_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.DELETE_USER_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.DELETE_USER_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default userProfileInfoReducer;
