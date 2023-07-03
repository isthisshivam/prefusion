//modify date 31May 2022
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
  BackHandler,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../component/loader';
import {LocaleConfig, Calendar, Arrow} from 'react-native-calendars';
import ApiConstant from '../../constants/api';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../MealView/style';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import DialogView from '../../component/dialog';
import {favMealUpdateRequest} from '../../redux/action/FavMealAction';
import SelectDropdown from 'react-native-select-dropdown';
import dummyContent from '../../constants/dummyContent';
import {addMealToFavRequest} from '../../redux/action/MealAction';
import {GradientCircularProgress} from 'react-native-circular-gradient-progress';
import moment, {weekdays} from 'moment';
import colorCodes from '../../constants/colorCodes';
import LinearGradient from 'react-native-linear-gradient';
import {
  customFoodInfoRequest,
  addCustomFoodRequest,
} from '../../redux/action/CustomFoodAction';
import {
  addMealRequest,
  mealUpdateRequest,
  mealRemoveRequest,
  getMealsNameRequest,
} from '../../redux/action/MealAction';
import {addFoodIdRequest, clearFoodId} from '../../redux/action/FoodIdAction';
import {
  addFoodToFavRequest,
  removeFoodToFavRequest,
} from '../../redux/action/AddFoodToFavAction';
import warning from '../../constants/warning';
import MealViewHeader from '../../component/MealViewHeader';
let quantityArray = [];
var foodIdArray = [];
var payload = null;
var mealIdTemporary = [];
var temp_food_id_ = null;
var temp_base_qty = null;
var today = new Date();
var date = moment(today).format('MM/DD/YYYY');
const DELETE_FOOD = 'DELETE_FOOD';
const GET_FOODS = 'GET_FOODS';
var CALLTYPE = 'EDITFOOD';
var call_type = null;
var spliceArray = null;
var clickedIndex = null;
var tempItem = null;
var selectedItemServingWeight = null;
var updatedCarbs = 0;
var updatedFat = 0;
var updatedProtein = 0;
var defaultServingWeight = 0;
var dateSelected = '';

