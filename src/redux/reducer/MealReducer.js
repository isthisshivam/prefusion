import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//mealReducer
const mealReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_MEAL_TO_FAV_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.ADD_MEAL_TO_FAV_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.ADD_MEAL_TO_FAV_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    ///////fav meal list reducer
    case ActionType.FAV_MEAL_LISTING_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.FAV_MEAL_LISTING_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.FAV_MEAL_LISTING_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    ///meal info
    case ActionType.MEAL_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.MEAL_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.MEAL_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    //
    case ActionType.SEND_AUTO_RESPONSE_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.SEND_AUTO_RESPONSE_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.SEND_AUTO_RESPONSE_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default mealReducer;
