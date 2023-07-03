import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//recipieReducer
const recipieReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.RECIPIE_LIST_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.RECIPIE_LIST_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.RECIPIE_LIST_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    /////////////
    case ActionType.RECIPIE_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.RECIPIE_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.RECIPIE_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default recipieReducer;
