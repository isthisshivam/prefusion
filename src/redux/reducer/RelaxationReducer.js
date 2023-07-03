import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//clientInfo
const relaxationInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.RELAXATION_INFO_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.RELAXATION_INFO_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.RELAXATION_INFO_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default relaxationInfoReducer;
