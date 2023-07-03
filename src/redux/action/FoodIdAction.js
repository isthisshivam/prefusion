import * as Actions from './index';

// init add food id
export function addFoodIdRequest(paramsData) {
  return {
    type: Actions.ADD_FOOD_ID_REQUEST,
    params: paramsData,
  };
}

// clear food id action
export function clearFoodId() {
  return {
    type: Actions.CLEAR_FOOD_ID_REQUEST,
    payload: null,
  };
}
