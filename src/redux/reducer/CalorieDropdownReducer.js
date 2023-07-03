import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//calorieDropdownReducer
const calorieDropdownReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.DROPWODN_DATA_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.DROPWODN_DATA_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.DROPWODN_DATA_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    //////////

    case ActionType.UPLOAD_USER_CALORIE_DATA_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.UPLOAD_USER_CALORIE_DATA_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.UPLOAD_USER_CALORIE_DATA_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    default:
      return state;
  }
};

export default calorieDropdownReducer;
