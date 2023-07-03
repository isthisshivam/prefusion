import {all} from 'redux-saga/effects';
import {loginSaga, logoutSaga} from '../saga/LoginSaga';
import registerSaga from '../saga/RegisterSaga';
import {
  userProfileInfoSaga,
  userProfileImageSaga,
  deleteUserAccountSaga,
  uplaodUserInformationSaga,
} from '../saga/UserProfileInfoSaga';
import PreviousMealSaga from './PreviousMealSaga';
import favoriteFoodSaga from '../saga/FavoriteFoodSaga';
import {
  foodSaga,
  updateFoodProfileSaga,
  foodProfileSaga,
} from '../saga/FoodSaga';
import {
  addFoodToFavSaga,
  removeFoodToFavSaga,
  favFoodListingSaga,
} from '../saga/AddFoodToFavSaga';
import {
  calorieDropdownSaga,
  uploadCalorieDataSaga,
  changeCalorieCounterSaga,
} from '../saga/CalorieDropdownSaga';
import {
  addCustomFoodSaga,
  customFoodInfoSaga,
  deleteCustomFoodSaga,
} from '../saga/CustomFoodSaga';
import {
  addMealSaga,
  addMealToFavSaga,
  favMealSaga,
  removeFavMealSaga,
  mealInfoSaga,
  mealUpdateSaga,
  mealHistorySaga,
  mealRemoveSaga,
  getMealNamesSaga,
} from '../../redux/saga/MealSaga';
import {
  weekelyListSaga,
  weekelyDataSaga,
} from '../../redux/saga/WeekelyDataSaga';
import {addWaterSaga, removeWaterSaga, waterInfoSaga} from '../saga/WaterSaga';
import {
  addVeggiesSaga,
  removeVeggiesSaga,
  veggiesInfoSaga,
} from '../saga/VeggiesSaga';
import {addFeedbackSaga, feedbackInfoSaga} from '../saga/AddFeedbackSaga';
import {
  progressReportInfoSaga,
  progressDataSaga,
  compareProgressPhotosSaga,
} from '../saga/ProgressReportSaga';
import {
  changePasswordSaga,
  forgotPasswordSaga,
} from '../saga/ChangePasswordSaga';
import {
  recipieSaga,
  recipieInfoSaga,
  addRecipieToFavSaga,
  removeRecipieFromFavSaga,
} from '../saga/RecipieSaga';
import approvedFoodSaga from '../saga/ApprovedFoodSaga';
import dailyDairyInfoSaga from '../saga/DailyDairySaga';
import clientInfoSaga from '../saga/ClientDataSaga';
import relaxationInfoSaga from '../saga/RelaxationSaga';
import convertTokenSaga from '../saga/ConvertTokenSaga';
import sendMsgNotificationModuleSaga from '../saga/SendMessageNotificationSaga';
import favoriteMealUpdateSaga from './FavMealUpdateSaga';
import {mailSaga, sendAutoResponseSaga} from './MailSaga';
import {
  addCommunityPostSaga,
  getCommunityPostSaga,
  getCommunityPostBySectionSaga,
  getCommunityPostRepliesSaga,
  addCommentCommunityPostSaga,
  addLikeDislikeCommunityPostSaga,
  getRepliedCommentsSaga,
} from './CommunitySectionSaga';
//////////////
export default function* rootSaga() {
  yield all([
    loginSaga(),
    registerSaga(),
    addRecipieToFavSaga(),
    removeRecipieFromFavSaga(),
    userProfileInfoSaga(),
    userProfileImageSaga(),
    favoriteFoodSaga(),
    foodSaga(),
    addFoodToFavSaga(),
    removeFoodToFavSaga(),
    uplaodUserInformationSaga(),
    calorieDropdownSaga(),
    uploadCalorieDataSaga(),
    changeCalorieCounterSaga(),
    addCustomFoodSaga(),
    customFoodInfoSaga(),
    addMealSaga(),
    weekelyDataSaga(),
    addVeggiesSaga(),
    removeVeggiesSaga(),
    addWaterSaga(),
    removeWaterSaga(),
    veggiesInfoSaga(),
    waterInfoSaga(),
    addFeedbackSaga(),
    progressReportInfoSaga(),
    weekelyListSaga(),
    changePasswordSaga(),
    addMealToFavSaga(),
    recipieSaga(),
    recipieInfoSaga(),
    approvedFoodSaga(),
    favMealSaga(),
    removeFavMealSaga(),
    deleteUserAccountSaga(),
    mealInfoSaga(),
    dailyDairyInfoSaga(),
    feedbackInfoSaga(),
    forgotPasswordSaga(),
    clientInfoSaga(),
    relaxationInfoSaga(),
    convertTokenSaga(),
    sendMsgNotificationModuleSaga(),
    logoutSaga(),
    mealUpdateSaga(),
    mealHistorySaga(),
    mealRemoveSaga(),
    favFoodListingSaga(),
    foodProfileSaga(),
    updateFoodProfileSaga(),
    deleteCustomFoodSaga(),
    favoriteMealUpdateSaga(),
    PreviousMealSaga(),
    progressDataSaga(),
    mailSaga(),
    getMealNamesSaga(),
    sendAutoResponseSaga(),
    addCommunityPostSaga(),
    getCommunityPostSaga(),
    getCommunityPostBySectionSaga(),
    getCommunityPostRepliesSaga(),
    addCommentCommunityPostSaga(),
    addLikeDislikeCommunityPostSaga(),
    getRepliedCommentsSaga(),
    compareProgressPhotosSaga(),
  ]);
}
