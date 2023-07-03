import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//addCustomFoodReducer
const addCustomFoodReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_CUSTOM_FOOD_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.ADD_CUSTOM_FOOD_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.ADD_CUSTOM_FOOD_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    //////////

    case ActionType.GET_CUSTOM_FOOD_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_CUSTOM_FOOD_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.GET_CUSTOM_FOOD_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    default:
      return state;
  }
};

export default addCustomFoodReducer;
