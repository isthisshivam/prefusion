import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//changePasswordReducer
const changePasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default changePasswordReducer;
