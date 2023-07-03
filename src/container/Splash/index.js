import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  AppState,
} from 'react-native';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import video from '../../assets/video';
import styles from '../Splash/style';
import Indicator from '../../component/buttonIndicator';
import {useDispatch, useSelector} from 'react-redux';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import {tokenRequest} from '../../redux/action/ConvertTokenAction';
import {clearFoodId} from '../../redux/action/FoodIdAction';
import RNPermissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
var userId = null;
var action = null;
const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const userData = useSelector(state => state.other.loginReducer.userData);

  useEffect(() => {
    // AsyncStorage.clear();
    dispatch(clearFoodId());
    if (userData) {
      userId = userData.id;
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }

    registerNotificationEventManager();
    createAndroidChannel();
    return () => {
      action = null;
    };
  }, []);

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('appStateListener', nextAppState);
        if (nextAppState === 'active' && Platform.OS === 'ios') {
          requestAppTrackingPermission();
        }
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  const requestAppTrackingPermission = async () => {
    await RNPermissions.request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
      .then(data => {
        console.log('requesting_permission:', data);
      })
      .catch(error => console.log('error_requesting_permission', error));
  };
  // notification implementaion @d9n6
  const createAndroidChannel = () => {
    //for android we need to create channel , Without channel android notification will not work
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'PREFUSION_HEALTH_CHANNEL_ID', // (required)
          channelName: 'PREFUSION_HEALTH_CHANNEL', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
          /// soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          //importance: 4, // (optional) default: 4. Int value of the Android notification importance
          // vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
      // setTimeout(navigateToHome, 1000);
    }
  };
  const registerNotificationEventManager = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (data) {
        const {token} = data;
        if (Platform.OS == 'ios') convertApnsToken(token);
        else saveTokenToStorage(token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        // process the notification

        if (notification?.userInteraction) {
          handleNotification(notification);
        }

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log(' onAction ACTION:', notification.action);
        console.log(' onAction NOTIFICATION:', notification);
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        console.log('onRegistrationError', err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  const handleNotification = notification => {
    const {data} = notification;

    if (data.action == 'Chat') {
      action = data.action; //put action;
      navigateToSpecificRoute(data.action);
    } else if (data.action == 'DailyBioFeedback') {
      action = data.action; //put action;
      navigateToSpecificRoute(data.action);
    } else if (data.action == 'Setting') {
      action = data.action; //put action;
      navigation.navigate('Home');
      navigation.navigate('Profile', 1);
    } else if (data.action == 'Home') {
      action = data.action; //put action;
      navigateToSpecificRoute(data.action);
    } else if (data.action == 'MealUpdated') {
      console.log('handleNotification.data=>', JSON.stringify(data));
      navigation.navigate('Home');
      // navigation.navigate('MealView',)
    } else if (data.action == 'LoginReminder') {
      console.log('handleNotification.data=>', JSON.stringify(data));
      navigation.navigate('Login');
      // navigation.navigate('MealView',)
    } else if (data.action == 'WeightReminder') {
      console.log('handleNotification.data=>', JSON.stringify(data));
      navigation.navigate('Login');
      // navigation.navigate('MealView',)
    }
  };
  const navigateToSpecificRoute = route => {
    navigation.navigate('Home');
    navigation.navigate(route);
  };
  const convertApnsToken = token => {
    setLoading(true);
    let payload = {
      application: strings.ios_pck_name,
      sandbox: false,
      apns_tokens: [token],
    };
    dispatch(tokenRequest(payload, onSuccess, onFailure));
  };
  async function onSuccess(response) {
    setLoading(false);
    const {results} = response;
    console.log('token=======>', results[0].registration_token);
    if (results) saveTokenToStorage(results[0].registration_token);
  }
  async function onFailure(error) {
    setLoading(false);
    navigateToHome();
  }
  const saveTokenToStorage = async tkn => {
    await Utility.getInstance()
      .setStoreData('FIREBASE_TOKEN', tkn)
      .then(() => {
        navigateToHome();
      });
  };
  const navigateToHome = () => {
    if (userData && !action)
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }, 3000);
  };
  const onLoginPress = () => {
    navigation.navigate('Login');
  };
  const oneSignupPress = () => {
    navigation.navigate('Signup');
  };
  return (
    <View style={[styles.flex, {backgroundColor: colors.primary}]}>
      <View style={[styles.flex_7, {backgroundColor: 'transparent'}]}>
        {/* <Video
          repeat
          source={video.SPLASHVIDEO} // Can be a URL or a local file.
          style={[
            styles.backgroundVideo,
            {
              transform: [{rotate: '10deg'}],
              width: 500,

              marginTop: -Utility.getInstance().DH() / 25,
              height: Utility.getInstance().heightToDp(60),
            },
          ]}
          resizeMode="stretch"
          muted></Video>
        {Platform.OS === 'android' ? (
          <>
            <View
              style={{
                backgroundColor: colors.primary,
                height: 400,
                width: 1200,
                marginLeft: -40,
                opacity: 0.5,
                marginTop: Utility.getInstance().heightToDp(-80),
                transform: [{rotate: '190deg'}],
              }}></View>
          </>
        ) : (
          <View
            style={{
              backgroundColor: colors.primary,
              height: 120,
              width: '100%',
              opacity: 0.5,
              marginTop:
                SCREEN_HEIGHT > 844
                  ? -Utility.getInstance().DH() / 3.4
                  : -Utility.getInstance().DH() / 3.05,
            }}>
            <View
              style={{
                transform: [{rotate: '190deg'}],
                backgroundColor: colors.primary,
                height: 300,
                width: Utility.getInstance().DW() + Utility.getInstance().DW(),
              }}></View>
          </View>
        )} */}
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
        <View
          style={{
            marginTop: '-25%',
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
              marginTop: Utility.getInstance().heightToDp(30),
              marginLeft: Utility.getInstance().widthToDp(8),
              backgroundColor: 'transparent',
            }}></ImageBackground>
        </View>
        <Indicator isAnimating={isLoading} />
      </View>
      {!userData && (
        <View style={[styles.flex_3, globalStyles.center]}>
          <TouchableOpacity
            onPress={onLoginPress}
            style={[globalStyles.button_primary, globalStyles.center]}>
            <Text style={globalStyles.btn_heading}>{strings.login}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={oneSignupPress}
            style={[
              globalStyles.button_primary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading}>{strings.signup}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default Splash;
