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
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from './style';
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
import {userProfileInfoRequest} from '../../redux/action/UserProfileInfo';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
var userId = null;
var payloadToSend = null;
const AndustWeight = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );
  const [willInflate, setWillInflate] = useState(false);
  const [startingWeight, setStartingWeight] = useState('');
  const [comingFrom] = useState(strings.MyGoal);

  const [goalWeightChange, setGoalWeightChange] = useState('');
  const [currentFatTissue, setCurrentFatTissue] = useState('');
  const [currentLeanTissue, setCurrentLeanTissue] = useState('');
  const [goalLeanTissueChange, setGoalLeanTissueChange] = useState('');
  const [goalFatTissueChange, setGoalFatTissueChange] = useState('');
  const [goalWeight, setGoalWeight] = useState(0);
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      if (userData) {
        userId = userData.id;
        console.log('userData.c_weight==', JSON.stringify(userData));
        setStartingWeight(userData.c_weight);
        getProfileInformation();
      }
    });
    return () => {
      focusListener;
    };
  }, []);

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
    let goalLeanTissueChangeTemp = goalLeanTissueChange.split(' ');
    let goalFatTissueChangeTemp = goalFatTissueChange.split(' ');

    data =
      parseInt(goalLeanTissueChangeTemp[0]) +
      parseInt(goalFatTissueChangeTemp[0]);

    if (validateFields()) {
      payloadToSend = {
        uid: userId,
        c_weight: startingWeight,
        g_weight: goalWeight,

        c_weight_change: goalWeightChange,
      };

      dispatch(updateUserInformationRequest(payloadToSend, onS, onF));
    }
  };
  const clearStates = () => {
    ``;
    setGoalWeightChange('');
    setGoalWeight('');
    setGoalFatTissueChange('');
    setGoalLeanTissueChange('');
    setGoalWeight('');
    setStartingWeight('');

    navigation.navigate('Home');
  };
  const onS = resolve => {
    clearStates();
  };
  const onF = reject => {};

  const calculateGoalChangeValue = value => {
    if (value.value <= 10) {
      let array = value.placeholder.split('');
      let splittedGoalWeight = startingWeight.split(' ');
      console.log('array[0]', array[0]);
      if (array[0] == strings.plus) {
        setGoalWeight(parseInt(splittedGoalWeight[0]) + parseInt(value.value));
      } else {
        let val = value.value.split('-');
        console.log('val', val);
        setGoalWeight(parseInt(splittedGoalWeight[0]) - parseInt(val[1]));
      }
      setGoalWeightChange(value.placeholder);
    } else {
      setWillInflate(true);
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
        <View style={styles.flex_8}>
          <ScrollView>
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading, {fontSize: 30}]}>
                {`3`}
                <Text
                  style={[
                    styles.why_heading,
                    globalStyles.white,
                    {fontSize: 30},
                  ]}>{`  Month Goals`}</Text>
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
                <Text
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
                </Pressable>

                <Text
                  style={[
                    styles.input_heading,
                    globalStyles.textAlignStart,
                    globalStyles.mt_20,
                  ]}>{`Goal Weight Change`}</Text>
                <SelectDropdown
                  data={dummyContent.g_lbs}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                    calculateGoalChangeValue(selectedItem);
                  }}
                  defaultButtonText={goalWeightChange}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    if (selectedItem.value > 10) {
                      return;
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
                <Text style={[styles.input_heading, globalStyles.mt_30]}>
                  {strings.goalweightc}
                </Text>
                <Text style={styles.goalval}>
                  {goalWeight}
                  <Text style={styles.goalvalwhite}>{strings.lbss}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={onNextPress}
                // onPress={() => setVisible(false)}
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
      {First()}
      {Modal()}
    </>
  );
};
export default AndustWeight;
