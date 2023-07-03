///////updated code 30 may 2022
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {useNavigation} from '@react-navigation/native';
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
import {getFoodsRequest} from '../../redux/action/FoodListAction';
import {GradientCircularProgress} from 'react-native-circular-gradient-progress';
import {
  addFoodToFavRequest,
  removeFoodToFavRequest,
} from '../../redux/action/AddFoodToFavAction';
import {addCustomFoodRequest} from '../../redux/action/CustomFoodAction';
import Loader from '../../component/loader';
import Indicator from '../../component/buttonIndicator';
import {RNCamera} from 'react-native-camera';
import api from '../../constants/api';
import {
  commonFoodDetails,
  brandedFoodDetails,
} from '../../redux/webservice/FoodDetailService';
var mealNum = 0;
let foodIdSending = null;
let qtyForSending = null;
var today = new Date();
var addFoodPayload = null;
var updatedCarbs = null;
var updatedFat = null;
var updatedProtein = null;
var selectedItemServingWeight = null;
var defaultServingWeight = 0;
var customFoods = [];
var foodId = '';
var userId = '';
var getCustomFoodListPayload = {id: userId, date: '', search: ''};
const AddFoods = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  foodIdSending = props?.route?.params?.foodId;
  qtyForSending = props?.route?.params?.qty;
  const [isUpdating, setUpdating] = useState(false);
  const userData = useSelector(state => state.other.loginReducer.userData);
  const cameraRef = useRef();
  const [willInflate, setWillInflate] = useState(false);
  const [willInflateScannedFoodModal, setWillInflateScannedFoodModal] =
    useState(false);
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
  const [isBarCodeScannerVisible, setBarcodeVisible] = useState(
    props?.route?.params?.isScanning ? props?.route?.params?.isScanning : false,
  );
  const [isLoading, setLoading] = useState(false);
  const [scannedFoodDetails, setScanedFoodDetails] = useState(null);
  const [CombinedFood, setCombinedFood] = useState([]);
  const [measurements, setMeasurments] = useState([]);
  const [is_customFood, setCustomFoodOrNot] = useState(false);
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    const focusSub = navigation.addListener('focus', () => {
      getCustomFoodList();
    });
    return () => {
      focusSub;
    };
  }, []);

  const getCustomFoodList = async () => {
    customFoods = [];
    getCustomFoodListPayload = {
      id: userId,
      date: await Utility.getInstance().getCurrentDate(),
      search: global.searchFoodStr ? global.searchFoodStr : searchValue,
    };
    setLoading(true);
    dispatch(getFoodsRequest(getCustomFoodListPayload, onS, onF));
  };

  const onS = resolve => {
    let customFoodData = resolve.data.food;
    mealNum = resolve.data.meal_number;

    customFoods = customFoodData;
    searchFood();
  };

  const onF = reject => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const clearGlobalSearch = async () => {
    global.searchFoodStr = '';
  };
  const searchFood = async () => {
    setLoading(true);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-user-jwt': userData && userData.nutritionix_user_jwt,
      'x-app-id': userData && userData.nutrition_app_id,
      'x-app-key': userData && userData.nutrition_app_key,
    });

    let url = global.searchFoodStr
      ? `https://trackapi.nutritionix.com/v2/search/instant?branded=true&common=true&detailed=true&query=` +
        global.searchFoodStr +
        `&self=false`
      : `https://trackapi.nutritionix.com/v2/search/instant?branded=true&common=true&detailed=true&query=` +
        getCustomFoodListPayload.search +
        `&self=false`;
    console.log('searchfood.payload>>>', url);
    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          let brandedFoods = data?.branded;
          console.log('brandedFoods.data>>>', brandedFoods);
          let commonFoods = data?.common;
          let concatedFoods = commonFoods.concat(brandedFoods); //lets combine alltypes of foods.

          // let foodsData = '';
          // for (let index = 0; index < concatedFoods.length; index++) {
          //   let foodName = concatedFoods[index].food_name;
          //   foodsData += foodName + '/n';
          // }
          ///setCombinedFood(customFoods.concat(concatedFoods));
          setCombinedFood(concatedFoods);
          // if (!Utility.getInstance().isEmpty(foodsData)) {
          //   setTimeout(() => {
          //     getSelectedFoodDetails(
          //       customFoods,
          //       Utility.getInstance().isEmpty(foodsData)
          //         ? getCustomFoodListPayload.search
          //         : foodsData,
          //     );
          //   }, 1000);
          // } else {
          //   setCombinedFood(customFoods);
          // }
        }
      })
      .catch(e => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCommonFoodDetails = async food_name => {
    setLoading(true);
    await commonFoodDetails(userData, food_name)
      .then(data => {
        setFoodDetailsToAddModal(data);
        disableLoader();
        console.log('getCommonFoodDetails.data==', data);
      })
      .catch(e => {
        Utility.getInstance().inflateToast(
          'Something went wrong please try again after sometime',
        );
        setCombinedFood([]);
        disableLoader();
        console.log('getCommonFoodDetails.catch==', e);
      });
  };
  const getBrandedFoodDetails = async food_id => {
    setLoading(true);
    await brandedFoodDetails(userData, food_id)
      .then(data => {
        setFoodDetailsToAddModal(data);
        disableLoader();
        console.log('getBrandedFoodDetails.data==', data);
      })
      .catch(e => {
        Utility.getInstance().inflateToast(
          'Something went wrong please try again after sometime',
        );
        disableLoader();
        setCombinedFood([]);
        console.log('getBrandedFoodDetails.catch==', e);
      });
  };
  // const onPlusPress = food_name => {
  //   console.log('onPlusPress.food_name==', food_name);
  //   const headers = new Headers({
  //     'Content-Type': 'application/json',
  //     'x-user-jwt': userData && userData.nutritionix_user_jwt,
  //     'x-app-id': userData && userData.nutrition_app_id,
  //     'x-app-key': userData && userData.nutrition_app_key,
  //   });
  //   fetch(api.GET_FOOD_DETAILS + food_name, {
  //     method: 'GET',
  //     headers: headers,
  //     // body: JSON.stringify({
  //     //   query: food_name,
  //     // }),
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('onPlusPress.resp===', JSON.stringify(data));
  //       setLoading(false);
  //       if (data?.foods) {
  //         setFoodDetailsToAddModal(data?.foods[0]);
  //       }
  //       // if (data?.foods) {
  //       //   const filteredArray = data?.foods.filter(
  //       //     (v, i, a) => a.findIndex(v2 => v2.food_name === v.food_name) === i,
  //       //   );

  //       //   console.log('flexrererrer=', filteredArray);
  //       //   let searchNew = global.searchFoodStr
  //       //     ? global.searchFoodStr
  //       //     : searchValue;
  //       //   if (searchNew == 'Turkey') {
  //       //     let newArray = filteredArray.splice(1);
  //       //     setCombinedFood(customFoodArray.concat(newArray));
  //       //   } else {
  //       //     setCombinedFood(customFoodArray.concat(filteredArray));
  //       //   }
  //       // }
  //     })
  //     .catch(e => {
  //       Utility.getInstance().inflateToast(
  //         'Something went wrong please try again after sometime',
  //       );
  //       setCombinedFood([]);
  //     })
  //     .finally(() => {
  //       disableLoader();
  //     });
  // };

  const setFoodDetailsToAddModal = item => {
    console.log(
      'onPplusPress==setFoodDetailsToAddModal.item.in===',
      JSON.stringify(item.nix_item_id),
    );

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
      id,
      alt_measures,
      serving_weight_grams,
      customFood,
      updated_at,
    } = item;
    if (nix_item_id) {
      setMeasurments('');
    }

    addFoodPayload = {
      ...item,
      created_by: parseInt(userId),
      name: food_name,
      calories: parseFloat(nf_calories),
      carbs: parseFloat(nf_total_carbohydrate),
      fat: parseFloat(nf_total_fat),
      protein: parseFloat(nf_protein),
      base_food_details: JSON.stringify({
        base_calories: parseFloat(nf_calories),
        // base_carbs: Math.round(nf_total_carbohydrate),
        // base_fat: Math.round(nf_total_fat),
        // base_protein: Math.round(nf_protein),
        base_carbs: parseFloat(nf_total_carbohydrate),
        base_fat: parseFloat(nf_total_fat),
        base_protein: parseFloat(nf_protein),
      }),
      description: note,
      fiber: parseFloat(nf_dietary_fiber),
      quantity: parseFloat(serving_qty),
      unit: serving_unit,
      image: photo.thumb,
      food_id: nix_item_id
        ? nix_item_id
        : food_name.replace(/ /g, '') +
          serving_unit.replace(/ /g, '') +
          serving_qty +
          parseFloat(nf_protein) +
          parseFloat(nf_total_carbohydrate),
      measurement: '',
      updated_at: parseInt(updated_at),
      serving_weight_grams: serving_weight_grams,
      base_qty: parseFloat(serving_qty ? serving_qty : 1),
    };
    if (serving_weight_grams) {
      defaultServingWeight = serving_weight_grams;
    }
    setFoodPieceCount(serving_qty);

    //setFoodPieceCount(1); //Jb
    setServingUnit(serving_unit);
    setFoodName(food_name);
    setFoodImg(photo.thumb);
    setFoodCaloriesCount(Math.round(nf_calories));
    setCustomFoodOrNot(customFood);
    foodId = id;
    if (customFood) {
      setMeasurments('');
      updateServingsThroughPeiceQtyBasis(serving_qty);
      //setWillInflate(true);
    } else {
      if (serving_weight_grams) {
        selectedItemServingWeight = {
          // serving_weight: serving_weight_grams / serving_qty, //Jb
          serving_weight: serving_weight_grams,
          measure: serving_unit,
        };
        console.log('is customFood==', customFood);
        console.log('alt_measures==', alt_measures);
        console.log('Payload=====', JSON.stringify(addFoodPayload));
        // updateServingsThroughMeasurment(
        //   {
        //     serving_weight: serving_weight_grams / serving_qty,
        //     measure: serving_unit,
        //   },
        //   serving_qty,
        // );
        // updateServingsThroughMeasurment(selectedItemServingWeight, 1); //Jb
        updateServingsThroughMeasurment(selectedItemServingWeight, serving_qty); //Jb
        if (alt_measures)
          if (alt_measures != '' && alt_measures.length > 0) {
            setMeasurments(
              Utility.getInstance().removeDuplicates(alt_measures),
            );
          } else {
            setMeasurments('');
          }
      } else {
        setMeasurments('');
        updateServingsThroughPeiceQtyBasis(serving_qty);
      }

      //setWillInflate(true);
    }
    setWillInflate(true);
    //return;
  };
  const manipulateMeasurments = () => {
    let data = measurements.find(item => item.measure == servingUnit);

    if (data) {
      if (
        addFoodPayload.name == 'milkshake' ||
        addFoodPayload.name == 'milkshakes'
      ) {
        const target = measurements.find(obj => obj.measure == servingUnit);
        measurements.indexOf(target);

        const source = {
          serving_weight: defaultServingWeight,
          measure: servingUnit,
          seq: 1,
          qty: addFoodPayload.base_qty,
        };
        measurements[measurements.indexOf(target)] = Object.assign(
          target,
          source,
        );
        return JSON.stringify(measurements);
      } else {
        return JSON.stringify(measurements);
      }
    } else {
      measurements.push({
        serving_weight: defaultServingWeight,
        measure: servingUnit,
      });
      return JSON.stringify(measurements);
    }
  };
  const onAddPress = () => {
    if (foodPieceCount == 0) {
      Utility.getInstance().inflateToast('Please enter ammount');
      return;
    }
    addFoodPayload = {
      ...addFoodPayload,
      carbs: Math.round(updatedCarbs),
      fat: Math.round(updatedFat),
      protein: Math.round(updatedProtein),
      quantity: foodPieceCount,
      unit: servingUnit,
      calories: isNaN(foodCaloriesCount) ? 0 : Math.round(foodCaloriesCount),
      // base_qty:parseInt(serving_qty ? serving_qty : 1),
      measurement: measurements.length > 0 ? manipulateMeasurments() : '',
      // serving_weight_grams:
      //   foodPieceCount == 1
      //     ? defaultServingWeight / temp
      //     : defaultServingWeight / foodPieceCount,
      serving_weight_grams: defaultServingWeight,
    };
    console.log(
      'onAddPress payload==',
      JSON.stringify(addFoodPayload),
      'updatedCarbs==',
      updatedCarbs,
      'updatedProtein==',
      updatedProtein,
      'updatedFat==',
      updatedFat,
    );

    setWillInflate(false);
    //return;
    if (addFoodPayload?.customFood) {
      let foodId = addFoodPayload?.id;
      var tempFoodCount = foodPieceCount;
      setTimeout(() => {
        setFoodPieceCount(0);
        global.backRoute = 'AddMeal';
        setSearchValue('');
        navigation.navigate('MealView', {foodId, qty: tempFoodCount});
      }, 1000);
    } else {
      setLoading(true);
      setTimeout(() => {
        dispatch(addCustomFoodRequest(addFoodPayload, onSS, onFF));
      }, 1000);
    }
  };

  const updateServingsThroughMeasurment = (selectedItem, foo_piece_Count) => {
    const {carbs, fat, protein, calories} = addFoodPayload;

    // console.log(
    //   'updateServingsThroughMeasurment.data==>',
    //   selectedItem,
    //   foo_piece_Count,
    //   carbs,
    //   parseFloat(selectedItem?.serving_weight) *
    //     (Number(foo_piece_Count) / addFoodPayload?.base_qty),
    //   (parseFloat(selectedItem?.serving_weight) *
    //     (Number(foo_piece_Count) / addFoodPayload?.base_qty)) /
    //     defaultServingWeight,
    // );
    const value =
      selectedItem?.measure == 'g'
        ? (1 * Number(foo_piece_Count)) / defaultServingWeight
        : (parseFloat(selectedItem?.serving_weight) *
            (Number(foo_piece_Count) / addFoodPayload?.base_qty)) /
          defaultServingWeight;
    // setFoodAProteinrray(
    //   returnBucketArray(Math.round(protein) * value, 20, true),
    // );
    // setFoodCarbsArray(returnBucketArray(Math.round(carbs) * value, 20, true));
    // setFoodFatArray(returnBucketArray(Math.round(fat) * value, 10, false));
    setFoodAProteinrray(returnBucketArray(protein * value, 20, true));
    setFoodCarbsArray(returnBucketArray(carbs * value, 20, true));
    setFoodFatArray(returnBucketArray(fat * value, 10, false));
    setFoodCaloriesCount(value * Math.round(calories));
    // updatedCarbs = Math.round(carbs) * value;
    // updatedFat = Math.round(fat) * value;
    // updatedProtein = Math.round(protein) * value;
    updatedCarbs = carbs * value;
    updatedFat = fat * value;
    updatedProtein = protein * value;
    console.log(
      'updateServingsThroughMeasurment.data==>',
      'carbs, fat, protein=>',
      carbs,
      fat,
      protein,
      'updatedCarbs, updatedFat, updatedProtein=>',
      updatedCarbs,
      updatedFat,
      updatedProtein,
    );
  };
  const updateServingsThroughPeiceQtyBasis = updatedQty => {
    var newQ = updatedQty / addFoodPayload?.base_qty;
    const {carbs, fat, protein, calories} = addFoodPayload;
    setFoodAProteinrray(
      returnBucketArray(Math.round(protein) * newQ, 20, true),
    );
    setFoodFatArray(returnBucketArray(Math.round(fat) * newQ, 10, false));
    setFoodCarbsArray(returnBucketArray(Math.round(carbs) * newQ, 20, true));
    setFoodCaloriesCount(newQ * Math.round(calories));

    updatedCarbs = Math.round(carbs) * newQ;
    updatedFat = Math.round(fat) * newQ;
    updatedProtein = Math.round(protein) * newQ;
  };

  const returnBucketArray = (totalvalue, type, isProtein) => {
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

  const setSearchValueAndPerformSearch = value => {
    setSearchValue(value);

    if (!value) {
      clearGlobalSearch();
      setCombinedFood([]);
    }
  };
  useEffect(() => {
    if (searchValue.length > 2) {
      getCustomFoodList();
    }
  }, [searchValue]);

  const backPress = () => {
    clearGlobalSearch();
    if (global.backRoute == 'NewMeal') {
      navigation.navigate('NewMeal');
    } else {
      console.log('NONADDMEAL');
      let foodId = foodIdSending;

      navigation.navigate(global.backRoute, {foodId, qty: qtyForSending});
    }
    console.log('NONADDMEAL');
    let foodId = foodIdSending;

    // navigation.navigate(
    //   global.backRoute ? global.backRoute : navigation.goBack(),
    //   {foodId, qty: qtyForSending},
    // );
  };
  const barcodeReceived = async e => {
    setTimeout(() => {
      setMeasurments('');
      setBarcodeVisible(false);
      setTimeout(() => {
        fetchFoodDetailsThroughBarcode(e.data);
      }, 700);
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
        console.log(
          'fetchFoodDetailsThroughBarcode.data',
          JSON.stringify(data),
        );
        setLoadingSearch(false);
        if (data.message) {
          Utility.getInstance().inflateToast(data.message);
          return;
        }
        if (data) {
          if (data?.foods) {
            setFoodDetailsToAddModal(data?.foods[0]);
          }
        }
      })
      .catch(e => {
        console.log('fetchFoodDetailsThroughBarcode.error', JSON.stringify(e));
        setLoadingSearch(false);
        Utility.getInstance().inflateToast(
          'Something went Wrong, Please try again after some time.',
        );
      });
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
    console.log('addCustomFoodRequest.reject', reject);
    disableLoader();
    addFoodPayload = null;
    Utility.getInstance().inflateToast(reject);
  };

  const onCustomFoodPress = () => {
    clearGlobalSearch();
    navigation.navigate('CustomFood');
  };
  const onFavoriteFoodPress = () => {
    clearGlobalSearch();
    navigation.navigate('FavoriteFoods');
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
      nix_item_id,
    } = item.item;
    return (
      <View
        style={[
          styles.addfoodc,
          {
            backgroundColor:
              item?.index % 2 == 0 ? colors.oddBackground : colors.white,
          },
        ]}>
        <View style={[styles.myfavlistcontainerchild, {flex: 0.72}]}>
          <Image
            style={styles.image}
            source={photo ? {uri: photo.thumb} : images.SPLASH.SPLASH}></Image>
          <View>
            <Text numberOfLines={2} style={[{marginRight: 80}, styles.ml_1]}>
              {Utility.getInstance().capitalize(food_name)}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={[styles.ml_15, {marginRight: 80}]}>
                {serving_qty + ` ` + serving_unit}
              </Text>
              {/* <Text numberOfLines={1} style={[styles.ml_s, {marginRight: 80}]}>
                {brand_name}
              </Text> */}
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.18,
          }}>
          {/* <Pressable>
            <Image style={styles.hearts} source={images.APP.HEART}></Image>
          </Pressable> */}
          <TouchableOpacity
            onPress={async () =>
              nix_item_id
                ? getBrandedFoodDetails(nix_item_id)
                : getCommonFoodDetails(food_name)
            }
            //  onPress={() => alert(nix_item_id)}
            style={[
              styles.plusc,
              {
                backgroundColor:
                  item?.index % 2 == 0 ? colors.white : colors.offwhite,
              },
            ]}>
            <Image style={styles.pimage} source={images.SIGNUP.PLUS}></Image>
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
            Are you sure you would like to add this food to
            <Text
              style={[globalStyles.underline_greendark, globalStyles.font20]}>
              {` Meal ` + mealNum + '?'}
            </Text>
          </Text>

          <View
            style={[
              styles.addfoodcn,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: 'transparent',
              },
            ]}>
            <View style={{flex: 0.65, backgroundColor: 'transparent'}}>
              {foodName.length > 25 ? (
                <Text numberOfLines={4} style={styles.foodname_s}>
                  {foodName}
                </Text>
              ) : (
                <Text numberOfLines={2} style={styles.foodname}>
                  {foodName}
                </Text>
              )}

              {/* <SelectDropdown
                data={dummyContent.piece}
                onSelect={(selectedItem, index) => {
                  setFoodPieceCount(selectedItem);
                  if (Utility.getInstance().isEmpty(measurements)) {
                    updateServingsThroughPeiceQtyBasis(selectedItem);
                  } else {
                    updateServingsThroughMeasurment(
                      selectedItemServingWeight,
                      selectedItem,
                    );
                  }
                }}
                defaultButtonText={
                  defaultServingWeight
                    ? foodPieceCount
                    : foodPieceCount + servingUnit
                }
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
              /> */}
              <TextInput
                returnKeyType="done"
                keyboardType="decimal-pad"
                //key={foodPieceCount}
                value={foodPieceCount}
                placeholder={foodPieceCount.toString()}
                placeholderTextColor={colors.black}
                onChangeText={selectedItem => {
                  setFoodPieceCount(selectedItem);
                  if (Utility.getInstance().isEmpty(measurements)) {
                    updateServingsThroughPeiceQtyBasis(selectedItem);
                  } else {
                    updateServingsThroughMeasurment(
                      selectedItemServingWeight,
                      selectedItem,
                    );
                  }
                }}
                style={styles.dropdownInput}></TextInput>
            </View>
            <View style={{flex: 0.35, alignItems: 'flex-end'}}>
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
                    {isNaN(foodCaloriesCount)
                      ? 0
                      : Math.round(foodCaloriesCount)}
                  </Text>
                </GradientCircularProgress>
                <Text
                  style={[
                    globalStyles.mt_10,
                    {fontSize: Utility.getInstance().dH(8)},
                  ]}>
                  {strings.calories}
                </Text>
              </View>
            </View>
          </View>

          {!Utility.getInstance().isEmpty(measurements) ? (
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: '-13%',
                },
              ]}>
              <View style={{flex: 0.65}}>
                <SelectDropdown
                  data={measurements}
                  onSelect={(selectedItem, index) => {
                    console.log(
                      'updateServingsThroughMeasurment.selectedItem===',
                      JSON.stringify(selectedItem),
                    );
                    setServingUnit(selectedItem.measure);
                    addFoodPayload.base_qty = selectedItem?.qty;
                    selectedItemServingWeight = {
                      serving_weight: selectedItem?.serving_weight,
                      measure: selectedItem.measure,
                    };

                    updateServingsThroughMeasurment(
                      selectedItemServingWeight,
                      foodPieceCount,
                    );
                  }}
                  defaultButtonText={servingUnit}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem?.measure;
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
                {width: '65%', alignSelf: 'flex-start', marginTop: -20},
              ]}></TextInput>
          )}

          <View style={styles.favmealsC}>
            <View style={styles.mealc}>
              <View style={{flex: 1, marginRight: 10}}>
                <View style={[globalStyles.flex_row, {marginRight: 10}]}>
                  <ImageBackground
                    source={foodImg ? {uri: foodImg} : images.PROFILE.CHICKEN}
                    borderRadius={10}
                    style={styles.mealimg_s}></ImageBackground>
                  <View
                    style={{
                      marginLeft: 10,
                      alignSelf: 'center',
                    }}>
                    {foodCarbsArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View style={{flex: 0.3}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.red,
                            ]}>
                            {`Carbs:`}
                          </Text>
                        </View>
                        <View style={{flex: 0.7, height: 50, marginRight: 10}}>
                          <FlatList
                            data={foodCarbsArray}
                            horizontal
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={item =>
                              renderCarbsItem(item)
                            }></FlatList>
                        </View>
                      </View>
                    )}
                    {foodFatArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View style={{flex: 0.3}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.orange,
                            ]}>
                            {`Fats:`}
                          </Text>
                        </View>
                        <View style={{flex: 0.7, height: 50, marginRight: 10}}>
                          <FlatList
                            data={foodFatArray}
                            horizontal
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={item => renderFatItem(item)}></FlatList>
                        </View>
                      </View>
                    )}
                    {foodProteinArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View
                          style={{
                            flex: 0.3,
                          }}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.green,
                            ]}>
                            {`Protein:`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.7,
                            height: 50,
                            marginRight: 10,
                          }}>
                          <FlatList
                            data={foodProteinArray}
                            horizontal
                            contentContainerStyle={{alignItems: 'center'}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={item =>
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
            onPress={onAddPress}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>ADD</Text>
          </TouchableOpacity>
          {is_customFood && (
            <TouchableOpacity
              onPress={() => [
                (global.searchFoodStr = searchValue),
                setWillInflate(false),

                navigation.navigate('EditCustomFoodMacros', {foodId}),
              ]}
              style={[
                globalStyles.button_secondarywithoutBlackBack,
                globalStyles.center,
                globalStyles.button,
                globalStyles.mt_10,
              ]}>
              <Text style={globalStyles.btn_heading_black}>EDIT</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onTouchOutside}
            style={[
              globalStyles.button_secondarywithoutBlackBack,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_10,
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
            marginTop: Platform.OS == 'android' ? 0 : windowHeight / 18.5,
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
  const DefautView = () => {
    return (
      <KeyboardAwareScrollView
        keyboardDismissMode="on-drag"
        enableOnAndroid={true}
        extraHeight={150}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="always"
        style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header
          profileClick={() => clearGlobalSearch()}
          onBackPress={() => backPress()}
        />

        <View style={styles.flex}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font20]}>
              {strings.sfa}
            </Text>
            {/* <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
              {strings.addfoodDesc}
            </Text> */}
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%',
                backgroundColor: 'transparent',
                paddingVertical: 25,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <TouchableOpacity
                  onPress={onCustomFoodPress}
                  style={styles.minuscBig}>
                  <Image
                    style={styles.codeimage}
                    source={images.SIGNUP.PLUS}></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    marginTop: 8,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 11,
                    color: colors.white,
                  }}>
                  Custom Food
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <TouchableOpacity
                  onPress={onFavoriteFoodPress}
                  style={styles.minuscBig}>
                  <Image
                    style={styles.codeimages}
                    source={images.APP.LIKEDHEART}></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    marginTop: 8,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 11,
                    color: colors.white,
                  }}>
                  Favorite Food
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <TouchableOpacity
                  onPress={() => [clearGlobalSearch(), setBarcodeVisible(true)]}
                  style={styles.minuscBig}>
                  {isLoadingSearch ? (
                    <Indicator isAnimating={isLoadingSearch} />
                  ) : (
                    <Image
                      style={styles.codeimage}
                      source={images.PROFILE.CODE}></Image>
                  )}
                </TouchableOpacity>
                {isLoadingSearch ? (
                  <Text
                    style={{
                      marginTop: 8,
                      fontFamily: 'Poppins-Regular',
                      fontSize: 13,
                      color: colors.white,
                    }}>
                    Processing
                  </Text>
                ) : (
                  <Text
                    style={{
                      marginTop: 8,
                      fontFamily: 'Poppins-Regular',
                      fontSize: 11,
                      color: colors.white,
                    }}>
                    Scan Barcode
                  </Text>
                )}
              </View>
            </View> */}

            <Text
              style={[
                globalStyles.input_heading,
                styles.white,
                globalStyles.font14,
                globalStyles.mt_20,
              ]}>
              {strings.search}
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
                onChangeText={value => setSearchValueAndPerformSearch(value)}
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
            <Text style={[styles.edit_, {marginTop: 10}]}>
              {strings.topresult}
            </Text>
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
export default AddFoods;
