import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//approvedFoodReducer
const approvedFoodReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_APPROVED_FOODS_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_APPROVED_FOODS_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.GET_APPROVED_FOODS_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default approvedFoodReducer;
