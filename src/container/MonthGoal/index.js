import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from './style';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Indicator from '../../component/buttonIndicator';
import warning from '../../constants/warning';
import Utility from '../../utility/Utility';
import colors from '../../constants/colorCodes';
import DialogView from '../../component/dialog';
import dummyContent from '../../constants/dummyContent';
import {updateUserInformationRequest} from '../../redux/action/UserProfileInfo';
import {uploadUserCalorieDataRequest} from '../../redux/action/CalorieDropdownAction';
import {userProfileInfoRequest} from '../../redux/action/UserProfileInfo';
import Loader from '../../component/loader';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
var userId = null;
var payloadToSend = null;
const MonthGoal = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );
  const [showLoader, setShowLoader] = useState(false);
  const [willInflate, setWillInflate] = useState(false);
  const [startingWeight, setStartingWeight] = useState('');
  const [comingFrom] = useState(props.route.params.FROM);
  const [description, setDescription] = useState('');
  const [goalWeightChange, setGoalWeightChange] = useState('');
  const [currentFatTissue, setCurrentFatTissue] = useState('');
  const [currentLeanTissue, setCurrentLeanTissue] = useState('');
  const [goalLeanTissueChange, setGoalLeanTissueChange] = useState('');
  const [goalFatTissueChange, setGoalFatTissueChange] = useState('');
  const [goalWeight, setGoalWeight] = useState(0);
  const [clientCode, setClientCode] = useState(null);
  const [firstStep, setFirst] = useState(true);
  const [secondStep, setSecond] = useState(false);
  const [thirdStep, setThird] = useState(false);
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      if (userData) {
        userId = userData.id;
        console.log('USERDATA==', JSON.stringify(userData));
        setClientCode(userData?.client_code);
        if (userData.c_weight) {
          setStartingWeight(userData.c_weight);
        } else {
          setStartingWeight(props.route.params.CURRENT_WEIGHT);
        }
        if (comingFrom == strings.MyGoal) {
          getProfileInformation();
        }
      }
    });
    return () => {
      focusListener;
    };
  }, []);
  // useEffect(() => {
  //   if (clientCode) {
  //     const {params} = props.route;
  //     payloadToSend = {
  //       uid: userId,
  //       description: params.DESCRIPTION,
  //       dob: params.DATE_OF_BIRTH,
  //     };
  //     dispatch(updateUserInformationRequest(payloadToSend, onS, onF));
  //   }
  // }, [clientCode]);

  const getProfileInformation = () => {
    dispatch(userProfileInfoRequest(userId, onSucc, onFail));
  };
  const onSucc = resolve => {
    const {
      g_weight,
      c_fat_change,
      c_lean_change,
      c_weight_change,
      c_fat,
      c_lean,
    } = resolve.data;

    setGoalWeight(g_weight);
    setGoalWeightChange(c_weight_change);
    setGoalLeanTissueChange(c_lean_change);
    setGoalFatTissueChange(c_fat_change);
    setCurrentFatTissue(c_fat);
    setCurrentLeanTissue(c_lean);
  };
  const onFail = reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const onSkipPress = () => {
    navigation.navigate('Calories');
  };
  const backPress = () => {
    navigation.goBack();
  };
  const onTouchOutside = () => {
    setWillInflate(false);
  };
  const validateFields = () => {
    var message = '';
    if (Utility.getInstance().isEmpty(goalWeightChange)) {
      message = warning.select_g_weight_change;
    }

    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const onNextPress = () => {
    const {params} = props.route;
    const currentAge = moment().diff(
      moment(params.DATE_OF_BIRTH, 'MM/DD/YYYY'),
      'years',
    );

    if (clientCode) {
    } else if (validateFields()) {
      {
        if (comingFrom == strings.MyGoal) {
          payloadToSend = {
            uid: userId,
            c_weight: params.CURRENT_WEIGHT,
            g_weight: goalWeight,
            //age: currentAge,
            //c_lean_change: goalLeanTissueChange,
            //c_fat_change: goalFatTissueChange,
            c_weight_change: goalWeightChange,
            //c_fat: currentFatTissue,
            //c_lean: currentLeanTissue,
          };
        } else if (comingFrom == strings.Signup)
          if (!userData.c_weight) {
            payloadToSend = {
              uid: userId,
              height: params.CURRENT_HEIGHT,
              c_weight: params.CURRENT_WEIGHT,
              description: params.DESCRIPTION,
              dob: params.DATE_OF_BIRTH,
              g_weight: goalWeight,
              c_weight_change: goalWeightChange,
              age: currentAge,
              //c_lean_change: goalLeanTissueChange,
              //c_fat_change: goalFatTissueChange,
            };
          } else {
            payloadToSend = {
              uid: userId,
              //height: params.CURRENT_HEIGHT,
              // c_weight: params.CURRENT_WEIGHT,
              // description: params.DESCRIPTION,
              c_weight: userData.c_weight,
              description: params.DESCRIPTION,
              //dob: params.DATE_OF_BIRTH,
              g_weight: goalWeight,
              age: currentAge,
              c_weight_change: goalWeightChange,
              //c_lean_change: goalLeanTissueChange,
              //c_fat_change: goalFatTissueChange,
            };
          }
      }

      dispatch(updateUserInformationRequest(payloadToSend, onS, onF));
    }
  };
  const clearStates = () => {
    // if (clientCode) {
    //   saveGoals();
    // } else {
    if (comingFrom == strings.MyGoal) {
      navigation.navigate('Calories');
    } else {
      setGoalWeightChange('');
      setGoalWeight('');
      setGoalFatTissueChange('');
      setGoalLeanTissueChange('');
      setGoalWeight('');
      setStartingWeight('');
      setFirst(false);
      setSecond(true);
    }
  };
  const handleWhereToGo = () => {
    if (clientCode) {
      saveGoals();
    } else {
      if (comingFrom == strings.MyGoal) {
        navigation.navigate('Calories');
      } else {
        navigation.navigate('Goal');
      }
    }
  };

  const saveGoals = () => {
    let payload = {
      goal_type: '1',
      calories: '2500',
      carbo: '35',
      fat: '30',
      protein: '35',
      uid: userId,
    };
    console.log('saveGoals.payload==', payload);
    setShowLoader(true);
    dispatch(uploadUserCalorieDataRequest(payload, onSS, onFF));
  };

  const onSS = resolve => {
    setShowLoader(false);
    console.log('resolve', resolve);
  };
  const onFF = reject => {
    setShowLoader(false);
    Utility.getInstance().inflateToast(reject);
  };

  const onS = resolve => {
    clearStates();
  };
  const onF = reject => {};

  const calculateGoalChangeValue = value => {
    if (value.value <= 10) {
      let array = value.placeholder.split('');
      let splittedGoalWeight = startingWeight.split(' ');

      if (array[0] == strings.plus) {
        setGoalWeight(parseInt(splittedGoalWeight[0]) + parseInt(value.value));
      } else if (array[0] == 0) {
        setGoalWeight(parseInt(splittedGoalWeight[0]));
      } else {
        let val = value.value.split('-');

        setGoalWeight(parseInt(splittedGoalWeight[0]) - parseInt(val[1]));
      }
      setGoalWeightChange(value.placeholder);
    } else {
      let array = value.placeholder.split('');
      let splittedGoalWeight = startingWeight.split(' ');

      if (array[0] == strings.plus) {
        setGoalWeight(parseInt(splittedGoalWeight[0]) + parseInt(value.value));
      } else if (array[0] == 0) {
        setGoalWeight(parseInt(splittedGoalWeight[0]));
      } else {
        let val = value.value.split('-');

        setGoalWeight(parseInt(splittedGoalWeight[0]) - parseInt(val[1]));
      }
      setGoalWeightChange(value.placeholder);
      if (clientCode) {
        setWillInflate(true);
      }
    }
  };

  const Modal = () => {
    return (
      <DialogView
        onTouchOutside={() => onTouchOutside()}
        willInflate={willInflate}
        onBackPress={() => setWillInflate(false)}
        children={<ModalContent />}></DialogView>
    );
  };
  const ModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 30,
            width: '100%',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => setWillInflate(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text style={{textAlign: 'center', fontFamily: 'Poppins-SemiBold'}}>
            Entry Out of Range!
          </Text>
        </View>
        <View
          style={{
            marginTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center', fontFamily: 'Poppins-Light'}}>
            One of your selections is out of range for your 3 month goals.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-LightItalic',
              marginTop: 20,
            }}>
            Your goals should be within the proper range of your current state:
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Goal Weight Change Limits:
          </Text>
          <Text style={{textAlign: 'center', marginTop: 10}}>
            -24 to +10lb change
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Lean Tissue Goal Max: -10 lbs
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Fat Tissue Goal Max: -10 lbs
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              marginTop: 20,
            }}>
            Are your goals outside our recommended ranges? Talk to our health
            professionals about your desired changes
          </Text>
          {/* <TouchableOpacity
            onPress={() => [
              navigation.navigate('Chat', 0),
              setWillInflate(false),
            ]}
            style={[
              globalStyles.button_primary,
              globalStyles.center,
              globalStyles.mt_30,
            ]}>
            <Text
              style={[globalStyles.btn_heading, globalStyles.green_heading]}>
              {strings.chat_with_us}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };
  const SecondStep = () => {
    return (
      <>
        <View
          style={[
            styles.flex_9,
            globalStyles.center,
            globalStyles.padding_40,
            globalStyles.mt_30,
          ]}>
          <Text style={[styles.why_heading, globalStyles.regular]}>
            {strings.why}
          </Text>
          <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
            {strings.whydesc}
          </Text>

          <TextInput
            onChangeText={text => setDescription(text)}
            value={description}
            textAlignVertical="top"
            multiline={true}
            style={styles.biginput}
          />

          <Text
            //onPress={() => [setSecond(false), setThird(true)]}
            onPress={() => handleWhereToGo()}
            style={[
              globalStyles.btn_heading,
              globalStyles.mt_30,
              globalStyles.green_heading,
              globalStyles.font20,
            ]}>
            {strings.skip}
          </Text>
          <TouchableOpacity
            onPress={() => [handleWhereToGo()]}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>{strings.next}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };
  const First = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <View style={[styles.flex_2]}>
          <View
            style={{
              width: SCREEN_WIDTH,
              height: 0,
              borderTopColor: colors.secondary,
              borderTopWidth: SCREEN_HEIGHT / 14,
              borderRightWidth: SCREEN_WIDTH + 50,
              borderRightColor: 'transparent',
            }}>
            {!clientCode && (
              <View
                style={{
                  height: 50,
                  width: 50,
                  marginTop: Utility.getInstance().heightToDp(-15),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={backPress}>
                  <Image
                    style={globalStyles.backimgregister}
                    source={images.SIGNUP.BACK}></Image>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              alignContent: 'center',
              backgroundColor: 'transparent',
            }}>
            <ImageBackground
              source={images.APP.APPLOGO}
              resizeMode="contain"
              style={{
                height: 50,
                width: '90%',
                marginTop: Utility.getInstance().heightToDp(10),
                marginLeft: Utility.getInstance().widthToDp(8),
                backgroundColor: 'transparent',
              }}></ImageBackground>
          </View>
        </View>
        {/* {clientCode ? (
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: 60,

              flex: 0.7,
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignStart,

                {
                  
                  alignSelf: 'center',
                  fontSize: 17,
                  colors: colors.secondary,
                  textAlign: 'justify',
                },
              ]}>
              {`Please close your app to allow our staff to upload your bucket allocation`}
            </Text>
          </View>
        ) : (
          <View style={styles.flex_8}>
            <ScrollView>
              <View style={[globalStyles.center, globalStyles.padding_40]}>
                <Text
                  style={[styles.why_heading, {fontSize: 25, marginLeft: 10}]}>
                  {`3`}
                  <Text
                    style={[
                      styles.why_heading,
                      globalStyles.white,
                      {fontSize: 25},
                    ]}>{` Month Goals`}</Text>
                </Text>
                <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
                  {strings.monthGoal}
                </Text>
                <View
                  style={[
                    globalStyles.center,
                    globalStyles.mt_20,
                    globalStyles.padding_40,
                  ]}>
                 
                  <SelectDropdown
                    data={dummyContent.g_lbs}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem);
                      calculateGoalChangeValue(selectedItem);
                    }}
                    defaultButtonText={goalWeightChange}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      if (selectedItem.value > 10) {
                        if (clientCode) {
                          return;
                        } else {
                          return selectedItem.placeholder;
                        }
                      } else {
                        return selectedItem.placeholder;
                      }
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.placeholder;
                    }}
                    renderDropdownIcon={() => {
                      return (
                        <Image
                          style={{
                            height: 20,
                            width: 20,
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
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      //backgroundColor: 'gray',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        //   backgroundColor: 'red',
                        flex: 1,
                      }}>
                      <Text
                        style={[
                          //styles.input_heading,
                          globalStyles.mt_30,
                          {color: colors.white},
                        ]}>
                        Current Weight
                      </Text>
                      <Text style={styles.goalval}>
                        {userData.c_weight
                          ? startingWeight + ` lbs`
                          : startingWeight}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        // backgroundColor: 'red',
                        flex: 1,
                      }}>
                      <Text
                        style={[
                          // styles.input_heading,
                          globalStyles.mt_30,
                          {color: colors.white},
                        ]}>
                        {strings.goalweightc}
                      </Text>
                      <Text style={styles.goalval}>
                        {goalWeight}
                        <Text style={styles.goalval}>{strings.lbss}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onNextPress}
                  style={[
                    globalStyles.button_secondary,
                    globalStyles.center,
                    globalStyles.button,
                    globalStyles.mt_30,
                  ]}>
                  {isLoading ? (
                    <Indicator isAnimating={isLoading} />
                  ) : (
                    <Text style={globalStyles.btn_heading_black}>CONTINUE</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )} */}
        <View style={styles.flex_8}>
          <ScrollView>
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text
                style={[styles.why_heading, {fontSize: 25, marginLeft: 10}]}>
                {`3`}
                <Text
                  style={[
                    styles.why_heading,
                    globalStyles.white,
                    {fontSize: 25},
                  ]}>{` Month Goals`}</Text>
              </Text>
              <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
                {strings.monthGoal}
              </Text>
              <View
                style={[
                  globalStyles.center,
                  globalStyles.mt_20,
                  globalStyles.padding_40,
                ]}>
                {/* <Text
                    style={[
                      styles.input_heading,
                      globalStyles.textAlignStart,
                    ]}>{`Starting Weight`}</Text>
                  <Pressable
                    style={[
                      styles.dropdown4BtnStyle,
                      globalStyles.justifyContent_c,
                    ]}>
                    <Text
                      style={[
                        globalStyles.btn_heading_black_dropdown,
                        globalStyles.mr_left,
                      ]}>
                      {userData.c_weight
                        ? startingWeight + ` lbs`
                        : startingWeight}
                    </Text>
                  </Pressable> */}

                {/* <Text
                    style={[
                      styles.input_heading,
                      globalStyles.textAlignStart,
                      globalStyles.mt_20,
                    ]}>{`Goal Weight Change`}</Text> */}
                <SelectDropdown
                  data={dummyContent.g_lbs}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                    calculateGoalChangeValue(selectedItem);
                  }}
                  defaultButtonText={goalWeightChange}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    if (selectedItem.value > 10) {
                      if (clientCode) {
                        return;
                      } else {
                        return selectedItem.placeholder;
                      }
                    } else {
                      return selectedItem.placeholder;
                    }
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.placeholder;
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        style={{
                          height: 20,
                          width: 20,
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
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    //backgroundColor: 'gray',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      //   backgroundColor: 'red',
                      flex: 1,
                    }}>
                    <Text
                      style={[
                        //styles.input_heading,
                        globalStyles.mt_30,
                        {color: colors.white},
                      ]}>
                      Current Weight
                    </Text>
                    <Text style={styles.goalval}>
                      {userData.c_weight
                        ? startingWeight + ` lbs`
                        : startingWeight}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      // backgroundColor: 'red',
                      flex: 1,
                    }}>
                    <Text
                      style={[
                        // styles.input_heading,
                        globalStyles.mt_30,
                        {color: colors.white},
                      ]}>
                      {strings.goalweightc}
                    </Text>
                    <Text style={styles.goalval}>
                      {goalWeight}
                      <Text style={styles.goalval}>{strings.lbss}</Text>
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={onNextPress}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_30,
                ]}>
                {isLoading ? (
                  <Indicator isAnimating={isLoading} />
                ) : (
                  <Text style={globalStyles.btn_heading_black}>CONTINUE</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="always"
        extraHeight={180}
        style={[styles.flex, {backgroundColor: colors.primary}]}>
        {firstStep && First()}
        {secondStep && comingFrom != strings.MyGoal && (
          <>
            <View style={styles.flex_1}>
              <View
                style={{
                  width: SCREEN_WIDTH,
                  height: 0,
                  borderTopColor: colors.secondary,
                  borderTopWidth: SCREEN_HEIGHT / 14,
                  borderRightWidth: SCREEN_WIDTH + 50,
                  borderRightColor: 'transparent',
                }}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    marginTop: Utility.getInstance().heightToDp(-15),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => [setSecond(false), setFirst(true)]}>
                    <Image
                      style={globalStyles.backimgregister}
                      source={images.SIGNUP.BACK}></Image>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  alignContent: 'center',
                  backgroundColor: 'transparent',
                }}>
                <ImageBackground
                  source={images.APP.APPLOGO}
                  resizeMode="contain"
                  style={{
                    height: 70,
                    width: '90%',
                    marginTop: Utility.getInstance().heightToDp(10),
                    marginLeft: Utility.getInstance().widthToDp(8),
                    backgroundColor: 'transparent',
                  }}></ImageBackground>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    height: 30,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: 32,
                      width: 32,
                      backgroundColor: colors.primary,
                      borderRadius: 16,
                      borderWidth: 4,
                      borderColor: colors.secondary,
                    }}></View>
                  <View
                    style={{
                      height: 3,
                      width: '50%',
                      backgroundColor: colors.secondary,
                    }}></View>
                </View>
              </View>
            </View>
            {SecondStep()}
          </>
        )}
      </KeyboardAwareScrollView>

      {Modal()}
      {showLoader && <Loader isLoading={showLoader || isLoading}></Loader>}
    </>
  );
};
export default MonthGoal;
