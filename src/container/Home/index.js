import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  StatusBar,
  BackHandler,
  Platform,
  AppState,
  Dimensions,
} from 'react-native';
import ApiConstant from '../../constants/api';
import BucketsLane from '../../component/BucketsLane';
import BottomTabMenu from '../../component/bottomMenu';
const {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../Home/style';
import {prevMealListRequest} from '../../redux/action/PreviousMealAction';
import globalStyles from '../../assets/globalStyles/index.js';
import strings from '../../constants/strings';
import moment from 'moment';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import Loader from '../../component/loader';
import {updateUserInformationRequest} from '../../redux/action/UserProfileInfo';
import {
  addMealRequest,
  favMealListRequest,
} from '../../redux/action/MealAction';
import api from '../../constants/api';
import Tooltip from 'react-native-walkthrough-tooltip';
import dummyContent from '../../constants/dummyContent';
import {weekelyDataRequest} from '../../redux/action/WeekelyDataAction';
import {addVeggiesRequest} from '../../redux/action/VeggiesAction';
import {addWaterRequest} from '../../redux/action/WaterAction';
import MealView from '../../component/MealView';
import MostRecentMealView from '../../component/MostRecentMealView';
import DialogView from '../../component/dialog';
import colorCodes from '../../constants/colorCodes';
import {TextInput} from 'react-native-gesture-handler';
var userId = null;
var today = new Date();
var tempWaterfall = [];
var tempVeganFall = [];

const Home = () => {
  const navigation = useNavigation();
  const toolTipRef = useRef();
  const flatlistRef = useRef();
  const [showTip, setTip] = useState(false);
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [isFeedbackEnteredToday, setIsFeedbackEnteredToday] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isUpdating, setUpdating] = useState(false);
  const userData = useSelector(state => state.other.loginReducer.userData);
  const userWeeklyInstance = useSelector(
    state => state.other.weekelyDataReducer.userData,
  );
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const userWeeklyInstanceIsLoading = useSelector(
    state => state.other.weekelyDataReducer.showLoader,
  );
  const [mealDetails, setMealDetails] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [prevMeals, setPrevMeals] = useState([]);
  const [myMeals, setMyMeals] = useState([]);
  const [isPrefusionClient, setClientStatus] = useState(false);
  const [dateValue, setDate] = useState('');
  const [carbsArray, setCarbsArray] = useState([]);
  const [fatArray, setFatArray] = useState([]);
  const [veggiesArray, setVeggArray] = useState([]);
  const [waterArray, setWaterArray] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [proteinArray, setProteinArray] = useState([]);
  const [tooltipData, setToolTipData] = useState([]);
  const [isMealVisible, SetMealVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [isMostRecentMeals, setMostRecentMeals] = useState(false);
  const [searchMostRecentMeal, setSearchMostRecentMeal] = useState('');
  const [bucketCounts, setBucketCounts] = useState({
    fat: 0,
    protein: 0,
    carbs: 0,
    consumedFat: 0,
    consumedProtein: 0,
    consumedCarbs: 0,
  });

  //d9n6
  useEffect(() => {
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        setDate(date_);
        getUserInstance(date_);
      } else {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();
        setDate(date);
        getUserInstance(date);
      }
    };
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('appStateListener', nextAppState);
        if (nextAppState === 'active') dateSet();
        else if (nextAppState === 'background') clearDateImmediate();
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getPreviousMeals();
      getMyMeals();
    }, []),
  );

  useEffect(() => {
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        setDate(date_);
        getUserInstance(date_);
      } else {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();
        setDate(date);
        getUserInstance(date);
      }
    };
    const unsubscribe = navigation.addListener('focus', () => {
      dateSet();
    });
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    getPreviousMeals();
  }, [searchMostRecentMeal]);
  const getPreviousMeals = async () => {
    let payload = {
      uid: userData?.id,
      page: 1,
      perpage: 100,
      search: searchMostRecentMeal,
    };
    console.log('getPreviousMeals', payload);
    dispatch(
      prevMealListRequest(
        payload,
        onPreviousMealSuccess,
        onPreviousMealFailure,
      ),
    );
  };
  const onPreviousMealSuccess = async resolve => {
    setPrevMeals(resolve?.data?.result);
    console.log('onPreviousMealSuccess==', resolve);
  };
  const onPreviousMealFailure = async reject => {
    console.log('onPreviousMealFailure==', reject);
  };
  const getMyMeals = () => {
    console.log('getMyMeals');
    let payload = {
      uid: userData?.id,
    };
    dispatch(favMealListRequest(payload, onMyMealsSuccess, onMyMealsFailure));
  };
  const onMyMealsSuccess = resolve => {
    setMyMeals(resolve.data);
  };
  const onMyMealsFailure = reject => {
    setMyMeals([]);
  };
  const clearDateImmediate = async () => {
    await Utility.getInstance().clearDate();
  };
  const saveSelectedDate = async date => {
    await Utility.getInstance().saveSelectedDate(date);
  };
  useEffect(() => {
    if (userData) {
      let client_code_Status = userData?.client_code == '' ? false : true;
      setImageUri(userData?.image);
      setClientStatus(userData);
      setClientStatus(client_code_Status);
      // setToolTipData(
      //   client_code_Status
      //     ? dummyContent.prefusionClientScope
      //     : dummyContent.nonPrefusionClientScope,
      // );
      setToolTipData(dummyContent.nonPrefusionClientScopeWithResources);
      userId = userData.id;
    }
    const unsubscribe = navigation.addListener('focus', () => {
      if (userData) {
        setImageUri(userData?.image);
      }
    });
    if (userData) {
      console.log('userData.image=', userData.image);
      setImageUri(userData.image);
    }

    return () => {
      unsubscribe;
    };
  }, [imageUri, userData]);

  const getLocationInformation = async () => {
    let locationData = await Utility.getInstance().getStoreData(
      strings.location_data,
    );
    if (locationData) {
      //updateUserLocation(locationData);
    }
  };

  const updateUserLocation = locationData => {
    setLoading(true);
    let payload = {uid: userId, location_details: locationData};
    dispatch(updateUserInformationRequest(payload, onS, onF));
  };
  const onS = async resolve => {
    console.log('updateUserLocation`==', resolve);
    setLoading(false);
  };
  const onF = async reject => {
    setLoading(false);
  };
  const scrollToIndexFailed = error => {
    const offset = error.averageItemLength * error.index;
    scrollRef?.current?.scrollToOffset({offset});
    setTimeout(
      () => scrollRef?.current?.scrollToIndex({index: error.index}),
      100,
    ); // You may choose to skip this line if the above typically works well because your average item height is accurate.
  };
  const focusToCurrentDate = () => {
    if (scrollRef != null && scrollRef != undefined) {
      if (scrollRef?.current) {
        if (dateList.length > 0) {
          let index = 1;
          for (let i = 0; i < dateList.length; i++) {
            if (dateValue == dateList[i].date) {
              index = i;
            }
          }
          if (index && index != 0 && index != -1)
            scrollRef?.current?.scrollToIndex({animated: true, index: index});
          // setTimeout(() => {
          //   if (index && index != 0 && index != -1)
          //     scrollRef?.current?.scrollToIndex({animated: true, index: 6});
          // }, 100);
        }
      }
    }
  };

  useEffect(() => {
    if (dateValue) {
      getUserInstance(dateValue);
    }
  }, [dateValue]);

  useEffect(() => {
    getLocationInformation();
  }, []);

  const getUserInstance = async date => {
    let timezone =
      Platform.OS === 'android'
        ? ''
        : Intl.DateTimeFormat().resolvedOptions().timeZone;

    let payload = {
      uid: userId,
      date: date,
      current_date:
        (await Utility.getInstance().getCurrentDateUser()) + ',' + timezone,
    };
    dispatch(weekelyDataRequest(payload, onSSS, onFFF));
  };
  const onSSS = resolve => {
    if (resolve?.data?.goal_type == '' || resolve?.data?.goal_type == null)
      navigation.navigate('AdjustMacros');

    const {
      fat,
      veggies,
      water,
      carbs,
      protein,
      date,
      carbsBucketCount,
      fatBucketCount,
      proteinBucketCount,
      carbsBucketConsumedCount,
      fatBucketConsumedCount,
      proteinBucketConsumed,
      proteinBucketConsumedCount,
      isFeedbackEnteredToday,
    } = resolve.data;
    console.log('onSSS===>', resolve.data);
    let tempWater = [];
    let tempVegan = [];
    global.weekdays = date;
    setFatArray(fat);
    setCarbsArray(carbs);
    tempWaterfall = [];
    tempVeganFall = [];
    water.map(value => {
      let data = {
        percent: value,
        isSelected: value == 0 ? false : true,
      };
      tempWaterfall.push(data);
      tempWater.push(data);
    });
    setTimeout(() => {
      setWaterArray(tempWater);
    }, 1000);
    veggies.map(value => {
      let data = {
        percent: value,
        isSelected: value == 0 ? false : true,
      };
      tempVeganFall.push(data);
      tempVegan.push(data);
    });
    setTimeout(() => {
      setVeggArray(tempVegan);
    }, 1000);
    console.log({
      consumedFat: fatBucketConsumedCount,
      consumedProtein: proteinBucketConsumedCount,
      consumedCarbs: carbsBucketConsumedCount,
    });
    //   setWaterArray(water.map(v => ({...v, isSelected: true})));
    setProteinArray(protein);
    setIsFeedbackEnteredToday(isFeedbackEnteredToday);
    setDateList(date);
    setBucketCounts({
      fat: fatBucketCount,
      protein: proteinBucketCount,
      carbs: carbsBucketCount,
      consumedFat: fatBucketConsumedCount,
      consumedProtein: proteinBucketConsumedCount,
      consumedCarbs: carbsBucketConsumedCount,
    });
    setUpdating(!isUpdating);
    Utility.getInstance().setGoalBucketCounts({
      fatTarget: fatBucketCount,
      proteinTarget: proteinBucketCount,
      carbsTarget: carbsBucketCount,
      fatConsumed: fatBucketConsumedCount,
      proteinConsumed: proteinBucketConsumedCount,
      carbsConsumed: carbsBucketConsumedCount,
    });
  };

  useEffect(() => {
    if (dateList) {
      if (dateList.length > 0) focusToCurrentDate();
    }
  }, [dateList]);
  const onFFF = reject => {
    console.log('offfffff', reject);
    if (reject == 'Please Select your Goal First!') {
      setTimeout(() => {
        Utility.getInstance().inflateToast('Please Select your Goal First');
      }, 100);
      setTimeout(() => {
        navigation.navigate('AdjustMacros');
      }, 1000);
    }
  };
  const backPress = () => {
    navigation.goBack();
  };
  const onViewPress = () => {
    navigation.navigate('ServingsizeGuide');
  };
  const onUserPress = () => {
    navigation.navigate('Profile');
  };
  const onPrefusionToolTipItemPress = expression => {
    switch (expression) {
      case 0:
        setTip(false);
        navigation.navigate('MyMeal');
        break;
      case 1:
        setTip(false);
        navigation.navigate('Chat', 0);
        break;
      case 2:
        setTip(false);
        navigation.navigate('MyGoal');
        break;
      case 3:
        setTip(false);
        navigation.navigate('ProgressReport');
        break;
      case 4:
        setTip(false);
        navigation.navigate('MealHistory');
        break;
      case 5:
        setTip(false);
        navigation.navigate('AddFavoriteMeal');
      case 6:
        setTip(false);
        navigation.navigate('ApprovedFoods');

        break;
      case 7:
        setTip(false);
        navigation.navigate('BrowseOurRecipies');

        break;
      case 8:
        setTip(false);
        navigation.navigate('ServingsizeGuide');

        break;

      case 9:
        setTip(false);
        navigation.navigate('Setting', 0);
        break;
      case 10:
        setTip(false);

        navigation.navigate('Help', {
          LINK: api.HELP_GUIDE,
        });
        break;

      case 11:
        setToolTipData(dummyContent.prefusionClientScopeWithResources);
        break;
        break;
      case 12:
        setTip(false);
        navigation.navigate('HelpWebview');
        break;
      case 13:
        setTip(false);
        navigation.navigate('NationalWebview');
        break;
      default:
    }
  };
  const onNonPrefusionToolTipPress = expression => {
    // alert(expression);
    switch (expression) {
      case 0:
        setTip(false);
        navigation.navigate('CommunityMessageBoard');

        break;
      case 1:
        setTip(false);
        navigation.navigate('Chat', 0);
        break;
      case 2:
        setTip(false);
        navigation.navigate('AddFavoriteMeal');

        break;
      case 3:
        setTip(false);
        navigation.navigate('ApprovedFoods');

        break;

      case 4:
        setTip(false);
        navigation.navigate('BrowseOurRecipies');

        break;
      case 5:
        setTip(false);
        navigation.navigate('ServingsizeGuide');
        //navigation.navigate('AdjustMacros');
        // navigation.navigate('ProgressReport');

        break;
      case 6:
        setTip(false);
        navigation.navigate('ApprovedFoods');
        //navigation.navigate('ProgressReport');

        break;
      case 7:
        setTip(false);
        navigation.navigate('Help', {
          LINK: api.HELP,
        });

        //navigation.navigate('MealHistory');

        break;

      case 8:
        setTip(false);
        //  setToolTipData(dummyContent.nonPrefusionClientScopeWithResources);

        //navigation.navigate('AddFavoriteMeal');

        break;

      case 9:
        setTip(false);
        navigation.navigate('HelpWebview');
        // navigation.navigate('ServingsizeGuide');
        //        navigation.navigate('ApprovedFoods');

        break;

      case 10:
        setTip(false);
        navigation.navigate('NationalWebview');
        //navigation.navigate('ServingsizeGuide');
        //navigation.navigate('BrowseOurRecipies');

        break;

      case 11:
        setTip(false);
        navigation.navigate('Help', {
          LINK: api.HELP,
        });
        // navigation.navigate('ServingsizeGuide');

        break;
      case 12:
        setTip(false);
        navigation.navigate('Help', {
          LINK: api.HELP,
        });

        break;
      case 13:
        // navigation.navigate('Help', {
        //   LINK: api.HELP,
        // });
        setTip(false);
        //  setToolTipData(dummyContent.nonPrefusionClientScopeWithResources);
        navigation.navigate('HelpWebview');
        break;
      case 14:
        setTip(false);
        navigation.navigate('NationalWebview');
        //setToolTipData(dummyContent.nonPrefusionClientScopeWithResources);
        break;
      case 15:
        setTip(false);
        //   navigation.navigate('HelpWebview');

        break;
      case 16:
        setTip(false);
      ///  navigation.navigate('NationalWebview');
      default:
    }
  };
  const getSetSelectedDate = async () => {
    let currentTime = await Utility.getInstance().getCurrentDateUserTime();
    return dateValue + ',' + currentTime;
  };
  const onAddMealPress = async () => {
    const {food_id, date, calories, quantity, meal_name} = mealDetails.item;

    let payload = {
      uid: userId,
      food_id: food_id.toString(),
      quantity: quantity.toString(),
      date: await getSetSelectedDate(),
      meal_name: meal_name,
      endpoint: ApiConstant.MEAL_ADD,
    };
    setConfirmVisible(false);
    setLoading(true);
    dispatch(addMealRequest(payload, onSS, onFF));
  };
  const onSS = async resolve => {
    console.log('onAddMealPress.resolve=>', resolve);
    setTimeout(() => {
      setLoading(false);
      getUserInstance(dateValue);
    }, 100);
  };
  const onFF = reject => {
    console.log('onAddMealPress.reject=>', reject);
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };
  const onAddServingPress = type => {
    setLoading(true);
    let value = 0;
    let convertedValue = 0;
    if (type === strings.water) {
      tempWaterfall.forEach(e => {
        convertedValue = e.percent === 100 ? 1 : e.percent === 50 ? 0.5 : 0;
        value += convertedValue;
      });

      let payload = {
        uid: userId,
        date: dateValue,
        amount: value,
      };
      console.log('addWaterRequest.payload==', payload, tempWaterfall);
      dispatch(
        addWaterRequest(payload, onAddServingSuccess, onAddServingFailure),
      );
    } else {
      tempVeganFall.forEach(e => {
        convertedValue = e.percent === 100 ? 1 : e.percent === 50 ? 0.5 : 0;
        value += convertedValue;
      });

      let payload = {
        uid: userId,
        date: dateValue,
        amount: value,
      };
      console.log('addVeggiesRequest.payload==', payload, tempVeganFall);
      dispatch(
        addVeggiesRequest(payload, onAddServingSuccess, onAddServingFailure),
      );
    }
  };
  const onAddServingSuccess = resolve => {
    setLoading(false);
    console.log('addWaterRequest.resolve==', resolve);
    getUserInstance(dateValue);
  };
  const onAddServingFailure = reject => {
    setLoading(false);
    console.log('addWaterRequest.reject==', reject);
    Utility.getInstance().inflateToast(reject);
  };
  const Menu = () => {
    return (
      <Tooltip
        backgroundColor="transparent"
        tooltipStyle={{padding: 0, margin: 0}}
        isVisible={showTip}
        ref={toolTipRef}
        contentStyle={{backgroundColor: '#5C5C5C'}}
        content={ToolTipContent()}
        onClose={() => setTip(false)}
        placement="bottom"
        topAdjustment={
          Platform.OS === 'android' ? Utility.getInstance().heightToDp(0.9) : 0
        }>
        <Pressable
          onPress={() => [
            // setToolTipData(
            //   isPrefusionClient
            //     ? dummyContent.prefusionClientScope
            //     : dummyContent.nonPrefusionClientScope,
            // ),
            setTip(true),
          ]}
          style={styles.menu}>
          <Image style={globalStyles.backimg} source={images.HOME.MENU}></Image>
        </Pressable>
      </Tooltip>
    );
  };
  const ToolTipContent = () => {
    return (
      <View
        style={[
          styles.tooltipc,
          {height: Utility.getInstance().heightToDp(110)},
        ]}>
        <Text
          style={[
            styles.menutext,
            styles.green,
            globalStyles.textAlignCenter,
            globalStyles.font20,
          ]}>
          Navigator
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={tooltipData}
          ref={flatlistRef}
          contentContainerStyle={{paddingVertical: 20}}
          keyExtractor={item => item.toString() + 0.7}
          renderItem={renderToolTipItem}></FlatList>
      </View>
    );
  };
  const renderToolTipItem = item => {
    return (
      <>
        {item.item != 'My Blood Work' ? (
          <TouchableOpacity
            onPress={() =>
              // isPrefusionClient
              //   ? onPrefusionToolTipItemPress(item.index)
              //   : onNonPrefusionToolTipPress(item.index)
              onNonPrefusionToolTipPress(item.index)
            }
            style={styles.menuitem}>
            {item?.item == 'HealthLine' ||
            item?.item == 'National Library of Medicine' ? (
              <Text
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  color: colors.secondary,
                  fontSize: 18,
                }}>
                {'\u2022'}
                <Text
                  style={[
                    styles.menutext,
                    {color: colors.secondary, paddingLeft: 20},
                  ]}>
                  {`  ` + item.item}
                </Text>
              </Text>
            ) : (
              <Text style={styles.menutext}>{item.item}</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </>
    );
  };
  const DateView = () => {
    return (
      <FlatList
        horizontal
        style={{marginTop: 15}}
        renderItem={renderDates}
        extraData={dateValue}
        ref={scrollRef}
        onScrollToIndexFailed={scrollToIndexFailed}
        keyExtractor={item => item.toString() + 2.9}
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        data={dateList}></FlatList>
    );
  };
  const renderDates = item => {
    const {show_date, date} = item.item;
    return (
      <Pressable
        onPress={() => [
          setDate(date),
          getUserInstance(date),
          saveSelectedDate(date),
        ]}
        style={[
          styles.dateView_,
          {
            borderWidth: dateValue == date ? 2 : 0.3,
          },
        ]}
        key={item?.index}>
        <Text
          style={[
            styles.headingT,
            {color: dateValue == date ? colors.white : colors.gray},
          ]}>
          {show_date && show_date}
        </Text>
      </Pressable>
    );
  };
  const CounterView = () => {
    return (
      <Pressable
        onPress={onViewPress}
        //style={{borderColor: 'green', borderWidth: 2, padding: 15, margin: 10}}
      >
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 40,
          }}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.redC]}>
            {`Carbs: 20g`}
          </Text>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.green]}>
            {`Protein: 20g`}
          </Text>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.blue]}>
            {`Water: 8oz`}
          </Text>
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: Utility.getInstance().widthToDp(20),
          }}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.orange]}>
            {`Fats: 10g`}
          </Text>

          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.green]}>
            {`Veggies: 1 Cup`}
          </Text>
        </View> */}
        <Text
          onPress={() =>
            navigation.navigate('Help', {
              LINK: api.BUCKER_SERV_SYS,
            })
          }
          style={[
            styles.forgot_pass_heading,
            styles.whydesc,
            {textAlign: 'center', textDecorationLine: 'underline'},
          ]}>
          {`BUCKET SERVING SYSTEM`}
        </Text>
      </Pressable>
    );
  };
  const AddView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
          paddingHorizontal: 0,
        }}>
        <TouchableOpacity
          onPress={() => [
            setDate(moment(today).format('L')),
            navigation.navigate('AddVeg'),
          ]}
          style={[styles.addView_green]}>
          <Text style={styles.headingtext}>Add Veggies</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('DailyBioFeedback')}
          style={styles.addView_orange}>
          <Text style={[styles.headingtextBlack]}>Daily Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => [
            setDate(moment(today).format('L')),
            navigation.navigate('AddWater'),
          ]}
          style={styles.addView_blue}>
          <Text style={styles.headingtext}>Add Water</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const CarbsBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingVertical: 10,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.redC]}>
            {`Carbs:`}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          <FlatList
            data={calculateBucketCount({
              consumedBuckets: bucketCounts.consumedCarbs,
              bucketCounts: bucketCounts.carbs,
              maxGoalType: 'Carbs',
            })}
            key={bucketCounts}
            numColumns={7}
            extraData={isUpdating || bucketCounts}
            contentContainerStyle={{alignItems: 'flex-start'}}
            renderItem={item => (
              <BucketsLane
                type="Carbs"
                item={item}
                consumed={bucketCounts.consumedCarbs}
                bucketCount={bucketCounts.carbs}></BucketsLane>
            )}></FlatList>
        </View>
      </View>
    );
  };

  const calculateBucketCount = data => {
    let bucketArray = [];
    let consumedBuckets = data.consumedBuckets;
    let trgetBuckets = data.bucketCounts;
    let maxGoalType = data.maxGoalType;
    // let allOver = trgetBuckets - consumedBuckets; old working line
    console.log(
      'calculateBucketCount=>',
      data.bucketCounts,
      consumedBuckets,
      maxGoalType,
    );
    let allOver =
      maxGoalType === 'Carbs'
        ? trgetBuckets >= 20
          ? 20 - consumedBuckets
          : trgetBuckets - consumedBuckets
        : maxGoalType === 'Fat'
        ? trgetBuckets >= 15
          ? 15 - consumedBuckets
          : trgetBuckets - consumedBuckets
        : trgetBuckets >= 13
        ? 13 - consumedBuckets
        : trgetBuckets - consumedBuckets;
    let numberOfBucket = trgetBuckets; // allOver > 0 ? trgetBuckets : trgetBuckets;
    console.log({consumedBuckets, trgetBuckets, allOver, numberOfBucket});
    for (let i = 0; i < numberOfBucket; i++) {
      let diffrence = consumedBuckets - i;
      console.log({diffrence, consumedBuckets, i, allOver});
      if (maxGoalType === 'Carbs' && i == 20) {
        break;
      } else if (maxGoalType === 'Fat' && i == 15) {
        break;
      } else if (maxGoalType === 'Protein' && i == 13) {
        break;
      }
      if (diffrence >= 1) {
        bucketArray.push(1);
      } else if (diffrence >= 0.75 && diffrence < 1) {
        bucketArray.push(0.75);
      } else if (diffrence >= 0.5 && diffrence < 0.75) {
        bucketArray.push(0.5);
      } else if (diffrence >= 0.25 && diffrence < 0.5) {
        bucketArray.push(0.25);
      } else if (diffrence <= 0) {
        bucketArray.push(0);
      }
    }

    if (allOver < 0) {
      console.log('sajsjkajsaksjs', allOver);
      bucketArray.push(allOver);
    }
    console.log({bucketArray});
    return bucketArray;
  };
  const FatBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 15,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.orange]}>
            {`Fats:`}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          <FlatList
            data={calculateBucketCount({
              consumedBuckets: bucketCounts.consumedFat,
              bucketCounts: bucketCounts.fat,
              //  bucketCounts: 5.25,
              maxGoalType: 'Fat',
            })}
            key={bucketCounts}
            numColumns={7}
            extraData={isUpdating || bucketCounts}
            contentContainerStyle={{alignItems: 'flex-start'}}
            renderItem={item => (
              <BucketsLane
                type="Fat"
                item={item}
                consumed={bucketCounts.consumedFat}
                bucketCount={bucketCounts.fat}></BucketsLane>
            )}></FlatList>
        </View>
      </View>
    );
  };
  // const renderTestFatItem = (item, consumed, bucketCount) => {
  //   const {index} = item;
  //   let diffrence = bucketCount - index;
  //   let consumedDifference = consumed - index;
  //   let diff = diffrence - consumedDifference;

  //   if (diffrence >= 1) {
  //     if (item?.item == 1) {
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={images.FAT_IMAGE.ORANGE_100}></Image>
  //       );
  //     } else if (item?.item == 0.75)
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={
  //             consumedDifference <= 0
  //               ? images.TARGET.FAT_TARGET_75
  //               : consumedDifference > 0
  //               ? images.TARGET.FAT_TARGET_FILLED_75
  //               : images.FAT_IMAGE.ORANGE_75
  //           }></Image>
  //       );
  //     else if (item?.item == 0.5)
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={
  //             consumedDifference <= 0
  //               ? images.TARGET.FAT_TARGET_50
  //               : consumedDifference > 0
  //               ? images.TARGET.FAT_TARGET_FILLED_50
  //               : images.FAT_IMAGE.ORANGE_50
  //           }></Image>
  //       );
  //     else if (item?.item == 0.25)
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={
  //             consumedDifference <= 0
  //               ? images.TARGET.FAT_TARGET_25
  //               : consumedDifference > 0
  //               ? images.TARGET.FAT_TARGET_FILLED_25
  //               : images.FAT_IMAGE.ORANGE_25
  //           }></Image>
  //       );
  //     else if (item?.item == 0)
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={
  //             consumedDifference <= 0
  //               ? images.TARGET.FAT_TARGET_100
  //               : images.APP.ORANGE_EMPTY
  //           }></Image>
  //       );
  //     else {
  //       return (
  //         <ImageBackground
  //           resizeMode="contain"
  //           style={[
  //             styles.bucketImg,
  //             {alignItems: 'center', justifyContent: 'center'},
  //           ]}
  //           source={images.MAXIMIZE_IMAGE.MAXIMUM}>
  //           <Text>{`+${Math.abs(item.item)}`}</Text>
  //         </ImageBackground>
  //       );
  //     }
  //   } else {
  //     //all buckets will be overage buckets
  //     // if (diffrence == 1) {
  //     //   return (
  //     //     <Image
  //     //       style={styles.bucketImg}
  //     //       source={images.OVEGARE_IMAGE.FAT}></Image>
  //     //   );
  //     // } else
  //     if (diffrence == 0.75)
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={
  //             consumedDifference <= 0
  //               ? images.TARGET.FAT_TARGET_75
  //               : images.OVEGARE_IMAGE.FAT_OVEGARE_75
  //           }></Image>
  //       );
  //     else if (diffrence == 0.5)
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={
  //             consumedDifference <= 0
  //               ? images.TARGET.FAT_TARGET_50
  //               : images.OVEGARE_IMAGE.FAT_OVEGARE_50
  //           }></Image>
  //       );
  //     else if (diffrence == 0.25)
  //       return (
  //         <Image
  //           style={styles.bucketImg}
  //           source={
  //             consumedDifference <= 0
  //               ? images.TARGET.FAT_TARGET_25
  //               : images.OVEGARE_IMAGE.FAT_OVEGARE_25
  //           }></Image>
  //       );
  //     // else if (diffrence == 0)
  //     //   return (
  //     //     <Image
  //     //       style={styles.bucketImg}
  //     //       source={images.APP.ORANGE_EMPTY}></Image>
  //     //   );
  //     else {
  //       return (
  //         <ImageBackground
  //           resizeMode="contain"
  //           style={[
  //             styles.bucketImg,
  //             {alignItems: 'center', justifyContent: 'center'},
  //           ]}
  //           source={images.MAXIMIZE_IMAGE.MAXIMUM}>
  //           <Text
  //             style={{
  //               fontSize: 10,
  //               fontFamily: 'Poppins-regular',
  //               marginTop: 6,
  //             }}>{`+${Math.abs(item.item)}`}</Text>
  //         </ImageBackground>
  //       );
  //     }
  //   }
  // };
  const ProteinBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingVertical: 10,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.green]}>
            {`Protein:`}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          <FlatList
            data={calculateBucketCount({
              consumedBuckets: bucketCounts.consumedProtein,
              bucketCounts: bucketCounts.protein,
              maxGoalType: 'Protein',
            })}
            key={bucketCounts}
            numColumns={7}
            extraData={isUpdating || bucketCounts}
            contentContainerStyle={{alignItems: 'flex-start'}}
            renderItem={item => (
              <BucketsLane
                type="Protein"
                item={item}
                consumed={bucketCounts.consumedProtein}
                bucketCount={bucketCounts.protein}></BucketsLane>
            )}></FlatList>
        </View>
      </View>
    );
  };
  const WaterBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          // alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.blue]}>
            {`Water:`}
          </Text>
        </View>
        <View style={{flex: 0.8}}>
          <FlatList
            data={waterArray}
            numColumns={6}
            extraData={isUpdating}
            contentContainerStyle={{alignItems: 'flex-start'}}
            renderItem={renderWaterItem}></FlatList>
        </View>
      </View>
    );
  };
  const returnBucketValues = (i, type) => {
    if (type === strings.water) {
      tempWaterfall[i].isSelected = true;
      if (tempWaterfall[i].percent == 0) {
        tempWaterfall[i].percent = 50;
      } else if (tempWaterfall[i].percent == 50) {
        tempWaterfall[i].percent = 100;
      } else if (tempWaterfall[i].percent == 100) {
        tempWaterfall[i].percent = 0;
        tempWaterfall[i].isSelected = false;
      }
      onAddServingPress(type);
    } else {
      tempVeganFall[i].isSelected = true;
      if (tempVeganFall[i].percent == 0) {
        tempVeganFall[i].percent = 50;
      } else if (tempVeganFall[i].percent == 50) {
        tempVeganFall[i].percent = 100;
      } else if (tempVeganFall[i].percent == 100) {
        tempVeganFall[i].percent = 0;
        tempVeganFall[i].isSelected = false;
      }
      onAddServingPress(type);
    }

    //setWaterArray(waterArray);

    // setUpdating(!isUpdating);
    console.log('returnBucketValues==', waterArray);
  };
  const returnValuableBucket = (percent, i, type) => {
    var image = null;
    switch (percent) {
      case 0:
        image =
          type == 'water' ? images.APP.BLUE_EMPTY : images.APP.VEGGIE_EMPTY;
        break;
      case 50:
        image =
          type == 'water'
            ? images.WATER_IMAGE.WATER_50
            : images.VEG_IMAGE.VEG_50;
        break;
      case 100:
        image =
          type == 'water'
            ? images.WATER_IMAGE.WATER_100
            : images.VEG_IMAGE.VEG_100;
        break;

      default:
    }
    return image;
  };
  const renderWaterItem = item => {
    const {percent} = item.item;
    console.log('returnValuableBucket.percents==', percent);
    return (
      <Pressable
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() =>
          !isLoading
            ? returnBucketValues(item.index, 'water')
            : console.log('Processing...')
        }>
        <Image
          style={[styles.bucketImg]}
          source={returnValuableBucket(percent, item.index, 'water')}></Image>
      </Pressable>
    );
    return;
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image style={styles.bucketImg} source={images.APP.BLUE_EMPTY}></Image>
      );
  };
  const VeggiesBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',

          paddingHorizontal: 20,
          paddingVertical: 10,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.green_p,
              {fontSize: 12},
            ]}>
            {`Veggies:`}
          </Text>
          {/* <Text style={styles.requireText}>
            log each 1 cup serving by itself
          </Text> */}
        </View>
        <View style={{flex: 0.8}}>
          <FlatList
            data={veggiesArray}
            numColumns={6}
            extraData={isUpdating}
            contentContainerStyle={{alignItems: 'flex-start'}}
            renderItem={renderVegItem}></FlatList>
        </View>
      </View>
    );
  };
  const renderVegItem = item => {
    console.log('renderVegItem.isSelected==', item.item);
    const {percent} = item.item;
    console.log('returnValuableBucket.percents==', percent);
    return (
      <Pressable
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() =>
          !isLoading
            ? returnBucketValues(item.index, 'veg')
            : console.log('Processing...')
        }>
        <Image
          style={[styles.bucketImg]}
          source={returnValuableBucket(percent, item.index, 'veg')}></Image>
      </Pressable>
    );
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image
          style={styles.bucketImg}
          source={images.APP.VEGGIE_EMPTY}></Image>
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
  const AddModal = () => {
    return (
      <TouchableOpacity
        onPress={() => setAddModalVisible(false)}
        style={styles.addMealView}>
        <View style={{marginTop: height / 1.7, alignItems: 'center'}}>
          <Button
            onClick={() => [setAddModalVisible(false), SetMealVisible(true)]}
            heading="ADD MEAL"
            color={colors.secondary}></Button>
          <Button
            onClick={() => [
              setAddModalVisible(false),
              navigation.navigate('AddWater'),
            ]}
            heading="ADD WATER"
            color={colors.blue}></Button>
          <Button
            onClick={() => [
              setAddModalVisible(false),
              navigation.navigate('AddVeg'),
            ]}
            heading="ADD VEGGIES"
            color={colors.secondary_green}></Button>
        </View>
      </TouchableOpacity>
    );
  };
  const MealModalView = () => {
    return (
      <DialogView
        dialog_Container={{
          width: Utility.getInstance().DW() / 1.25,
          backgroundColor: 'white',
          height: Utility.getInstance().DH() / 1.5,
        }}
        onTouchOutside={() => [
          Utility.getInstance().creatingAndUpdatingMeal(false),
          SetMealVisible(false),
        ]}
        willInflate={isMealVisible}
        onBackPress={() => [
          Utility.getInstance().creatingAndUpdatingMeal(false),
          SetMealVisible(false),
        ]}
        children={MealModalContent()}></DialogView>
    );
  };
  const MealModalContent = () => {
    return (
      <ScrollView>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => [
              Utility.getInstance().creatingAndUpdatingMeal(false),
              SetMealVisible(false),
            ]}>
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
            Add Meal
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
          <Button
            onClick={() => [
              Utility.getInstance().creatingAndUpdatingMeal(false),
              setAddModalVisible(false),
              SetMealVisible(false),
              navigation.navigate('NewMeal'),
            ]}
            heading="NEW MEAL"
            color={colors.secondary}></Button>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Medium',
              color: colors.black,
              fontSize: 16,
              marginTop: 12,
            }}>
            OR
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              color: colors.black,
              fontSize: 12,
              marginTop: 12,
            }}>
            {`Quick add from your meals
or recent meals.`}
          </Text>
        </View>
        <Pressable
          onPress={() => setMostRecentMeals(!isMostRecentMeals)}
          style={{
            margin: 10,
            alignSelf: 'center',
            height: 34,
            width: 120,
            borderColor: colorCodes.black,
            borderWidth: 1,
            borderRadius: 20,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={images.APP.SORT}
            style={{height: 15, width: 15, resizeMode: 'contain'}}></Image>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              color: colors.black,
              fontSize: 14,
            }}>
            {isMostRecentMeals ? `Most Recent` : `My Meals`}
          </Text>
        </Pressable>
        {isMostRecentMeals && (
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 25,
              borderWidth: 1,
              height: 40,
              paddingHorizontal: 10,
              borderColor: colorCodes.black,
              alignItems: 'center',
            }}>
            <Image
              style={{height: 25, width: 25, resizeMode: 'contain'}}
              source={images.APP.SEARCH}></Image>
            <TextInput
              value={searchMostRecentMeal}
              onChangeText={setSearchMostRecentMeal}
              style={{
                opacity: 0.3,
                width: '90%',
                height: 40,
                margin: 10,
              }}
              placeholder="Search my meals "
              placeholderTextColor={colors.black}></TextInput>
          </View>
        )}
        {isMostRecentMeals ? (
          <MealView
            onClick={details => [
              setMealDetails(details),
              SetMealVisible(false),
              setConfirmVisible(true),
            ]}
            onEditPress={item => onPencilPress(item)}
            data={prevMeals}
          />
        ) : (
          <MostRecentMealView
            onClick={details => [
              setMealDetails(details),
              SetMealVisible(false),
              setConfirmVisible(true),
            ]}
            onEditPress={item => onPencilPress(item)}
            data={myMeals}
          />
        )}
      </ScrollView>
    );
  };
  const onPencilPress = async ({item}) => {
    if (!isMostRecentMeals) {
      Utility.getInstance().isUpdatingFavoriteMeals(true);
    } else {
      Utility.getInstance().isUpdatingFavoriteMeals(false);
    }
    console.log('onEditPress=>', item);
    const {id, food_id, quantity, meal_name, fav_id} = item;
    global.fav_id = fav_id;
    Global = meal_name;
    let foodId = food_id.toString();
    let mealId = typeof id === 'string' ? JSON.parse(id) : id;
    SetMealVisible(false);
    setConfirmVisible(false);
    Utility.getInstance().creatingAndUpdatingMeal(true);
    await Utility.getInstance()
      .setStoreData('MEAL_ID', typeof id === 'string' ? JSON.parse(id) : id)
      .then(() => {
        navigation.navigate('MealView', {
          foodId,
          qty: quantity.toString(),
          mealId,
          //updateAndAddMeal: true,
        });
      });
  };
  const ConfirmMealModalView = () => {
    return (
      <DialogView
        dialog_Container={{
          width: Utility.getInstance().DW() / 1.25,
          backgroundColor: 'white',
          height: Utility.getInstance().DH() / 1.8,
        }}
        onTouchOutside={() => setConfirmVisible(false)}
        willInflate={isConfirmVisible}
        onBackPress={() => setConfirmVisible(false)}
        children={ConfirmMealModalContent()}></DialogView>
    );
  };
  const ConfirmMealModalContent = () => {
    ///const {food_id, date, calories, quantity, meal_name} = mealDetails.item;
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
          <TouchableOpacity onPress={() => setConfirmVisible(false)}>
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
              marginTop: 20,
              margin: 30,
              textDecorationLine: 'underline',
            }}>
            {strings.selectedL}
          </Text>

          <View
            style={{
              height: 100,
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
                source={images.SPLASH.SPLASH}></Image>
              <View>
                <Text
                  style={[
                    styles.ml_15,

                    {
                      color: colorCodes.black,
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                    },
                  ]}>
                  {`${mealDetails?.item?.calories} cal`}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.ml_15,
                    styles.black,
                    {width: 150, fontSize: 13},
                  ]}>
                  {mealDetails?.item?.meal_name}
                </Text>
              </View>
            </View>
            <Pressable
              // onPress={() => console.log('details=>', mealDetails)}
              onPress={() => onPencilPress(mealDetails)}
              style={{
                height: 30,
                width: 110,
                borderRadius: 15,
                alignSelf: 'flex-end',
                backgroundColor: colorCodes.secondary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Details / Edit</Text>
            </Pressable>
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
            {strings.confirmDesc}
          </Text>
          <Button
            onClick={() => [
              setAddModalVisible(false),
              SetMealVisible(false),
              onAddMealPress(),
            ]}
            heading="ADD MEAL"
            color={colors.secondary}></Button>
        </View>
      </View>
    );
  };

  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          {/* {addModalVisible && AddModal()} */}
          <Loader isLoading={userWeeklyInstanceIsLoading || isLoading}></Loader>
          <View style={styles.appHeader}>
            {Menu()}
            {MealModalView()}
            {ConfirmMealModalView()}

            <TouchableOpacity onPress={backPress}>
              <Image
                style={globalStyles.applogoheader}
                source={images.FAVORITE.APPLOGO}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={onUserPress}>
              <Image
                style={styles.userlogo_image}
                source={{uri: imageUri}}></Image>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {DateView()}
            {/* <CounterView /> */}
            <Text style={styles.dailygoals_heading}>{strings.dailygoals}</Text>
            <View style={[styles.outer, {backgroundColor: 'transparent'}]}>
              <View style={styles.outer_}>
                <View style={styles.disc}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.kn_img}
                    source={images.CARBS_IMAGE.CARBS_100}>
                    <Text style={[styles.carbon]}>{bucketCounts.carbs}</Text>
                  </ImageBackground>
                  <Text
                    style={[styles.content1, styles.redC, styles.heading_text]}>
                    {strings.carbs_heading}
                  </Text>
                </View>
                <View style={styles.disc}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.kn_img}
                    source={images.FAT_IMAGE.ORANGE_100}>
                    <Text style={[styles.carbon]}>{bucketCounts.fat}</Text>
                  </ImageBackground>

                  <Text
                    style={[
                      styles.content1,
                      styles.orange,
                      styles.heading_text,
                    ]}>
                    {strings.fat_heading}
                  </Text>
                </View>
                <View style={styles.disc}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.kn_img}
                    source={images.PROTEIN_IMAGE.PROTEIN_100}>
                    <Text style={[styles.carbon]}>{bucketCounts.protein}</Text>
                  </ImageBackground>

                  <Text
                    style={[
                      styles.content1,
                      styles.green,
                      styles.heading_text,
                    ]}>
                    {strings.protein_heading}
                  </Text>
                </View>
              </View>
              <View style={styles.disc_1}>
                <View style={styles.center}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.kn_img}
                    source={images.OVEGARE_IMAGE.OVEGARE_100}></ImageBackground>
                  <Text
                    style={[
                      styles.content1,
                      //styles.redC,
                      styles.heading_text,
                      {color: 'rgba(210,210,210,210)'},
                    ]}>
                    {strings.overage_heading}
                  </Text>
                </View>
              </View>
            </View>
            {/* <View style={{paddingHorizontal: 20}}>{AddView()}</View> */}
            {/* <Text
              onPress={() => navigation.navigate('ServingsizeGuide')}
              style={styles.bucketSize}>
              {strings.servingsizeguide}
            </Text> */}
            {/* <View style={styles.progressc}>
              <View style={styles.progressbar}>
                <GradientCircularProgress
                  startColor={colors.primary}
                  middleColor={colors.secondary}
                  endColor={colors.primary}
                  size={67}
                  emptyColor={colors.black}
                  progress={
                    userWeeklyInstance && userWeeklyInstance.filled_data_value
                  }
                  strokeWidth={6}>
                  <Text style={styles.lbs}>
                    {userWeeklyInstance && userWeeklyInstance.filled}
                  </Text>
                </GradientCircularProgress>
                <Text style={[styles.bucketSize, globalStyles.mt_10]}>
                  {strings.filledbucket}
                </Text>
              </View>
              <View style={styles.progressbar}>
                <GradientCircularProgress
                  startColor={colors.primary}
                  middleColor={colors.secondary}
                  endColor={colors.primary}
                  size={67}
                  emptyColor={colors.black}
                  progress={
                    userWeeklyInstance &&
                    userWeeklyInstance.remaining_data_value
                  }
                  strokeWidth={6}>
                  <Text style={styles.lbs}>
                    {userWeeklyInstance && userWeeklyInstance.remaining}
                  </Text>
                </GradientCircularProgress>
                <Text style={[styles.bucketSize, globalStyles.mt_10]}>
                  {strings.remainingbucket}
                </Text>
              </View>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
              }}>
              {/* <TouchableOpacity
                onPress={() => [
                  setDate(moment(today).format('L')),
                  navigation.navigate('DailyDairy'),
                ]}
                style={[styles.dailydairy_btn]}>
                <Text style={styles.headingtext}>{strings.dairy}</Text>
              </TouchableOpacity> */}
              {/* <Text
                onPress={() =>
                  navigation.navigate('Help', {
                    LINK: api.BUCKER_SERV_SYS,
                  })
                }
                style={styles.bucketSize_green}>
                {strings.bSizeguide}
              </Text> */}
            </View>

            {CarbsBucketView()}
            {FatBucketView()}
            {ProteinBucketView()}
            {/* {WaterBucketView()}
            {VeggiesBucketView()} */}
          </ScrollView>
          <BottomTabMenu
            isFeedbackEnteredToday={isFeedbackEnteredToday}
            onClick={() => [
              Utility.getInstance().creatingAndUpdatingMeal(false),
              SetMealVisible(true),
            ]}></BottomTabMenu>
        </View>
      </>
    );
  };

  return DefautView();
};
export default Home;
