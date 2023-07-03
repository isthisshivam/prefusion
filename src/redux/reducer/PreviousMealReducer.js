import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};
const PrevoiusMealReducer = (state = initialState, action) => {
  switch (action.type) {
    ///////prev meal list reducer
    case ActionType.PREVIOUS_MEAL_LISTING_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.PREVIOUS_MEAL_LISTING_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.PREVIOUS_MEAL_LISTING_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default PrevoiusMealReducer;
