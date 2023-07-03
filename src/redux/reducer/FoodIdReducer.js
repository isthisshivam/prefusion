import * as ActionType from '../action/index';

const initialState = {
  showLoader: false,
  data: undefined,
  error: null,
};
//reducers
const addFoodIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_FOOD_ID_REQUEST:
      return {
        ...state,
        showLoader: false,
        data: action.params,
      };

    default:
      return state;
  }
};

export default addFoodIdReducer;
