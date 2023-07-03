import React, {useState, useEffect} from 'react';
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
  addCustomFoodRequest,
  deleteCustomFoodRequest,
} from '../../redux/action/CustomFoodAction';
import Loader from '../../component/loader';
import Indicator from '../../component/buttonIndicator';
import {RNCamera} from 'react-native-camera';
import api from '../../constants/api';
var userId = null;
var mealNum = 0;
var tempFoodArray = [];
var today = new Date();
var date = moment(today).format('L');
var addFoodPayload = null;
var temp = 0;
var updatedCarbs = null;
var updatedFat = null;
var updatedProtein = null;
var selectedItemServingWeight = null;
var defaultServingWeight = 0;
const CustomFoods = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [food, setFood] = useState([]);
  const [isUpdating, setUpdating] = useState(false);
  const userData = useSelector(state => state.other.loginReducer.userData);
  const foodIdData = useSelector(state => state.food.addFoodIdReducer.data);
  const [willInflate, setWillInflate] = useState(false);
  const [willInflateScannedFoodModal, setWillInflateScannedFoodModal] =
    useState(false);
  //modal variables
  const [isLoadingSearch, setLoadingSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodImg, setFoodImg] = useState(null);
  const [foodCaloriesCount, setFoodCaloriesCount] = useState(0);
  //const [defaultServingWeight, setDefaultServingWeight] = useState(0);
  const [foodPieceCount, setFoodPieceCount] = useState(0);
  const [foodFatArray, setFoodFatArray] = useState([]);
  const [foodCarbsArray, setFoodCarbsArray] = useState([]);
  const [foodProteinArray, setFoodAProteinrray] = useState([]);
  const [selectedItemFoodId, setSelectedItemFoodId] = useState(null);
  const [servingUnit, setServingUnit] = useState(null);
  const [servingQty, setServingQty] = useState(null);
  const [isBarCodeScannerVisible, setBarcodeVisible] = useState(false);
  const [isCodeScanned, setCodeScanned] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [scannedFoodDetails, setScanedFoodDetails] = useState(null);
  const [CombinedFood, setCombinedFood] = useState([]);
  const [measurements, setMeasurments] = useState([]);
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    const focusSub = navigation.addListener('focus', () => {
      getFoodList();
    });
    return () => {
      focusSub;
    };
  }, []);
  const getFoodList = () => {
    setLoading(true);
    let payload = {
      id: userId,
      date: date,
      search: searchValue,
    };

    dispatch(getFoodsRequest(payload, onSs, onFf));
  };

  const onSs = resolve => {
    console.log('resolve.data===', JSON.stringify(resolve.data));
    const {food} = resolve?.data;
    setTimeout(() => {
      setLoading(false);
    }, 100);
    if (!searchValue) {
      tempFoodArray = food;
    }
    setCombinedFood(food);
  };

  const onFf = reject => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };
  const onMinusPress = ({item}) => {
    setLoading(true);
    const {id} = item;
    console.log('onMinusPress=', JSON.stringify(id));
    let payload = {
      id: id,
    };
    dispatch(deleteCustomFoodRequest(payload, onDeleteSuccess, onDeleteFail));
  };
  const onDeleteSuccess = async resolve => {
    setTimeout(() => {
      setLoading(false);
      getFoodList();
    }, 500);
    console.log('onDeleteSuccess=', JSON.stringify(resolve));
  };
  const onDeleteFail = async reject => {
    Utility.getInstance().inflateToast(reject);
    setTimeout(() => {
      setLoading(false);
    }, 100);
    console.log('onDeleteFail=', JSON.stringify(reject));
  };

  const onAddPress = () => {
    //let foodId = selectedItemFoodId;
    // navigation.navigate('MacroEstimation');
    //navigation.navigate('MealView', {foodId});
    // let payload = {
    //   ...addFoodPayload,
    //   quantity: foodPieceCount,
    // };

    addFoodPayload = {
      ...addFoodPayload,
      carbs: updatedCarbs,
      fat: updatedFat,
      protein: updatedProtein,
      quantity: foodPieceCount,
      unit: servingUnit,
      calories: foodCaloriesCount,
      measurement: measurements.length > 0 ? JSON.stringify(measurements) : '',
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

    setLoading(true);
    setTimeout(() => {
      dispatch(addCustomFoodRequest(addFoodPayload, onSS, onFF));
    }, 1000);
  };

  const updateServingsThroughPeiceQtyBasis = updatedQty => {
    //alert('updateServingsThroughPeiceQtyBasis');
    var newQ = updatedQty / temp;
    const {carbs, fat, protein, calories} = addFoodPayload;
    console.log('updateServingsThroughPeiceQtyBasis.updatedQty==', updatedQty);
    setFoodAProteinrray(returnBucketArray(protein * newQ, 20, true));
    setFoodFatArray(returnBucketArray(fat * newQ, 10));
    setFoodCarbsArray(returnBucketArray(carbs * newQ, 20, true));
    setFoodCaloriesCount(newQ * Math.round(calories));
    // addFoodPayload = {
    //   ...addFoodPayload,
    //   carbs: parseInt(carbs) * parseInt(updatedQty),
    //   fat: parseInt(fat) * parseInt(updatedQty),
    //   protein: parseInt(protein) * parseInt(updatedQty),
    // };
    updatedCarbs = carbs * newQ;
    updatedFat = fat * newQ;
    updatedProtein = protein * newQ;
  };

  // const returnBucketArray = (totalvalue, type) => {
  //   let value = Math.round(totalvalue);
  //   let bucketArray = [];
  //   for (let i = value; i > 0; i -= type) {
  //     if (i < (type == 20 ? 16 : 9)) {
  //       if (i < (type == 20 ? 6 : 4)) {
  //         bucketArray.push(25);
  //         break;
  //       }
  //       if (i < (type == 20 ? 11 : 6)) {
  //         bucketArray.push(50);
  //         break;
  //       }
  //       if (i < (type == 20 ? 16 : 9)) {
  //         bucketArray.push(75);
  //         break;
  //       }
  //     }
  //     bucketArray.push(100);
  //   }
  //   console.log('selectedFoodPeice bucketArray==', bucketArray);
  //   return bucketArray;
  // };
  const returnBucketArray = (totalvalue, type, isProtein = false) => {
    let value = Math.round(totalvalue);
    console.log('returnBucketArray.value==', value);
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
    console.log('value bucketArray==', value);

    console.log('selectedFoodPeice bucketArray==', bucketArray);
    return bucketArray;
  };

  const updateServingsThroughMeasurment = (selectedItem, foo_piece_Count) => {
    console.log('updateServingsThroughMeasurment==');

    const {carbs, fat, protein, calories} = addFoodPayload;
    const value =
      selectedItem?.measure == 'g'
        ? (1 * foo_piece_Count) / defaultServingWeight
        : (parseFloat(selectedItem?.serving_weight) * foo_piece_Count) /
          defaultServingWeight;
    console.log('value==', value);
    setFoodAProteinrray(returnBucketArray(protein * value, 20, true));
    setFoodFatArray(returnBucketArray(fat * value, 10));
    setFoodCarbsArray(returnBucketArray(carbs * value, 20, true));
    setFoodCaloriesCount(value * Math.round(calories));
    updatedCarbs = carbs * value;
    updatedFat = fat * value;
    updatedProtein = protein * value;
  };

  const setSearchValueAndPerformSearch = value => {
    setSearchValue(value);
    if (!value) setCombinedFood(tempFoodArray);
  };
  const onHeartPress = item => {
    const {favorite, id} = item.item;
    let index = item.index;
    if (favorite == 0) {
      addFoodToFav(id);
      food[index].favorite = 1;
    } else {
      removeFoodToFav(id);
      food[index].favorite = 0;
    }
    setFood(food);
    setUpdating(!isUpdating);
  };
  const addFoodToFav = foodId => {
    let payload = {
      uid: userId,
      food_id: foodId,
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
  const backPress = () => {
    navigation.goBack();
    //navigation.navigate('AddFoods');
    // if (global.backRoute == 'AddMeal') {
    //   console.log('ADDMEAL');
    //   navigation.navigate('AddMeal');
    // } else {
    //   console.log('NONADDMEAL');
    //   let foodId = foodIdSending;
    //   console.log('onBaclData=>', {foodId, qty: qtyForSending});
    //   navigation.navigate(global.backRoute, {foodId, qty: qtyForSending});
    // }
  };

  const barcodeReceived = async e => {
    console.log('Barcode: ' + JSON.stringify(e));

    // if (e.type == 'UPC_E') {
    //   console.log('Barcode: ' + e.data);
    //   //console.log('Type: ' + e.type);
    //   fetchFoodDetailsThroughBarcode(e.data);
    //   setCodeScanned(true);
    //   setBarcodeVisible(false);
    // } else {
    //   //console.error('Type: ' + e.type, 'Invalid Item!');
    //   setBarcodeVisible(false);
    //   setTimeout(() => {
    //     InvalidAlert();
    //   }, 500);
    //   return;
    // }
    await setBarcodeVisible(false);
    setTimeout(() => {
      fetchFoodDetailsThroughBarcode(e.data);
    }, 1000);
    // if (e.data) {
    //   fetchFoodDetailsThroughBarcode(e.data);
    //   setBarcodeVisible(false);
    // }
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
    };
    console.log('payload', payload);
    setLoading(true);
    dispatch(addCustomFoodRequest(payload, onSS, onFF));
  };
  const onSS = resolve => {
    var tempFoodCount = foodPieceCount;
    console.log('addCustomFoodRequest.resolve', resolve);
    console.log('tempFoodCount==', tempFoodCount);
    // Utility.getInstance().inflateToast(strings.foodadded);
    disableLoader();
    addFoodPayload = null;
    let foodId = resolve.data.id;
    //foodIdSending = resolve.data.id;

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

  const onTouchOutside = () => {
    setWillInflate(!willInflate);
  };
  const onItemPress = foodId => {
    setSearchValue('');
    setCombinedFood([]);
    navigation.navigate('EditCustomFoodMacros', {foodId});
  };

  const TopResultsItems = item => {
    const {
      food_name,
      serving_unit,
      serving_qty,
      nf_calories,
      photo,
      id,
      brand_name,
    } = item.item;
    return (
      <TouchableOpacity onPress={() => onItemPress(id)} style={styles.addfoodc}>
        <View style={[styles.myfavlistcontainerchild, {flex: 0.75}]}>
          <Image
            style={styles.image}
            source={photo ? {uri: photo.thumb} : images.SPLASH.SPLASH}></Image>
          <View>
            {/* <Text style={styles.ml_15}>{nf_calories + ` Cal`}</Text> */}
            <Text style={styles.ml_15}>{serving_qty + ` ` + serving_unit}</Text>
            <Text numberOfLines={2} style={[{marginRight: 80}, styles.ml_1]}>
              {food_name}
            </Text>
            <Text numberOfLines={1} style={[styles.ml_s]}>
              {brand_name}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.15,
          }}>
          <TouchableOpacity
            onPress={() => onMinusPress(item)}
            style={styles.plusc}>
            <Image
              style={[styles.pimage, {height: 18, width: 18}]}
              source={images.SIGNUP.MINUS}></Image>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
              },
            ]}>
            <View style={{flex: 0.6}}>
              <Text style={styles.foodname}>{foodName}</Text>
              <SelectDropdown
                data={dummyContent.piece}
                //data={dropdownValue}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem);
                  setFoodPieceCount(selectedItem);
                  if (measurements == '') {
                    updateServingsThroughPeiceQtyBasis(selectedItem);
                  } else {
                    updateServingsThroughMeasurment(
                      selectedItemServingWeight,
                      selectedItem,
                    );
                  }
                }}
                // defaultButtonText={
                //   measurements != '' ? foodPieceCount + 'piece' : foodPieceCount
                // }
                defaultButtonText={foodPieceCount}
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
                buttonStyle={styles.dropdownSmall4BtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown4DropdownStyle}
                rowStyle={styles.dropdown4RowStyle}
                rowTextStyle={styles.dropdown4RowTxtStyle}
              />
            </View>
            <View style={{flex: 0.4, alignItems: 'flex-end'}}>
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
                  <Text style={styles.lbs}>{parseInt(foodCaloriesCount)}</Text>
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

          {measurements != '' && (
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                },
              ]}>
              <View style={{flex: 0.6}}>
                <SelectDropdown
                  data={measurements}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                    setServingUnit(selectedItem.measure);
                    selectedItemServingWeight = {
                      serving_weight: selectedItem?.serving_weight,
                      measure: selectedItem.measure,
                    };
                    updateServingsThroughMeasurment(
                      selectedItem,
                      foodPieceCount,
                    );
                    //setFoodPieceCount(selectedItem);
                    //updateServingsThroughPeiceQtyBasis(selectedItem);
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
                          height: 12,
                          width: 12,
                          resizeMode: 'contain',
                          //   transform: [{rotate: '270deg'}],
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
          )}

          <View style={styles.favmealsC}>
            <View style={styles.mealc}>
              <View style={{flex: 1, marginRight: 10}}>
                <View style={[globalStyles.flex_row, {marginRight: 10}]}>
                  <ImageBackground
                    source={foodImg ? {uri: foodImg} : images.PROFILE.CHICKEN}
                    borderRadius={10}
                    style={styles.mealimg_s}></ImageBackground>
                  <View style={{marginLeft: 20}}>
                    {foodCarbsArray.length > 0 && (
                      <View style={styles.mealinnerc}>
                        <View style={{flex: 0.4}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.red,
                            ]}>
                            {`Carbs:`}
                          </Text>
                        </View>
                        <View style={{flex: 0.6, height: 50, marginRight: 10}}>
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
                        <View style={{flex: 0.4}}>
                          <Text
                            style={[
                              styles.forgot_pass_heading,
                              styles.whydesc_new,
                              styles.orange,
                            ]}>
                            {`Fats:`}
                          </Text>
                        </View>
                        <View style={{flex: 0.6, height: 50, marginRight: 10}}>
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
                            flex: 0.4,
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
                            flex: 0.6,
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
              {/* <View style={{flex: 0.35}}>
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
                    <Text style={styles.lbs}>{foodCaloriesCount}</Text>
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
              </View> */}
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
            marginTop: windowHeight / 18.5,
            height: windowHeight,
            width: windowWidth,
          }}>
          <Header onBackPress={() => setBarcodeVisible(false)} />
          {/* <RNCamera
            // googleVisionBarcodeType={'alternate'}
            autoFocus
            style={{height: windowHeight, width: windowWidth}}
            //torchMode={this.state.torchOn ? Camera.constants.TorchMode.on : Camera.constants.TorchMode.off}
            onBarCodeRead={barcodeReceived}
            // onGoogleVisionBarcodesDetected={() =>
            //   alert('onGoogleVisionBarcodesDetected')
            // }
            captureAudio={false}
            // barCodeTypes={[
            //   RNCamera.Constants.BarCodeType.qr,
            //   RNCamera.Constants.BarCodeType.upc_e,
            // ]}
            //ref={cam => this.camera = cam}
            //aspect={Camera.constants.Aspect.fill}
          >
            {({camera, status, recordAudioPermissionStatus}) => {
              if (status !== 'READY')
                return <Text>Connecting................</Text>;
              
            }}
          </RNCamera> */}
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

  const onDiscardMealPress = () => {
    dispatch(clearFoodId());
    setTimeout(() => {
      backPress();
    }, 100);
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

          {/* <View style={styles.addfoodcn}>
            <Text style={styles.foodname}>{scannedFoodDetails?.food_name}</Text>
            <SelectDropdown
              data={dummyContent.piece}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem);
              }}
              defaultButtonText={foodPieceCount + 'piece'}
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
              buttonStyle={styles.dropdownSmall4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View> */}

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
        enableOnAndroid={true}
        keyboardShouldPersistTaps="always"
        extraHeight={150}
        style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />

        <View style={styles.flex}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {`Custom Foods`}
            </Text>
            {/* <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                {marginLeft: -20},
              ]}>
              {strings.customfoodDescFav}
            </Text> */}

            <Text
              style={[
                globalStyles.input_heading,
                styles.white,
                {marginTop: 20},
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
                // onPress={() => searchFood()}
                onPress={() => getFoodList()}
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
            {/* <Text style={[styles.edit_, {marginTop: 10}]}>
              {strings.topresult}
            </Text> */}
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
export default CustomFoods;
