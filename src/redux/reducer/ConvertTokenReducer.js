import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  userData: undefined,
  error: null,
};
//reducers
const convertTokenReducer = (state = initialState, action) => {
  console.log('convertTokenReducer', JSON.stringify(state));
  switch (action.type) {
    case ActionType.TOKEN_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.TOKEN_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.TOKEN_FAILURE:
      return {
        ...state,
        showLoader: false,
        error: action.payload.userData,
      };

    default:
      return state;
  }
};

export default convertTokenReducer;
