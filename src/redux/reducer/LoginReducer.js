import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};
//reducers
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LOGIN_USER_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.LOGIN_USER_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.LOGIN_USER_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default loginReducer;
