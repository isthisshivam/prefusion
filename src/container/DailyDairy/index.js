import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../DailyDairy/style';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index.js';
import strings from '../../constants/strings';

import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import Loader from '../../component/loader';
import {dailyDiryInfoRequest} from '../../redux/action/DailyDairyAction';

import {clearFoodId} from '../../redux/action/FoodIdAction';

import {GradientCircularProgress} from 'react-native-circular-gradient-progress';
var userId = null;

const DailyDairy = () => {
  const navigation = useNavigation();
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const [remainingProgress, setremainingProgress] = useState(0);
  const [filledProgress, setfilledProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [calories, setCalories] = useState(null);

  const [dateValue, setDate] = useState('');
  const [dateArray, setDateArray] = useState([]);
  const [meal, setMealArray] = useState([]);
  const [filled, setFilled] = useState(0);
  const [remaining, setRemaning] = useState(0);
  const [dailyLimit, setDailyLimit] = useState({
    carbs: null,
    fat: null,
    protein: null,
  });

  useEffect(() => {
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        setDate(date_);
      } else {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();

        setDate(date);
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
    if (userData) {
      userId = userData.id;
    }
    // dateSelected = '';
    const unsubscribe = navigation.addListener('focus', () => {
      clearDetails();
    });

    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (dateValue) {
      getDailyDairyInfoCall(dateValue);
    }
  }, [dateValue]);

  const clearDetails = async () => {
    dispatch(clearFoodId());
    await Utility.getInstance().removeStoreData('MEAL_ID');
  };
  const getDailyDairyInfoCall = async date => {
    let timezone =
      Platform.OS === 'android'
        ? ''
        : Intl.DateTimeFormat().resolvedOptions().timeZone;
    let payload = {
      uid: userId,
      date: dateValue,
      current_date:
        (await Utility.getInstance().getCurrentDateUser()) + ',' + timezone,
    };
    setLoading(true);

    dispatch(dailyDiryInfoRequest(payload, onSSS, onFFF));
  };

  const onSSS = resolve => {
    const {
      calories,
      meal_array,
      date,
      progress,
      carbsTargetStatus,
      fatTargetStatus,
      proteinTargetStatus,
    } = resolve.data;
    console.log('resolve.data', resolve.data);
    setCalories(calories);
    setMealArray(meal_array);
    setDailyLimit({
      carbs: carbsTargetStatus,
      fat: fatTargetStatus,
      protein: proteinTargetStatus,
    });
    setLoading(false);
    setRemaning(progress.remaining);
    setFilled(progress.filled);
    setremainingProgress(progress.remaining_progress_value);
    setfilledProgress(progress.filled_progress_value);
    setDateArray(date);
  };
  const focusToCurrentDate = () => {
    if (scrollRef != null && scrollRef != undefined) {
      if (scrollRef?.current) {
        if (dateArray.length > 0) {
          let index = 1;
          for (let i = 0; i < dateArray.length; i++) {
            if (dateValue == dateArray[i].date) {
              index = i;
            }
          }
          if (index && index != 0 && index != -1)
            scrollRef?.current?.scrollToIndex({animated: true, index: index});
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
  useEffect(() => {
    if (dateArray) {
      focusToCurrentDate();
    }
  }, [dateArray]);
  const onFFF = reject => {
    setLoading(false);
  };
  const backPress = () => {
    navigation.goBack();
  };

  const onDetailsPress = async item => {
    console.log('onDetailsPress=>', item);
    // return;
    setDate(null);
    const {id, food_id, quantity, meal_name} = item;
    let foodId = food_id;
    let mealId = id;
    Global = meal_name;
    await Utility.getInstance()
      .setStoreData('MEAL_ID', id)
      .then(() => {
        navigation.navigate('MealView', {foodId, qty: quantity, mealId});
      });
  };
  const saveSelectedDate = async date => {
    await Utility.getInstance().saveSelectedDate(date);
  };
  const MealList = () => {
    return (
      <FlatList
        style={{marginTop: 15}}
        renderItem={renderMeals}
        extraData={meal}
        keyExtractor={item => item.toString() + Math.random()}
        contentContainerStyle={{paddingHorizontal: 0}}
        showsHorizontalScrollIndicator={false}
        data={meal}></FlatList>
    );
  };
  const renderMeals = ({item}) => {
    const {
      meal_name,
      carbs,
      fat,
      protein,
      calories,
      id,
      protein_value,
      fat_value,
      carbs_value,
    } = item;

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 30,
            height: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.white,
                globalStyles.padding_20_hor,
              ]}>
              {meal_name}
            </Text>
            <TouchableOpacity
              onPress={() => onDetailsPress(item)}
              style={{
                flexDirection: 'row',
                height: 16,
                width: 50,
                alignItems: 'center',
              }}>
              {/* <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.white,
                  // globalStyles.padding_20_hor,
                  {
                    textAlign: 'right',
                    alignSelf: 'flex-end',
                    color: colors.secondary,
                    letterSpacing: 1,
                  },
                ]}>
                Edit
              </Text> */}
              <Image
                style={{height: 16, width: 16, resizeMode: 'contain'}}
                source={images.APP.DRAW}></Image>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.white,
                globalStyles.padding_20_hor,
                {textAlign: 'right', alignSelf: 'flex-end'},
              ]}>
              {parseInt(calories) + ` Calories`}
            </Text>
          </View>
        </View>
        <View style={styles.maincb}>
          <View style={[styles.alignC, styles.flexxx]}>
            <Image
              style={{height: 30, width: 30, resizeMode: 'contain'}}
              source={images.CARBS_IMAGE.CARBS_100}></Image>

            <Text style={styles.mainBalanceH}>{`${carbs_value}`}</Text>

            <Text style={[styles.forgot_pass_heading, styles.redC]}>
              {`Carbs`}
            </Text>
          </View>

          <View style={[styles.alignC, styles.flexxx]}>
            <Image
              style={{height: 30, width: 30, resizeMode: 'contain'}}
              source={images.FAT_IMAGE.ORANGE_100}></Image>

            <Text style={styles.mainBalanceH}>{`${fat_value}`}</Text>

            <Text style={[styles.forgot_pass_heading, styles.orange]}>
              {`Fats`}
            </Text>
          </View>

          <View style={[styles.alignC, styles.flexxx]}>
            <Image
              style={{height: 30, width: 30, resizeMode: 'contain'}}
              source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
            <Text style={styles.mainBalanceH}>{`${protein_value}`}</Text>
            <Text style={[styles.forgot_pass_heading, styles.green]}>
              {`Protein`}
            </Text>
          </View>
        </View>
      </>
    );
  };
  const CounterView = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
            margin: -15,
            padding: 30,
          }}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.redC]}>
            {`Carbs: 20g`}
          </Text>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.orange]}>
            {`Fat: 10g`}
          </Text>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.green]}>
            {`Protein: 20g`}
          </Text>
        </View>
      </>
    );
  };

  const DateView = () => {
    return (
      <FlatList
        horizontal
        style={{marginTop: 15}}
        renderItem={renderDates}
        extraData={dateArray}
        ref={scrollRef}
        onScrollToIndexFailed={scrollToIndexFailed}
        keyExtractor={item => item.toString() + Math.random()}
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        data={dateArray}></FlatList>
    );
  };
  useEffect(() => {
    const dateSet = async () => {
      if (dateValue == '') {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();
        setDate(date);
      }
    };
    dateSet();
  }, [dateValue]);
  const renderDates = item => {
    const {show_date, date} = item.item;

    return (
      <Pressable
        onPress={() => [saveSelectedDate(date), setDate(date)]}
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
  const getDailyLimitTextColor = text => {
    if (text === 'Reached') {
      return styles.green;
    } else if (text === 'Exceeded') {
      return styles.redC;
    } else if (text === 'Under') {
      return {color: 'yellow'};
    }
  };
  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Loader isLoading={isLoading}></Loader>

          <Header onBackPress={() => backPress()} />
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {DateView()}

            {/* <View style={styles.progressc}>
              <View style={styles.progressbar}>
                <GradientCircularProgress
                  startColor={colors.primary}
                  middleColor={colors.secondary}
                  endColor={colors.primary}
                  size={67}
                  emptyColor={colors.black}
                  progress={parseInt(filledProgress)}
                  strokeWidth={6}>
                  <Text style={styles.lbs}>{filled}</Text>
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
                  progress={parseInt(remainingProgress)}
                  strokeWidth={6}>
                  <Text style={styles.lbs}>{remaining}</Text>
                </GradientCircularProgress>
                <Text style={[styles.bucketSize, globalStyles.mt_10]}>
                  {strings.remainingbucket}
                </Text>
              </View>
            </View> */}

            {/* <CounterView /> */}
            <View style={styles.outer}>
              <View style={styles.outer_}>
                <View style={[styles.disc]}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.kn_img}
                    source={images.CARBS_IMAGE.CARBS_100}></ImageBackground>
                  <Text style={[styles.redC, styles.heading_text]}>
                    {strings.carbs_heading}
                  </Text>
                  <Text
                    style={[
                      styles.white,
                      styles.heading_text,
                      {marginTop: 10},
                    ]}>
                    {'Daily Limit'}
                  </Text>
                  <Text
                    style={[
                      getDailyLimitTextColor(dailyLimit?.carbs),
                      styles.heading_text,
                    ]}>
                    {dailyLimit?.carbs}
                  </Text>
                </View>
                <View
                  style={{
                    width: 1,
                    opacity: 0.4,
                    backgroundColor: colors.gray,
                  }}></View>

                <View style={styles.disc}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.kn_img}
                    source={images.FAT_IMAGE.ORANGE_100}></ImageBackground>

                  <Text style={[styles.orange, styles.heading_text]}>
                    {strings.fat_heading}
                  </Text>
                  <Text
                    style={[
                      styles.white,
                      styles.heading_text,
                      {marginTop: 10},
                    ]}>
                    {'Daily Limit'}
                  </Text>
                  <Text
                    style={[
                      getDailyLimitTextColor(dailyLimit?.fat),
                      styles.heading_text,
                    ]}>
                    {dailyLimit?.fat}
                  </Text>
                </View>
                <View
                  style={{
                    width: 1,
                    opacity: 0.4,
                    backgroundColor: colors.gray,
                  }}></View>

                <View style={styles.disc}>
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.kn_img}
                    source={images.PROTEIN_IMAGE.PROTEIN_100}></ImageBackground>

                  <Text style={[styles.green, styles.heading_text]}>
                    {strings.protein_heading}
                  </Text>
                  <Text
                    style={[
                      styles.white,
                      styles.heading_text,
                      {marginTop: 10},
                    ]}>
                    {'Daily Limit'}
                  </Text>
                  <Text
                    style={[
                      getDailyLimitTextColor(dailyLimit?.protein),
                      styles.heading_text,
                    ]}>
                    {dailyLimit?.protein}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{paddingHorizontal: 0}}>
              {/* <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  styles.white,
                  globalStyles.padding_20_hor,
                ]}>
                {`Calories`}
              </Text>
              <View style={styles.mainc}>
                <View style={styles.alignC}>
                  <Text style={styles.mainBalance}>
                    {calories && calories.goal}
                  </Text>
                  <Text style={styles.mainBalanceH}>Goal</Text>
                </View>
                <View style={styles.minusc}>
                  <Text style={styles.minus}>-</Text>
                </View>
                <View style={styles.alignC}>
                  <Text style={styles.mainBalance}>
                    {calories && parseInt(calories.taken)}
                  </Text>
                  <Text style={styles.mainBalanceH}>Consumed</Text>
                </View>
                <View style={styles.minusc}>
                  <Text style={styles.minus}>=</Text>
                </View>
                <View style={styles.alignC}>
                  <Text style={styles.mainBalance}>
                    {calories && parseInt(calories.remaining)}
                  </Text>
                  <Text style={styles.mainBalanceH}>Remaining</Text>
                </View>
              </View> */}
              {MealList()}
            </View>
          </ScrollView>
        </View>
      </>
    );
  };

  return DefautView();
};
export default DailyDairy;
