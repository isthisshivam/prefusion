import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  AppState,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../AddVeg/style';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Header from '../../component/headerWithBackControl';
import Utility from '../../utility/Utility';
import Button from '../../component/smallButton';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../component/loader';
import {
  removeVeggiesRequest,
  addVeggiesRequest,
  veggiesInfoRequest,
} from '../../redux/action/VeggiesAction';
var userId = null;
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
];
var selectedBucketIndex = 0;

const AddVeg = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const [isUpdating, setUpdating] = useState(false);
  const [bucketArray, setBucketArray] = useState(bucketArrayHold);
  const userData = useSelector(state => state.other.loginReducer.userData);

  const userWeeklyInstance = useSelector(
    state => state.other.weekelyDataReducer.userData,
  );

  const veggiesReducerIsLoading = useSelector(
    state => state.other.veggiesReducer.showLoader,
  );

  const [dateValue, setDate] = useState('');
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }

    return (selectedBucketIndex = 0);
  }, []);

  useEffect(() => {
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        setDate(date_);
      } else {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();
        getUserVegggiesInstance(date_);
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
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        setDate(date_);
        getUserVegggiesInstance(date_);
      } else {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();
        setDate(date);
        getUserVegggiesInstance(date);
      }
    };
    //return;
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
    if (dateValue) {
      getUserVegggiesInstance(dateValue);
    }
  }, [dateValue]);

  const getUserVegggiesInstance = async date => {
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
    dispatch(veggiesInfoRequest(payload, onSSS, onFFF));
  };
  const onSSS = async resolve => {
    const {data} = resolve;
    console.log('getUserVegggiesInstance.reoslve=', data);
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
    setUpdating(!isUpdating);
    setBucketArray(bucketArray);
  };

  const focusToCurrentDate = () => {
    if (scrollRef != null && scrollRef != undefined) {
      if (scrollRef?.current) {
        if (global?.weekdays.length > 0) {
          let index = 1;
          for (let i = 0; i < global?.weekdays.length; i++) {
            if (dateValue == global?.weekdays[i].date) {
              index = i;
            }
          }
          setTimeout(() => {
            if (index && index != 0 && index != -1)
              scrollRef?.current?.scrollToIndex({animated: true, index: index});
          }, 10);
          //  scrollRef?.current?.scrollToIndex({animated: true, index: index});
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
    if (dateValue && global?.weekdays.length > 0) {
      focusToCurrentDate();
    }
  }, [dateValue]);
  const onFFF = resolve => {};

  const onAddServingPress = () => {
    let value = 0;
    bucketArray.forEach(e => {
      value += e.percent;
    });
    let payload = {
      uid: userId,
      date: dateValue,
      amount: value,
    };
    dispatch(addVeggiesRequest(payload, onS, onF));
  };
  const onS = resolve => {
    setTimeout(() => {
      setUpdating(!isUpdating);
      navigation.goBack();
    }, 500);
  };
  const onF = reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const onRemoveServingPress = () => {
    if (selectedBucketIndex != 0) {
      selectedBucketIndex--;
      bucketArray[selectedBucketIndex].isSelected = false;
      setBucketArray(bucketArray);
      let payload = {
        uid: userId,
        date: dateValue,
      };
      dispatch(removeVeggiesRequest(payload, onSS, onFF));
      setTimeout(() => {
        setUpdating(!isUpdating);
      }, 500);
    }
  };
  const onSS = resolve => {};
  const onFF = reject => {
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

  function setSelectedBucketCount() {
    selectedBucketIndex++;
  }
  const saveSelectedDate = async date => {
    await Utility.getInstance().saveSelectedDate(date);
  };
  const renderDates = item => {
    const {show_date, date, isSelected} = item.item;

    return (
      <Pressable
        onPress={() => [
          setUpdating(!isUpdating),
          setDate(date),
          (selectedBucketIndex = 0),
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
          ]),
          saveSelectedDate(date),
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
  const backPress = () => {
    navigation.goBack();
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
        <Pressable
          onPress={onAddServingPress}
          style={[styles.addView_darkgreen]}>
          <Text style={styles.headingtext}>Add Serving</Text>
        </Pressable>
        <Pressable onPress={onRemoveServingPress} style={styles.addView_red}>
          <Text style={[styles.headingtext]}>Remove Serving</Text>
        </Pressable>
      </View>
    );
  };

  const BucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <FlatList
          key={item => item.isSelected.toString()}
          data={bucketArray}
          horizontal
          extraData={isUpdating}
          contentContainerStyle={{flex: 1, justifyContent: 'center'}}
          renderItem={renderBucket}></FlatList>
      </View>
    );
  };
  const returnValuableBucket = (percent, i) => {
    var image = null;
    switch (percent) {
      case 0:
        image = images.APP.VEGGIE_EMPTY;
        break;
      case 0.5:
        image = images.VEG_IMAGE.VEG_50;
        break;
      case 1:
        image = images.VEG_IMAGE.VEG_100;
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
  const renderBucket = item => {
    const {isSelected, percent} = item.item;

    return (
      <Pressable
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() => returnBucketValues(item.index)}>
        <Image
          style={styles.bucket}
          source={returnValuableBucket(percent, item.index)}></Image>
      </Pressable>
    );
  };

  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />
          <Loader isLoading={veggiesReducerIsLoading} />
          <ScrollView>
            {DateView()}
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading, styles.font30]}>
                {strings.addVeg}
              </Text>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.white,
                ]}>
                {strings.vegDesc}
              </Text>
            </View>

            {BucketView()}
            <Button
              marginTop={100}
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
export default AddVeg;
