import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import images from '../../assets/images/index';
import styles from '../Signup/style';
import globalStyles from '../../assets/globalStyles/index';
import colors from '../../constants/colorCodes';
import {useNavigation} from '@react-navigation/native';
import strings from '../../constants/strings';
import Utility from '../../utility/Utility';
import serverCode from '../../constants/serverCodes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import warning from '../../constants/warning';
import dummyContent from '../../constants/dummyContent';
import {registerRequest} from '../../redux/action/RegisterAction';
import {loginSuccess} from '../../redux/action/LoginAction';
import Indicator from '../../component/buttonIndicator';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {userProfileInfoRequest} from '../../redux/action/UserProfileInfo';
import {updateUserInformationRequest} from '../../redux/action/UserProfileInfo';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
var formattedDate = '';
const EditWeightGoals = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );
  const userData = useSelector(state => state.other.loginReducer.userData);

  const [firstStep, setFirst] = useState(true);
  const [secondStep, setSecond] = useState(false);
  const [thirdStep, setThird] = useState(false);
  const [welcomePage, setWelcomePage] = useState(false);
  const [currenWeight, setCurrentWeight] = useState(0);
  const [goalWeight, setGoalWeight] = useState(0);
  const [goalWeightChange, setGoalWeightChange] = useState('');
  useEffect(() => {
    getUserProfileInformation();
  }, []);
  const getUserProfileInformation = () => {
    dispatch(userProfileInfoRequest(userData?.id, onSucc, onFail));
  };
  const onSucc = resolve => {
    console.log('resolve', resolve);
    console.log({userInformationReducer});
    setCurrentWeight(resolve?.data?.c_weight);
    setGoalWeight(resolve?.data?.g_weight);
  };
  const onFail = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const backPress = () => {
    navigation.goBack();
  };
  const calculateGoalChangeValue = value => {
    if (value.value <= 10) {
      let array = value.placeholder.split('');
      let splittedGoalWeight = currenWeight.split(' ');

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
  const updateUserInformation = async () => {
    let payloadWithNonClient = {
      uid: userData?.id,
      c_weight: currenWeight,
      g_weight: goalWeight,
      c_weight_change: goalWeightChange,
    };
    console.log({payloadWithNonClient});

    dispatch(updateUserInformationRequest(payloadWithNonClient, onS, onF));
  };

  const onS = resolve => {
    backPress();
  };
  const onF = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  return (
    <>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="always"
        extraHeight={180}
        style={[styles.flex, {backgroundColor: colors.primary}]}>
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
                height: 60,
                width: '90%',
                marginTop: Utility.getInstance().heightToDp(2),
                marginLeft: Utility.getInstance().widthToDp(8),
                backgroundColor: 'transparent',
              }}></ImageBackground>
          </View>
        </View>
        <Text
          style={[
            globalStyles.input_heading,
            {
              paddingHorizontal: 20,
              color: colors.white,
              fontSize: 24,
              fontFamily: 'Poppins-Medium',
              lineHeight: 26,
              textAlign: 'left',
              marginTop: Utility.getInstance().heightToDp(10),
            },
          ]}>
          My
          <Text
            style={[
              globalStyles.input_heading,
              {
                paddingHorizontal: 20,
                color: colors.secondary,
                fontSize: 24,
                fontFamily: 'Poppins-Medium',
                lineHeight: 26,
                textAlign: 'left',
                marginTop: Utility.getInstance().heightToDp(10),
              },
            ]}>
            {` Weight Goals`}
          </Text>
        </Text>
        <Text
          style={[
            globalStyles.input_heading,
            {
              paddingHorizontal: 20,
              color: colors.white,
              fontSize: 14,
              lineHeight: 22,
              marginTop: 10,
              textAlign: 'left',
              opacity: 0.8,
              //marginTop: Utility.getInstance().heightToDp(10),
            },
          ]}>
          {`Enter your current weight and change
Your goal weight  below.`}
        </Text>
        <View
          style={[
            styles.flex_7,
            globalStyles.center,
            globalStyles.padding_40_,
          ]}>
          <Text style={globalStyles.input_heading}>{strings.currenweight}</Text>

          <SelectDropdown
            data={dummyContent.weight}
            value={currenWeight}
            onSelect={(selectedItem, index) => {
              setCurrentWeight(selectedItem);
            }}
            defaultButtonText={currenWeight + ' lbs'}
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
            buttonStyle={styles.input}
            buttonTextStyle={styles.dropdown4BtnTxtStyle}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown4DropdownStyle}
            rowStyle={styles.dropdown4RowStyle}
            rowTextStyle={styles.dropdown4RowTxtStyle}
          />
          <Text style={globalStyles.input_heading}>{strings.goalweights}</Text>

          <SelectDropdown
            data={dummyContent.g_lbs}
            onSelect={(selectedItem, index) => {
              calculateGoalChangeValue(selectedItem);
              //   setGoalWeight(selectedItem.value);
            }}
            value={goalWeight}
            defaultButtonText={goalWeight + ' lbs'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.placeholder;
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
            buttonStyle={styles.input}
            buttonTextStyle={styles.dropdown4BtnTxtStyle}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown4DropdownStyle}
            rowStyle={styles.dropdown4RowStyle}
            rowTextStyle={styles.dropdown4RowTxtStyle}
          />

          <TouchableOpacity
            onPress={updateUserInformation}
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
      </KeyboardAwareScrollView>
    </>
  );
};
export default EditWeightGoals;
