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
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../component/loader';
import DatePicker from 'react-native-date-picker';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../MealHistory/style';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';

import {mealHistoryRequest} from '../../redux/action/MealAction';
import {GradientCircularProgress} from 'react-native-circular-gradient-progress';
import moment from 'moment';
import Header from '../../component/headerWithBackControl';

import {addMealRequest} from '../../redux/action/MealAction';
import {clearFoodId} from '../../redux/action/FoodIdAction';
import {
  addFoodToFavRequest,
  removeFoodToFavRequest,
} from '../../redux/action/AddFoodToFavAction';

let quantityArray = [];
var foodIdArray = [];
var today = new Date();
var formattedDate = '';
var userId = null;
const MealHistory = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isLoadingFav = useSelector(
    state => state.other.favoriteReducer.showLoader,
  );
  const userData = useSelector(state => state.other.loginReducer.userData);

  const [willInflate, setWillInflate] = useState(false);

  const [isUpdating, setUpdating] = useState(false);
  const [mealMainArray, setMealMainArray] = useState([]);

  const [dateOfCalender, setDate] = useState(today);
  const [open, setOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    const unsubscribe = navigation.addListener('focus', () => {
      getMealHistory();
    });
    formattedDate = moment(dateOfCalender).format('L');
    getMealHistory();
    return () => {
      unsubscribe;
    };
  }, []);

  const getMealHistory = () => {
    let payload = {uid: userId, date: formattedDate};
    setLoading(true);
    dispatch(mealHistoryRequest(payload, onS, onF));
  };

  const onS = resolve => {
    const {meal_array} = resolve.data;
    setLoading(false);
    setMealMainArray(meal_array);
  };

  const onF = reject => {
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };

  const manipulateDate = date => {
    formattedDate = moment(date).format('L');
    setDate(date);
    getMealHistory();
  };
  const getPreviousDate = () => {
    const currentDayInMilli = new Date(formattedDate).getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const previousDayInMilli = currentDayInMilli - oneDay;
    const previousDate = new Date(previousDayInMilli);
    setUpdating(!isUpdating);
    formattedDate = moment(previousDate).format('L');
    setTimeout(() => {
      getMealHistory();
    }, 400);
  };

  const getNextDate = () => {
    const currentDayInMilli = new Date(formattedDate).getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const nextDayInMilli = currentDayInMilli + oneDay;
    const nextDate = new Date(nextDayInMilli);
    setUpdating(!isUpdating);
    formattedDate = moment(nextDate).format('L');
    setTimeout(() => {
      getMealHistory();
    }, 410);
  };

  const backPress = () => {
    navigation.goBack();
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
  const EMaskUnits = () => {
    return (
      <View
        style={{
          height: Utility.getInstance().heightToDp(120),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={[styles.white, globalStyles.font14]}>
          No Meal history found on Selected date
        </Text>
      </View>
    );
  };

  const renderMealView = () => {
    return (
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        extraData={isUpdating}
        showsVerticalScrollIndicator={false}
        data={mealMainArray}
        style={{marginTop: 20}}
        ListEmptyComponent={() => EMaskUnits()}
        renderItem={MealItem}></FlatList>
    );
  };
  const MealItem = item => {
    const {meal, meal_name, meal_time, food, meal_timestamp} = item.item;
    console.log('mealitem->', item.item);
    return (
      <View style={styles.mealitemc_food}>
        <View
          style={[
            globalStyles.center,
            globalStyles.flex_row,
            globalStyles.justifyContent_space_between,
            {marginLeft: 10},
          ]}>
          <View>
            <Text style={[styles.why_heading, styles.font30]}>{meal}</Text>
            <Text
              style={[
                globalStyles.textAlignStart,
                styles.white,
                globalStyles.font17,
              ]}>
              {meal_name}
            </Text>
            <Text
              style={[
                globalStyles.textAlignStart,
                styles.white,
                globalStyles.font14,
              ]}>
              {moment.unix(meal_timestamp).format('hh:mm a')}
            </Text>
          </View>
        </View>

        <FlatList
          data={food}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.favmealsC_foods}>
              <View style={styles.mealc}>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flex: 0.8,
                    padding: 10,
                  }}>
                  <Text numberOfLines={1} style={styles.melaname}>
                    {item.name + 'showsHorizontalScrollIndicator'}
                  </Text>
                  <Text numberOfLines={1} style={styles.mealcategory}>
                    {item.quantity + ` Piece`}
                  </Text>
                  <View style={globalStyles.flex_row}>
                    <ImageBackground
                      source={{uri: item.image}}
                      borderRadius={10}
                      style={styles.mealimg}></ImageBackground>

                    <View>
                      {item.fat.length > 0 && (
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
                          <View style={{flex: 0.65}}>
                            <ScrollView
                              style={{
                                width: Utility.getInstance().widthToDp(40),
                              }}
                              contentContainerStyle={{alignItems: 'center'}}
                              showsHorizontalScrollIndicator={false}
                              horizontal>
                              {item.fat.map(item => rendeFatItem(item))}
                            </ScrollView>
                          </View>
                        </View>
                      )}

                      {item.carbs.length > 0 && (
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
                              style={{
                                width: Utility.getInstance().widthToDp(40),
                              }}
                              contentContainerStyle={{alignItems: 'center'}}
                              showsHorizontalScrollIndicator={false}
                              horizontal>
                              {item.carbs.map(item => rendeCarbsItem(item))}
                            </ScrollView>
                          </View>
                        </View>
                      )}

                      {item.protein.length > 0 && (
                        <View
                          style={{
                            flexDirection: 'row',
                            // justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 5,
                          }}>
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
                          <View
                            style={{
                              flex: 0.65,
                            }}>
                            <ScrollView
                              contentContainerStyle={{
                                alignItems: 'center',
                              }}
                              style={{
                                width: Utility.getInstance().widthToDp(40),
                              }}
                              showsHorizontalScrollIndicator={false}
                              horizontal>
                              {item.protein.map(item => rendeProteinItem(item))}
                            </ScrollView>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    justifyContent: 'space-between',
                    flex: 0.2,
                    padding: 10,
                  }}>
                  <View style={styles.progressbar}>
                    <GradientCircularProgress
                      startColor={colors.primary}
                      middleColor={colors.secondary}
                      endColor={colors.primary}
                      size={47}
                      emptyColor={colors.black}
                      progress={70}
                      strokeWidth={6}>
                      <Text style={styles.lbs}>{item.calories}</Text>
                    </GradientCircularProgress>
                    <Text
                      style={[
                        styles.bucketSize,
                        globalStyles.mt_0,
                        styles.headingtextBlack,
                        {color: 'gray'},
                      ]}>
                      {strings.calories}
                    </Text>
                  </View>
                  {/* 
              <Pressable onPress={() => onHeartPress(item)}>
                <Image
                  style={styles.heart}
                  source={
                    favorite == 0 ? images.APP.HEART : images.APP.LIKED
                  }></Image>
              </Pressable>
              <TouchableOpacity
                onPress={() => onDeleteFoodPress(item)}
                style={styles.minusc}>
                <Image
                  style={styles.minusimage}
                  source={images.APP.TRASH}></Image>
              </TouchableOpacity> */}
                </View>
              </View>
            </View>
          )}></FlatList>
      </View>
    );
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header
          onBackPress={() => {
            backPress();
          }}
        />
        <ScrollView>
          <DatePicker
            modal
            mode="date"
            open={open}
            date={dateOfCalender}
            onConfirm={date => {
              setOpen(false);
              manipulateDate(date);
              // console.log('date', moment(date).format('L'));
            }}
            androidVariant="iosClone"
            textColor={colors.primary}
            placeholder="select date"
            format="DD-MM-YYYY"
            // minDate="01-01-2016"
            // maxDate="01-01-2019"
            onCancel={() => {
              setOpen(false);
            }}
            theme="auto"
          />
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingHorizontal: 20,
              marginTop: 20,
              // height: 80,
            }}>
            <Text
              onPress={() => navigation.goBack()}
              // onPress={() => [onDonePress()]}
              style={[
                globalStyles.btn_heading,
                {color: colors.secondary, fontSize: 18, paddingVertical: 10},
              ]}>
              My Meal History
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              height: 55,
              borderBottomColor: colors.secondary,
              borderBottomWidth: 1,
              borderTopColor: colors.secondary,
              borderTopWidth: 1,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={{
                flex: 0.27,
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginLeft: 20,
              }}>
              <Image
                source={images.APP.CALENDER}
                style={{height: 25, width: 25, resizeMode: 'contain'}}></Image>
            </TouchableOpacity>
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Pressable onPress={() => getPreviousDate()}>
                <Image
                  source={images.APP.LEFT}
                  style={{
                    height: 22,
                    width: 22,
                    resizeMode: 'contain',
                  }}></Image>
              </Pressable>
              <Text style={[styles.white, globalStyles.font17]}>
                {formattedDate}
              </Text>
              <Pressable onPress={() => getNextDate()}>
                <Image
                  source={images.APP.RIGHT}
                  style={{
                    height: 22,
                    width: 22,
                    resizeMode: 'contain',
                  }}></Image>
              </Pressable>
            </View>
            <View style={{flex: 0.3}}>
              <Image
                style={{height: 25, width: 25, resizeMode: 'contain'}}></Image>
            </View>
          </View>
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
              </View>

              <View style={styles.disc}>
                <ImageBackground
                  resizeMode="contain"
                  style={styles.kn_img}
                  source={images.FAT_IMAGE.ORANGE_100}></ImageBackground>

                <Text style={[styles.orange, styles.heading_text]}>
                  {strings.fat_heading}
                </Text>
              </View>

              <View style={styles.disc}>
                <ImageBackground
                  resizeMode="contain"
                  style={styles.kn_img}
                  source={images.PROTEIN_IMAGE.PROTEIN_100}></ImageBackground>

                <Text style={[styles.green, styles.heading_text]}>
                  {strings.protein_heading}
                </Text>
              </View>
            </View>
          </View>
          {renderMealView()}
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      {DefautView()}

      <Loader isLoading={isLoading || isLoadingFav} />
    </>
  );
};
export default MealHistory;
