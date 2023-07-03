import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//weekelyDataReducer
const weekelyDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.HOME_DATA_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.HOME_DATA_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.HOME_DATA_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default weekelyDataReducer;
