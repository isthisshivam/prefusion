import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../AddVeg/style';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../component/loader';
import Button from '../../component/smallButton';
import {
  addWaterRequest,
  removeWaterRequest,
  waterInfoRequest,
} from '../../redux/action/WaterAction';
var userId = null;
var selectedBucketIndex = 0;
var bucketArrayHold = [
  {
    isSelected: false,
    percent: 0,
  },
  {
    isSelected: false,
    percent: 0,
  },
  {
    isSelected: false,
    percent: 0,
  },
  {
    isSelected: false,
    percent: 0,
  },
  {
    isSelected: false,
    percent: 0,
  },
  {
    isSelected: false,
    percent: 0,
  },
];

const AddWater = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const userWeeklyInstance = useSelector(
    state => state.other.weekelyDataReducer.userData,
  );

  const userData = useSelector(state => state.other.loginReducer.userData);
  const [dateValue, setDate] = useState('');
  const [isUpdating, setUpdating] = useState(false);
  const [isLoadingAddGlass, setAddingGlass] = useState(false);
  const [isLoadingRemoveGlass, setRemovingGlass] = useState(false);
  const [waterReducerIsLoading, setwaterReducerIsLoading] = useState(false);
  const [bucketArray, setBucketArray] = useState(bucketArrayHold);

  useEffect(() => {
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        setDate(date_);
        getUserWaterInstance(date_);
      } else {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();
        setDate(date);
        getUserWaterInstance(date);
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
  const clearDateImmediate = async () => {
    await Utility.getInstance().clearDate();
  };
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
      selectedBucketIndex = 0;
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (dateValue && global.weekdays.length > 0) {
      getUserWaterInstance(dateValue);
      focusToCurrentDate();
    }
  }, [dateValue]);

  const saveSelectedDate = async date => {
    await Utility.getInstance().saveSelectedDate(date);
  };
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
  }, []);
  const backPress = () => {
    navigation.goBack();
  };
  const getUserWaterInstance = async date => {
    setBucketArray(bucketArrayHold);
    setUpdating(!isUpdating);
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
    setwaterReducerIsLoading(true);
    dispatch(waterInfoRequest(payload, onSSS, onFFF));
  };
  const onSSS = async resolve => {
    const {data} = resolve;
    console.log('waterInfoRequest.onSSS==', data);

    data.forEach((item, index) => {
      if (item === 0) {
        bucketArray[index].percent = 0;
      } else if (item === 0.5) {
        bucketArray[index].isSelected = true;
        bucketArray[index].percent = 0.5;
      } else if (item === 1) {
        bucketArray[index].isSelected = true;
        bucketArray[index].percent = 1;
      }
    });
    setwaterReducerIsLoading(false);
    setUpdating(!isUpdating);
    setBucketArray(bucketArray);
  };
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
  const onFFF = async reject => {
    setwaterReducerIsLoading(false);
  };

  const onAddServingPress = () => {
    // if (selectedBucketIndex != 20) {
    //   let payload = {
    //     uid: userId,
    //     date: dateValue,
    //     amount: bucketCounts,
    //   };

    //   dispatch(addWaterRequest(payload, onS, onF));
    // } else {
    //   Utility.getInstance().inflateToast('Limit exceed');
    // }
    let value = 0;
    bucketArray.forEach(e => {
      value += e.percent;
    });

    let payload = {
      uid: userId,
      date: dateValue,
      amount: value,
    };
    console.log('addWaterRequest.payload==', payload);

    dispatch(addWaterRequest(payload, onS, onF));
  };
  const onS = resolve => {
    console.log('addWaterRequest.resolve==', resolve);
    setTimeout(() => {
      setUpdating(!isUpdating);
      navigation.goBack();
    }, 500);
  };
  const onF = reject => {
    console.log('addWaterRequest.reject==', reject);
    Utility.getInstance().inflateToast(reject);
  };

  const onRemoveServingPress = () => {
    if (selectedBucketIndex != 0) {
      setRemovingGlass(true);

      let payload = {
        uid: userId,
        date: dateValue,
      };
      dispatch(removeWaterRequest(payload, onSS, onFF));
    }
  };
  const onSS = resolve => {
    selectedBucketIndex--;
    bucketArray[selectedBucketIndex].isSelected = false;
    setBucketArray(bucketArray);
    setTimeout(() => {
      setUpdating(!isUpdating);
      setRemovingGlass(false);
    }, 500);
  };
  const onFF = reject => {
    setRemovingGlass(false);
    Utility.getInstance().inflateToast(reject);
  };

  const DateView = () => {
    return (
      <FlatList
        horizontal
        ref={scrollRef}
        style={{marginTop: 20}}
        renderItem={renderDates}
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={scrollToIndexFailed}
        data={userWeeklyInstance && userWeeklyInstance.date}></FlatList>
    );
  };
  const renderDates = item => {
    const {show_date, date, isSelected} = item.item;
    return (
      <Pressable
        onPress={() => [
          setUpdating(!isUpdating),
          setDate(date),
          saveSelectedDate(date),
          setBucketArray([
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
            {
              isSelected: false,
            },
          ]),
          (selectedBucketIndex = 0),
          getUserWaterInstance(date),
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
  const AddView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 15,
        }}>
        {isLoadingAddGlass ? (
          <ActivityIndicator
            size={30}
            animating={isLoadingAddGlass}
            color="#FFFFFF"
          />
        ) : (
          <Pressable onPress={onAddServingPress} style={[styles.addView_blue]}>
            <Text style={styles.headingtext}>Add Glass</Text>
          </Pressable>
        )}
        {isLoadingRemoveGlass ? (
          <ActivityIndicator
            size={30}
            animating={isLoadingRemoveGlass}
            color="#FFFFFF"
          />
        ) : (
          <Pressable onPress={onRemoveServingPress} style={styles.addView_red}>
            <Text style={[styles.headingtext]}>Remove Glass</Text>
          </Pressable>
        )}
      </View>
    );
  };
  const returnValuableBucket = (percent, i) => {
    var image = null;
    switch (percent) {
      case 0:
        image = images.APP.BLUE_EMPTY;
        break;
      case 0.5:
        image = images.WATER_IMAGE.WATER_50;
        break;
      case 1:
        image = images.WATER_IMAGE.WATER_100;
        break;

      default:
    }
    console.log('returnValuableBucket.value', percent, image);
    return image;
  };

  const returnBucketValues = i => {
    bucketArray[i].isSelected = true;
    if (bucketArray[i].percent == 0) {
      bucketArray[i].percent = 0.5;
    } else if (bucketArray[i].percent == 0.5) {
      bucketArray[i].percent = 1;
    } else if (bucketArray[i].percent == 1) {
      bucketArray[i].percent = 0;
      bucketArray[i].isSelected = false;
    }
    setUpdating(!isUpdating);
    setBucketArray(bucketArray);
    console.log('returnBucketValues==', bucketArray);
  };

  const BucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <FlatList
          contentContainerStyle={{alignSelf: 'center'}}
          key={item => item.isSelected.toString()}
          data={bucketArray}
          extraData={isUpdating}
          numColumns={3}
          renderItem={renderBucket}></FlatList>
      </View>
    );
  };

  const renderBucket = item => {
    const {isSelected, percent} = item.item;
    return (
      <Pressable
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() => returnBucketValues(item.index)}>
        <Image
          style={[styles.bucket]}
          source={returnValuableBucket(percent, item.index)}></Image>
      </Pressable>
    );
  };

  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />
          <Loader isLoading={waterReducerIsLoading} />
          <ScrollView>
            {DateView()}
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading, styles.font30]}>
                {strings.addwater}
              </Text>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.white,
                ]}>
                {strings.addwater_desc}
              </Text>
            </View>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc.fontSize,
                globalStyles.textAlignCenter,
                globalStyles.padding_30_hor,
                styles.green,
              ]}>
              {strings.waterdesc}
            </Text>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc.fontSize,
                globalStyles.textAlignCenter,
                globalStyles.padding_20_hor,
              ]}>
              {strings.bucketsize}
            </Text>

            {BucketView()}
            <Button
              onClick={() => onAddServingPress()}
              heading="SAVE"
              color={colors.secondary}></Button>
          </ScrollView>
        </View>
      </>
    );
  };

  return DefautView();
};
export default AddWater;
