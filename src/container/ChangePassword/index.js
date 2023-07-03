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
import {useDispatch, useSelector} from 'react-redux';
import images from '../../assets/images/index';
import styles from '../ChangePassword/style';
import globalStyles from '../../assets/globalStyles/index';
import colors from '../../constants/colorCodes';
import Indicator from '../../component/buttonIndicator';
import {useNavigation} from '@react-navigation/native';
import strings from '../../constants/strings';
import Utility from '../../utility/Utility';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import warning from '../../constants/warning';

import {changePasswordRequest} from '../../redux/action/ChangePasswordAction';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
var userId = '';
const ChangePassword = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.changePasswordReducer.showLoader,
  );
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (userData) {
    userId = userData.id;
  }
  useEffect(() => {}, []);
  const backPress = () => {
    navigation.goBack();
  };
  const changePasswordPress = () => {
    if (isFirstStepValid()) {
      let payload = {
        uid: userId,
        old_password: oldPassword,
        new_password: newPassword,
      };
      dispatch(changePasswordRequest(payload, onS, onF));
    }
  };
  const onS = async resolve => {
    const {data, message} = resolve;
    Utility.getInstance().inflateToast(message);
    setTimeout(() => {
      navigation.navigate('Home');
    });
  };
  const onF = async reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const isFirstStepValid = () => {
    var message = '';
    if (Utility.getInstance().isEmpty(oldPassword)) {
      message = warning.please_enter_password;
    } else if (oldPassword.length < 6) {
      message = warning.please_enter_valid_password;
    } else if (Utility.getInstance().isEmpty(newPassword)) {
      message = warning.please_enter_password;
    } else if (newPassword.length < 6) {
      message = warning.please_enter_valid_password;
    }

    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };

  const ReisterFirstStep = () => {
    return (
      <View
        style={[styles.flex_7, globalStyles.center, globalStyles.padding_40]}>
        <Text style={globalStyles.input_heading}>{'Old Password'}</Text>
        <TextInput
          value={oldPassword}
          // secureTextEntry
          onChangeText={text => setOldPassword(text)}
          style={styles.input}
        />
        <Text style={globalStyles.input_heading}>{'New Password'}</Text>
        <TextInput
          value={newPassword}
          // secureTextEntry
          onChangeText={text => setNewPassword(text)}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => [changePasswordPress()]}
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
              {strings.changepass}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraHeight={180}
        keyboardShouldPersistTaps="always"
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
                height: 100,
                width: '90%',
                marginTop: Utility.getInstance().heightToDp(30),
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

        {ReisterFirstStep()}
      </KeyboardAwareScrollView>
    </>
  );
};
export default ChangePassword;
