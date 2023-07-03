import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};

//dailyDairyReducer
const dailyDairyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.DAILY_ADIRY_INFORMATION_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.DAILY_ADIRY_INFORMATION_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.DAILY_ADIRY_INFORMATION_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default dailyDairyReducer;
