import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../component/loader';

import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../MealView/style';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import DialogView from '../../component/dialog';
import dummyContent from '../../constants/dummyContent';
import {addMealToFavRequest} from '../../redux/action/MealAction';
import {GradientCircularProgress} from 'react-native-circular-gradient-progress';
import moment from 'moment';
import Header from '../../component/headerWithBackControl';
import {customFoodInfoRequest} from '../../redux/action/CustomFoodAction';
import {mealUpdateRequest} from '../../redux/action/MealAction';
import {addFoodIdRequest, clearFoodId} from '../../redux/action/FoodIdAction';
import {
  addFoodToFavRequest,
  removeFoodToFavRequest,
} from '../../redux/action/AddFoodToFavAction';
let quantityArray = [];
var foodIdArray = [];
var payload = null;
var clickedIndex = null;
var today = new Date();
var date = moment(today).format('L');
const DELETE_FOOD = 'DELETE_FOOD';
const GET_FOODS = 'GET_FOODS';
var call_type = null;

var temp = 0;
var spliceArray = null;
const MacroEstimation = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  const isLoading = useSelector(
    state => state.other.addCustomFoodReducer.showLoader,
  );
  const userData = useSelector(state => state.other.loginReducer.userData);
  const draftFoodsData =
    useSelector(state => state.food.addFoodIdReducer.data) || null;
  const [willInflate, setWillInflate] = useState(false);
  const [mealNum, setMealNum] = useState(0);

  const [alreadyFavorite, setAlreadyFav] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [mealMainArray, setMealMainArray] = useState([]);
  const [carbsArray, setcarbsArray] = useState([]);
  const [fatArray, setfatArray] = useState([]);
  const [proteinArray, setproteinArray] = useState([]);
  const [foodId] = useState(props.route.params.foodId);
  const [food_qty] = useState(props.route.params.qty);
  const [MEAL_ID, setMEALID] = useState(props.route.params.mealId);
  const [userId, setUserId] = useState(userData ? userData.id : null);
  const [selectedFoodItem, setSelectedItemFood] = useState(null);
  const [foodFatArray, setFoodFatArray] = useState([]);
  const [foodCarbsArray, setFoodCarbsArray] = useState([]);
  const [foodProteinArray, setFoodAProteinrray] = useState([]);

  useEffect(() => {
    call_type = GET_FOODS;
    const unsubscribe = navigation.addListener('focus', () => {
      quantityArray = [];
      foodIdArray = [];
      payload = {
        uid: userId,
        food_id: foodId.toString(),
        date: date,
        quantity: food_qty.toString(),
      };

      getMealDetails(payload);
    });
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      quantityArray = [];
      foodIdArray = [];
      unsubscribe;
      backHandler;
    };
  }, []);

  const getMealDetails = api_payload => {
    setTimeout(() => {
      console.log('getMealDetails.payload', api_payload);
      dispatch(customFoodInfoRequest(api_payload, onS, onF));
    }, 100);
  };

  const onS = resolve => {
    const {meal, macro, favorite_meal, meal_number} = resolve.data;
    console.log('meal.length==', meal.length);
    setMealNum(meal_number);
    setMealMainArray(meal);
    if (call_type == GET_FOODS) {
      meal.forEach(item => {
        quantityArray.push(item.quantity);
        foodIdArray.push(item.id);
      });
    }

    if (favorite_meal == 1) setAlreadyFav(true);
    else setAlreadyFav(false);
    setcarbsArray(macro.carbs);
    setfatArray(macro.fat);
    setproteinArray(macro.protein);
  };

  const onF = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const backPress = () => {
    navigation.goBack();
  };

  const onDonePress = () => {
    mealUpdate();
  };

  const mealUpdate = () => {
    setWillInflate(false);
    setLoading(true);
    let payload = {
      uid: userId,
      food_id: foodIdArray.toString(),
      quantity: quantityArray.toString(),

      meal_id: MEAL_ID,
    };
    dispatch(mealUpdateRequest(payload, onSS, onFF));
  };
  const onSS = async resolve => {
    const {id, favorite} = resolve.data;
    if (favorite == '1') setAlreadyFav(true);
    else if (favorite == '') setAlreadyFav(false);
    else setAlreadyFav(false);
    setLoading(false);

    payload = {
      uid: userId,
      food_id: foodIdArray.toString(),
      date: date,
      quantity: quantityArray.toString(),
    };

    if (spliceArray) {
      setMealMainArray(spliceArray);
      if (spliceArray.length == 0) {
        navigation.goBack();
        return;
      }
    }

    getMealDetails(payload);
    setTimeout(() => {
      quantityArray = [];
      foodIdArray = [];
    }, 100);
  };

  const onFF = reject => {
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
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
    dispatch(clearFoodId());
    setTimeout(() => {
      backPress();
    }, 100);
  };
  const onTouchOutside = () => {
    setWillInflate(!willInflate);
  };

  const updateServingsThroughPeiceQtyBasis = updatedQty => {
    var newQ = updatedQty / temp;
    const {carbs, fat, protein, carbs_value, fat_value, protein_value} =
      selectedFoodItem;
    setFoodAProteinrray(returnBucketArray(protein_value * newQ, 20, true));
    setFoodFatArray(returnBucketArray(fat_value * newQ, 10));
    setFoodCarbsArray(
      returnBucketArray(parseInt(carbs_value * newQ), 20, true),
    );
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
    setUpdating(!isUpdating);
  };
  const HeaderInfo = () => {
    return (
      <View
        style={[
          globalStyles.center,
          globalStyles.padding_10_hor,
          globalStyles.flex_row,
          globalStyles.justifyContent_space_between,
          globalStyles.mt_30,
        ]}>
        <View>
          <Text style={[styles.why_heading, globalStyles.font25]}>
            {global.favMealName}
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
    console.log('rendeCarbsItem=', item);
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
            style={[styles.forgot_pass_heading, styles.whydesc, styles.red]}>
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
            style={[styles.forgot_pass_heading, styles.whydesc, styles.orange]}>
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
            style={[styles.forgot_pass_heading, styles.whydesc, styles.green]}>
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
  const Modal = () => {
    return (
      <DialogView
        onTouchOutside={() => console.log('onTouchOutside')}
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
            Edit Food
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
              <Text style={[styles.why_heading, globalStyles.font20]}>
                {selectedFoodItem?.name}
              </Text>

              <SelectDropdown
                data={dummyContent.piece}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem);
                  //setFoodPieceCount(selectedItem);
                  updateServingsThroughPeiceQtyBasis(selectedItem);
                  updateQty(selectedItem);
                }}
                defaultButtonText={
                  selectedFoodItem?.quantity + selectedFoodItem?.unit
                }
                //defaultButtonText={foodPieceCount + servingUnit}
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
                  <Text style={styles.lbs}>
                    {parseInt(selectedFoodItem?.calories)}
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

          <View style={styles.favmealsCC}>
            <View style={styles.mealc}>
              <View style={{flex: 1, marginRight: 10}}>
                <View style={[globalStyles.flex_row, {marginRight: 10}]}>
                  <ImageBackground
                    source={{uri: selectedFoodItem?.image}}
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
                        <View
                          style={{
                            flex: 0.6,
                            height: 50,
                            marginRight: 10,
                          }}>
                          <FlatList
                            data={foodCarbsArray}
                            horizontal
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
            onPress={onDonePress}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>ACCEPT CHANGES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onTouchOutside()}
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
  const RenderMealView = () => {
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
    } = item.item;
    return (
      <View style={styles.mealitemc}>
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
                  style={styles.mealimg}></ImageBackground>

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
                    styles.headingtextBlack,
                  ]}>
                  {strings.calories}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header
          onBackPress={() => {
            draftFoodsData ? discardAlert() : backPress();
          }}
        />
        <ScrollView>
          {HeaderInfo()}
          {RenderMealView()}

          <Text
            style={[
              globalStyles.textAlignCenter,
              styles.white,
              globalStyles.mt_20,
              globalStyles.font17,
            ]}>
            {strings.totalBuckets}
          </Text>
          <View style={[globalStyles.padding_20_hor, globalStyles.mt_30]}>
            {carbsArray.length > 0 && CarbsBucketView()}
            {fatArray.length > 0 && FatBucketView()}
            {proteinArray.length > 0 && ProteinBucketView()}
          </View>
        </ScrollView>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            backgroundColor: 'transparent',
            height: 80,
            width: 100,
            alignSelf: 'flex-end',
            alignContent: 'center',
          }}>
          <Text
            onPress={() => [navigation.goBack()]}
            style={globalStyles.btn_heading}>
            DONE
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {DefautView()}
      {Modal()}
      <Loader isLoading={isLoading || isLoadingFav || Loading} />
    </>
  );
};
export default MacroEstimation;
