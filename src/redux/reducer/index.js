import {combineReducers} from 'redux';
import * as ActionType from '../action/index';
import AsyncStorage from '@react-native-community/async-storage';
import loginReducer from '../reducer/LoginReducer';
import registerReducer from '../reducer/RegisterReducer';
import userProfileInfoReducer from '../reducer/UserProfileInfoReducer';
import favoriteReducer from '../reducer/FavoriteReducer';
import foodReducer from '../reducer/FoodReducer';
import calorieDropdownReducer from '../reducer/CalorieDropdownReducer';
import addCustomFoodReducer from '../reducer/CustomFoodReducer';
import weekelyDataReducer from '../reducer/WeekelyDataReducer';
import waterReducer from '../reducer/WaterReducer';
import veggiesReducer from '../reducer/VeggiesReducer';
import addFeedbackReducer from '../reducer/AddFeedbackReducer';
import weekelyListReducer from '../reducer/WeeklyListReducer';
import progressReportInfoReducer from '../reducer/ProgressReportInfoReducer';
import changePasswordReducer from '../reducer/ChangePasswordReducer';
import addFoodIdReducer from '../reducer/FoodIdReducer';
import mealReducer from '../reducer/MealReducer';
import recipieReducer from '../reducer/RecipieReducer';
import approvedFoodReducer from '../reducer/ApprovedFoodReducer';
import dailyDairyReducer from '../reducer/DailyDairyReducer';
import clientInfoReducer from '../reducer/ClientDataReducer';
import relaxationInfoReducer from '../reducer/RelaxationReducer';
import convertTokenReducer from '../reducer/ConvertTokenReducer';
import favoriteMealUpdateReducer from '../reducer/FavMealUpdateReducer';
import PrevoiusMealReducer from './PreviousMealReducer';
import mailReducer from './MailReducer';
import communitySectionReducer from './CommunitySectionReducer';

// root reducer
const appReducer = combineReducers({
  loginReducer: loginReducer,
  registerReducer: registerReducer,
  userProfileInfoReducer: userProfileInfoReducer,
  favoriteReducer: favoriteReducer,
  foodReducer: foodReducer,
  calorieDropdownReducer: calorieDropdownReducer,
  addCustomFoodReducer: addCustomFoodReducer,
  weekelyDataReducer: weekelyDataReducer,
  waterReducer: waterReducer,
  veggiesReducer: veggiesReducer,
  addFeedbackReducer: addFeedbackReducer,
  progressReportInfoReducer: progressReportInfoReducer,
  weekelyListReducer: weekelyListReducer,
  changePasswordReducer: changePasswordReducer,
  mealReducer: mealReducer,
  recipieReducer: recipieReducer,
  approvedFoodReducer: approvedFoodReducer,
  dailyDairyReducer: dailyDairyReducer,
  clientInfoReducer: clientInfoReducer,
  relaxationInfoReducer: relaxationInfoReducer,
  convertTokenReducer: convertTokenReducer,
  favoriteMealUpdateReducer: favoriteMealUpdateReducer,
  PrevoiusMealReducer: PrevoiusMealReducer,
  mailReducer: mailReducer,
  communitySectionReducer: communitySectionReducer,
});
const foodIdReducer = combineReducers({
  addFoodIdReducer: addFoodIdReducer,
});

const RootReducer = (state, action) => {
  if (action.type === ActionType.LOGOUT) {
    AsyncStorage.removeItem('persist:root');
    state = undefined;
  }
  return appReducer(state, action);
};
const rootFoodIdReducer = (state, action) => {
  if (action.type === ActionType.CLEAR_FOOD_ID_REQUEST) {
    AsyncStorage.removeItem('persist:foodId');
    state = undefined;
  }
  return foodIdReducer(state, action);
};

//export default rootReducer;
export {RootReducer, rootFoodIdReducer};
