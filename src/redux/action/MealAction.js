import * as Actions from './index';

// init addMeal
export function addMealRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.ADD_MEAL_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// addMeal success
export function addMealSuccess(userData) {
  return {
    type: Actions.ADD_MEAL_SUCCESS,
    payload: {
      userData,
    },
  };
}

// addMeal fail
export function addMealFailure(userData) {
  return {
    type: Actions.ADD_MEAL_FAILURE,
    payload: {
      userData,
    },
  };
}

///////////////
// init addMealToFav
export function addMealToFavRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.ADD_MEAL_TO_FAV_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// addMealToFav success
export function addMealToFavSuccess(userData) {
  return {
    type: Actions.ADD_MEAL_TO_FAV_SUCCESS,
    payload: {
      userData,
    },
  };
}

// addMealToFav fail
export function addMealToFavFailure(userData) {
  return {
    type: Actions.ADD_MEAL_TO_FAV_FAILURE,
    payload: {
      userData,
    },
  };
}

/////
///////////////
// init favmeal listing
export function favMealListRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.FAV_MEAL_LISTING_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// favMealList success
export function favMealListSuccess(userData) {
  return {
    type: Actions.FAV_MEAL_LISTING_SUCCESS,
    payload: {
      userData,
    },
  };
}

// favMealList fail
export function favMealListFailure(userData) {
  return {
    type: Actions.FAV_MEAL_LISTING_FAILURE,
    payload: {
      userData,
    },
  };
}
/////////
///////////////
// init removemealfromfav
export function removeMealFromFavRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.REMOVE_MEAL_FROM_FAV_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// removemealfromfav success
export function removeMealFromFavSuccess(userData) {
  return {
    type: Actions.REMOVE_MEAL_FROM_FAV_SUCCESS,
    payload: {
      userData,
    },
  };
}

// removemealfromfav fail
export function removeMealFromFavFailure(userData) {
  return {
    type: Actions.REMOVE_MEAL_FROM_FAV_FAILURE,
    payload: {
      userData,
    },
  };
}
//meal info actions
export function mealInfoRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.MEAL_INFO_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// mealInfo success
export function mealInfoSuccess(userData) {
  return {
    type: Actions.MEAL_INFO_SUCCESS,
    payload: {
      userData,
    },
  };
}

// mealInfo fail
export function mealInfoFailure(userData) {
  return {
    type: Actions.MEAL_INFO_FAILURE,
    payload: {
      userData,
    },
  };
}

//meal update request
export function mealUpdateRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.MEAL_UPDATE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// meal update success
export function mealUpdateSuccess(userData) {
  return {
    type: Actions.MEAL_UPDATE_SUCCESS,
    payload: {
      userData,
    },
  };
}

// meal update fail
export function mealUpdateFailure(userData) {
  return {
    type: Actions.MEAL_UPDATE_FAILURE,
    payload: {
      userData,
    },
  };
}
////meal history

export function mealHistoryRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.MEAL_HISTORY_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// meal history success
export function mealHistorySuccess(userData) {
  return {
    type: Actions.MEAL_HISTORY_SUCCESS,
    payload: {
      userData,
    },
  };
}

// meal history fail
export function mealHistoryFailure(userData) {
  return {
    type: Actions.MEAL_HISTORY_FAILURE,
    payload: {
      userData,
    },
  };
}

export function mealRemoveRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.MEAL_REMOVE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// meal remove success
export function mealRemoveSuccess(userData) {
  return {
    type: Actions.MEAL_REMOVE_SUCCESS,
    payload: {
      userData,
    },
  };
}

// meal remove fail
export function mealRemoveFailure(userData) {
  return {
    type: Actions.MEAL_REMOVE_FAILURE,
    payload: {
      userData,
    },
  };
}
//GET MEAL NAMES LIST
export function getMealsNameRequest(obj, onSuccess, onFailure) {
  return {
    type: Actions.GET_MEAL_NAMELIST_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// meal remove success
export function getMealsNameSuccess(userData) {
  return {
    type: Actions.GET_MEAL_NAMELIST_SUCCESS,
    payload: {
      userData,
    },
  };
}

// meal remove fail
export function getMealsNameFailure(userData) {
  return {
    type: Actions.GET_MEAL_NAMELIST_FAILURE,
    payload: {
      userData,
    },
  };
}
