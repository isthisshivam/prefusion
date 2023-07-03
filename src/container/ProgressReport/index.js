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
  Dimensions,
  Animated,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Header from '../../component/headerWithBackControl';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../ProgressReport/style';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Loader from '../../component/loader';
import colors from '../../constants/colorCodes';
import {useDispatch, useSelector} from 'react-redux';
import {progressInfoRequest} from '../../redux/action/ProgressReportAction';
import Utility from '../../utility/Utility';
import {weekelyListRequest} from '../../redux/action/WeekelyDataAction';
import {GradientCircularProgress} from 'react-native-circular-gradient-progress';
import ProgressDialogView from '../../component/ProgressDialog';
var userId = null;
var start_date = null;
var end_date = null;
var DIVISOR = 7;
const labels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const ProgressReport = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.progressReportInfoReducer.showLoader,
  );
  const isLoadingWeekly = useSelector(
    state => state.other.progressReportInfoReducer.showLoader,
  );
  const progressReportInfoReducerData = useSelector(
    state => state.other.progressReportInfoReducer.userData,
  );
  const weekelyListReducer = useSelector(
    state => state.other.weekelyListReducer.userData,
  );
  const [isBio, setBio] = useState(true);
  const [weekValue, setWeek] = useState(
    weekelyListReducer && weekelyListReducer[0].week,
  );
  const [status_code, setStatusCode] = useState(null);
  const [isCalorie, setCalorie] = useState(false);
  const [isCarbs, setCarbs] = useState(false);
  const [isFat, setFat] = useState(false);
  const [isProtein, setProtein] = useState(false);
  const [isWeight, setWeight] = useState(false);
  const [value, setValue] = useState(null);
  const [isVisible, setVisible] = useState(false);
  const [dailyTargets, setDailyTargets] = useState({
    carbs_target: 0,
    fat_target: 0,
    protein_target: 0,
  });
  if (weekelyListReducer) {
    start_date = weekelyListReducer[0].week_start;
    end_date = weekelyListReducer[0].week_end;
  }
  const getBucketCounts = (carbs = 0, fat = 0, protein = 0) => {
    var p_total;
    var f_total;
    var c_total;
    var c_left;
    var f_left;
    var p_left;
    c_total = f_total = p_total = 0;
    {
      c_total = parseInt(carbs / 20);
      c_left = carbs % 20;
      c_total +=
        c_left < 16 && c_left > 2
          ? c_left < 12
            ? c_left < 7
              ? 0.25
              : 0.5
            : 0.75
          : c_left > 15
          ? 1
          : 0;
    }
    {
      p_total = parseInt(protein / 20);
      p_left = protein % 20;

      p_total +=
        p_left < 16 && p_left > 2
          ? p_left < 12
            ? p_left < 7
              ? 0.25
              : 0.5
            : 0.75
          : p_left > 15
          ? 1
          : 0;
    }
    if (fat > 0.49 && fat < 1) {
      f_total = 0.25;
    } else {
      f_total = parseInt(fat / 10);
      f_left = fat % 10;
      f_total +=
        f_left < 9 && f_left > 0
          ? f_left < 6
            ? f_left < 4
              ? 0.25
              : 0.5
            : 0.75
          : f_left > 8
          ? 1
          : 0;
    }
    p_left = protein % 20;
    console.log('[c_total, f_total, p_total]=>', [c_total, f_total, p_total]);
    // setDailyTargets({
    //   carbs_target: c_total,
    //   fat_target: f_total,
    //   protein_target: p_total,
    // });
    return [c_total, f_total, p_total];
  };
  useEffect(() => {
    if (progressReportInfoReducerData) {
      const {calories_goal, fat_goal, protein_goal} =
        progressReportInfoReducerData;
    }
  }, [progressReportInfoReducerData]);
  console.log({progressReportInfoReducerData});
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    const focus = navigation.addListener('focus', () => {
      getWeekelyRangeList();
    });
    return () => {
      focus;
    };
  }, []);
  const askAgainForResult = () => {
    getWeekelyRangeList();
  };
  const getWeekelyRangeList = () => {
    let payload = {};
    dispatch(weekelyListRequest(payload, onSS, onFF));
  };
  const onSS = resolve => {
    const {data} = resolve;
    setWeek(data[0].week);
    getProgressReportInfo(start_date, end_date);
  };
  const onFF = reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const getProgressReportInfo = (sd, ed) => {
    let payload = {
      uid: userId,
      start_date: sd,
      end_date: ed,
    };
    console.log('payload=>', JSON.stringify(payload));
    dispatch(progressInfoRequest(payload, onS, onF));
  };
  const onS = resolve => {
    const {data, status} = resolve;
    setStatusCode(status);
    console.log('resolve====>', data);
  };
  const onF = reject => {
    setStatusCode(400);
  };

  const backPress = () => {
    navigation.goBack();
  };

  // const getPercentage = (value, totalValue) => {
  //   let data = parseInt(totalValue) - parseInt(value);
  //   let data1 = (data / parseInt(totalValue)) * 100;
  //   return Math.abs(parseInt(data1));
  // };
  const getPercentage = (value, totalValue) => {
    let data = parseInt(totalValue) - parseInt(value);
    let data1 = (data / parseInt(totalValue)) * 100;
    return Math.round(data1);
  };
  const isBelowOrAbove = (value, target) => {
    if (parseInt(target) > parseInt(value)) {
      return 'below';
    } else {
      return 'above';
    }
  };
  const ProgressView = () => {
    return (
      <FlatList
        horizontal
        style={{marginTop: 15}}
        renderItem={renderProgress}
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        data={weekelyListReducer && weekelyListReducer}></FlatList>
    );
  };

  const renderProgress = item => {
    const {week, week_end, week_start} = item.item;
    return (
      <Pressable
        onPress={() => [
          setWeek(week),
          getProgressReportInfo(week_start, week_end),
        ]}
        style={[
          styles.dateView_,
          {
            borderWidth: weekValue == week ? 2 : 0.3,
          },
        ]}>
        <Text
          style={[
            styles.headingT,
            {color: weekValue == week ? colors.white : colors.gray},
          ]}>
          {week}
        </Text>
      </Pressable>
    );
  };

  const BioView = () => {
    return (
      <View>
        <View style={{marginTop: 0, paddingHorizontal: 20}}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: colors.white,
            }}>
            {'Did you get 6-8 hours or more of sleep?'}
          </Text>
          {renderBioChildView(
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.got_sleep?.yes,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.got_sleep?.no,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.got_sleep?.no_response,
          )}
        </View>
        <View style={{marginTop: 30, paddingHorizontal: 20}}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: colors.white,
            }}>
            {'Felt energetic upon waking up?'}
          </Text>
          {renderBioChildView(
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.feel_energetic?.yes,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.feel_energetic?.no,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.feel_energetic?.no_response,
          )}
        </View>
        <View style={{marginTop: 30, paddingHorizontal: 20}}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: colors.white,
            }}>
            {'Engaged in some form of exercise?'}
          </Text>
          {renderBioChildView(
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.exercise?.yes,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.exercise?.no,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.exercise?.no_response,
          )}
        </View>
        <View style={{marginTop: 30, paddingHorizontal: 20}}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: colors.white,
            }}>
            {'Performed any relaxation techniques?'}
          </Text>
          {renderBioChildView(
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.relaxation_technique?.yes,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.relaxation_technique?.no,
            progressReportInfoReducerData &&
              progressReportInfoReducerData?.relaxation_technique?.no_response,
          )}
        </View>
      </View>
    );
  };

  const getProgress = value => {
    let result = (parseInt(value) / DIVISOR) * 100;
    return result;
  };
  const renderBioChildView = (one, two, three) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.progressgoalchildc}>
          <View style={styles.progressbar}>
            <GradientCircularProgress
              startColor={colors.primary}
              middleColor={colors.secondary}
              endColor={colors.primary}
              size={85}
              emptyColor={colors.black}
              progress={getProgress(one)}
              strokeWidth={6}>
              <Text style={styles.lbs}>{one}</Text>
            </GradientCircularProgress>
            <Text
              style={[
                styles.bucketSize,
                globalStyles.mt_10,
                globalStyles.textAlignCenter,
              ]}>
              {`Yes`}
            </Text>
          </View>
        </View>
        <View style={styles.progressgoalchildc}>
          <View style={styles.progressbar}>
            <GradientCircularProgress
              startColor={colors.primary}
              middleColor={colors.secondary}
              endColor={colors.primary}
              size={85}
              emptyColor={colors.black}
              progress={getProgress(two)}
              strokeWidth={6}>
              <Text style={styles.lbs}>{two}</Text>
            </GradientCircularProgress>
            <Text
              style={[
                styles.bucketSize,
                globalStyles.mt_10,
                globalStyles.textAlignCenter,
              ]}>
              {`No`}
            </Text>
          </View>
        </View>
        <View style={styles.progressgoalchildc}>
          <View style={styles.progressbar}>
            <GradientCircularProgress
              startColor={colors.primary}
              middleColor={colors.secondary}
              endColor={colors.primary}
              size={85}
              emptyColor={colors.black}
              progress={getProgress(three)}
              strokeWidth={6}>
              <Text style={styles.lbs}>{three}</Text>
            </GradientCircularProgress>
            <Text
              style={[
                styles.bucketSize,
                globalStyles.mt_10,
                globalStyles.textAlignCenter,
              ]}>
              {`No response`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const Chart = (dataArray, color) => {
    return (
      <LineChart
        data={{
          labels: labels,

          datasets: [
            {
              data: dataArray,
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={260}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: colors.primary,
          backgroundGradientFrom: colors.primary,
          backgroundGradientTo: colors.primary,
          //linejoinType: 'round',
          // scrollableDotFill: 'round',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 0.2) => color,
          labelColor: (opacity = 0.2) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          // FillProps: {
          //   fill: 'red',
          // },
          propsForBackgroundLines: {
            stroke: colors.primary,
            r: '10',
          },
          strokeWidth: 1,
          // scrollableDotStrokeColor: 'red',
          scrollableInfoViewStyle: {
            width: 120,
            height: 120,
            //backgroundColor: 'red',
          },
          scrollableInfoTextStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 130,
          },
          scrollableInfoSize: {width: 133, height: 120},
          propsForVerticalLabels: {
            rotation: 310,
            fontSize: 9,
            fontFamily: 'Poppins-Regular',
          },
          propsForHorizontalLabels: {
            //rotation: 310,
            fontSize: 10,
            fontFamily: 'Poppins-Medium',
          },

          propsForDots: {
            r: '2',
            strokeWidth: '3',
            //backgroundColor: 'red',
            stroke: color,
          },
        }}
        //onDataPointClick={data => <InfoView value={data}></InfoView>}
        onDataPointClick={data => setValue(data)}
        bezier
        style={{
          marginVertical: 8,
          marginTop: -10,
          // borderRadius: 16,
        }}></LineChart>
    );
  };
  useEffect(() => {
    if (value) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [value]);

  const InfoView = () => {
    return (
      <ProgressDialogView
        onTouchOutside={() => [setValue(null), setVisible(false)]}
        willInflate={isVisible}
        children={InfoViewContent()}></ProgressDialogView>
    );
  };
  const InfoViewContent = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: 'black',
          alignItems: 'center',
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View
            style={{
              height: 10,
              width: 10,
              backgroundColor: 'green',
              borderRadius: 5,
            }}></View>
          <Text
            style={{
              color: colors.white,
              fontSize: 14,
              marginLeft: 7,
              lineHeight: 15,
              fontFamily: 'Poppins-Regular',
            }}>
            {labels[value?.index]}
          </Text>
        </View>
        <Text
          style={{
            color: colors.white,
            fontSize: 15,
            lineHeight: 17,
            marginLeft: 5,
            marginTop: 5,
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
          }}>
          {isCalorie
            ? `${value?.value} 
calories`
            : isCarbs
            ? `${value?.value}g 
carbs`
            : isFat
            ? `${value?.value}g
fat`
            : `${value?.value}g
protein`}
        </Text>
      </View>
    );
  };

  const WeightChart = (dataArray, weight_labels, color) => {
    return (
      <LineChart
        data={{
          labels: weight_labels ? weight_labels : [],

          datasets: [
            {
              data: dataArray,
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={220}
        // yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: colors.primary,
          backgroundGradientFrom: colors.primary,
          backgroundGradientTo: colors.primary,
          //linejoinType: 'round',
          // scrollableDotFill: 'round',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 0.2) => color,
          labelColor: (opacity = 0.2) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          // FillProps: {
          //   fill: 'red',
          // },
          propsForBackgroundLines: {
            stroke: colors.primary,
            r: '10',
          },
          strokeWidth: 1,
          // scrollableDotStrokeColor: 'red',
          scrollableInfoViewStyle: {
            width: 120,
            height: 120,
            //backgroundColor: 'red',
          },
          scrollableInfoTextStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 130,
          },
          scrollableInfoSize: {width: 133, height: 120},
          propsForVerticalLabels: {
            rotation: 310,
            fontSize: 9,
            fontFamily: 'Poppins-Regular',
          },
          propsForHorizontalLabels: {
            //rotation: 310,
            fontSize: 10,
            fontFamily: 'Poppins-Medium',
          },

          propsForDots: {
            r: '3',
            strokeWidth: '3',
            //backgroundColor: 'red',
            stroke: color,
          },
        }}
        //onDataPointClick={value => setValue(value)}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  };
  const CalorieView = () => {
    return (
      <View style={[globalStyles.padding_40_hor, globalStyles.center]}>
        {Chart(
          progressReportInfoReducerData
            ? progressReportInfoReducerData?.calories_array
            : [],
          colors.blue,
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.progressgoalchildc}>
            <View style={styles.progressbar}>
              <GradientCircularProgress
                startColor={colors.primary}
                middleColor={colors.secondary}
                endColor={colors.primary}
                size={85}
                emptyColor={colors.black}
                progress={70}
                strokeWidth={6}>
                <Text style={styles.lbs}>
                  {progressReportInfoReducerData &&
                    progressReportInfoReducerData?.calories_goal}
                </Text>
              </GradientCircularProgress>
              <Text
                style={[
                  styles.bucketSize,
                  globalStyles.mt_10,
                  globalStyles.textAlignCenter,
                ]}>
                {`Daily Calorie Goal`}
              </Text>
            </View>
          </View>
          <View style={styles.progressgoalchildc}>
            <View style={styles.progressbar}>
              <GradientCircularProgress
                startColor={colors.primary}
                middleColor={colors.secondary}
                endColor={colors.primary}
                size={85}
                emptyColor={colors.black}
                progress={70}
                strokeWidth={6}>
                <Text style={styles.lbs}>
                  {progressReportInfoReducerData &&
                    progressReportInfoReducerData?.calories_average}
                </Text>
              </GradientCircularProgress>
              <Text
                style={[
                  styles.bucketSize,
                  globalStyles.mt_10,
                  globalStyles.textAlignCenter,
                ]}>
                {`Weekly Average`}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={[styles.whydesc, globalStyles.textAlignCenter, styles.white]}>
          {'You have performed ' +
            getPercentage(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.calories_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.calories_goal,
            ) +
            '% ' +
            isBelowOrAbove(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.calories_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.calories_goal,
            ) +
            ' your daily target over the last ' +
            progressReportInfoReducerData?.averageOfDays +
            ' days. Don’t forget to use our chat feature for help on how to hit  your targeted goal!'}
        </Text>
      </View>
    );
  };
  const WeightView = () => {
    return (
      <View style={[globalStyles.padding_40_hor, globalStyles.center]}>
        {WeightChart(
          progressReportInfoReducerData
            ? progressReportInfoReducerData?.weight
            : [],
          progressReportInfoReducerData?.weight_labels,
          colors.blue,
        )}

        <Text
          style={[
            styles.whydesc,
            globalStyles.textAlignCenter,
            styles.white,
            globalStyles.mt_40,
          ]}>
          {strings.currenweight + ` Change: `}
          <Text
            style={[
              styles.whydesc,
              globalStyles.textAlignCenter,
              styles.green,
              globalStyles.mt_40,
            ]}>
            {progressReportInfoReducerData &&
              progressReportInfoReducerData?.weight_change + `lbs`}
          </Text>
        </Text>
      </View>
    );
  };
  const CarbsBucketView = dataArray => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 0,
          paddingVertical: 20,
        }}>
        <FlatList
          numColumns={10}
          data={dataArray}
          renderItem={renderCarbsBucket}></FlatList>
      </View>
    );
  };
  const renderCarbsBucket = item => {
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
    else if (item.item == 0)
      return (
        <Image style={styles.bucketImg} source={images.APP.RED_EMPTY}></Image>
      );
  };
  const CarbsView = () => {
    return (
      <View style={globalStyles.padding_20_hor}>
        {Chart(
          progressReportInfoReducerData
            ? progressReportInfoReducerData?.carbs_array
            : [],
          colors.red,
        )}

        <View
          style={{
            // backgroundColor: 'yellow',
            justifyContent: 'center',
            marginTop: 24,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              color: colors.white,
            }}>
            {`Daily Carbs Target:  `}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              // height: 60,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: colors.red,
              }}>
              {progressReportInfoReducerData &&
                `${progressReportInfoReducerData?.carbs_goal} g =`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                  //marginLeft: 10,
                }}
                source={images.CARBS_IMAGE.CARBS_100}></Image>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  marginTop: 5,
                  color: colors.red,
                }}>
                {progressReportInfoReducerData &&
                  getBucketCounts(
                    progressReportInfoReducerData?.carbs_goal,
                    progressReportInfoReducerData?.fat_goal,
                    progressReportInfoReducerData?.protein_goal,
                  )[0] + ' Buckets'}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 24,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              color: colors.white,
            }}>
            {`Average Carbs Consumed:  `}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              // height: 60,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: colors.red,
              }}>
              {progressReportInfoReducerData &&
                `${progressReportInfoReducerData?.carbs_average} g = `}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                  marginLeft: 0,
                }}
                source={images.CARBS_IMAGE.CARBS_100}></Image>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: colors.red,
                  marginTop: 5,
                }}>
                {progressReportInfoReducerData &&
                  getBucketCounts(
                    progressReportInfoReducerData?.carbs_average,
                    progressReportInfoReducerData?.fat_average,
                    progressReportInfoReducerData?.protein_average,
                  )[0] + ' Buckets'}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.whydesc,
            globalStyles.textAlignCenter,
            styles.white,
            {fontSize: 14},
          ]}>
          {'You have performed ' +
            getPercentage(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.carbs_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.carbs_goal,
            ) +
            '% ' +
            isBelowOrAbove(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.carbs_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.carbs_goal,
            ) +
            ' your daily target over the last ' +
            progressReportInfoReducerData?.averageOfDays +
            ' days. Don’t forget to use our chat feature for help on how to hit  your targeted goal!'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', 0)}
          style={[
            globalStyles.button_secondary_extra_width,
            globalStyles.center,
            globalStyles.button,
            globalStyles.font17,
            {
              width: '50%',
              alignSelf: 'center',
              margin: 40,
              height: 30,
              borderRadius: 4,
            },
          ]}>
          <Text style={globalStyles.btn_heading_black_small}>CHAT WITH US</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const FatView = () => {
    return (
      <View style={globalStyles.padding_20_hor}>
        {/* <Chart data={[]} /> */}
        {Chart(
          progressReportInfoReducerData
            ? progressReportInfoReducerData?.fat_array
            : [],
          colors.orange,
        )}
        <View
          style={{
            // backgroundColor: 'yellow',
            justifyContent: 'center',
            marginTop: 24,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              color: colors.white,
            }}>
            {`Daily Fat Target:  `}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              // height: 60,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: colors.orange,
              }}>
              {progressReportInfoReducerData &&
                `${progressReportInfoReducerData?.fat_goal} g =`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                  marginLeft: 0,
                }}
                source={images.FAT_IMAGE.ORANGE_100}></Image>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: colors.orange,
                }}>
                {progressReportInfoReducerData &&
                  getBucketCounts(
                    progressReportInfoReducerData?.carbs_goal,
                    progressReportInfoReducerData?.fat_goal,
                    progressReportInfoReducerData?.protein_goal,
                  )[1] + ' Buckets'}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 24,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              color: colors.white,
            }}>
            {`Average Fat Consumed:  `}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              // height: 60,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: colors.orange,
              }}>
              {progressReportInfoReducerData &&
                `${progressReportInfoReducerData?.fat_average} g =`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                  // marginLeft: 10,
                }}
                source={images.FAT_IMAGE.ORANGE_100}></Image>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: colors.orange,
                }}>
                {progressReportInfoReducerData &&
                  getBucketCounts(
                    progressReportInfoReducerData?.carbs_average,
                    progressReportInfoReducerData?.fat_average,
                    progressReportInfoReducerData?.protein_average,
                  )[1] + ' Buckets'}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.whydesc,
            globalStyles.textAlignCenter,
            styles.white,
            {fontSize: 14},
          ]}>
          {'You have performed ' +
            getPercentage(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.fat_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.fat_goal,
            ) +
            '% ' +
            isBelowOrAbove(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.fat_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.fat_goal,
            ) +
            ' your daily target over the last ' +
            progressReportInfoReducerData?.averageOfDays +
            ' days. Don’t forget to use our chat feature for help on how to hit  your targeted goal!'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', 0)}
          style={[
            globalStyles.button_secondary_extra_width,
            globalStyles.center,
            globalStyles.button,
            globalStyles.font17,
            {
              width: '50%',
              alignSelf: 'center',
              margin: 40,
              height: 30,
              borderRadius: 4,
            },
          ]}>
          <Text style={globalStyles.btn_heading_black_small}>CHAT WITH US</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const FatBucketView = dataArray => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 0,
          paddingVertical: 20,
        }}>
        <FlatList
          numColumns={10}
          data={dataArray}
          renderItem={renderFatsBucket}></FlatList>
      </View>
    );
  };
  const renderFatsBucket = item => {
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
    else if (item.item == 0)
      return (
        <Image
          style={styles.bucketImg}
          source={images.APP.ORANGE_EMPTY}></Image>
      );
  };
  const ProteinBucketView = dataArray => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}>
        <FlatList
          numColumns={10}
          data={dataArray}
          renderItem={renderProteinBucket}></FlatList>
      </View>
    );
  };
  const ProteinView = () => {
    return (
      <View style={globalStyles.padding_20_hor}>
        {Chart(
          progressReportInfoReducerData
            ? progressReportInfoReducerData?.protein_array
            : [],
          colors.secondary,
        )}

        <View
          style={{
            justifyContent: 'center',
            marginTop: 24,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              color: colors.white,
            }}>
            {`Daily Protein Target:  `}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              // height: 60,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: colors.green,
              }}>
              {progressReportInfoReducerData &&
                `${progressReportInfoReducerData?.protein_goal}g = `}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                  //marginLeft: 10,
                }}
                source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: colors.green,
                  marginTop: 5,
                }}>
                {progressReportInfoReducerData &&
                  getBucketCounts(
                    progressReportInfoReducerData?.carbs_goal,
                    progressReportInfoReducerData?.fat_goal,
                    progressReportInfoReducerData?.protein_goal,
                  )[2] + ' Buckets'}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            //height: 60,
            marginTop: 22,
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              color: colors.white,
            }}>
            {`Average Protein Consumed:  `}
            {/* <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              color: colors.green,
            }}>
            {progressReportInfoReducerData &&
              progressReportInfoReducerData?.protein_average + `g`}
          </Text> */}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',

              //  height: 60,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: colors.green,
              }}>
              {progressReportInfoReducerData &&
                `${progressReportInfoReducerData?.protein_average}g =`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                  marginLeft: 10,
                }}
                source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  marginTop: 5,
                  marginTop: 5,
                  color: colors.green,
                }}>
                {progressReportInfoReducerData &&
                  getBucketCounts(
                    progressReportInfoReducerData?.carbs_average,
                    progressReportInfoReducerData?.fat_average,
                    progressReportInfoReducerData?.protein_average,
                  )[2] + ' Buckets'}
              </Text>
            </View>
          </View>
        </View>
        {/* {ProteinBucketView(
          progressReportInfoReducerData &&
            progressReportInfoReducerData?.protein_average_array,
        )} */}
        <Text
          style={[
            styles.whydesc,
            globalStyles.textAlignCenter,
            styles.white,
            {fontSize: 14},
          ]}>
          {'You have performed ' +
            getPercentage(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.protein_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.protein_goal,
            ) +
            '% ' +
            isBelowOrAbove(
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.protein_average,
              progressReportInfoReducerData &&
                progressReportInfoReducerData?.protein_goal,
            ) +
            ' your daily target over the last ' +
            progressReportInfoReducerData?.averageOfDays +
            ' days. Don’t forget to use our chat feature for help on how to hit  your targeted goal!'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', 0)}
          style={[
            globalStyles.button_secondary_extra_width,
            globalStyles.center,
            globalStyles.button,
            globalStyles.font17,
            {
              width: '50%',
              alignSelf: 'center',
              margin: 40,
              height: 30,
              borderRadius: 4,
            },
          ]}>
          <Text style={globalStyles.btn_heading_black_small}>CHAT WITH US</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderProteinBucket = item => {
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
    else if (item.item == 0)
      return (
        <Image style={styles.bucketImg} source={images.APP.GREEN_EMPTY}></Image>
      );
  };

  const BottomTabMenu = () => {
    return (
      <View style={globalStyles.bottom_tab_c}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyGoal')}
          style={globalStyles.bottom_tab_item_c}>
          <Image
            source={images.APP.GOAL}
            style={[
              globalStyles.bottom_tab_item_img,
              {tintColor: colors.white},
            ]}
          />
          <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
            Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('AddMeal')}
          style={globalStyles.bottom_tab_item_c}>
          <Text
            style={[
              globalStyles.bottom_tab_text,
              {marginTop: -10, color: colors.white},
            ]}>
            Add Meal
          </Text>
          <View style={globalStyles.bottom_tab_addmeal_c}>
            <Image
              source={images.SIGNUP.PLUS}
              style={[
                globalStyles.bottom_tab_item_img_plus,
                {tintColor: colors.secondary},
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ProgressReport')}
          style={globalStyles.bottom_tab_item_c}>
          <Image
            source={images.APP.PROGRESS}
            style={[
              globalStyles.bottom_tab_item_img,
              {tintColor: colors.secondary},
            ]}
          />
          <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
            Progress
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const somethingWrongView = () => {
    console.log('called');
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: 'red',
          width: 400,
          height: 400,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => askAgainForResult()}
          style={{
            height: 34,
            width: 120,
            backgroundColor: colors.green,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          }}>
          <Text
            style={[
              styles.why_heading,
              styles.white,
              {alignSelf: 'center', fontSize: 14},
            ]}>
            {'Try Again'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />
          <Loader isLoading={isLoading || isLoadingWeekly} />
          {status_code == 400 && somethingWrongView()}
          {status_code != 400 && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[globalStyles.center, globalStyles.padding_30_hor]}>
                <Text style={[styles.why_heading, styles.font30, styles.white]}>
                  {strings.ProgressReport}
                </Text>
              </View>
              {!isWeight && ProgressView()}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                style={{
                  height: 100,
                  backgroundColor: colors.primary,
                }}>
                <Pressable
                  onPress={() => [
                    setBio(true),
                    setCalorie(false),
                    setCarbs(false),
                    setFat(false),
                    setWeight(false),
                    setProtein(false),
                  ]}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: isBio
                      ? colors.secondary
                      : colors.light_gray,
                    borderBottomWidth: 4,
                    height: 35,
                    width: 120,
                  }}>
                  <Text
                    style={{
                      fontSize: isBio ? 16 : 14,
                      fontFamily: isBio ? 'Poppins-Medium' : 'Poppins-Light',
                      color: colors.secondary,
                    }}>
                    BioFeedback
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => [
                    setBio(false),
                    setWeight(true),
                    setCalorie(false),
                    setCarbs(false),
                    setFat(false),
                    setProtein(false),
                  ]}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: isWeight
                      ? colors.blue
                      : colors.light_gray,
                    borderBottomWidth: 4,
                    height: 35,
                    fontSize: isWeight ? 16 : 14,
                    width: 80,
                  }}>
                  <Text
                    style={{
                      fontFamily: isWeight ? 'Poppins-Medium' : 'Poppins-Light',
                      color: isWeight ? colors.blue : colors.gray,
                    }}>
                    Weight
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => [
                    setBio(false),
                    setCalorie(true),
                    setCarbs(false),
                    setFat(false),
                    setProtein(false),
                    setWeight(false),
                  ]}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: isCalorie
                      ? colors.white
                      : colors.light_gray,
                    borderBottomWidth: 4,
                    height: 35,
                    fontSize: isCalorie ? 16 : 14,
                    width: 80,
                  }}>
                  <Text
                    style={{
                      fontFamily: isCalorie
                        ? 'Poppins-Medium'
                        : 'Poppins-Light',
                      color: isCalorie ? colors.white : colors.gray,
                    }}>
                    Calories
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => [
                    setBio(false),
                    setCalorie(false),
                    setCarbs(true),
                    setFat(false),
                    setProtein(false),
                    setWeight(false),
                  ]}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',

                    borderBottomColor: isCarbs ? colors.red : colors.light_gray,
                    borderBottomWidth: 4,
                    height: 35,
                    width: 80,
                  }}>
                  <Text
                    style={{
                      fontSize: isCarbs ? 16 : 14,

                      color: colors.red,
                      fontFamily: isCarbs ? 'Poppins-Medium' : 'Poppins-Light',
                    }}>
                    Carbs
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => [
                    setBio(false),
                    setCalorie(false),
                    setCarbs(false),
                    setFat(true),
                    setProtein(false),
                    setWeight(false),
                  ]}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: isFat
                      ? colors.orange
                      : colors.light_gray,
                    borderBottomWidth: 4,
                    height: 35,
                    width: 80,
                  }}>
                  <Text
                    style={{
                      fontSize: isFat ? 16 : 14,
                      color: colors.orange,
                      fontFamily: isFat ? 'Poppins-Medium' : 'Poppins-Light',
                    }}>
                    Fat
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => [
                    setBio(false),
                    setCalorie(false),
                    setCarbs(false),
                    setFat(false),
                    setProtein(true),
                    setWeight(false),
                  ]}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: isProtein
                      ? colors.green
                      : colors.light_gray,
                    borderBottomWidth: 4,
                    height: 35,
                    width: 80,
                  }}>
                  <Text
                    style={{
                      fontSize: isProtein ? 16 : 14,
                      color: colors.secondary,
                      fontFamily: isProtein
                        ? 'Poppins-Medium'
                        : 'Poppins-Light',
                    }}>
                    Protein
                  </Text>
                </Pressable>
              </ScrollView>
              {isBio && BioView()}
              {isWeight && WeightView()}
              {isCalorie && CalorieView()}
              {isCarbs && CarbsView()}
              {isFat && FatView()}
              {isProtein && ProteinView()}
              {InfoView()}
            </ScrollView>
          )}
        </View>
      </>
    );
  };

  return DefautView();
};
export default ProgressReport;
