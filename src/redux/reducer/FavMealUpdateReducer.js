import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//favoriteMealUpdateReducer
const favoriteMealUpdateReducer = (state = initialState, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
};

export default favoriteMealUpdateReducer;
