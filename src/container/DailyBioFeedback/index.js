import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  AppState,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import moment from 'moment';
import styles from '../DailyBioFeedback/style';
import Header from '../../component/headerWithBackControl';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import dummyContent from '../../constants/dummyContent';
import Indicator from '../../component/buttonIndicator';
import {useDispatch, useSelector} from 'react-redux';
import {
  addFeedbackRequest,
  feedbackInfoRequest,
} from '../../redux/action/FeedbackAction';
import {relaxationInfoRequest} from '../../redux/action/RelaxationAction';
var userId = null;
const DailyBioFeedback = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userWeeklyInstance = useSelector(
    state => state.other.weekelyDataReducer.userData,
  );
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.addFeedbackReducer.showLoader,
  );
  const scrollRef = useRef();
  const [techniqueArray, setTechniqueArray] = useState([]);

  const [dateValue, setDate] = useState('');
  const [gotSleep, setSleep] = useState('');
  const [feelEnergetic, setEnergetic] = useState('');
  const [exercise, setExercise] = useState('');
  const [technique, setTechnique] = useState('');

  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
  }, []);
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
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (dateValue && global.weekdays.length > 0) {
      getFeedbackInformation(dateValue);
      getRelaxationData();
      focusToCurrentDate();
    }
  }, [dateValue]);
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
  const getRelaxationData = () => {
    dispatch(relaxationInfoRequest({}, onRS, onRF));
  };
  const onRS = resolve => {
    const {data} = resolve;
    let newData = [];
    data.map(item => {
      newData.push(item.technique);
    });
    setTechniqueArray(newData);
  };
  const onRF = reject => {};

  const onContinuePress = date => {
    if (
      Utility.getInstance().isEmpty(gotSleep) ||
      Utility.getInstance().isEmpty(feelEnergetic) ||
      Utility.getInstance().isEmpty(exercise) ||
      Utility.getInstance().isEmpty(technique)
    ) {
      Utility.getInstance().inflateToast(strings.allmandatory);
    } else {
      let payload = {
        uid: userId,
        date: date,
        got_sleep: gotSleep == strings.yes ? 1 : 0,
        feel_energetic: feelEnergetic == strings.yes ? 1 : 0,
        exercise: exercise == strings.yes ? 1 : 0,
        relaxation_technique: technique,
      };
      console.log({payload});
      //  return;
      dispatch(addFeedbackRequest(payload, onS, onF));
    }
  };
  const onS = resolve => {
    const {message} = resolve;
    Utility.getInstance().inflateToast(message);
    setTimeout(() => {
      navigation.navigate('Home');
    }, 500);
  };

  const onF = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const getFeedbackInformation = async date => {
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
    dispatch(feedbackInfoRequest(payload, onSS, onFF));
  };
  const onSS = async resolve => {
    const {data} = resolve;

    if (data.got_sleep == '') {
      setSleep('');
    }
    if (data.feel_energetic == '') {
      setEnergetic('');
    }
    if (data.exercise == '') {
      setExercise('');
    }
    if (data.relaxation_technique == '') {
      setTechnique('');
    }
    if (
      data.got_sleep != '' &&
      data.feel_energetic != '' &&
      data.exercise != '' &&
      data.relaxation_technique != ''
    ) {
      setSleep(data.got_sleep == strings.one ? 'yes' : 'No');
      setEnergetic(data.feel_energetic == strings.one ? 'Yes' : 'No');
      setExercise(data.exercise == strings.one ? 'Yes' : 'No');
      setTechnique(data.relaxation_technique);
    }
  };
  const onFF = async reject => {};
  function clearStateVariables() {
    setSleep('');
    setEnergetic('');
    setExercise('');
    setTechnique('');
  }
  const backPress = () => {
    navigation.goBack();
  };
  console.log(
    'userWeeklyInstance && userWeeklyInstance.date=>',
    userWeeklyInstance && userWeeklyInstance.date,
  );
  const DateView = () => {
    return (
      <FlatList
        ref={scrollRef}
        horizontal
        style={{marginTop: 20}}
        renderItem={renderDates}
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={scrollToIndexFailed}
        data={userWeeklyInstance && userWeeklyInstance.date}></FlatList>
    );
  };
  const saveSelectedDate = async date => {
    await Utility.getInstance().saveSelectedDate(date);
  };
  const renderDates = item => {
    const {show_date, date, isSelected} = item.item;
    return (
      <Pressable
        onPress={() => [
          saveSelectedDate(date),
          clearStateVariables(),
          setDate(date),
          getFeedbackInformation(date),
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

  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {DateView()}
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading, styles.font30]}>
                {strings.biofeedback}
              </Text>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  globalStyles.textAlignStart,
                  globalStyles.white,
                ]}>
                {strings.biofeedbackDesc}
              </Text>
              <View style={[globalStyles.center, globalStyles.padding_40]}>
                <Text style={[globalStyles.input_heading, globalStyles.mt_30]}>
                  {strings.getsleep}
                </Text>
                <SelectDropdown
                  data={dummyContent.question}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem);
                    setSleep(selectedItem);
                  }}
                  defaultButtonText={gotSleep}
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
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
                <Text style={[globalStyles.input_heading, globalStyles.mt_30]}>
                  {strings.fellenergic}
                </Text>
                <SelectDropdown
                  data={dummyContent.question}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem);
                    setEnergetic(selectedItem);
                  }}
                  defaultButtonText={feelEnergetic}
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
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
                <Text style={[globalStyles.input_heading, globalStyles.mt_30]}>
                  {strings.enggaged}
                </Text>
                <SelectDropdown
                  data={dummyContent.question}
                  onSelect={(selectedItem, index) => {
                    //console.log(selectedItem);
                    setExercise(selectedItem);
                  }}
                  defaultButtonText={exercise}
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
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
                <Text style={[globalStyles.input_heading, globalStyles.mt_30]}>
                  {strings.excercise}
                </Text>
                <SelectDropdown
                  data={techniqueArray}
                  onSelect={(selectedItem, index) => {
                    //console.log(selectedItem);
                    setTechnique(selectedItem);
                  }}
                  defaultButtonText={technique}
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
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
              </View>

              <TouchableOpacity
                onPress={() => onContinuePress(dateValue)}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_30,
                ]}>
                {isLoading ? (
                  <Indicator isAnimating={isLoading} />
                ) : (
                  <Text style={globalStyles.btn_heading_black}>
                    {strings.continue}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </>
    );
  };

  return DefautView();
};
export default DailyBioFeedback;
