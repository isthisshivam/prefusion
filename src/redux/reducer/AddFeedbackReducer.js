import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};
//reducers
const addFeedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_FEEDBACK_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.ADD_FEEDBACK_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.ADD_FEEDBACK_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    //////feedback information
    case ActionType.FEEDBACK_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.FEEDBACK_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.FEEDBACK_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default addFeedbackReducer;
