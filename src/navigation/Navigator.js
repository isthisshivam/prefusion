import React, {useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Splash from '../container/Splash/index';
import Login from '../container/Login/index';
import Signup from '../container/Signup/index';
import CommunityMessageBoard from '../container/CommunityMesageBoard';
import Goal from '../container/Goal/index';
import Calories from '../container/Calories/index';
import AddMeal from '../container/AddMeal/index';
import RecipieDetails from '../container/RecipieDetails/index';
import ChangePassword from '../container/ChangePassword/index';
import MyFavorites from '../container/MyFavorites/index';
import AddFavoriteMeal from '../container/AddFavoriteMeal/index';
import Chat from '../container/Chat/index';
import NationalWebview from '../container/NationalWebView';
import DailyDairy from '../container/DailyDairy';
import AddFoods from '../container/AddFoods/index';
import Welcome from '../container/Welcome/index';
import Home from '../container/Home/index';
import FavoriteFoods from '../container/FavoriteFoods';
import ServingsizeGuide from '../container/ServingsizeGuide/index';
import AddVeg from '../container/AddVeg/index';
import AddWater from '../container/AddWater/index';
import DailyBioFeedback from '../container/DailyBioFeedback/index';
import Setting from '../container/Setting/index';
import MyGoal from '../container/MyGoal/index';
import Profile from '../container/Profile/index';
import CustomFood from '../container/CustomFood/index';
import MealsList from '../container/MealsList/index';
import Help from '../container/Help/index';
import MealView from '../container/MealView/index';
import ProgressReport from '../container/ProgressReport/index';
import MacroEstimation from '../container/MacroEstimation/index';
import ReadFoodLabel from '../container/ReadFoodLabel/index';
import AddBloodWork from '../container/AddBloodWork/index';
import BrowseOurRecipies from '../container/BrowseOurRecipies/index';
import SubmitMealPhoto from '../container/SubmitMealPhoto/index';
import HandGuide from '../container/HandGuide/index';
import MonthGoal from '../container/MonthGoal/index';
import ApprovedFoods from '../container/ApprovedFoods/index';
import CustomFoods from '../container/CustomFoods';
import EditCustomFoodMacros from '../container/EditCustomFoodMacros';
import NewMeal from '../container/NewMeal';
import AdjustWeight from '../container/AdjustWeight/index';
import AdjustMacros from '../container/AdjustMacros/index';
import MealHistory from '../container/MealHistory';
import EditFavoriteFoods from '../container/EditFavoriteFood';
import HelpWebview from '../container/HelpWebView';
import Progress from '../container/Progress';
import ProgressPhotos from '../container/ProgressPhotos';
import CustomFoodMethod from '../container/CustomFoodMethod';
import BucketEntry from '../container/BucketEntry';
import MyMeal from '../container/MyMeal';
import CommunityPosts from '../container/CommunityPosts';
import ProgressComparison from '../container/ProgressComparsion';
import NewCommunityPost from '../container/NewCommunityPost';
import CommunityBoardSectionList from '../container/CommunityBoardSectionList';
import ReplyOnComment from '../container/ReplyOnComment';
import EditWeightGoals from '../container/EditWeightGoals';
const Stack = createStackNavigator();

const AppNavigator = () => {
  function Root() {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false, gestureEnabled: false}}
        initialRouteName={Splash}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddVeg" component={AddVeg} />
        <Stack.Screen name="AddWater" component={AddWater} />
        <Stack.Screen name="AddFoods" component={AddFoods} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Goal" component={Goal} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Calories" component={Calories} />
        <Stack.Screen name="AddMeal" component={AddMeal} />
        <Stack.Screen name="MyFavorites" component={MyFavorites} />
        <Stack.Screen name="AddFavoriteMeal" component={AddFavoriteMeal} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="ServingsizeGuide" component={ServingsizeGuide} />
        <Stack.Screen name="DailyBioFeedback" component={DailyBioFeedback} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AddBloodWork" component={AddBloodWork} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="MyGoal" component={MyGoal} />
        <Stack.Screen name="ProgressReport" component={ProgressReport} />
        <Stack.Screen name="RecipieDetails" component={RecipieDetails} />
        <Stack.Screen name="MonthGoal" component={MonthGoal} />
        <Stack.Screen name="DailyDairy" component={DailyDairy}></Stack.Screen>
        <Stack.Screen name="HandGuide" component={HandGuide} />
        <Stack.Screen name="BrowseOurRecipies" component={BrowseOurRecipies} />
        <Stack.Screen name="CustomFood" component={CustomFood} />
        <Stack.Screen name="MealView" component={MealView} />
        <Stack.Screen name="MealsList" component={MealsList} />
        <Stack.Screen name="MacroEstimation" component={MacroEstimation} />
        <Stack.Screen name="ReadFoodLabel" component={ReadFoodLabel} />
        <Stack.Screen name="SubmitMealPhoto" component={SubmitMealPhoto} />
        <Stack.Screen name="ApprovedFoods" component={ApprovedFoods} />
        <Stack.Screen name="MealHistory" component={MealHistory} />
        <Stack.Screen name="CommunityPosts" component={CommunityPosts} />
        <Stack.Screen
          name="CommunityMessageBoard"
          component={CommunityMessageBoard}
        />
        <Stack.Screen
          name="AdjustWeight"
          component={AdjustWeight}></Stack.Screen>
        <Stack.Screen
          name="AdjustMacros"
          component={AdjustMacros}></Stack.Screen>

        <Stack.Screen
          component={FavoriteFoods}
          name="FavoriteFoods"></Stack.Screen>
        <Stack.Screen component={CustomFoods} name="CustomFoods"></Stack.Screen>
        <Stack.Screen
          component={EditCustomFoodMacros}
          name="EditCustomFoodMacros"></Stack.Screen>
        <Stack.Screen
          component={EditFavoriteFoods}
          name="EditFavoriteFoods"></Stack.Screen>
        <Stack.Screen component={Help} name="Help"></Stack.Screen>
        <Stack.Screen name="HelpWebview" component={HelpWebview} />
        <Stack.Screen name="NationalWebview" component={NationalWebview} />
        <Stack.Screen name="Progress" component={Progress} />
        <Stack.Screen name="ProgressPhotos" component={ProgressPhotos} />
        <Stack.Screen name={'NewMeal'} component={NewMeal} />
        <Stack.Screen name="CustomFoodMethod" component={CustomFoodMethod} />
        <Stack.Screen name="BucketEntry" component={BucketEntry} />
        <Stack.Screen name="MyMeal" component={MyMeal} />
        <Stack.Screen
          name="ProgressComparison"
          component={ProgressComparison}
        />
        <Stack.Screen name="NewCommunityPost" component={NewCommunityPost} />
        <Stack.Screen
          name="CommunityBoardSectionList"
          component={CommunityBoardSectionList}
        />
        <Stack.Screen name="ReplyOnComment" component={ReplyOnComment} />
        <Stack.Screen name="EditWeightGoals" component={EditWeightGoals} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Root />
    </NavigationContainer>
  );
};

export default AppNavigator;
