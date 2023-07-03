import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import {debounce} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import images from '../../assets/images/index';
import dummyContent from '../../constants/dummyContent';
import styles from '../AddFoods/style';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Header from '../../component/headerWithBackControl';
import colors from '../../constants/colorCodes';
import DialogView from '../../component/dialog';
import Utility from '../../utility/Utility';
import {clearFoodId} from '../../redux/action/FoodIdAction';
import {GradientCircularProgress} from 'react-native-circular-gradient-progress';
import {getFavouriteFoodsRequest} from '../../redux/action/FavoriteFoodsAction';
import {
  addCustomFoodRequest,
  customFoodInfoRequest,
} from '../../redux/action/CustomFoodAction';
import Loader from '../../component/loader';
import Carbs from '../../component/buckets';
import {RNCamera} from 'react-native-camera';
import api from '../../constants/api';
var userId = null;
var mealNum = 0;
var tempFoodArray = [];
var addFoodPayload = null;
var today = new Date();
var date = moment(today).format('MM/DD/YYYY');
var updatedCarbs = null;
var updatedFat = null;
var updatedProtein = null;
var selectedItemServingWeight = null;
var defaultServingWeight = null;
var selectedFoods = [];
const FavoriteFoods = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [food, setFood] = useState([]);
  const [isUpdating, setUpdating] = useState(false);
  const userData = useSelector(state => state.other.loginReducer.userData);

  const [willInflate, setWillInflate] = useState(false);
  const [willInflateScannedFoodModal, setWillInflateScannedFoodModal] =
    useState(false);
  const [mealMainArray, setMealMainArray] = useState([]);
  const [isLoadingSearch, setLoadingSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodImg, setFoodImg] = useState(null);
  const [foodCaloriesCount, setFoodCaloriesCount] = useState(0);
  const [foodPieceCount, setFoodPieceCount] = useState(0);
  const [foodFatArray, setFoodFatArray] = useState([]);
  const [foodCarbsArray, setFoodCarbsArray] = useState([]);
  const [foodProteinArray, setFoodAProteinrray] = useState([]);
  const [servingUnit, setServingUnit] = useState(null);
  const [isBarCodeScannerVisible, setBarcodeVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [scannedFoodDetails, setScanedFoodDetails] = useState(null);
  const [CombinedFood, setCombinedFood] = useState([]);
  const [measurements, setMeasurments] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      if (userData) {
        userId = userData.id;
      }
      getFoodList();
    }, []),
  );
  const getFoodList = () => {
    setLoading(true);
    let payload = {
      uid: userId,
      search: searchValue && searchValue.trim(),
    };

    dispatch(getFavouriteFoodsRequest(payload, onS, onF));
  };

  const onS = resolve => {
    let data = resolve?.data.map(obj => ({...obj, isSelected: false}));
    setTimeout(() => {
      setLoading(false);
    }, 100);
    if (!searchValue) {
      tempFoodArray = data;
    }
    setCombinedFood(data);
  };
  const onF = reject => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const setFoodDetailsToAddModal = item => {
    console.log('setFoodDetailsToAddModal.item', item);
    const {
      food_name,
      nf_calories,
      nf_protein,
      serving_unit,
      nf_total_carbohydrate,
      nf_total_fat,
      note,
      nf_dietary_fiber,
      serving_qty,
      photo,
      nix_item_id,
      customFood,
      measurement,
      serving_weight_grams,
      quantity,
      base_qty,
    } = item;

    addFoodPayload = {
      ...item,
      created_by: parseInt(userId),
      name: food_name,
      calories: parseInt(nf_calories),
      carbs: parseInt(nf_total_carbohydrate),
      fat: parseInt(nf_total_fat),
      protein: parseInt(nf_protein),

      description: note,
      fiber: parseInt(nf_dietary_fiber),
      quantity: parseInt(serving_qty),
      unit: serving_unit,
      image: photo.thumb,
      food_id: nix_item_id
        ? nix_item_id
        : food_name.replace(/ /g, '') +
          serving_unit.replace(/ /g, '') +
          serving_qty +
          parseInt(nf_protein) +
          parseInt(nf_total_carbohydrate),
      measurement: measurement,
      serving_weight_grams: serving_weight_grams,
    };
    if (serving_weight_grams) {
      defaultServingWeight = serving_weight_grams;
      if (customFood) {
        setMeasurments('');
        updateServingsThroughPeiceQtyBasis(serving_qty);
      } else {
        if (measurement != '' && measurement.length > 0) {
          setMeasurments(measurement ? JSON.parse(measurement) : '');
          checkAndGetDefaultServingWeight(
            JSON.parse(measurement),
            serving_qty,
            serving_unit,
          );
        } else {
          defaultServingWeight = 0;
          setMeasurments('');
          updateServingsThroughPeiceQtyBasis(serving_qty);
        }
      }
    } else {
      defaultServingWeight = 0;
      setMeasurments('');
      updateServingsThroughPeiceQtyBasis(serving_qty);
    }

    setFoodPieceCount(serving_qty);
    setServingUnit(serving_unit);
    setFoodName(food_name);
    setFoodImg(photo.thumb);
    setFoodCaloriesCount(Math.round(nf_calories));

    setWillInflate(true);
  };

  const onAddPressV2 = async () => {
    let foodId = [];
    let qty = [];
    selectedFoods.forEach(e => {
      foodId.push(e.id);
      qty.push(e.qty);
    });
    (foodId = foodId.toString()), (qty = qty.toString());
    console.log('onAddPressV2==', foodId, qty);

    selectedFoods = [];
    global.backRoute = 'NewMeal';
    setWillInflate(false);
    navigation.navigate('MealView', {foodId, qty: qty});
  };
  const onAddPress = () => {
    addFoodPayload = {
      ...addFoodPayload,
      carbs: Math.round(updatedCarbs),
      fat: Math.round(updatedFat),
      protein: Math.round(updatedProtein),
      quantity: foodPieceCount,
      unit: servingUnit,
      calories: foodCaloriesCount,
      measurement: measurements.length > 0 ? JSON.stringify(measurements) : '',
      serving_weight_grams: defaultServingWeight,
    };
    console.log('onAddPress==', addFoodPayload);
    setWillInflate(false);
    if (addFoodPayload?.customFood) {
      let foodId = addFoodPayload?.id;
      setTimeout(() => {
        setFoodPieceCount(0);
        global.backRoute = 'AddMeal';
        setSearchValue('');
        addFoodPayload = null;
        navigation.navigate('MealView', {foodId, qty: foodPieceCount});
      }, 1000);
    } else {
      setLoading(true);
      setTimeout(() => {
        dispatch(addCustomFoodRequest(addFoodPayload, onSS, onFF));
      }, 1000);
    }
  };
  const checkAndGetDefaultServingWeight = (measurementData, quantity, unit) => {
    console.log(
      'measurementData=',
      measurementData,
      'quantity=',
      quantity,
      'unit=',
      unit,
    );
    let food;
    food = measurementData.find(food => food.measure === unit);
    if (!food) {
      food = measurementData.find(food => food.measure.includes(unit));
    }

    selectedItemServingWeight = {
      serving_weight: food?.serving_weight,
      measure: unit,
    };

    updateServingsThroughMeasurment(
      selectedItemServingWeight,
      quantity,
      'INITIAL',
    );
  };
  const updateServingsThroughPeiceQtyBasis = updatedQty => {
    var newQ;
    if (defaultServingWeight != 0) {
      newQ = updatedQty;
    } else {
      newQ = updatedQty / addFoodPayload?.base_qty;
    }
    const {carbs, fat, protein, calories, base_food_details} = addFoodPayload;
    let parsingbase_food_details = JSON.parse(base_food_details);
    setFoodAProteinrray(
      returnBucketArray(
        Math.round(parsingbase_food_details?.base_protein) * newQ,
        20,
        true,
      ),
    );
    setFoodFatArray(
      returnBucketArray(
        Math.round(parsingbase_food_details.base_fat) * newQ,
        10,
        false,
      ),
    );
    setFoodCarbsArray(
      returnBucketArray(
        Math.round(parsingbase_food_details.base_carbs) * newQ,
        20,
        true,
      ),
    );

    setFoodCaloriesCount(
      newQ * Math.round(parsingbase_food_details?.base_calories),
    );

    updatedCarbs = Math.round(parsingbase_food_details.base_carbs) * newQ;
    updatedFat = Math.round(parsingbase_food_details.base_fat) * newQ;
    updatedProtein = Math.round(parsingbase_food_details?.base_protein) * newQ;
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
  const updateServingsThroughMeasurment = (selected_Item, foo_piece_Count) => {
    const {
      carbs,
      fat,
      protein,
      calories,
      serving_weight_grams,
      quantity,
      base_qty,
      base_food_details,
    } = addFoodPayload;
    let parsingbase_food_details = JSON.parse(base_food_details);

    const value =
      selected_Item?.measure == 'g'
        ? (1 * foo_piece_Count) / defaultServingWeight
        : parseFloat(selected_Item?.serving_weight / serving_weight_grams) *
          (quantity / base_qty);

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
    //     false,
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
      returnBucketArray(parsingbase_food_details.base_fat * value, 10, false),
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
    setFoodCaloriesCount(
      parseFloat(parsingbase_food_details?.base_calories * value),
    );
  };

  const setSearchValueAndPerformSearch = value => {
    setSearchValue(value);
    if (!value) setCombinedFood(tempFoodArray);
  };

  useEffect(() => {
    if (searchValue.length > 2) {
      debounceGetFoodList();
    }
  }, [searchValue]);
  const backPress = () => {
    selectedFoods = [];
    navigation.goBack();
  };
  const debounceGetFoodList = debounce(() => {
    console.log('debounced');
    getFoodList();
  }, 200);

  const barcodeReceived = async e => {
    console.log('Barcode: ' + JSON.stringify(e));

    await setBarcodeVisible(false);
    setTimeout(() => {
      fetchFoodDetailsThroughBarcode(e.data);
    }, 1000);
  };
  const disableLoader = async () => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };
  const fetchFoodDetailsThroughBarcode = async code => {
    setLoadingSearch(true);
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      'x-user-jwt': userData && userData.nutritionix_user_jwt,
    });
    fetch(api.SCAN_FOOD_DETAILS + code.toString(), {
      method: 'GET',
      headers: myHeaders,
    })
      .then(response => response.json())
      .then(data => {
        setLoadingSearch(false);
        if (data.message) {
          Utility.getInstance().inflateToast(data.message);
          return;
        }
        if (data) {
          if (data?.foods) {
            CreateCustomFoodFromScannedDetails(data?.foods[0]);
          }
        }
      })
      .catch(e => {
        setLoadingSearch(false);
        Utility.getInstance().inflateToast(
          'Something went Wrong, Please try again after some time.',
        );
      });
  };
  const CreateCustomFoodFromScannedDetails = data => {
    const {
      food_name,
      brand_name,
      serving_qty,
      serving_unit,
      serving_weight_grams,
      nf_calories,
      nf_total_fat,
      nf_cholesterol,
      nf_total_carbohydrate,
      nf_dietary_fiber,
      nf_protein,
      nix_brand_name,
      upc,
      photo,
      note,
      nix_item_id,
    } = data;
    let payload = {
      created_by: parseInt(userId),
      name: food_name,
      calories: parseFloat(nf_calories),
      carbs: parseFloat(nf_total_carbohydrate),
      fat: parseFloat(nf_total_fat),
      protein: parseFloat(nf_protein),
      description: note,
      fiber: parseFloat(nf_dietary_fiber),
      quantity: parseInt(serving_qty),
      unit: serving_unit,
      image: photo.thumb,
      food_id: nix_item_id
        ? nix_item_id
        : food_name.replace(/ /g, '') +
          serving_unit.replace(/ /g, '') +
          serving_qty +
          parseFloat(nf_protein) +
          parseFloat(nf_total_carbohydrate),
    };

    setLoading(true);
    dispatch(addCustomFoodRequest(payload, onSS, onFF));
  };

  const onSS = resolve => {
    var tempFoodCount = foodPieceCount;
    disableLoader();
    addFoodPayload = null;
    let foodId = resolve.data.id;
    setTimeout(() => {
      setFoodPieceCount(0);
      global.backRoute = 'AddMeal';
      setSearchValue('');
      navigation.navigate('MealView', {foodId, qty: tempFoodCount});
    }, 1000);
  };

  const onFF = reject => {
    disableLoader();
    addFoodPayload = null;
    Utility.getInstance().inflateToast(reject);
  };

  const getMealDetails = async () => {
    let foodId = [];
    let qty = [];
    let timezone =
      Platform.OS === 'android'
        ? ''
        : Intl.DateTimeFormat().resolvedOptions().timeZone;
    selectedFoods.forEach(e => {
      foodId.push(e.id);
      qty.push(e.qty);
    });
    console.log('FOODIDDD=', foodId, qty);
    // return;
    let payload = {
      uid: userId,
      food_id: foodId.toString(),
      date: date,
      quantity: qty.toString(),
      current_date:
        (await Utility.getInstance().getCurrentDateUser()) + ',' + timezone,
    };

    setTimeout(() => {
      dispatch(customFoodInfoRequest(payload, onSSS, onFFF));
    }, 100);
  };

  const onSSS = resolve => {
    const {meal, macro, favorite_meal, meal_number, date, fav_id} =
      resolve.data;
    console.log('mealdetailds=', resolve.data);
    // setMealNum(meal_number);
    setFoodCarbsArray(macro.carbs);
    setFoodFatArray(macro.fat);
    setFoodAProteinrray(macro.protein);
    setMealMainArray(meal);

    // fav_meal_id = fav_id;
    // if (call_type == GET_FOODS) {
    //   meal.forEach(item => {
    //     quantityArray.push(item.quantity);
    //     foodIdArray.push(item.id);
    //   });
    // }

    // if (favorite_meal == 1) setAlreadyFav(true);
    // else setAlreadyFav(false);

    // setDateArray(date);
    setLoading(false);
  };
  useEffect(() => {
    if (mealMainArray.length > 0) {
      setWillInflate(true);
    }
  }, [mealMainArray]);

  const onFFF = reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const onPlusPress = item => {
    setFoodDetailsToAddModal(item.item);

    return;
  };

  const onPlusPressNew = (i, item) => {
    console.log('item==', item);
    CombinedFood[i].isSelected = !CombinedFood[i].isSelected;
    if (CombinedFood[i].isSelected) {
      selectedFoods.push({qty: item.quantity, id: item.id});
    } else {
      selectedFoods.forEach((e, i) => {
        selectedFoods.splice(i, 1);
      });
    }
    console.log('onPlusPressNew==', selectedFoods);
    setCombinedFood(CombinedFood);
    setUpdating(!isUpdating);
  };
  const onTouchOutside = () => {
    setWillInflate(!willInflate);
  };
  const TopResultsItems = item => {
    const {
      food_name,
      serving_unit,
      serving_qty,
      nf_calories,
      photo,
      brand_name,
      isSelected,
    } = item.item;
    console.log('onTouchOutside=>', item.item);
    return (
      <View
        style={[
          styles.addfoodc,
          {
            backgroundColor:
              item.index % 2 == 0 ? colors.offwhite : colors.oddBackground,
          },
        ]}>
        <View style={[styles.myfavlistcontainerchild, {flex: 0.75}]}>
          <Image
            style={styles.image}
            source={photo ? {uri: photo.thumb} : images.SPLASH.SPLASH}></Image>
          <View>
            {/* <Text style={styles.ml_15}>{serving_qty + ` ` + serving_unit}</Text> */}
            <Text numberOfLines={2} style={[{marginRight: 80}, styles.ml_1]}>
              {food_name}
            </Text>
            {/* <Text numberOfLines={1} style={[styles.ml_s]}>
              {brand_name}
            </Text> */}
          </View>
        </View>
        <Text
          numberOfLines={1}
          style={[styles.ml_15, styles.black, {textAlign: 'auto'}]}>
          {serving_qty + ` ` + serving_unit}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.15,
          }}>
          <TouchableOpacity
            onPress={() => onPlusPressNew(item.index, item.item)}>
            {isSelected ? (
              <Image
                source={images.APP.SELECTED}
                style={{height: 30, width: 30, resizeMode: 'contain'}}></Image>
            ) : (
              <Image
                source={images.APP.UNSELECTED}
                style={{height: 30, width: 30, resizeMode: 'contain'}}></Image>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const emptyContainer = () => {
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignSelf: 'center',
          marginVertical: 60,
        }}>
        <Text style={[styles.whydesc, globalStyles.white]}>
          {'No Food Found.'}
        </Text>
      </View>
    );
  };
  const TopResults = () => {
    return (
      <FlatList
        data={CombinedFood}
        extraData={isUpdating}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.myfavccs}
        ListEmptyComponent={emptyContainer}
        renderItem={item => TopResultsItems(item)}></FlatList>
    );
  };
  const AddFoodModal = () => {
    return (
      <DialogView
        dialog_Container={{
          width: Utility.getInstance().DW() / 1.25,
          backgroundColor: 'white',
          height: Utility.getInstance().DH() / 1.7,
        }}
        onTouchOutside={() => onTouchOutside()}
        willInflate={willInflate}
        onBackPress={() => setWillInflate(false)}
        children={ModalContent()}></DialogView>
    );
  };
  const ModalContent = () => {
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
          <TouchableOpacity onPress={() => onTouchOutside()}>
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
            Add Food
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
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              color: colors.black,
            }}>
            Are you sure you would like to add these foods to your meal?
            {/* <Text
              style={[globalStyles.underline_greendark, globalStyles.font20]}>
              {` Meal ` + mealNum + '?'}
            </Text> */}
          </Text>
          {renderMealView()}
          <TouchableOpacity
            onPress={onAddPressV2}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>ADD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onTouchOutside}
            style={[
              globalStyles.button_secondarywithoutBlackBack,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderFatItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.FAT_IMAGE.ORANGE_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.FAT_IMAGE.ORANGE_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.FAT_IMAGE.ORANGE_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.FAT_IMAGE.ORANGE_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.APP.ORANGE_EMPTY}></Image>
      );
  };
  const rendeProteinItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.PROTEIN_IMAGE.PROTEIN_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.PROTEIN_IMAGE.PROTEIN_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.PROTEIN_IMAGE.PROTEIN_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.APP.GREEN_EMPTY}></Image>
      );
  };
  const renderCarbsItem = item => {
    console.log('rendercarbsitem==', item);
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.CARBS_IMAGE.CARBS_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.CARBS_IMAGE.CARBS_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.CARBS_IMAGE.CARBS_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.CARBS_IMAGE.CARBS_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image
          style={styles.bucketImg_new}
          source={images.APP.RED_EMPTY}></Image>
      );
  };
  const CameraModalContent = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBarCodeScannerVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <View
          style={{
            marginTop: windowHeight / 18.5,
            height: windowHeight,
            width: windowWidth,
          }}>
          <Header onBackPress={() => setBarcodeVisible(false)} />

          <QRCodeScanner
            onRead={barcodeReceived}
            showMarker={true}
            markerStyle={{
              borderWidth: 2,
              width: 250,
              height: 250,
              borderColor: 'green',
              borderRadius: 5,
              marginTop: -windowHeight / 7,
            }}
            cameraStyle={{
              height: windowHeight / 1.12,
              width: windowWidth,
            }}
            flashMode={RNCamera.Constants.FlashMode.auto}
          />
        </View>
      </Modal>
    );
  };
  const onTouchOutsideScannedFoodModal = () => {
    setWillInflateScannedFoodModal(false);
  };
  const ScannedFoodInfoModal = () => {
    return (
      <DialogView
        onTouchOutside={() => onTouchOutsideScannedFoodModal()}
        willInflate={willInflateScannedFoodModal}
        onBackPress={() => onTouchOutsideScannedFoodModal()}
        children={ScannedFoodInfoModalContent()}></DialogView>
    );
  };
  const ScannedFoodInfoModalContent = () => {
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
          <TouchableOpacity onPress={() => onTouchOutsideScannedFoodModal()}>
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
            Add Food
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
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              color: colors.black,
            }}>
            Are you sure you would like to add this food to
            <Text
              style={[globalStyles.underline_greendark, globalStyles.font20]}>
              {` Meal ` + mealNum + '?'}
            </Text>
          </Text>

          <View style={styles.favmealsC}>
            <View style={styles.mealc}>
              <View style={{flex: 0.65}}>
                <View style={globalStyles.flex_row}>
                  <ImageBackground
                    source={
                      scannedFoodDetails
                        ? {uri: scannedFoodDetails[0]?.photo?.thumb}
                        : images.PROFILE.CHICKEN
                    }
                    borderRadius={10}
                    style={styles.mealimg_s}></ImageBackground>
                  <View
                    style={{
                      width: 120,
                    }}>
                    {foodCarbsArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.red,
                          ]}>
                          {`Carbs:`}
                        </Text>

                        <FlatList
                          data={foodCarbsArray}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={item => renderCarbsItem(item)}></FlatList>
                      </View>
                    )}
                    {foodFatArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.orange,
                          ]}>
                          {`Fats:`}
                        </Text>

                        <FlatList
                          data={foodFatArray}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={item => renderFatItem(item)}></FlatList>
                      </View>
                    )}
                    {foodProteinArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.green,
                          ]}>
                          {`Protein:`}
                        </Text>

                        <FlatList
                          data={foodProteinArray}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={item =>
                            rendeProteinItem(item)
                          }></FlatList>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <View style={{flex: 0.35}}>
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
                    <Text style={styles.lbs}>
                      {scannedFoodDetails && scannedFoodDetails[0]?.nf_calories}
                    </Text>
                  </GradientCircularProgress>
                  <Text
                    style={[
                      //styles.bucketSize,
                      globalStyles.mt_10,
                      // styles.headingtextBlack,
                      {fontSize: 13},
                    ]}>
                    {strings.calories}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onAddPress}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>ADD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onTouchOutside}
            style={[
              globalStyles.button_secondarywithoutBlackBack,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderMealView = () => {
    return (
      <FlatList
        horizontal
        extraData={isUpdating}
        showsHorizontalScrollIndicator={false}
        data={mealMainArray}
        renderItem={MealItem}></FlatList>
    );
  };
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
        <View style={styles.favmealsC}>
          <View style={styles.mealc}>
            <View style={styles.flex_68}>
              <Text numberOfLines={1} style={styles.melaname}>
                {name}
              </Text>
              <Text numberOfLines={1} style={styles.mealcategory}>
                {quantity + ` ` + unit}
              </Text>

              <View style={[globalStyles.flex_row, {alignItems: 'center'}]}>
                <ImageBackground
                  source={{uri: image}}
                  borderRadius={10}
                  style={styles.mealimg}></ImageBackground>

                <View style={{marginLeft: 10}}>
                  {fat.length > 0 && (
                    <View style={styles.mealinnerc}>
                      <View style={{flex: 0.35}}>
                        <Text
                          style={[
                            styles.forgot_pass_heading,
                            styles.whydesc,
                            styles.orange,
                            globalStyles.mt_0,
                            {fontSize: 12},
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
                          {fat.map(item => renderFatItem(item))}
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
                            {fontSize: 12},
                          ]}>
                          {`Carbs:`}
                        </Text>
                      </View>
                      <View style={{flex: 0.65}}>
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          contentContainerStyle={{alignItems: 'center'}}>
                          {carbs.map(item => (
                            <Carbs value={item} />
                          ))}
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
                            {fontSize: 12},
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
            <View style={styles.flex_32_aligncenter}>
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
                <Text style={[globalStyles.mt_0, styles.headingtextBlack]}>
                  {strings.calories}
                </Text>
              </View>

              {/* <Pressable
                style={styles.minusc}
                onPress={() => [
                  setUpdating(!isUpdating),
                  onSetSelectedItemPress(item?.item),
                  (tempItem = item?.item),
                  (temp_food_id_ = id),
                  (clickedIndex = item?.index),
                  //onEditButtonClick(item.item, item.index),
                ]}>
                <Image style={styles.heart} source={images.APP.PENCIL}></Image>
              </Pressable> */}

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

              <TouchableOpacity
                //onPress={() => onDeleteFoodPress(item)}
                style={styles.minusc}>
                <Image
                  style={styles.minusimage}
                  source={images.APP.TRASH}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const DefautView = () => {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={150}
        keyboardShouldPersistTaps="always"
        style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />

        <View style={styles.flex}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Image
              style={{
                height: 30,
                width: 30,
                marginVertical: 10,
                resizeMode: 'contain',
                alignSelf: 'flex-start',
              }}
              source={images.APP.LIKEDHEART}></Image>
            <Text style={[styles.why_heading, styles.font_23]}>
              {strings.myFav}
            </Text>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                {alignSelf: 'flex-start'},
              ]}>
              {strings.favFoodDesc}
            </Text>

            {selectedFoods.length > 0 && (
              <TouchableOpacity
                onPress={() => getMealDetails()}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_30,
                ]}>
                <Text style={globalStyles.btn_heading_black}>ADD FOODS</Text>
              </TouchableOpacity>
            )}
            <Text
              onPress={() => [
                (tempFoodArray = []),
                setCombinedFood([]),
                navigation.navigate('EditFavoriteFoods'),
              ]}
              style={styles.edit_fav}>
              Edit My Favorites
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                backgroundColor: colors.white,
                //padding: 10,
                paddingHorizontal: 30,
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextInput
                value={searchValue}
                onChangeText={setSearchValueAndPerformSearch}
                placeholder="Search your food...."
                style={[styles.input, {marginTop: 0}]}
              />
              <TouchableOpacity
                //  onPress={() => searchFood()}
                // onPress={() => [getCustomFoodList()]}
                style={{
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.APP.SEARCH}
                  resizeMode="cover"
                  style={{height: 20, width: 20}}></Image>
              </TouchableOpacity>
            </View>
          </View>

          {TopResults()}
        </View>
      </KeyboardAwareScrollView>
    );
  };
  return (
    <>
      {DefautView()}
      {AddFoodModal()}
      {ScannedFoodInfoModal()}
      {CameraModalContent()}
      <Loader isLoading={isLoading} />
    </>
  );
};
export default FavoriteFoods;
