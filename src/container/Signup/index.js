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
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
var radio_props = [
  {label: 'Yes', value: 0},
  {label: 'No', value: 1},
];
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
var formattedDate = '';
const Signup = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoading = useSelector(
    state => state.other.registerReducer.showLoader,
  );
  const [firstStep, setFirst] = useState(true);
  const [secondStep, setSecond] = useState(false);
  const [thirdStep, setThird] = useState(false);
  const [welcomePage, setWelcomePage] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPrefusionClient, serPrefusionClient] = useState(0);
  const [clientCode, setClientCode] = useState(''); //151515
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [currenWeight, setCurrentWeight] = useState('');
  const [currenHeight, setCurrentHeight] = useState('');
  const [fcToken, setFcToken] = useState(null);

  useEffect(() => {
    getFcToken();
  }, []);
  const getFcToken = async () => {
    let tkn = await Utility.getInstance().getStoreData('FIREBASE_TOKEN');
    let token_fb = tkn ? JSON.parse(tkn) : null;

    if (tkn) {
      setFcToken(token_fb);
    }
  };
  const backPress = () => {
    if (firstStep) {
      navigation.goBack();
    } else if (secondStep) {
      setSecond(false);
      setFirst(true);
      setThird(false);
    } else if (thirdStep) {
      setSecond(true);
      setFirst(false);
      setThird(false);
    } else if (welcomePage) {
      setSecond(true);
      setFirst(false);
      setThird(false);
      setWelcomePage(false);
    }
  };
  const onSignupPress = async () => {
    let payloadWithNonClient = {
      username: username,
      email: email,
      password: password,
      name: username,
      gender: gender,
      age: age,
      description: description,
      isenrolled: 0,
      fb_token: fcToken,
    };
    dispatch(
      registerRequest(payloadWithNonClient, registerSuccess, registerFail),
    );
    return;
    if (isSecondStepValid()) {
      // let payloadWithNonClient = {
      //   username: username,
      //   email: email,
      //   password: password,
      //   name: username,
      //   gender: gender,
      //   age: age,
      //   description: description,
      //   isenrolled: 0,
      //   fb_token: fcToken,
      // };
      // dispatch(
      //   registerRequest(payloadWithNonClient, registerSuccess, registerFail),
      // );
      return;
      if (isPrefusionClient == serverCode.one) {
        //not a client
        let payloadWithNonClient = {
          username: username,
          email: email,
          password: password,
          name: username,
          gender: gender,
          age: age,
          description: description,
          isenrolled: 0,
          fb_token: fcToken,
        };
        dispatch(
          registerRequest(payloadWithNonClient, registerSuccess, registerFail),
        );
      } else {
        // is a client
        let payloadWithClient = {
          username: username,
          email: email,
          password: password,
          name: username,
          gender: gender,
          age: age,
          description: description,
          isenrolled: 1,
          client_code: clientCode,
          fb_token: fcToken,
        };

        await Utility.getInstance().setStoreData(strings.clientId, clientCode);
        dispatch(
          registerRequest(payloadWithClient, registerSuccess, registerFail),
        );
      }
    }
  };
  const registerSuccess = async resolve => {
    console.log('registerSuccess=>', resolve);
    Utility.getInstance().inflateToast(strings.register_success);
    dispatch(loginSuccess(resolve, onS, onF));
    clerStates();
  };
  const onS = () => {};
  const onF = () => {};
  const registerFail = async reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const clerStates = () => {
    // setEmail('');
    // setAge('');
    // setDescription('');
    // setGender('');
    // setPassword('');
    // setSecond(false);
    // setFirst(false);
    // setThird(false);
    //checkClientOrNot();

    onStepsCompletedPress();
  };
  const checkClientOrNot = () => {
    setWelcomePage(true);
    return;

    if (isPrefusionClient == serverCode.one) {
      setWelcomePage(true);
    } else {
      setWelcomePage(false);
      setThird(true);
    }
  };
  const manipulateDate = date => {
    formattedDate = moment(date).format('L');
    setDate(date);
  };
  const isFirstStepValid = () => {
    var message = '';
    if (Utility.getInstance().isEmpty(email)) {
      message = warning.please_enter_email;
    } else if (!Utility.getInstance().isEmail(email)) {
      message = warning.invalid_email;
    } else if (Utility.getInstance().isEmpty(username)) {
      message = warning.please_enter_username;
    } else if (Utility.getInstance().isEmpty(password)) {
      message = warning.please_enter_password;
    } else if (password.length < 6) {
      message = warning.please_enter_valid_password;
    } else if (password != confirmPassword) {
      message = warning.both_password_dont_match;
    }

    if (message == '') {
      setFirst(false);
      setSecond(false);
      setThird(false);
      setWelcomePage(true);
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const ReisterFirstStep = () => {
    return (
      <View
        style={[styles.flex_7, globalStyles.center, globalStyles.padding_40_]}>
        <Text style={globalStyles.input_heading}>{strings.chooseusernae}</Text>
        <TextInput
          value={username}
          onChangeText={text => setUserName(text)}
          style={styles.input}
        />
        <Text style={globalStyles.input_heading}>{strings.email_}</Text>
        <TextInput
          value={email}
          onChangeText={va => [setEmail(va)]}
          style={styles.input}
        />

        <Text style={globalStyles.input_heading}>{strings.password}</Text>
        <TextInput
          value={password}
          // secureTextEntry
          onChangeText={text => setPassword(text)}
          style={styles.input}
        />
        <Text style={globalStyles.input_heading}>
          {strings.confirmpassword}
        </Text>
        <TextInput
          // secureTextEntry
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => [isFirstStepValid()]}
          style={[
            globalStyles.button_secondary,
            globalStyles.center,
            globalStyles.button,
            globalStyles.mt_30,
            {marginBottom: 30},
          ]}>
          <Text style={globalStyles.btn_heading_black}>{strings.continue}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const isSecondStepValid = () => {
    var message = '';

    if (Utility.getInstance().isEmpty(gender)) {
      message = warning.select_gender;
    } else if (Utility.getInstance().isEmpty(age)) {
      message = warning.enter_age;
    }
    //  else if (isPrefusionClient == 0) {
    //   if (Utility.getInstance().isEmpty(clientCode)) {
    //     message = warning.enter_client_code;
    //   }
    // }

    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const onWelcomeContinue = () => {
    if (isWelcomeStepValid()) {
      onSignupPress();
    }
  };
  const isWelcomeStepValid = () => {
    var message = '';
    if (Utility.getInstance().isEmpty(gender)) {
      message = warning.select_gender;
    } else if (Utility.getInstance().isEmpty(formattedDate)) {
      message = warning.enter_date;
    } else if (Utility.getInstance().isEmpty(currenHeight)) {
      message = warning.enter_height;
    } else if (Utility.getInstance().isEmpty(currenWeight)) {
      message = warning.enter_current_weight;
    }

    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };

  const onStepsCompletedPress = () => {
    let payloadToRedirectNext = {
      CURRENT_HEIGHT: currenHeight,
      CURRENT_WEIGHT: currenWeight,
      DESCRIPTION: description,
      DATE_OF_BIRTH: formattedDate,
      IS_PREFUSION_CLIENT: isPrefusionClient,
      FROM: 'Signup',
    };

    console.log('onStepsCompletedPress==', payloadToRedirectNext);
    // setFirst(false);
    // setSecond(false);
    // setThird(false);
    // setWelcomePage(false);
    navigation.navigate('MonthGoal', payloadToRedirectNext);
  };
  const ReisterSecondStep = () => {
    return (
      <View
        style={[styles.flex_7, globalStyles.center, globalStyles.padding_40]}>
        <Text style={globalStyles.input_heading}>{strings.gender}</Text>

        <SelectDropdown
          data={dummyContent.gender}
          value={gender}
          onSelect={(selectedItem, index) => {
            setGender(selectedItem);
          }}
          defaultButtonText={gender}
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
        <Text style={globalStyles.input_heading}>{strings.age}</Text>

        <SelectDropdown
          data={dummyContent.age}
          onSelect={(selectedItem, index) => {
            setAge(selectedItem);
          }}
          value={age}
          defaultButtonText={age}
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

        {/* <Text style={[styles.forgot_pass_heading, styles.areyou]}>
          {strings.areyou______}
        </Text>
        <RadioForm
          labelStyle={{
            fontSize: 15,
            color: colors.white,
          }}
          buttonColor={colors.secondary}
          selectedButtonColor={colors.secondary}
          formHorizontal={true}
          animation={true}
          labelHorizontal={true}
          buttonStyle={{height: 20, width: 20}}
          buttonWrapStyle={{margin: 0}}
          labelColor={colors.white}
          radio_props={radio_props}
          initial={0}
          style={globalStyles.radiobutton}
          onPress={value => {
            serPrefusionClient(value);
            setClientCode('');
          }}
        />

        <Text style={globalStyles.input_heading}>{strings.clientcode}</Text>
        <TextInput
          value={clientCode}
          onChangeText={text => setClientCode(text)}
          editable={isPrefusionClient == 1 ? false : true}
          style={isPrefusionClient == 0 ? styles.input : [styles.input_gray]}
        /> */}

        <TouchableOpacity
          //onPress={onSignupPress}
          // onPress={() => setWelcomePage(true)}
          style={[
            globalStyles.button_secondary,
            globalStyles.center,
            globalStyles.button,
            globalStyles.mt_30,
          ]}>
          {isLoading ? (
            <Indicator isAnimating={isLoading} />
          ) : (
            <Text style={globalStyles.btn_heading_black}>{strings.signup}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  const ReisterThirdStep = () => {
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
          <Text style={[styles.forgot_pass_heading, styles.whydesc]}>{}</Text>

          <TextInput
            onChangeText={text => setDescription(text)}
            value={description}
            textAlignVertical="top"
            multiline={true}
            style={styles.biginput}
          />

          <Text
            onPress={onStepsCompletedPress}
            style={[
              globalStyles.btn_heading,
              globalStyles.mt_30,
              globalStyles.green_heading,
              globalStyles.font20,
            ]}>
            {strings.skip}
          </Text>
          <TouchableOpacity
            onPress={onStepsCompletedPress}
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
  const WelcomView = () => {
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
              <TouchableOpacity
                onPress={() => [
                  setSecond(false),
                  setFirst(true),
                  setThird(false),
                  setWelcomePage(false),
                ]}>
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

              alignContent: 'center',
              backgroundColor: 'transparent',
            }}>
            <ImageBackground
              source={images.APP.APPLOGO}
              resizeMode="contain"
              style={{
                height: 50,
                width: '90%',
                marginTop: Utility.getInstance().heightToDp(5),
                marginLeft: Utility.getInstance().widthToDp(8),
                backgroundColor: 'transparent',
              }}></ImageBackground>
          </View>
        </View>
        <View style={styles.flex_8}>
          <ScrollView
            contentContainerStyle={{paddingVertical: 20}}
            contentInsetAdjustmentBehavior="automatic">
            <DatePicker
              modal
              mode="date"
              open={open}
              date={date}
              onConfirm={date => {
                setOpen(false);
                manipulateDate(date);
              }}
              placeholder="select date"
              format="DD-MM-YYYY"
              onCancel={() => {
                setOpen(false);
              }}
            />
            <View style={[globalStyles.center, globalStyles.padding_30_hor]}>
              <Text style={[styles.username, styles.font30]}>
                {strings.welcome}
                {username && (
                  <Text style={[styles.why_heading, styles.font30]}>
                    {`${username.split('@')[0]} !`}
                  </Text>
                )}
              </Text>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  {lineHeight: 22, color: colors.white},
                ]}>
                {strings.welcomedesc}
              </Text>
              <View style={[globalStyles.center, globalStyles.padding_40]}>
                <Text style={globalStyles.input_heading}>{strings.gender}</Text>

                <SelectDropdown
                  data={dummyContent.gender}
                  value={gender}
                  onSelect={(selectedItem, index) => {
                    setGender(selectedItem);
                  }}
                  defaultButtonText={gender}
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
                <Text
                  style={[
                    globalStyles.input_heading,
                    globalStyles.mt_30,
                    globalStyles.newheading,
                  ]}>
                  {strings.dob}
                </Text>
                <Pressable
                  onPress={() => setOpen(true)}
                  style={[
                    styles.dropdown4BtnStyle,
                    globalStyles.justifyContent_c,
                  ]}>
                  <Text
                    style={[
                      globalStyles.btn_heading_black_dropdown,
                      globalStyles.mr_left,
                    ]}>
                    {formattedDate}
                  </Text>
                </Pressable>
                <Text
                  style={[
                    globalStyles.input_heading,
                    globalStyles.mt_30,
                    globalStyles.newheading,
                  ]}>
                  {strings.height}
                </Text>
                <SelectDropdown
                  data={dummyContent.height}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                    setCurrentHeight(selectedItem);
                  }}
                  defaultButtonText={currenHeight}
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
                <Text
                  style={[
                    globalStyles.input_heading,
                    globalStyles.mt_30,
                    globalStyles.newheading,
                  ]}>
                  {strings.currenweight}
                </Text>
                <SelectDropdown
                  data={dummyContent.weight}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                    setCurrentWeight(selectedItem);
                  }}
                  defaultButtonText={currenWeight}
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
              </View>

              <TouchableOpacity
                onPress={() => onWelcomeContinue()}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_30,
                ]}>
                <Text style={globalStyles.btn_heading_black}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  return (
    <>
      {!welcomePage ? (
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
          {firstStep && (
            <Text
              style={[
                globalStyles.input_heading,
                {
                  paddingHorizontal: 40,
                  color: colors.white,
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: 'left',
                  marginTop: Utility.getInstance().heightToDp(10),
                },
              ]}>
              {`Enter your email and choose a password
to begin creating your account`}
            </Text>
          )}

          {firstStep && ReisterFirstStep()}
          {secondStep && ReisterSecondStep()}
          {thirdStep && ReisterThirdStep()}
        </KeyboardAwareScrollView>
      ) : (
        WelcomView()
      )}
    </>
  );
};
export default Signup;
