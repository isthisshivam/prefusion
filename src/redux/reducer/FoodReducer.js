import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//favoriteReducer
const foodReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_FOODS_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_FOODS_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.GET_FOODS_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default foodReducer;