const MealView = props => {
  const scrollRef = useRef();
  const mealtextInputRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mealNames, setMealNames] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const isLoading = useSelector(
    state => state.other.addCustomFoodReducer.showLoader,
  );
  const userData = useSelector(state => state.other.loginReducer.userData);
  const draftFoodsData =
    useSelector(state => state.food.addFoodIdReducer.data) || null;
  const [MEAL_ID, setMEAL_ID] = useState(null);
  const [nameEditable, setNameEditable] = useState(Global ? true : false);
  const [willInflate, setWillInflate] = useState(false);
  const [
    willInflateDeleteConfirmationModal,
    setwillInflateDeleteConfirmationModal,
  ] = useState(false);
  const [selectedFoodItemForDeletion, setSelectedFoodItemForDeletion] =
    useState(null);
  const [willInflateCustomMealNameModal, setWillInflateCustomMealNameModal] =
    useState(false);
  const [selectedFoodItem, setSelectedItemFood] = useState(null);
  const [willInflateEditFood, setWillInflateEditFood] = useState(false);
  const [willInflateCopyMeal, setWillInflateCopyMeal] = useState(false);
  const [willInflateOutofRangeModal, setwillInflateOutofRangeModal] =
    useState(false);
  const [mealNum, setMealNum] = useState(0);
  const [meal_ref_name, setMealRefName] = useState(
    global.mealName ? global.mealName : '',
  );
  const [mealName, setMealName] = useState('Choose meal name');
  const [mealId, setMealId] = useState('');
  const [alreadyFavorite, setAlreadyFav] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [mealMainArray, setMealMainArray] = useState([]);
  const [carbsArray, setcarbsArray] = useState([]);
  const [fatArray, setfatArray] = useState([]);
  const [proteinArray, setproteinArray] = useState([]);
  const [foodFatArray, setFoodFatArray] = useState([]);
  const [foodCarbsArray, setFoodCarbsArray] = useState([]);
  const [foodProteinArray, setFoodAProteinrray] = useState([]);
  const [foodId] = useState(props?.route?.params?.foodId);
  const [addMealFavInflate, setAddMealFavInflate] = useState(false);
  const [food_qty] = useState(props?.route?.params?.qty);
  const [userId, setUserId] = useState(userData ? userData.id : null);
  const [servingUnit, setServingUnit] = useState(null);
  const [foodPieceCount, setFoodPieceCount] = useState(0);
  const [selectedCalories, setSelectedCalories] = useState(0);
  const [customMealName, setCustomMealName] = useState('');
  const [myMealAddedInflate, setMyMealAddedInflate] = useState(false);
  const [dateValue, setDate] = useState(null);
  const [dateArray, setDateArray] = useState([]);
  const [copyMealDate, setCoyMealDate] = useState('');
  const [copyMealFormatedDate, setCopyMealFormatedDate] = useState('');
  if (draftFoodsData) {
    if (draftFoodsData.foodIdArrayData.length > 0) {
      let data = draftFoodsData.foodIdArrayData.toString();
      let qtyData = draftFoodsData.quantityArrayData.toString();
      let FI = props?.route?.params?.foodId;
      let QTY = props?.route?.params?.qty;
      if (global.backRoute == 'MealView') {
        payload = {
          uid: userId,
          food_id: FI.toString(),
          date: date,
          quantity: QTY.toString(),
        };
      } else {
        payload = {
          uid: userId,
          food_id: data + `,` + FI,
          date: date,
          quantity: qtyData + `,` + QTY,
        };
      }
    }
  } else {
    payload = {
      uid: userId,
      food_id: foodId,
      date: date,
      quantity: food_qty,
    };
  }

  /// console.log('updateAndAddMeal=>', props?.route.params.updateAndAddMeal);
  useEffect(() => {
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        dateSelected = date_;
        setDate(date_);
      } else {
        const dateee = await Utility.getInstance().getCurrentDateOnlyUser();
        dateSelected = dateee;
        setDate(dateee);
      }
    };
    const unsubscribe = navigation.addListener('focus', () => {
      dateSet();
    });
    return () => {
      unsubscribe();
      Utility.getInstance().isUpdatingFavoriteMeals(false);
    };
  }, [willInflateCopyMeal]);
  useEffect(() => {
    if (userId) {
      dispatch(
        getMealsNameRequest(
          {uid: userId},
          onGetMealsNameSuccess,
          onGetMealsNameFailure,
        ),
      );
    }
  }, []);

  const onGetMealsNameSuccess = async resolve => {
    if (resolve.data) {
      let custom = ['Custom'];
      // = ['Custom',resolve.data]
      setMealNames(custom.concat(resolve.data));
    }
    console.log('onGetMealsNameSuccess=>', resolve.data);
  };
  const onGetMealsNameFailure = async reject => {
    console.log('onGetMealsNameFailure=>', reject);
  };
  useEffect(() => {
    call_type = GET_FOODS;
    const unsubscribe = navigation.addListener('focus', () => {
      quantityArray = [];
      foodIdArray = [];
      getMealId();
    });
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      quantityArray = [];
      foodIdArray = [];
      // MEAL_ID = null;
      unsubscribe;
      backHandler;
      setMEAL_ID(null);
      mealIdTemporary = null;
    };
  }, []);

  const getSetSelectedDate = async () => {
    let currentTime = await Utility.getInstance().getCurrentDateUserTime();
    return dateSelected + ',' + currentTime;
  };
  const getMealId = async () => {
    await Utility.getInstance()
      .getStoreData('MEAL_ID')
      .then(id => {
        if (id) {
          setMEAL_ID(id);
          mealIdTemporary = id;
        }
        getMealDetails(payload);
      });
  };

  const getMealDetails = async api_payload => {
    let timezone =
      Platform.OS === 'android'
        ? ''
        : Intl.DateTimeFormat().resolvedOptions().timeZone;

    let payload = {
      ...api_payload,
      current_date:
        (await Utility.getInstance().getCurrentDateUser()) + ',' + timezone,
    };
    if (mealIdTemporary) {
      payload = {
        ...payload,
        meal_id: mealIdTemporary,
      };
    }
    console.log('getmealdetails.payloaddddd===>', payload);
    setTimeout(() => {
      dispatch(customFoodInfoRequest(payload, onS, onF));
    }, 100);
  };
  const onS = resolve => {
    const {meal, macro, favorite_meal, meal_number, date, fav_id} =
      resolve.data;
    // alert(resolve?.data?.mealName);
    console.log('resolve.data=>', resolve.data);
    setMealNum(meal_number);
    setMealMainArray(meal);
    fav_meal_id = fav_id;
    if (call_type == GET_FOODS) {
      meal.forEach(item => {
        quantityArray.push(item.quantity);
        foodIdArray.push(item.id);
      });
    }
    if (favorite_meal == 1) setAlreadyFav(true);
    else setAlreadyFav(false);
    if (resolve?.data?.mealName) {
      setMealName(resolve?.data?.mealName);
    } else setAlreadyFav(false);
    setcarbsArray(macro.carbs);
    setfatArray(macro.fat);
    setproteinArray(macro.protein);
    console.log('Datetime=>', date);
    setDateArray(date);
    setLoading(false);
  };
  const onF = reject => {
    //Utility.getInstance().inflateToast(reject);
  };
  useEffect(() => {
    if (dateArray.length > 0) {
      focusToCurrentDate();
    }
  }, [dateArray]);

  const focusToCurrentDate = () => {
    if (scrollRef != null && scrollRef != undefined) {
      if (scrollRef?.current) {
        if (global.weekdays.length > 0) {
          let index = 1;
          for (let i = 0; i < global.weekdays.length; i++) {
            if (dateValue == global.weekdays[i].date) {
              index = i;
            }
          }
          setTimeout(() => {
            if (index && index != 0 && index != -1)
              scrollRef?.current?.scrollToIndex({animated: true, index: index});
          }, 10);
        }
      }
    }
  };
  const scrollToIndexFailed = error => {
    const offset = error.averageItemLength * error.index;
    scrollRef?.current?.scrollToOffset({offset});
    setTimeout(
      () => scrollRef?.current?.scrollToIndex({index: error.index}),
      100,
    ); // You may choose to skip this line if the above typically works well because your average item height is accurate.
  };
  const addMealId = async () => {
    dispatch(
      addFoodIdRequest({
        foodIdArrayData: foodIdArray,
        quantityArrayData: quantityArray,
      }),
    );
    console.log('onAddPress.payloaddddd=>', {
      foodId: foodIdArray,
      qty: quantityArray,
    });
    setTimeout(() => {
      // navigation.navigate('AddFoods', {
      //   foodId: foodIdArray,
      //   qty: quantityArray,
      // });
      navigation.navigate('NewMeal', {
        foodId: foodIdArray,
        qty: quantityArray,
      });
    }, 100);
  };
  const addMealToFavCall = async () => {
    let calories = 0;
    if (mealName === 'Choose meal name' || mealName === 'Custom') {
      Utility.getInstance().inflateToast('Please select Meal Name');
      return;
    }
    for (i = 0; i < mealMainArray.length; i++) {
      calories += mealMainArray[i].calories;
      console.log('Total calories=>', calories);
    }
    setTotalCalories(calories);
    let payload = null;
    if (mealId) {
      payload = {
        uid: userId,
        meal_id: mealId,
        favorite: '1',
        food_id: foodIdArray.toString(),
        quantity: quantityArray.toString(),
        favorite_seperation: true,
        meal_name: mealName,
      };
    } else {
      payload = {
        uid: userId,
        status: '0',
        favorite_seperation: true,
        meal_name: mealName,
        food_id: foodIdArray.toString(),
        quantity: quantityArray.toString(),
        favorite: 1,
      };
    }
    console.log('addMealToFavCall.payload=>', payload);
    setIsLoadingFav(true);
    dispatch(addMealToFavRequest(payload, onAddmealSuc, onAddmealFailure));
  };
  const onAddmealSuc = resolve => {
    console.log('addMealToFavCall=>', resolve);
    setIsLoadingFav(false);
    setAlreadyFav(true);
    setMyMealAddedInflate(true);

    // setWillInflate(false);
    // setAddMealFavInflate(false);
    // setTimeout(() => {
    //   dispatch(clearFoodId());
    //   navigation.navigate('Home');
    //   clearFavMealGlobalVariableDetails();
    // }, 300);
  };
  const onAddmealFailure = reject => {
    //dispatch(clearFoodId());
    setIsLoadingFav(false);
    Utility.getInstance().inflateToast(reject);
    // setTimeout(() => {
    //   navigation.navigate('Home');
    //   clearFavMealGlobalVariableDetails();
    // }, 300);
  };
  const backPress = () => {
    Utility.getInstance().creatingAndUpdatingMeal(false);
    navigation.goBack();
  };

  const onDonePress = () => {
    if (MEAL_ID && !Utility.getInstance().isCreatingMealAndUpdatingMeal()) {
      if (Utility.getInstance().isFavoriteMeals()) {
        favMealUpdate();
      } else {
        mealUpdate();
      }
    } else if (
      MEAL_ID &&
      Utility.getInstance().isCreatingMealAndUpdatingMeal()
    ) {
      // mealUpdate();
      isGoalBucketExceeds();
    } else {
      isGoalBucketExceeds();
    }
  };
  const isGoalBucketExceeds = () => {
    const goalBucket = Utility.getInstance().getGoalBucketCounts();
    if (goalBucket) {
      const {
        fatTarget,
        proteinTarget,
        carbsTarget,
        fatConsumed,
        proteinConsumed,
        carbsConsumed,
      } = goalBucket;
      if (
        fatConsumed > fatTarget ||
        proteinConsumed > proteinTarget ||
        carbsConsumed > carbsTarget
      ) {
        setwillInflateOutofRangeModal(true);
      } else {
        createMeal();
      }
    }
  };
  const onDeleteMealPress = () => {
    let payload = {
      uid: userId,
      meal_id: MEAL_ID,
    };
    setLoading(true);
    dispatch(mealRemoveRequest(payload, onMealRemoveS, onMealFailure));
  };
  const onMealRemoveS = async resolve => {
    setLoading(false);
    navigation.navigate('DailyDairy');
    clearFavMealGlobalVariableDetails();
  };
  const onMealFailure = async reject => {
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };
  const manipulateServingOnMealCreateTime = () => {
    if (foodPieceCount == 0) {
      setLoading(false);
      Utility.getInstance().inflateToast('Please enter ammount');
      return;
    }
    call_type = DELETE_FOOD;
    setWillInflateEditFood(false);

    if (selectedFoodItem) {
      const {
        name,
        food_id,
        nf_calories,
        base_food_details,
        note,
        fiber,
        photo,
        quantity,
        calories,
        serving_weight_grams,
        measurement,
        customFood,
        image,
        id,
      } = selectedFoodItem;

      if (base_food_details != '') {
        let parsingbase_food_details = JSON.parse(base_food_details);
        payload = {
          ...selectedFoodItem,
          calories: parseFloat(selectedCalories),
          carbs: parseFloat(updatedCarbs),
          fat: parseFloat(updatedFat),
          protein: parseFloat(updatedProtein),
          base_food_details: JSON.stringify({
            base_calories: parsingbase_food_details.base_calories,
            base_carbs: parsingbase_food_details.base_carbs,
            base_fat: parsingbase_food_details.base_fat,
            base_protein: parsingbase_food_details.base_protein,
          }),
          measurement: measurement != '' ? JSON.stringify(measurement) : '',
          serving_weight_grams: serving_weight_grams,
          quantity: parseFloat(foodPieceCount),
          created_by: parseInt(userId),
          fiber: parseFloat(fiber),
          description: note,
          unit: servingUnit,
          food_id: food_id,
          name: name,
          image: image,
        };
      } else {
        payload = {
          ...selectedFoodItem,
          calories: parseFloat(selectedCalories),
          carbs: parseFloat(updatedCarbs),
          fat: parseFloat(updatedFat),
          protein: parseFloat(updatedProtein),
          base_food_details: '',
          measurement: '',
          serving_weight_grams: '',
          quantity: parseFloat(foodPieceCount),
          created_by: parseInt(userId),
          fiber: parseFloat(fiber),
          description: note,
          unit: servingUnit,
          food_id: food_id,
          name: name,
          image: image,
        };
      }

      console.log('manipulateServingOnMealCreateTime.payload===', payload);
      // return;
      if (customFood) {
        let updated_food_id = id;

        var index = foodIdArray.indexOf(temp_food_id_);
        if (index != -1) {
          foodIdArray[index] = parseInt(updated_food_id);
        }
        payload = {
          uid: userId,
          food_id: foodIdArray.toString(),
          quantity: quantityArray.toString(),
          date: date,
        };

        getMealDetails(payload);
      } else {
        dispatch(addCustomFoodRequest(payload, onSSSSS, onFFFFF));
      }
    }
  };
  const onSSSSS = async resolve => {
    let updated_food_id = resolve?.data?.id;

    var index = foodIdArray.indexOf(temp_food_id_);

    if (index != -1) {
      foodIdArray[index] = parseInt(updated_food_id);
    }
    payload = {
      uid: userId,
      food_id: foodIdArray.toString(),
      quantity: quantityArray.toString(),
      date: date,
    };

    getMealDetails(payload);
  };
  const onFFFFF = async reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const createMeal = async () => {
    if (mealName === 'Choose meal name' || mealName === 'Custom') {
      Utility.getInstance().inflateToast('Please select Meal Name');
      return;
    }
    console.log(`isGoalBucketExceeds111111111`);
    let payload = {
      uid: userId,
      food_id: foodIdArray.toString(),
      quantity: quantityArray.toString(),
      date: await getSetSelectedDate(),
      meal_name: mealName,
      endpoint: ApiConstant.MEAL_ADD,
    };
    console.log('doublinig isssues checker createMeal.payloaddddd==', payload);
    //return;
    setLoading(true);
    dispatch(addMealRequest(payload, onSS, onFF));
  };
  const favMealUpdate = () => {
    setLoading(true);
    let payload = {
      uid: userId,
      food_id: foodIdArray.toString(),
      quantity: quantityArray.toString(),
      meal_name: mealName,
      meal_id: MEAL_ID,
      fav_id: global.fav_id,
    };
    console.log('favMealUpdate.payloaddddd==', payload);
    dispatch(
      favMealUpdateRequest(payload, onFavMealUpdateSucc, onFavMealUpdateFail),
    );
  };
  const onFavMealUpdateSucc = async resolve => {
    Utility.getInstance().isUpdatingFavoriteMeals(false);
    setLoading(false);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };
  const onFavMealUpdateFail = async reject => {
    setLoading(false);
    setTimeout(() => {
      Utility.getInstance().inflateToast(reject);
    }, 300);
  };
  const clearFavMealGlobalVariableDetails = () => {
    Utility.getInstance().creatingAndUpdatingMeal(false);
    global.is_fav_meal = false;
    global.fav_id = null;
  };
  const mealUpdate = () => {
    setLoading(true);
    let payload = {
      uid: userId,
      food_id: foodIdArray.toString(),
      quantity: quantityArray.toString(),
      meal_name: mealName,
      meal_id: MEAL_ID,
    };
    console.log('doublinig isssues checker mealUpdate.payloaddddd==>', payload);
    dispatch(mealUpdateRequest(payload, onMealUpdateSuccess, onFF));
  };
  const saveSelectedDate = async date => {
    await Utility.getInstance().saveSelectedDate(date);
  };
  const onMealUpdateSuccess = async resolve => {
    const {id, favorite} = resolve.data;
    if (MEAL_ID && Utility.getInstance().isCreatingMealAndUpdatingMeal()) {
      createMeal();
    } else {
      Utility.getInstance().isUpdatingFavoriteMeals(false);
      setMealId(id);
      // if (favorite == '1') setAlreadyFav(true);
      // else if (favorite == '') setAlreadyFav(false);
      // else setAlreadyFav(false);
      setWillInflate(false);
      await Utility.getInstance().removeStoreData('MEAL_ID');

      //setAddMealFavInflate(true);
      // setTimeout(() => {
      //   setLoading(false);
      //   dispatch(clearFoodId());
      //   setWillInflate(false);
      //   navigation.navigate('Home');
      // }, 100);
      setLoading(false);
      setTimeout(() => {
        dispatch(clearFoodId());
        clearFavMealGlobalVariableDetails();
        navigation.navigate('Home');
      }, 500);
    }
  };
  const onSS = async resolve => {
    const {id, favorite} = resolve.data;
    Utility.getInstance().isUpdatingFavoriteMeals(false);
    setMealId(id);
    // if (favorite == '1') setAlreadyFav(true);
    // else if (favorite == '') setAlreadyFav(false);
    // else setAlreadyFav(false);
    setWillInflate(false);
    await Utility.getInstance().removeStoreData('MEAL_ID');

    //setAddMealFavInflate(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   dispatch(clearFoodId());
    //   setWillInflate(false);
    //   navigation.navigate('Home');
    // }, 100);
    setLoading(false);
    setTimeout(() => {
      dispatch(clearFoodId());
      clearFavMealGlobalVariableDetails();
      navigation.navigate('Home');
    }, 500);
  };
  const onFF = reject => {
    dispatch(clearFoodId());
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };
  const validateCopyAndCreateMealFirst = () => {
    var message = '';
    // if (Utility.getInstance().isEmpty(mealName)) {
    //   message = warning.enter_name;
    // } else if (
    //   mealName == 'Custom' &&
    //   Utility.getInstance().isEmpty(customMealName)
    // ) {
    //   message = warning.please_enter_meal_name;
    // } else if (Utility.getInstance().isEmpty(copyMealDate)) {
    //   message = warning.please_select_date;
    // }
    if (Utility.getInstance().isEmpty(copyMealDate)) {
      message = warning.please_select_date;
    }
    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const copyAndCreateMeal = async () => {
    let currentTime = await Utility.getInstance().getCurrentDateUserTime();

    if (validateCopyAndCreateMealFirst()) {
      setLoading(true);
      let payload = {
        uid: userId,
        food_id: foodIdArray.toString(),
        quantity: quantityArray.toString(),
        date: `${copyMealFormatedDate},${currentTime}`,
        //meal_name: mealName == 'Custom' ? customMealName : mealName,
        meal_name: mealName,
        endpoint: ApiConstant.MEAL_ADD,
      };
      console.log('copyAndCreateMeal.payload=>>', payload);

      dispatch(
        addMealRequest(payload, onSSCopyAndCreateMeal, onFFCopyAndCreateMeal),
      );
    }
  };
  const onSSCopyAndCreateMeal = async resolve => {
    const {id, favorite} = resolve.data;
    console.log('copyAndCreateMeal.reoslce=>>', resolve.data);
    setMealId(id);
    // if (favorite == '1') setAlreadyFav(true);
    // else if (favorite == '') setAlreadyFav(false);
    // else setAlreadyFav(false);
    setLoading(false);
    setWillInflateCopyMeal(false);
    setTimeout(() => {
      clearFavMealGlobalVariableDetails();
      dispatch(clearFoodId());
      navigation.navigate('Home');
    }, 1000);
  };
  const onFFCopyAndCreateMeal = reject => {
    dispatch(clearFoodId());
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };
  const onHeartPress = item => {
    const {favorite, id} = item.item;
    let index = item.index;
    if (mealMainArray[index].favorite == 0) {
      mealMainArray[index].favorite = 1;
      addFoodToFav(id);
    } else if (mealMainArray[index].favorite == 1) {
      mealMainArray[index].favorite = 0;
      removeFoodToFav(id);
    }
    setMealMainArray(mealMainArray);
    setUpdating(!isUpdating);
  };
  const addFoodToFav = async foodId => {
    let payload = {
      uid: userId,
      food_id: foodId,
      date: await Utility.getInstance().getCurrentDate(),
    };
    dispatch(addFoodToFavRequest(payload));
  };
  const removeFoodToFav = foodId => {
    let payload = {
      uid: userId,
      food_id: foodId,
    };
    dispatch(removeFoodToFavRequest(payload));
  };
  const onDeleteFoodPress = async item => {
    console.log('onDeleteFoodPress=>', item);
    setLoading(true);
    call_type = DELETE_FOOD;
    let index = selectedFoodItemForDeletion.index;
    console.log('item', JSON.stringify(selectedFoodItemForDeletion));
    const {favorite, id} = selectedFoodItemForDeletion.item;
    spliceArray = mealMainArray.filter((item, index) => {
      return item.id != id;
    });
    foodIdArray.splice(index, 1);
    quantityArray.splice(index, 1);
    let foodIdData = foodIdArray.toString();
    let qtyData = quantityArray.toString();
    let delete_payload = {
      uid: userId,
      food_id: foodIdData,
      date: await Utility.getInstance().getCurrentDate(),
      quantity: qtyData,
    };
    getMealDetails(delete_payload);
    if (MEAL_ID) {
      if (spliceArray) {
        setMealMainArray(spliceArray);
        if (spliceArray.length == 0) {
          mealUpdate();
          return;
        }
      }
    } else {
      if (spliceArray) {
        setMealMainArray(spliceArray);
        if (spliceArray.length == 0) {
          removerMealId();
          clearFavMealGlobalVariableDetails();
          setTimeout(() => {
            navigation.navigate('Home');
          }, 400);
          return;
        }
      }
    }
    // setTimeout(() => {
    //   getMealDetails(delete_payload);
    // }, 2000);
  };
  const discardAlert = () =>
    Alert.alert(
      'Discard entire Meal',
      'If you go back now, you will loose Meal that have been added.',
      [
        {
          text: 'Cancel',
          onPress: () => onCancelPress(),
          style: 'cancel',
        },
        {text: 'Discard Meal', onPress: () => onDiscardMealPress()},
      ],
    );
  const onCancelPress = () => {};
  const onDiscardMealPress = () => {
    Utility.getInstance().creatingAndUpdatingMeal(false);
    dispatch(clearFoodId());
    setTimeout(() => {
      global.backRoute = 'AddMeal';
      backPress();
    }, 100);
  };
  const onTouchOutsideEditFood = async () => {
    await setFoodAProteinrray([]);
    await setFoodFatArray([]);
    await setFoodCarbsArray([]);
    setWillInflateEditFood(false);
  };
  const onTouchOutsideCopyMeal = async () => {
    setWillInflateCopyMeal(!willInflateCopyMeal);
  };
  useEffect(() => {
    if (selectedFoodItem) {
      onEditButtonClick(tempItem);
    }
  }, [selectedFoodItem]);
  const onSetSelectedItemPress = item => {
    const {measurement, quantity} = item;
    if (measurement != '') {
      let parsedItem = {
        ...item,
        measurement: JSON.parse(measurement),
      };
      setSelectedItemFood(parsedItem);
    } else {
      let parsedItem = {
        ...item,
        quantity: quantity,
      };
      setSelectedItemFood(parsedItem);
    }
  };
  const onEditButtonClick = async item => {
    const {
      quantity,
      serving_qty,
      measurement,
      serving_weight_grams,
      unit,
      calories,
      id,
      base_qty,
    } = item;
    console.log('onEditButtonClick=>', item);
    temp_base_qty = base_qty;
    temp = serving_qty ? serving_qty : 1;
    defaultServingWeight = serving_weight_grams;
    if (serving_weight_grams != '' && serving_weight_grams != null) {
      if (measurement != '') {
        checkAndGetDefaultServingWeight(
          JSON.parse(measurement),
          serving_qty,
          unit,
        );
      } else {
        defaultServingWeight = 0;
        updateServingsThroughPeiceQtyBasis(quantity);
      }
    } else {
      updateServingsThroughPeiceQtyBasis(quantity);
    }
    setSelectedCalories(parseFloat(calories));
    setFoodPieceCount(quantity);
    setServingUnit(unit);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setWillInflateEditFood(true);
    }, 500);
  };
  const checkAndGetDefaultServingWeight = (measurementData, quantity, unit) => {
    let food;
    food = measurementData.find(food => food.measure === unit);
    console.log('checkAndGetDefaultServingWeight.food=>', food);
    if (food) {
      selectedItemServingWeight = {
        serving_weight: food?.serving_weight,
        measure: unit,
      };
    } else {
      food = measurementData.find(data => data.measure.match(unit));
      selectedItemServingWeight = {
        serving_weight: food?.serving_weight,
        measure: unit,
      };
    }
    updateServingsThroughMeasurment(selectedItemServingWeight, quantity);
  };
  const updateServingsThroughPeiceQtyBasis = async updatedQty => {
    var newQ;
    if (defaultServingWeight != 0) {
      newQ = updatedQty;
    } else {
      newQ = updatedQty / temp_base_qty;
    }

    const {carbs_value, fat_value, protein_value, calories, base_food_details} =
      selectedFoodItem;

    let parsingbase_food_details = JSON.parse(base_food_details);

    // await setFoodAProteinrray(
    //   returnBucketArray(
    //     Math.round(parsingbase_food_details.base_protein) * newQ,
    //     20,
    //     true,
    //   ),
    // );

    // await setFoodFatArray(
    //   returnBucketArray(
    //     Math.round(parsingbase_food_details.base_fat) * newQ,
    //     10,
    //   ),
    // );

    await setFoodCarbsArray(
      returnBucketArray(
        Math.round(parsingbase_food_details.base_carbs) * newQ,
        20,
        true,
      ),
    );

    setSelectedCalories(
      parseFloat(newQ * Math.round(parsingbase_food_details?.base_calories)),
    );

    updatedCarbs = Math.round(parsingbase_food_details.base_carbs) * newQ;
    updatedFat = Math.round(parsingbase_food_details.base_fat) * newQ;
    updatedProtein = Math.round(parsingbase_food_details.base_protein) * newQ;
  };
  const returnBucketArray = (totalvalue, type, isProtein = false) => {
    let value = Math.round(totalvalue);

    let bucketArray = [];
    for (let i = value; i > 0; i -= type) {
      if (isProtein && i < 16) {
        if (i == 1 || i == 2) {
          break;
        }
        if (i < 7) {
          bucketArray.push(25);
          break;
        }
        if (i < 12) {
          bucketArray.push(50);
          break;
        }
        if (i < 16) {
          bucketArray.push(75);
          break;
        }
      } else if (i < (type == 20 ? 16 : 9)) {
        if (i < (type == 20 ? 6 : 4)) {
          bucketArray.push(25);
          break;
        }
        if (i < (type == 20 ? 11 : 6)) {
          bucketArray.push(50);
          break;
        }
        if (i < (type == 20 ? 16 : 9)) {
          bucketArray.push(75);
          break;
        }
      }
      bucketArray.push(100);
    }

    return bucketArray;
  };
  const updateQty = qty => {
    quantityArray[clickedIndex] = qty;
  };
  const updateServingsThroughMeasurment = (selected_Item, foo_piece_Count) => {
    const {
      carbs_value,
      fat_value,
      protein_value,
      calories,
      base_food_details,
      base_qty,
      quantity,
      serving_qty,
      serving_weight_grams,
    } = selectedFoodItem;
    let parsingbase_food_details = JSON.parse(base_food_details);

    const value =
      selected_Item?.measure == 'g'
        ? (1 * foo_piece_Count) / defaultServingWeight
        : parseFloat(selected_Item?.serving_weight / serving_weight_grams) *
          (serving_qty / base_qty);
    console.log(
      'updateServingsThroughMeasurment.value=>',
      parsingbase_food_details,
    );
    // setFoodAProteinrray(
    //   returnBucketArray(
    //     Math.round(parsingbase_food_details.base_protein) * value,
    //     20,
    //     true,
    //   ),
    // );
    // setFoodFatArray(
    //   returnBucketArray(
    //     Math.round(parsingbase_food_details.base_fat) * value,
    //     10,
    //   ),
    // );
    // setFoodCarbsArray(
    //   returnBucketArray(
    //     Math.round(parsingbase_food_details.base_carbs) * value,
    //     20,
    //     true,
    //   ),
    // );
    setFoodAProteinrray(
      returnBucketArray(
        parsingbase_food_details.base_protein * value,
        20,
        true,
      ),
    );
    setFoodFatArray(
      returnBucketArray(parsingbase_food_details.base_fat * value, 10),
    );
    setFoodCarbsArray(
      returnBucketArray(parsingbase_food_details.base_carbs * value, 20, true),
    );
    setServingUnit(selected_Item?.measure);
    // updatedCarbs = Math.round(parsingbase_food_details.base_carbs) * value;
    // updatedFat = Math.round(parsingbase_food_details.base_fat) * value;
    // updatedProtein = Math.round(parsingbase_food_details.base_protein) * value;

    updatedCarbs = parsingbase_food_details.base_carbs * value;
    updatedFat = parsingbase_food_details.base_fat * value;
    updatedProtein = parsingbase_food_details.base_protein * value;

    setSelectedCalories(
      parseFloat(parsingbase_food_details?.base_calories * value),
    );
  };
  const EditFoodModal = () => {
    return (
      <DialogView
        onTouchOutside={() => console.log('onTouchOutside')}
        willInflate={willInflateEditFood}
        onBackPress={() => setWillInflateEditFood(false)}
        children={EditModalContent()}></DialogView>
    );
  };
  const EditModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => onTouchOutsideEditFood()}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 20,
            }}>
            {CALLTYPE == 'EDITFOOD' ? `Edit Item` : `Remove Item`}
          </Text>
          <View
            style={{
              height: 20,
              width: 20,
              marginHorizontal: 20,
            }}></View>
        </View>
        <View
          style={{
            marginTop: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.abs}>{strings.edit_desc}</Text>
          <View
            style={[
              styles.addfoodcn,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
              },
            ]}>
            <View style={{flex: 0.66}}>
              <Text style={[styles.why_heading, globalStyles.font20]}>
                {selectedFoodItem?.name}
              </Text>
              {CALLTYPE === 'EDITFOOD' && (
                // <SelectDropdown
                //   data={dummyContent.piece}
                //   onSelect={(selectedItem, index) => {
                //     console.log('selectedItemshivamsaini', selectedItem);
                //     setFoodPieceCount(selectedItem);
                //     updateQty(selectedItem);
                //     selectedFoodItem.serving_qty = selectedItem;
                //     if (selectedFoodItem?.measurement != '') {
                //       updateServingsThroughMeasurment(
                //         selectedItemServingWeight,
                //         selectedItem,
                //       );
                //     } else {
                //       updateServingsThroughPeiceQtyBasis(selectedItem);
                //     }
                //   }}
                //   defaultButtonText={foodPieceCount}
                //   //defaultButtonText={foodPieceCount + servingUnit}
                //   buttonTextAfterSelection={(selectedItem, index) => {
                //     return selectedItem;
                //   }}
                //   rowTextForSelection={(item, index) => {
                //     return item;
                //   }}
                //   renderDropdownIcon={() => {
                //     return (
                //       <Image
                //         style={{
                //           height: 18,
                //           width: 18,
                //           resizeMode: 'contain',
                //           //   transform: [{rotate: '270deg'}],
                //         }}
                //         source={images.SIGNUP.DOWN_ARROW}
                //       />
                //     );
                //   }}
                //   buttonStyle={styles.dropdownSmall4BtnStyle}
                //   buttonTextStyle={styles.dropdown4BtnTxtStyle}
                //   dropdownIconPosition={'right'}
                //   dropdownStyle={styles.dropdown4DropdownStyle}
                //   rowStyle={styles.dropdown4RowStyle}
                //   rowTextStyle={styles.dropdown4RowTxtStyle}
                // />
                <TextInput
                  //key={foodPieceCount}
                  value={foodPieceCount}
                  placeholder={foodPieceCount.toString()}
                  placeholderTextColor={colors.black}
                  onChangeText={selectedItem => {
                    console.log('selectedItemshivamsaini', selectedItem);
                    setFoodPieceCount(selectedItem);
                    updateQty(selectedItem);
                    selectedFoodItem.serving_qty = selectedItem;
                    if (selectedFoodItem?.measurement != '') {
                      updateServingsThroughMeasurment(
                        selectedItemServingWeight,
                        selectedItem,
                      );
                    } else {
                      updateServingsThroughPeiceQtyBasis(selectedItem);
                    }
                  }}
                  style={styles.dropdownInput}></TextInput>
              )}
            </View>
            {/* <View style={{flex: 0.42, alignItems: 'flex-end'}}>
              <View style={styles.progressbar}>
                <GradientCircularProgress
                  startColor={colors.primary}
                  middleColor={colors.secondary}
                  endColor={colors.primary}
                  size={47}
                  emptyColor={colors.black}
                  progress={70}
                  style={{backgroundColor: 'black'}}
                  strokeWidth={6}>
                  <Text style={styles.lbs}>{parseInt(selectedCalories)}</Text>
                </GradientCircularProgress>
                <Text
                  style={[
                    //styles.bucketSize,
                    globalStyles.mt_10,
                    // styles.headingtextBlack,
                    {fontSize: Utility.getInstance().dH(10)},
                  ]}>
                  {strings.calories}
                </Text>
              </View>
            </View> */}
          </View>

          {selectedFoodItem?.measurement != '' && CALLTYPE === 'EDITFOOD' ? (
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                },
              ]}>
              <View style={{flex: 0.66}}>
                <SelectDropdown
                  data={
                    selectedFoodItem?.measurement != ''
                      ? selectedFoodItem?.measurement
                      : []
                  }
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                    setServingUnit(selectedItem.measure);

                    selectedFoodItem.base_qty = selectedItem?.qty;
                    selectedItemServingWeight = {
                      serving_weight: selectedItem?.serving_weight,
                      measure: selectedItem.measure,
                    };
                    console.log(
                      'updateServingsThroughMeasurment.selectedItemtotalweight==',
                      selectedItem?.serving_weight,
                    );
                    updateServingsThroughMeasurment(
                      selectedItemServingWeight,
                      foodPieceCount,
                    );
                  }}
                  defaultButtonText={servingUnit}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.measure;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item?.measure;
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        style={{
                          height: 18,
                          width: 18,
                          resizeMode: 'contain',
                        }}
                        source={images.SIGNUP.DOWN_ARROW}
                      />
                    );
                  }}
                  buttonStyle={styles.dropdownSmall4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
              </View>
            </View>
          ) : (
            <TextInput
              editable={false}
              //key={foodPieceCount}
              //value={servingUnit}
              placeholder={servingUnit}
              placeholderTextColor={colors.black}
              style={[
                styles.dropdownInput,
                {width: '66%', alignSelf: 'flex-start'},
              ]}></TextInput>
          )}

          <View style={styles.favmealsCC}>
            <View style={styles.mealc}>
              <View style={{flex: 1, marginRight: 10}}>
                <View style={[globalStyles.flex_row, {marginRight: 10}]}>
                  <ImageBackground
                    source={{uri: selectedFoodItem?.image}}
                    borderRadius={10}
                    style={styles.mealimg_s}></ImageBackground>
                  <View
                    style={{
                      marginLeft: 20,
                      backgroundColor: 'transparent',
                      marginVertical: 15,
                    }}>
                    <View style={styles.progressbar}>
                      <GradientCircularProgress
                        startColor={colors.primary}
                        middleColor={colors.secondary}
                        endColor={colors.primary}
                        size={55}
                        emptyColor={colors.black}
                        progress={70}
                        style={{backgroundColor: 'black'}}
                        strokeWidth={6}>
                        <Text style={styles.lbs}>
                          {parseInt(selectedCalories)}
                        </Text>
                      </GradientCircularProgress>
                      <Text
                        style={[
                          //styles.bucketSize,
                          //  globalStyles.mt_10,
                          // styles.headingtextBlack,
                          {
                            fontSize: Utility.getInstance().dH(10),
                            opacity: 0.7,
                          },
                        ]}>
                        {strings.calories}
                      </Text>
                    </View>
                    {foodCarbsArray.length > 0 && (
                      <View style={[styles.mealinnerc, {marginTop: 10}]}>
                        <View style={{flex: 0.4}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.red,
                              styles.font_13,
                            ]}>
                            {`Carbs:`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.6,
                            height: 50,
                            marginRight: 10,
                          }}>
                          <FlatList
                            data={foodCarbsArray}
                            horizontal
                            extraData={foodCarbsArray}
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) =>
                              rendeCarbsItem(item)
                            }></FlatList>
                        </View>
                      </View>
                    )}
                    {foodFatArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View style={{flex: 0.4}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.orange,
                              styles.font_13,
                            ]}>
                            {`Fats:`}
                          </Text>
                        </View>
                        <View style={{flex: 0.6, height: 50, marginRight: 10}}>
                          <FlatList
                            data={foodFatArray}
                            horizontal
                            extraData={foodFatArray}
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) =>
                              rendeFatItem(item)
                            }></FlatList>
                        </View>
                      </View>
                    )}
                    {foodProteinArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View
                          style={{
                            flex: 0.4,
                          }}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.green,
                              styles.font_13,
                            ]}>
                            {`Protein:`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.6,
                            height: 50,
                            marginRight: 10,
                          }}>
                          <FlatList
                            data={foodProteinArray}
                            horizontal
                            extraData={foodProteinArray}
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) =>
                              rendeProteinItem(item)
                            }></FlatList>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {CALLTYPE === 'EDITFOOD' ? (
            <>
              <TouchableOpacity
                onPress={() => manipulateServingOnMealCreateTime()}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_30,
                ]}>
                <Text style={globalStyles.btn_heading_black}>SAVE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onTouchOutsideEditFood()}
                style={[
                  globalStyles.button_secondarywithoutBlackBack,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_10,
                ]}>
                <Text style={globalStyles.btn_heading_black}>CANCEL</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => onDeleteFoodPress()}
              style={[
                globalStyles.button_secondary,
                globalStyles.center,
                globalStyles.button,
                globalStyles.mt_30,
              ]}>
              <Text style={globalStyles.btn_heading_black}>YES, REMOVE</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  const DeleteConfirmationModal = () => {
    return (
      <DialogView
        onTouchOutside={() => console.log('onTouchOutside')}
        willInflate={willInflateDeleteConfirmationModal}
        onBackPress={() => setwillInflateDeleteConfirmationModal(false)}
        children={DeleteConfirmationModalContent()}></DialogView>
    );
  };
  const DeleteConfirmationModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => setwillInflateDeleteConfirmationModal(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 20,
            }}>
            Remove Item
          </Text>
          <View
            style={{
              height: 20,
              width: 20,
              marginHorizontal: 20,
            }}></View>
        </View>
        <View
          style={{
            marginTop: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.abs}>{strings.edit_desc}</Text>
          <View
            style={[
              styles.addfoodcn,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
              },
            ]}>
            <View style={{flex: 0.66}}>
              <Text style={[styles.why_heading, globalStyles.font20]}>
                {selectedFoodItemForDeletion &&
                  selectedFoodItemForDeletion?.item?.name}
              </Text>
            </View>
          </View>

          <View style={styles.favmealsCC}>
            <View style={styles.mealc}>
              <View style={{flex: 1, marginRight: 10}}>
                <View style={[globalStyles.flex_row, {marginRight: 10}]}>
                  <ImageBackground
                    // {selectedFoodItemForDeletion &&
                    //   selectedFoodItemForDeletion?.item?.name}
                    source={{uri: selectedFoodItemForDeletion?.item?.image}}
                    borderRadius={10}
                    style={styles.mealimg_s}></ImageBackground>
                  <View
                    style={{
                      marginLeft: 20,
                      backgroundColor: 'transparent',
                      marginVertical: 15,
                    }}>
                    <View style={styles.progressbar}>
                      <GradientCircularProgress
                        startColor={colors.primary}
                        middleColor={colors.secondary}
                        endColor={colors.primary}
                        size={55}
                        emptyColor={colors.black}
                        progress={70}
                        style={{backgroundColor: 'black'}}
                        strokeWidth={6}>
                        <Text style={styles.lbs}>
                          {parseInt(selectedCalories)}
                        </Text>
                      </GradientCircularProgress>
                      <Text
                        style={[
                          //styles.bucketSize,
                          //  globalStyles.mt_10,
                          // styles.headingtextBlack,
                          {
                            fontSize: Utility.getInstance().dH(10),
                            opacity: 0.7,
                          },
                        ]}>
                        {strings.calories}
                      </Text>
                    </View>
                    {selectedFoodItemForDeletion?.item?.carbs.length > 0 && (
                      <View style={[styles.mealinnerc, {marginTop: 10}]}>
                        <View style={{flex: 0.4}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.red,
                              styles.font_13,
                            ]}>
                            {`Carbs:`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.6,
                            height: 50,
                            marginRight: 10,
                          }}>
                          <FlatList
                            data={selectedFoodItemForDeletion?.item?.carbs}
                            horizontal
                            extraData={selectedFoodItemForDeletion?.item?.carbs}
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) =>
                              rendeCarbsItem(item)
                            }></FlatList>
                        </View>
                      </View>
                    )}
                    {selectedFoodItemForDeletion?.item?.fat.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View style={{flex: 0.4}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.orange,
                              styles.font_13,
                            ]}>
                            {`Fats:`}
                          </Text>
                        </View>
                        <View style={{flex: 0.6, height: 50, marginRight: 10}}>
                          <FlatList
                            data={selectedFoodItemForDeletion?.item?.fat}
                            horizontal
                            extraData={selectedFoodItemForDeletion?.item?.fat}
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) =>
                              rendeFatItem(item)
                            }></FlatList>
                        </View>
                      </View>
                    )}
                    {selectedFoodItemForDeletion?.item?.protein.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View
                          style={{
                            flex: 0.4,
                          }}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.green,
                              styles.font_13,
                            ]}>
                            {`Protein:`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.6,
                            height: 50,
                            marginRight: 10,
                          }}>
                          <FlatList
                            data={selectedFoodItemForDeletion?.item?.protein}
                            horizontal
                            extraData={
                              selectedFoodItemForDeletion?.item?.protein
                            }
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) =>
                              rendeProteinItem(item)
                            }></FlatList>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => [
              setwillInflateDeleteConfirmationModal(false),
              onDeleteFoodPress(),
            ]}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>YES, REMOVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CustomMealNameModal = () => {
    return (
      <DialogView
        onTouchOutside={() => setWillInflateCustomMealNameModal(false)}
        willInflate={willInflateCustomMealNameModal}
        onBackPress={() => setWillInflateCustomMealNameModal(false)}
        children={CustomMealNameModalContent()}></DialogView>
    );
  };
  const CustomMealNameModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 45,
            // marginTop: 20,
            borderWidth: 1,
            borderColor: colors.gray,
            borderRadius: 5,
            paddingHorizontal: 10,
            fontFamily: 'Poppins-Regular',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextInput
            value={customMealName}
            onChangeText={text => [setCustomMealName(text), setMealName(text)]}
            style={{
              height: 45,
              paddingHorizontal: 7,
              fontFamily: 'Poppins-Regular',
              width: '85%',
            }}
            placeholder="Enter Meal Name"></TextInput>
          {customMealName.length > 0 ? (
            <Pressable
              onPress={() => setWillInflateCustomMealNameModal(false)}
              style={{
                height: 45,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 24, width: 24, resizeMode: 'contain'}}
                source={images.APP.SELECTED}></Image>
            </Pressable>
          ) : (
            <View
              style={{
                height: 45,
                width: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}></View>
          )}
        </View>
        {/* <View
          style={{
            marginTop: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            //  onPress={() => manipulateServingOnMealCreateTime()}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>DONE</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };
  const CopyMealModal = () => {
    return (
      <DialogView
        onTouchOutside={() => console.log('onTouchOutside.CopyMealModal')}
        willInflate={willInflateCopyMeal}
        onBackPress={() => setWillInflateCopyMeal(false)}
        dialog_Container={globalStyles.dialog_Container_a_bit_large}
        children={CopyMealContent()}></DialogView>
    );
  };
  const CopyMealContent = () => {
    return (
      <View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            backgroundColor: 'transparent',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => onTouchOutsideCopyMeal()}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 17,
            }}>
            Meal Copied
          </Text>

          <View style={globalStyles.backimgregister}></View>
        </View>
        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontFamily: 'Poppins-Medium',
            color: colors.black,
            opacity: 0.6,
            fontSize: 13,
            margin: 10,
          }}>
          Select a day to copy this meal to.
        </Text>
        <Calendar
          markedDates={{
            [copyMealDate]: {
              selected: true,
            },
          }}
          onDayPress={day => {
            [
              console.log(
                'onDayPress->',
                moment(day?.timestamp).utc().format('MM/DD/YYYY'),
              ),
              setCoyMealDate(day.dateString),
              setCopyMealFormatedDate(
                moment(day?.timestamp).utc().format('MM/DD/YYYY'),
              ),
            ];
          }}
          style={{
            borderWidth: 1,
            borderColor: colors.gray,
            // height: 350,
            backgroundColor: colors.gray,
            borderRadius: 3,
            //padding: 20,
            alignSelf: 'center',
            width: '100%',
          }}
          current={new Date().toISOString()}
          // timelineLeftInset={4}
          hideExtraDays
          disableMonthChange={true}
          headerStyle={{height: 90}}
          theme={{
            backgroundColor: colors.gray,
            calendarBackground: colors.gray,
            textSectionTitleColor: colors.black,
            textSectionTitleDisabledColor: colors.black,
            selectedDayBackgroundColor: colors.secondary,
            selectedDayTextColor: colors.black,
            todayTextColor: colors.black,
            dayTextColor: colors.black,
            textDisabledColor: colors.black,
            dotColor: '#00adf5',
            selectedDotColor: colors.black,
            arrowColor: colors.black,
            disabledArrowColor: '#d9e1e8',
            textDayStyle: {
              fontFamily: 'Poppins-Medium',
            },
            monthTextColor: colors.black,
            textDayFontFamily: 'Poppins-Medium',
            textMonthFontFamily: 'Poppins-Medium',
            textDayHeaderFontFamily: 'Poppins-Medium',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayHeaderFontFamily: 'Poppins-Medium',
            textDayFontSize: 13,
            textMonthFontFamily: 'Poppins-Medium',
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13,
          }}
        />
        {copyMealDate.length > 0 && (
          <TouchableOpacity
            onPress={() => [setWillInflate(false), copyAndCreateMeal()]}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.mt_30,
              {alignSelf: 'center'},
            ]}>
            <Text style={globalStyles.btn_heading_black}>{'COPY'}</Text>
          </TouchableOpacity>
        )}
      </View>
      // <View>
      //   <View
      //     style={{
      //       height: 40,
      //       flexDirection: 'row',
      //       width: '100%',
      //       alignItems: 'center',
      //       backgroundColor: 'transparent',
      //       justifyContent: 'space-between',
      //     }}>
      //     <TouchableOpacity onPress={() => onTouchOutsideCopyMeal()}>
      //       <Image
      //         style={globalStyles.backimgregister}
      //         source={images.FAVORITE.ARROW}></Image>
      //     </TouchableOpacity>
      //     <Text
      //       style={{
      //         alignSelf: 'center',
      //         textAlign: 'center',
      //         fontFamily: 'Poppins-SemiBold',
      //         color: colors.black,
      //         fontSize: 16,
      //       }}>
      //       Copy to Current Day
      //     </Text>
      //     <View style={globalStyles.backimgregister}></View>
      //   </View>

      //   <View
      //     style={{
      //       marginTop: 7,
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //     }}>
      //     {CopyMealView()}

      //     <View style={[globalStyles.mt_30, globalStyles.width_100_percent]}>
      //       <Text style={[globalStyles.input_heading, {color: colors.black}]}>
      //         {strings.nameMeal}
      //       </Text>

      //       <SelectDropdown
      //         data={dummyContent.food}
      //         onSelect={(selectedItem, index) => {
      //           console.log('selectedItem.mealname==', selectedItem);
      //           setMealName(selectedItem);
      //         }}
      //         defaultButtonText={mealName}
      //         buttonTextAfterSelection={(selectedItem, index) => {
      //           return selectedItem;
      //         }}
      //         rowTextForSelection={(item, index) => {
      //           return item;
      //         }}
      //         renderDropdownIcon={() => {
      //           return (
      //             <Image
      //               style={{
      //                 height: 12,
      //                 width: 12,
      //                 resizeMode: 'contain',
      //                 //   transform: [{rotate: '270deg'}],
      //               }}
      //               source={images.SIGNUP.DOWN_ARROW}
      //             />
      //           );
      //         }}
      //         buttonStyle={styles.dropdownFull4BtnStyle}
      //         buttonTextStyle={styles.dropdown4BtnTxtStyle}
      //         dropdownIconPosition={'right'}
      //         dropdownStyle={styles.dropdown4DropdownStyle}
      //         rowStyle={styles.dropdown4RowStyle}
      //         rowTextStyle={styles.dropdown4RowTxtStyle}
      //       />
      //       {mealName == 'Custom' && (
      //         <TextInput
      //           value={customMealName}
      //           onChangeText={text => setCustomMealName(text)}
      //           style={styles.input}
      //         />
      //       )}
      //     </View>
      //     <View style={[globalStyles.width_100_percent, {marginTop: 10}]}>
      //       <Text style={[globalStyles.input_heading, {color: colors.black}]}>
      //         {strings.setDate}
      //       </Text>

      //       <SelectDropdown
      //         data={dateArray}
      //         onSelect={(selectedItem, index) => {
      //           console.log('selectedItem.mealname==', selectedItem);
      //           setCoyMealDate(selectedItem);
      //         }}
      //         //defaultButtonText={copyMealDate}
      //         buttonTextAfterSelection={(selectedItem, index) => {
      //           return selectedItem.show_date;
      //         }}
      //         rowTextForSelection={(item, index) => {
      //           return item.show_date;
      //         }}
      //         renderDropdownIcon={() => {
      //           return (
      //             <Image
      //               style={{
      //                 height: 12,
      //                 width: 12,
      //                 resizeMode: 'contain',
      //                 //   transform: [{rotate: '270deg'}],
      //               }}
      //               source={images.SIGNUP.DOWN_ARROW}
      //             />
      //           );
      //         }}
      //         buttonStyle={styles.dropdownFull4BtnStyle}
      //         buttonTextStyle={styles.dropdown4BtnTxtStyle}
      //         dropdownIconPosition={'right'}
      //         dropdownStyle={styles.dropdown4DropdownStyle}
      //         rowStyle={styles.dropdown4RowStyle}
      //         rowTextStyle={styles.dropdown4RowTxtStyle}
      //       />
      //     </View>
      //     <TouchableOpacity
      //       onPress={() => copyAndCreateMeal()}
      //       style={[
      //         globalStyles.button_secondary,
      //         globalStyles.center,
      //         globalStyles.button,
      //         globalStyles.mt_30,
      //       ]}>
      //       <Text style={globalStyles.btn_heading_black}>ADD</Text>
      //     </TouchableOpacity>

      //     <TouchableOpacity
      //       onPress={() => onTouchOutsideCopyMeal()}
      //       style={[
      //         globalStyles.button_secondarywithoutBlackBack,
      //         globalStyles.center,
      //         globalStyles.button,
      //         globalStyles.mt_30,
      //       ]}>
      //       <Text style={globalStyles.btn_heading_black}>CANCEL</Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
    );
  };
  const HeaderInfo = () => {
    return (
      <View
        style={[
          globalStyles.center,
          globalStyles.padding_30_hor,
          globalStyles.flex_row,
          //globalStyles.justifyContent_space_between,
          {marginTop: 30, justifyContent: 'space-around'},
        ]}>
        {/* {MEAL_ID ? (
          <Text
            style={[
              styles.why_heading,
              globalStyles.font25,
              globalStyles.mt_30,
            ]}>
            {Global}
          </Text>
        ) : (
          <View>
            <Text style={[styles.why_heading, styles.font30]}>
              {`Meal ` + mealNum}
            </Text>
            <Text
              style={[
                globalStyles.textAlignStart,
                styles.white,
                globalStyles.font17,
              ]}>
              {Global}
            </Text>
          </View>
        )} */}
        {/* {MEAL_ID ? (
          <View
            style={{
              height: 60,
              width: '70%',
              flexDirection: 'row',
              // backgroundColor: 'red',
              alignItems: 'center',
            }}>
            <TextInput
              ref={mealtextInputRef}
              onChangeText={setMealRefName}
              placeholder="Meal Name"
              placeholderTextColor={colorCodes.white}
              style={[
                {
                  height: 55,
                  width: 140,
                  backgroundColor: colorCodes.primary,
                },
                styles.why_heading,
                globalStyles.font25,
              ]}
              value={meal_ref_name}></TextInput>
            {nameEditable && (
              <Pressable
                onPress={() => [
                  setNameEditable(false),
                  mealtextInputRef.current.focus(),
                ]}>
                <Image
                  style={styles.heart}
                  source={images.SPLASH.GREENPENCIL}></Image>
              </Pressable>
            )}
          </View>
        ) : (
          <Text
            style={[
              styles.why_heading,
              globalStyles.font25,
              globalStyles.mt_30,
            ]}>
            {Global}
          </Text>
        )} */}
        <View style={globalStyles.alignItems_c}>
          <TouchableOpacity
            onPress={() => [addMealToFavCall()]}
            style={styles.minuscBig}>
            <Image style={styles.codeimage} source={images.APP.FOOODDD}></Image>
          </TouchableOpacity>
          <Text
            style={[
              globalStyles.textAlignStart,
              styles.white,
              globalStyles.font_12,
              globalStyles.mt_10,
            ]}>
            {alreadyFavorite ? 'Added to my meals' : strings.addfoodstomymeal}
          </Text>
        </View>
        {MEAL_ID && (
          <View style={globalStyles.alignItems_c}>
            <TouchableOpacity
              // onPress={() => [
              //   (global.backRoute = 'MealView'),
              //   MEAL_ID ? [(call_type = GET_FOODS), addMealId()] : addMealId(),
              //   setDate(null),
              //   (dateSelected = null),
              // ]}
              onPress={() => setWillInflateCopyMeal(true)}
              style={styles.minuscBig}>
              <Image style={styles.codeimage} source={images.APP.COPYY}></Image>
            </TouchableOpacity>
            <Text
              style={[
                globalStyles.textAlignStart,
                styles.white,
                globalStyles.font_12,
                globalStyles.mt_10,
              ]}>
              {strings.copymeal}
            </Text>
          </View>
        )}
        <View style={globalStyles.alignItems_c}>
          <TouchableOpacity
            onPress={() => [
              (global.backRoute = 'MealView'),
              MEAL_ID ? [(call_type = GET_FOODS), addMealId()] : addMealId(),
              setDate(null),
              (dateSelected = null),
            ]}
            style={styles.minuscBig}>
            <Image style={styles.codeimage} source={images.SIGNUP.PLUS}></Image>
          </TouchableOpacity>
          <Text
            style={[
              globalStyles.textAlignStart,
              styles.white,
              globalStyles.font_12,
              globalStyles.mt_10,
            ]}>
            {strings.addfoods}
          </Text>
        </View>
      </View>
    );
  };
  const rendeFatItem = item => {
    if (item == 100) {
      return (
        <Image
          style={styles.smallbucket}
          source={images.FAT_IMAGE.ORANGE_100}></Image>
      );
    } else if (item == 75)
      return (
        <Image
          style={styles.smallbucket}
          source={images.FAT_IMAGE.ORANGE_75}></Image>
      );
    else if (item == 50)
      return (
        <Image
          style={styles.smallbucket}
          source={images.FAT_IMAGE.ORANGE_50}></Image>
      );
    else if (item == 25)
      return (
        <Image
          style={styles.smallbucket}
          source={images.FAT_IMAGE.ORANGE_25}></Image>
      );
  };
  const rendeProteinItem = item => {
    if (item == 100) {
      return (
        <Image
          style={styles.smallbucket}
          source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
      );
    } else if (item == 75)
      return (
        <Image
          style={styles.smallbucket}
          source={images.PROTEIN_IMAGE.PROTEIN_75}></Image>
      );
    else if (item == 50)
      return (
        <Image
          style={styles.smallbucket}
          source={images.PROTEIN_IMAGE.PROTEIN_50}></Image>
      );
    else if (item == 25)
      return (
        <Image
          style={styles.smallbucket}
          source={images.PROTEIN_IMAGE.PROTEIN_25}></Image>
      );
  };
  const rendeCarbsItem = item => {
    if (item == 100) {
      return (
        <Image
          style={styles.smallbucket}
          source={images.CARBS_IMAGE.CARBS_100}></Image>
      );
    } else if (item == 75)
      return (
        <Image
          style={styles.smallbucket}
          source={images.CARBS_IMAGE.CARBS_75}></Image>
      );
    else if (item == 50)
      return (
        <Image
          style={styles.smallbucket}
          source={images.CARBS_IMAGE.CARBS_50}></Image>
      );
    else if (item == 25)
      return (
        <Image
          style={styles.smallbucket}
          source={images.CARBS_IMAGE.CARBS_25}></Image>
      );
  };
  const rendeMajorCarbsItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_25}></Image>
      );
  };
  const rendeMajorFatItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_25}></Image>
      );
  };
  const rendeMajorProteinItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_25}></Image>
      );
  };
  const renderMealView = () => {
    return (
      <FlatList
        horizontal
        contentContainerStyle={{paddingHorizontal: 20}}
        extraData={isUpdating}
        showsHorizontalScrollIndicator={false}
        data={mealMainArray}
        renderItem={MealItem}></FlatList>
    );
  };
  useEffect(() => {
    if (selectedFoodItemForDeletion) {
      setwillInflateDeleteConfirmationModal(true);
      console.log('selectedFoodItemForDeletion=>', selectedFoodItemForDeletion);
    }
  }, [selectedFoodItemForDeletion]);

  const MealItem = item => {
    const {
      name,
      description,
      image,
      carbs,
      fat,
      protein,
      fiber,
      quantity,
      unit,
      calories,
      favorite,
      calories_percentage,
      measurement,
      id,
    } = item.item;
    return (
      <View style={styles.mealitemc}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.favmealsC}>
          <View style={styles.mealc}>
            <View style={globalStyles.flex_68}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text numberOfLines={1} style={styles.melaname}>
                    {name}
                  </Text>
                  {/* <Text numberOfLines={1} style={styles.mealcategory}>
                    {quantity + ` ` + unit}
                  </Text> */}
                </View>
                {/* <Pressable onPress={() => onHeartPress(item)}>
                  <Image
                    style={styles.hearts}
                    source={
                      favorite == 0 ? images.APP.HEART : images.APP.LIKEDHEART
                    }></Image>
                </Pressable> */}
              </View>

              <SelectDropdown
                disabled
                data={dummyContent.piece}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem);
                  //setFoodPieceCount(selectedItem);
                  updateServingsThroughPeiceQtyBasis(selectedItem);
                  //updateQty(selectedItem);
                }}
                // defaultButtonText={
                //   selectedFoodItem?.quantity + selectedFoodItem?.unit
                // }
                defaultButtonText={quantity + ` ` + unit}
                //defaultButtonText={foodPieceCount + servingUnit}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                renderDropdownIcon={() => {
                  return null;
                  // (
                  //   <Image
                  //     style={{
                  //       height: 18,
                  //       width: 18,
                  //       resizeMode: 'contain',
                  //       //   transform: [{rotate: '270deg'}],
                  //     }}
                  //     source={images.SIGNUP.DOWN_ARROW}
                  //   />
                  // );
                }}
                buttonStyle={styles.dropdownMiniBtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown4DropdownStyle}
                rowStyle={styles.dropdown4RowStyle}
                rowTextStyle={styles.dropdown4RowTxtStyle}
              />

              <View style={globalStyles.flex_row}>
                <ImageBackground
                  source={{uri: image}}
                  borderRadius={10}
                  style={styles.mealimg}></ImageBackground>

                <View
                  style={{
                    marginTop: 20,
                    /// backgroundColor: 'gray',
                    marginVertical: 12,
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}>
                  {fat.length > 0 && (
                    <View style={styles.mealinnerc}>
                      <View style={{flex: 0.35}}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.orange,
                            styles.font_13,
                            globalStyles.mt_0,
                          ]}>
                          {`Fats:`}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 0.65,
                        }}>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          //style={{width: 10, backgroundColor: 'red'}}
                          contentContainerStyle={{alignItems: 'center'}}
                          horizontal>
                          {fat.map(item => rendeFatItem(item))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                  {carbs.length > 0 && (
                    <View style={styles.mealinnerc}>
                      <View style={{flex: 0.35}}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.red,
                            globalStyles.mt_0,
                            styles.font_13,
                          ]}>
                          {`Carbs:`}
                        </Text>
                      </View>
                      <View style={{flex: 0.65}}>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          contentContainerStyle={{alignItems: 'center'}}>
                          {carbs.map(item => rendeCarbsItem(item))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                  {protein.length > 0 && (
                    <View style={styles.mealinnerc}>
                      <View style={{flex: 0.35}}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.green,
                            styles.font_13,
                            globalStyles.mt_0,
                          ]}>
                          {`Protein:`}
                        </Text>
                      </View>
                      <View style={{flex: 0.65}}>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          contentContainerStyle={{alignItems: 'center'}}>
                          {protein.map(item => rendeProteinItem(item))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={globalStyles.flex_32_aligncenter}>
              <View style={styles.progressbar}>
                <GradientCircularProgress
                  startColor={colors.primary}
                  middleColor={colors.secondary}
                  endColor={colors.primary}
                  size={45}
                  emptyColor={colors.black}
                  progress={calories_percentage}
                  strokeWidth={8}>
                  <Text style={styles.lbs}>{calories}</Text>
                </GradientCircularProgress>
                <Text
                  style={[
                    styles.bucketSize,
                    globalStyles.mt_0,
                    styles.headingtextBlack,
                    styles.font_11,
                    {opacity: 0.7},
                  ]}>
                  {strings.calories}
                </Text>
              </View>
              {/* {MEAL_ID ? (
                <Pressable
                  style={styles.minusc}
                  onPress={() => [
                    setUpdating(!isUpdating),
                    onSetSelectedItemPress(item.item),
                    (tempItem = item.item),
                    setUpdating(!isUpdating),
                    (tempIndex = item.index),
                    (clickedIndex = item.index),
                    //onEditButtonClick(item.item, item.index),
                  ]}>
                  <Image
                    style={styles.heart}
                    source={images.APP.PENCIL}></Image>
                </Pressable>
              ) : (
                <Pressable onPress={() => onHeartPress(item)}>
                  <Image
                    style={styles.heart}
                    source={
                      favorite == 0 ? images.APP.HEART : images.APP.LIKED
                    }></Image>
                </Pressable>
              )} */}
              {/* {MEAL_ID && (
                <Pressable
                  style={styles.minusc}
                  onPress={() => [
                    setUpdating(!isUpdating),
                    onSetSelectedItemPress(item.item),
                    (tempItem = item.item),
                    (tempIndex = item.index),
                    (clickedIndex = item.index),
                    //onEditButtonClick(item.item, item.index),
                  ]}>
                  <Image
                    style={styles.heart}
                    source={images.APP.PENCIL}></Image>
                </Pressable>
              )} */}

              {/* <Pressable
                style={styles.minusc}
                onPress={() => [
                  (CALLTYPE = 'EDITFOOD'),
                  setUpdating(!isUpdating),
                  onSetSelectedItemPress(item?.item),
                  (tempItem = item?.item),
                  (temp_food_id_ = id),
                  (clickedIndex = item?.index),
                  //onEditButtonClick(item.item, item.index),
                ]}>
                <Image style={styles.heart} source={images.APP.HEART}></Image>
              </Pressable> */}
              <Pressable
                style={styles.minusc}
                onPress={() => onHeartPress(item)}>
                <Image
                  style={styles.heart}
                  source={
                    favorite == 0 ? images.APP.HEART : images.APP.LIKED
                  }></Image>
              </Pressable>
              <TouchableOpacity
                // onPress={() => onDeleteFoodPress(item)}
                onPress={() => [
                  (CALLTYPE = 'DELETE'),
                  ///setSelectedItemFood(item),
                  setSelectedFoodItemForDeletion(item),
                  // setwillInflateDeleteConfirmationModal(true),
                  // onEditButtonClick(item.item, item.index),
                ]}
                style={styles.minusc}>
                <Image
                  style={styles.minusimage}
                  source={images.APP.TRASH}></Image>
              </TouchableOpacity>
              <Pressable
                style={styles.minusc}
                onPress={() => [
                  (CALLTYPE = 'EDITFOOD'),
                  setUpdating(!isUpdating),
                  onSetSelectedItemPress(item?.item),
                  (tempItem = item?.item),
                  (temp_food_id_ = id),
                  (clickedIndex = item?.index),

                  //onEditButtonClick(item.item, item.index),
                ]}>
                <Image style={styles.heart} source={images.APP.PENCIL}></Image>
              </Pressable>

              {/* {item.index > 0 ? (
                <TouchableOpacity
                  onPress={() => onDeleteFoodPress(item)}
                  style={styles.minusc}>
                  <Image
                    style={styles.minusimage}
                    source={images.APP.TRASH}></Image>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{height: 40, width: 40}}></TouchableOpacity>
              )} */}
              {/* <Pressable onPress={() => onHeartPress(item)}>
                <Image
                  style={styles.hearts}
                  source={
                    favorite == 0 ? images.APP.HEART : images.APP.LIKED
                  }></Image>
              </Pressable> */}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };
  const CopyMealView = () => {
    return (
      <FlatList
        horizontal
        extraData={isUpdating}
        showsHorizontalScrollIndicator={false}
        data={mealMainArray}
        renderItem={CopyMealItem}></FlatList>
    );
  };
  const CopyMealItem = item => {
    console.log('MealItem.item=>', item.item);
    const {
      name,
      description,
      image,
      carbs,
      fat,
      protein,
      fiber,
      quantity,
      unit,
      calories,
      favorite,
      calories_percentage,
      measurement,
      id,
    } = item.item;
    return (
      <View style={styles.mealitemcopyMeal}>
        <View style={styles.favmealsC}>
          <View style={styles.mealc}>
            <View style={globalStyles.flex_68}>
              <Text numberOfLines={1} style={styles.melaname}>
                {name}
              </Text>
              <Text numberOfLines={1} style={styles.mealcategory}>
                {quantity + ` ` + unit}
              </Text>

              <View style={globalStyles.flex_row}>
                <ImageBackground
                  source={{uri: image}}
                  borderRadius={10}
                  style={styles.mealimgCopyMeal}></ImageBackground>

                <View>
                  {fat.length > 0 && (
                    <View style={styles.mealinnerc}>
                      <View style={{flex: 0.35}}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.orange,
                            globalStyles.mt_0,
                          ]}>
                          {`Fats:`}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 0.65,
                        }}>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          //style={{width: 10, backgroundColor: 'red'}}
                          contentContainerStyle={{alignItems: 'center'}}
                          horizontal>
                          {fat.map(item => rendeFatItem(item))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                  {carbs.length > 0 && (
                    <View style={styles.mealinnerc}>
                      <View style={{flex: 0.35}}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.red,
                            globalStyles.mt_0,
                          ]}>
                          {`Carbs:`}
                        </Text>
                      </View>
                      <View style={{flex: 0.65}}>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          contentContainerStyle={{alignItems: 'center'}}>
                          {carbs.map(item => rendeCarbsItem(item))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                  {protein.length > 0 && (
                    <View style={styles.mealinnerc}>
                      <View style={{flex: 0.35}}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.green,
                            globalStyles.mt_0,
                          ]}>
                          {`Protein:`}
                        </Text>
                      </View>
                      <View style={{flex: 0.65}}>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          contentContainerStyle={{alignItems: 'center'}}>
                          {protein.map(item => rendeProteinItem(item))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={globalStyles.flex_32_aligncenter}>
              <View style={styles.progressbar}>
                <GradientCircularProgress
                  startColor={colors.primary}
                  middleColor={colors.secondary}
                  endColor={colors.primary}
                  size={47}
                  emptyColor={colors.black}
                  progress={calories_percentage}
                  strokeWidth={6}>
                  <Text style={styles.lbs}>{calories}</Text>
                </GradientCircularProgress>
                <Text
                  style={[
                    styles.bucketSize,
                    globalStyles.mt_0,
                    styles.headingtextBlackCopyMeal,
                  ]}>
                  {strings.calories}
                </Text>
              </View>

              <Pressable
                style={styles.minusc}
                onPress={() => [
                  setUpdating(!isUpdating),
                  (temp_food_id_ = id),
                  onSetSelectedItemPress(item?.item),
                  (tempItem = item?.item),
                  (clickedIndex = item?.index),
                  //onEditButtonClick(item.item, item.index),
                ]}>
                <Image style={styles.heart} source={images.APP.PENCIL}></Image>
              </Pressable>

              <TouchableOpacity
                onPress={() =>
                  item.index > 0
                    ? onDeleteFoodPress(item)
                    : Utility.getInstance().inflateToast(
                        'You Cannot delete all foods In Copying Meal Phase.',
                      )
                }
                style={styles.minusc}>
                <Image
                  style={styles.minusimage}
                  source={images.APP.TRASH}></Image>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => onDeleteFoodPress(item)}
                style={styles.minusc}>
                <Image
                  style={styles.minusimage}
                  source={images.APP.TRASH}></Image>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    );
  };
  const CarbsBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          paddingVertical: 5,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.red,
              styles.font_13,
            ]}>
            {`Carbs: `}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          <FlatList
            numColumns={6}
            //horizontal
            showsHorizontalScrollIndicator={false}
            data={carbsArray}
            renderItem={rendeMajorCarbsItem}></FlatList>
        </View>
      </View>
    );
  };
  const FatBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          paddingVertical: 5,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.orange,
              styles.font_13,
            ]}>
            {`Fats:`}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={fatArray}
            numColumns={6}
            renderItem={rendeMajorFatItem}></FlatList>
        </View>
      </View>
    );
  };
  const ProteinBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          paddingVertical: 5,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.green,
              styles.font_13,
            ]}>
            {`Protein:`}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          <FlatList
            numColumns={6}
            showsHorizontalScrollIndicator={false}
            data={proteinArray}
            renderItem={rendeMajorProteinItem}></FlatList>
        </View>
      </View>
    );
  };
  const Button = props => {
    return (
      <Pressable
        onPress={props.onClick}
        style={{
          backgroundColor: props.color,
          height: 40,
          width: 200,
          marginTop: 12,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: colors.black,
            fontSize: 15,
            letterSpacing: 0.2,
            fontFamily: 'Poppins-Medium',
          }}>
          {props.heading}
        </Text>
      </Pressable>
    );
  };
  var onSkipPress = () => {
    setWillInflate(false);
    setAddMealFavInflate(false);
    clearFavMealGlobalVariableDetails();
    setTimeout(() => {
      navigation.navigate('Home');
    }, 700);
  };
  const Modal = () => {
    return (
      <DialogView
        onTouchOutside={() => console.log('onTouchOutside')}
        willInflate={willInflate}
        onBackPress={() => setWillInflate(false)}
        children={ConfirmMealModalContent()}></DialogView>
    );
  };
  //   const AddMealToFavModal = () => {
  //     return (
  //       <DialogView
  //         onTouchOutside={() => console.log('onTouchOutside')}
  //         willInflate={addMealFavInflate}
  //         onBackPress={() => setAddMealFavInflate(false)}
  //         children={AddMealFavModalContent()}></DialogView>
  //     );
  //   };
  //   const AddMealFavModalContent = () => {
  //     return (
  //       <View>
  //         <View
  //           style={{
  //             marginTop: 1,
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //           }}>
  //           <Text
  //             style={{
  //               textAlign: 'center',
  //               fontFamily: 'Poppins-SemiBold',
  //               color: colors.black,
  //               fontSize: 25,
  //             }}>
  //             {` Meal
  // Submitted`}
  //           </Text>

  //           <Text
  //             style={{
  //               textAlign: 'center',
  //               fontFamily: 'Poppins-Light',
  //               marginTop: 20,
  //               color: colors.black,
  //             }}>
  //             {alreadyFavorite
  //               ? 'Your Meal has been submitted. This meal is already in your favorite meals.'
  //               : 'Your Meal has been submitted. Would you like to favorite this meal so you can add it faster in the future?'}
  //           </Text>

  //           {alreadyFavorite ? (
  //             <>
  //               <TouchableOpacity
  //                 onPress={() => [onSkipPress()]}
  //                 style={[
  //                   globalStyles.button_secondary,
  //                   globalStyles.center,
  //                   globalStyles.mt_30,
  //                 ]}>
  //                 <Text style={globalStyles.btn_heading_black}>{'CONTINUE'}</Text>
  //               </TouchableOpacity>
  //             </>
  //           ) : (
  //             <>
  //               <TouchableOpacity
  //                 onPress={() => [setWillInflate(false), addMealToFavCall()]}
  //                 style={[
  //                   globalStyles.button_secondary,
  //                   globalStyles.center,
  //                   globalStyles.mt_30,
  //                 ]}>
  //                 <Text style={globalStyles.btn_heading_black}>
  //                   {'ADD TO FAVORITES'}
  //                 </Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 onPress={() => [onSkipPress()]}
  //                 style={[
  //                   globalStyles.button_secondarywithoutBlackBack,
  //                   globalStyles.center,
  //                   globalStyles.mt_30,
  //                 ]}>
  //                 <Text style={globalStyles.btn_heading_black}>
  //                   {'SKIP FOR NOW'}
  //                 </Text>
  //               </TouchableOpacity>
  //             </>
  //           )}
  //         </View>
  //       </View>
  //     );
  //   };
  const ConfirmMealModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => setWillInflate(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 20,
            }}>
            Confirmation
          </Text>
          <View
            style={{
              height: 20,
              width: 20,
              marginHorizontal: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
        </View>
        <View
          style={{
            marginTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              color: colors.black,
              fontSize: 12,
              lineHeight: 20,
              marginTop: 20,
              margin: 30,
              //textDecorationLine: 'underline',
            }}>
            {strings.selectedLdes}
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={mealMainArray}
            renderItem={renderConfirmModalFoods}></FlatList>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              color: colors.black,
              fontSize: 12,
              marginTop: 30,
              lineHeight: 22,
              // margin: 25,
            }}>
            {strings.infuture}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              color: colors.black,
              fontSize: 12,
              marginTop: 10,
              lineHeight: 22,
              //   margin: 25,
              textDecorationLine: 'underline',
            }}>
            {strings.mealAdd}
          </Text>
          <Button
            onClick={() => [onDonePress()]}
            heading="ADD MEAL"
            color={colors.secondary}></Button>
        </View>
      </View>
    );
  };
  const renderConfirmModalFoods = item => {
    const {
      name,
      description,
      image,
      carbs,
      fat,
      protein,
      fiber,
      quantity,
      unit,
      calories,
      favorite,
      calories_percentage,
      measurement,
      id,
    } = item.item;
    return (
      <View
        style={{
          height: 70,
          width: 200,
          backgroundColor: colorCodes.offwhite,
          justifyContent: 'center',
          paddingHorizontal: 25,
          marginRight: 10,
        }}>
        <View style={[styles.myfavlistcontainerchild, {alignItems: 'center'}]}>
          <Image
            style={{
              height: 50,
              width: 50,
              resizeMode: 'cover',
              borderRadius: 5,
              marginLeft: 0,
            }}
            source={{uri: image}}></Image>
          <View>
            <Text
              style={[
                styles.ml_15,

                {
                  color: colorCodes.black,
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  marginLeft: 10,
                },
              ]}>
              {`${calories} cal`}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                styles.ml_15,
                styles.black,
                {width: 150, fontSize: 13, marginLeft: 10},
              ]}>
              {name}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const AddedToMyMealModal = () => {
    return (
      <DialogView
        onTouchOutside={() => console.log('onTouchOutside')}
        willInflate={myMealAddedInflate}
        onBackPress={() => setMyMealAddedInflate(false)}
        children={AddedToMyMealModalContent()}></DialogView>
    );
  };
  const AddedToMyMealModalContent = () => {
    return (
      <View>
        <Text
          style={{
            // alignSelf: 'center',
            //textAlign: 'center',
            fontFamily: 'Poppins-SemiBold',
            color: colors.black,
            fontSize: 20,
            textAlign: 'center',
          }}>
          {strings.added}
        </Text>
        <View
          style={{
            marginTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              color: colors.black,
              fontSize: 12,
              marginTop: 20,
              margin: 30,
              lineHeight: 20,
              textDecorationLine: 'underline',
            }}>
            {strings.selectedL}
          </Text>

          <View
            style={{
              height: 80,
              width: '100%',
              backgroundColor: colorCodes.offwhite,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={[styles.myfavlistcontainerchild, {alignItems: 'center'}]}>
              <Image
                style={{
                  height: 50,
                  width: 50,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginLeft: 10,
                }}
                source={{
                  uri: 'http://52.1.213.252/backend/web/uploads/recipes/default-food.png',
                }}></Image>
              <View style={{marginLeft: 10}}>
                <Text
                  style={[
                    styles.ml_15,

                    {
                      color: colorCodes.black,
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                    },
                  ]}>
                  {`${totalCalories} cal`}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.ml_15,
                    styles.black,
                    {width: 150, fontSize: 13},
                  ]}>
                  {mealName}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              color: colors.black,
              fontSize: 12,
              marginTop: 30,
              lineHeight: 22,
              margin: 25,
            }}>
            {strings.mealadded}
          </Text>
          <Button
            onClick={() => [setMyMealAddedInflate(false)]}
            heading="BACK"
            color={colors.secondary}></Button>
        </View>
      </View>
    );
  };
  const DateView = () => {
    return (
      <FlatList
        horizontal
        style={{marginTop: 15}}
        renderItem={renderDates}
        /// extraData={dateArray}
        ref={scrollRef}
        onScrollToIndexFailed={scrollToIndexFailed}
        keyExtractor={item => item.toString() + 2.9}
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        data={dateArray}></FlatList>
    );
  };
  const renderDates = item => {
    const {show_date, date} = item.item;
    return (
      <Pressable
        onPress={() => [
          saveSelectedDate(date),
          setDate(date),
          (dateSelected = date),
        ]}
        style={[
          styles.dateView_,
          {
            borderWidth: dateValue == date ? 2 : 0.3,
          },
        ]}>
        <Text
          style={[
            styles.headingT,
            {color: dateValue == date ? colors.white : colors.gray},
          ]}>
          {show_date}
        </Text>
      </Pressable>
    );
  };
  const removerMealId = async () => {
    dispatch(clearFoodId());
    await Utility.getInstance().removeStoreData('MEAL_ID');
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <MealViewHeader
          onBackPress={() => {
            draftFoodsData ? discardAlert() : backPress();
          }}
          profileClick={() => removerMealId()}
        />
        <ScrollView
          contentContainerStyle={{paddingVertical: 10}}
          contentInsetAdjustmentBehavior="automatic">
          {/* {!MEAL_ID && DateView()} */}
          <View style={{paddingHorizontal: 20}}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: colorCodes.white,
                fontSize: 15,
                marginTop: 25,
              }}>
              Meal Name
            </Text>

            <SelectDropdown
              data={mealNames}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem);
                setMealName(selectedItem);

                if (selectedItem === 'Custom') {
                  setCustomMealName('');
                  setWillInflateCustomMealNameModal(true);
                }
              }}
              key={mealName}
              defaultButtonText={mealName}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              renderDropdownIcon={() => {
                return (
                  <Image
                    style={{
                      height: 12,
                      width: 12,
                      resizeMode: 'contain',
                      //   transform: [{rotate: '270deg'}],
                    }}
                    source={images.SIGNUP.DOWN_ARROW}
                  />
                );
              }}
              buttonStyle={styles.dropdownMiniBtnStyle_50}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>
          {HeaderInfo()}
          {renderMealView()}
          {/* {MEAL_ID && (
            <Pressable
              onPress={() => setWillInflateCopyMeal(true)}
              style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
              <Image
                style={{height: 20, width: 20, resizeMode: 'contain'}}
                source={images.APP.COPY}></Image>
              <Text
                numberOfLines={1}
                style={[
                  styles.melaname,
                  globalStyles.mr_left,
                  globalStyles.white,
                  globalStyles.font14,
                ]}>
                COPY MEAL
              </Text>
            </Pressable>
          )} */}
          <Text
            style={[
              globalStyles.textAlignCenter,
              styles.white,
              globalStyles.mt_20,
              globalStyles.font17,
            ]}>
            {strings.totalBuckets}
          </Text>
          <View style={globalStyles.padding_20_hor}>
            {carbsArray.length > 0 && CarbsBucketView()}
            {fatArray.length > 0 && FatBucketView()}
            {proteinArray.length > 0 && ProteinBucketView()}
          </View>
        </ScrollView>
        {MEAL_ID ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              backgroundColor: 'transparent',
              height: 80,
              width: '60%',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              alignContent: 'center',
            }}>
            <Text
              onPress={() => [onDeleteMealPress()]}
              style={[globalStyles.btn_heading, {marginRight: 50}]}>
              DELETE
            </Text>
            {!Loading && (
              <Text
                onPress={() => [onDonePress()]}
                style={[globalStyles.btn_heading]}>
                {'UPDATE'}
              </Text>
            )}
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              backgroundColor: 'transparent',
              height: 80,
              width: 100,
              flexDirection: 'row',
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            {!Loading && (
              // <Text
              //   onPress={() => [onDonePress()]}
              //   style={[globalStyles.btn_heading]}>
              //   {'DONE'}
              // </Text>
              <Button
                onClick={() => onDonePress()}
                //onClick={() => setWillInflate(true)}
                heading="ADD MEAL"
                color={colors.secondary}></Button>
            )}
          </View>
        )}
      </View>
    );
  };
  const GoalsOutOfRangeModal = () => {
    return (
      <DialogView
        onTouchOutside={() => setwillInflateOutofRangeModal(false)}
        willInflate={willInflateOutofRangeModal}
        onBackPress={() => setwillInflateOutofRangeModal(false)}
        children={<GoalsOutOfRangeModalContent />}></DialogView>
    );
  };
  const GoalsOutOfRangeModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 30,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => setwillInflateOutofRangeModal(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text style={{textAlign: 'center', fontFamily: 'Poppins-SemiBold'}}>
            Entry Out of Range!
          </Text>
          <View style={globalStyles.backimgregister}></View>
        </View>
        <View
          style={{
            marginTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center', fontFamily: 'Poppins-Light'}}>
            You have already added enough meals, If you add more meal It will
            exceeds your daily goals buckets count
          </Text>

          <TouchableOpacity
            onPress={() => [setwillInflateOutofRangeModal(false), createMeal()]}
            style={[
              globalStyles.button_primary,
              globalStyles.center,
              globalStyles.mt_30,
            ]}>
            <Text
              style={[globalStyles.btn_heading, globalStyles.green_heading]}>
              {strings.continue}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <>
      {DefautView()}
      {Modal()}
      {EditFoodModal()}
      {CopyMealModal()}
      {/* {AddMealToFavModal()} */}
      {AddedToMyMealModal()}
      {DeleteConfirmationModal()}
      {CustomMealNameModal()}
      {GoalsOutOfRangeModal()}
      <Loader
        fullScrreen={true}
        isLoading={isLoading || isLoadingFav || Loading}
      />
    </>
  );
};
export default MealView;
