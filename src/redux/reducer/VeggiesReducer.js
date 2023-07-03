import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//veggiesReducer
const veggiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_VEGGIES_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.ADD_VEGGIES_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.ADD_VEGGIES_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    ////////////
    case ActionType.REMOVE_VEGGIES_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.REMOVE_VEGGIES_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.REMOVE_VEGGIES_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };
    /////////
    ////////
    ////////////
    case ActionType.VEGGIES_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.VEGGIES_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.VEGGIES_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default veggiesReducer;
