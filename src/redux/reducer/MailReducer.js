import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};
//reducers
const mailReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SEND_MAIL_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.SEND_MAIL_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.SEND_MAIL_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default mailReducer;
