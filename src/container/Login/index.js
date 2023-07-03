import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import images from '../../assets/images/index';
import styles from '../Login/style';
import globalStyles from '../../assets/globalStyles/index';
import colors from '../../constants/colorCodes';
import {useNavigation} from '@react-navigation/native';
import strings from '../../constants/strings';
import warning from '../../constants/warning';
import Utility from '../../utility/Utility';
import ForgotPasswordBottomSheet from '../../component/forgotPasswordBottomSheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {loginRequest} from '../../redux/action/LoginAction';
import {forgotPasswordRequest} from '../../redux/action/ChangePasswordAction';
import {useDispatch, useSelector} from 'react-redux';
import video from '../../assets/video';
import Video from 'react-native-video';
import Indicator from '../../component/buttonIndicator';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const inputRef = useRef();
  const [loader, setLoader] = useState(false);
  const [fcToken, setFcToken] = useState(null);
  const isLoading = useSelector(state => state.other.loginReducer.showLoader);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const userData = useSelector(state => state.other.loginReducer.userData);
  const onSignupPress = () => {
    navigation.navigate('Signup');
  };

  useEffect(() => {
    getFcToken();
  }, []);
  const getFcToken = async () => {
    let tkn = await Utility.getInstance().getStoreData('FIREBASE_TOKEN');
    if (tkn) {
      setFcToken(JSON.parse(tkn));
    }
  };

  const validateLoginFiedls = () => {
    var message = '';
    if (Utility.getInstance().isEmpty(username)) {
      message = warning.please_enter_email;
    } else if (!Utility.getInstance().isEmail(username)) {
      message = warning.invalid_email;
    } else if (Utility.getInstance().isEmpty(password)) {
      message = warning.please_enter_password;
    } else if (password.length < 6) {
      message = warning.please_enter_valid_password;
    }
    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };

  const onLoginPress = () => {
    if (validateLoginFiedls()) {
      let payload = {
        username: username,
        password: password,
        fb_token: fcToken,
      };

      dispatch(loginRequest(payload, loginSuccess, loginFailure));
    }
  };
  const loginSuccess = async resolve => {
    await Utility.getInstance().setStoreData(
      strings.clientId,
      resolve.data.client_code,
    );
    clearStates();
  };

  const loginFailure = async reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const validateForgotFields = email => {
    var message = '';
    if (Utility.getInstance().isEmpty(email)) {
      message = warning.please_enter_email;
    } else if (!Utility.getInstance().isEmail(email)) {
      message = warning.invalid_email;
    }
    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const onFogrotPasswordPress = email => {
    if (validateForgotFields(email)) {
      let payload = {
        email: email,
      };
      setLoader(true);
      dispatch(forgotPasswordRequest(payload, onSSS, onFFF));
    }
  };
  const onSSS = resolve => {
    refRBSheet.current.close();
    inputRef.current.clear();
    setLoader(false);
    if (resolve) {
      setTimeout(() => {
        Utility.getInstance().inflateToast(resolve?.message);
      }, 1000);
    }
  };
  const onFFF = reject => {
    setLoader(false);
    setTimeout(() => {
      Utility.getInstance().inflateToast(reject);
    }, 1000);
  };

  const onForgotPassPress = () => {
    refRBSheet.current.open();
  };
  const clearStates = () => {
    Utility.getInstance().inflateToast(strings.login_success);
    setPassword('');
    setUserName('');
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraHeight={150}
      keyboardShouldPersistTaps="always"
      style={[styles.flex, {backgroundColor: colors.primary}]}>
      <ForgotPasswordBottomSheet
        inputRefV={inputRef}
        isLoading={loader}
        onPress={email => onFogrotPasswordPress(email)}
        reference={refRBSheet}
      />
      <View style={styles.flex_6}>
        {/* <Video
          repeat
          source={video.LOGINVIDEO} // Can be a URL or a local file.
          style={[
            styles.backgroundVideo,
            {
              transform: [{rotate: '-10deg'}],
              width: 650,
              //marginTop: Utility.getInstance().heightToDp(-8),
              marginTop: -Utility.getInstance().DH() / 25,
              height: Utility.getInstance().heightToDp(60),
              marginLeft: -200,
            },
          ]}
          resizeMode="stretch"
          muted></Video> */}
        <ImageBackground
          resizeMode="cover"
          style={{
            transform: [{rotate: '-2deg'}],
            width: 760,
            height: 350,
            //marginTop: Utility.getInstance().heightToDp(-8),
            marginTop: -Utility.getInstance().DH() / 25,
            // height: Utility.getInstance().heightToDp(60),
            marginLeft: -200,
          }}
          source={images.SPLASH.BACKWALL}></ImageBackground>

        {/* {Platform.OS === 'android' ? (
          <View
            style={{
              marginTop: Utility.getInstance().heightToDp(-79.7),
              backgroundColor: colors.primary,
              height: 290,
              opacity: 0.5,
              width: 1200,
              marginLeft: -200,
              transform: [{rotate: '170deg'}],
            }}></View>
        ) : (
          <View
            style={{
              marginTop:
                SCREEN_HEIGHT > 844
                  ? -Utility.getInstance().DH() / 4.15
                  : -Utility.getInstance().DH() / 3.81,

              backgroundColor: colors.primary,
              height: 120,
              opacity: 0.5,
              width: '100%',
            }}>
            <View
              style={{
                backgroundColor: colors.primary,
                height: 220,
                transform: [{rotate: '170deg'}],
                marginLeft: -200,
              }}></View>
          </View>
        )} */}

        <View
          style={{
            marginTop: '-40%',
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
              height: 130,
              width: '90%',
              marginTop: Utility.getInstance().heightToDp(25),
              marginLeft: Utility.getInstance().widthToDp(8),
              backgroundColor: 'transparent',
            }}></ImageBackground>
        </View>
      </View>
      <View
        style={[styles.flex_4, globalStyles.center, globalStyles.padding_40]}>
        <Text style={globalStyles.input_heading}>{strings.email_}</Text>
        <TextInput
          keyboardType="email-address"
          value={username}
          onChangeText={text => setUserName(text)}
          style={styles.input}
        />
        <View style={styles.flex_row}>
          <Text style={globalStyles.input_heading}>{strings.password}</Text>
          <Text onPress={onForgotPassPress} style={styles.forgot_pass_heading}>
            {strings.forgotpasword}
          </Text>
        </View>

        <TextInput
          value={password}
          secureTextEntry
          onChangeText={text => setPassword(text)}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={onLoginPress}
          style={[
            globalStyles.button_secondary,
            globalStyles.center,
            globalStyles.button,
            globalStyles.mt_30,
          ]}>
          {isLoading ? (
            <Indicator isAnimating={isLoading} />
          ) : (
            <Text style={globalStyles.btn_heading_black}>{strings.login}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.new_user_c}>
          <Text style={styles.new_user_heading}>{strings.newuser}</Text>
          <Text onPress={onSignupPress} style={styles.signup_heading}>
            {strings.signup}
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
export default Login;
