import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//favoriteReducer
const progressReportInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.PROGRESS_INFORMATION_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.PROGRESS_INFORMATION_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.PROGRESS_INFORMATION_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    ////
    case ActionType.PROGRESS_DATA_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.PROGRESS_DATA_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.PROGRESS_DATA_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    //
    case ActionType.COMPARE_PROGRESS_PHOTOS_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.COMPARE_PROGRESS_PHOTOS_REQUEST:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.COMPARE_PROGRESS_PHOTOS_REQUEST:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default progressReportInfoReducer;
