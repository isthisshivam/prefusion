import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//waterReducer
const waterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_WATER_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.ADD_WATER_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.ADD_WATER_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    ////////////
    case ActionType.REMOVE_WATER_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.REMOVE_WATER_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.REMOVE_WATER_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    //////////
    /////////
    ////////////
    case ActionType.WATER_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.WATER_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.WATER_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default waterReducer;
