import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../Setting/style';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Utility from '../../utility/Utility';
import Loader from '../../component/loader';
import Header from '../../component/headerWithBackControl';
import colors from '../../constants/colorCodes';
import {useDispatch, useSelector} from 'react-redux';
import dummyContent from '../../constants/dummyContent';
import {logout, logoutRequest} from '../../redux/action/LoginAction';
import {
  updateUserInformationRequest,
  userProfileInfoRequest,
  deleteUserAccountRequest,
} from '../../redux/action/UserProfileInfo';
var userId = null;
const ONE = '1';
const Setting = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const dropdownRef = useRef();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [clientCode, setClientCode] = useState('');
  const [haveClientCode, setHaveClientCode] = useState(false);
  const [userName, setUserName] = useState('');
  const [userimage, setuserimage] = useState('');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }

    getProfileInformation();
  }, []);

  //user information call
  const getProfileInformation = async () => {
    let data = await Utility.getInstance().getStoreData(strings.clientId);
    let c_c = data ? JSON.parse(data) : null;
    if (c_c) {
      setHaveClientCode(true);
      setClientCode(c_c);
    }
    dispatch(userProfileInfoRequest(userId, onSucc, onFail));
  };
  //user update information call
  const updateUserInfo = payload => {
    dispatch(updateUserInformationRequest(payload, onS, onF));
  };
  const onSucc = resolve => {
    const {
      age,
      gender,
      height,
      c_weight,
      image,
      username,
      name,
      notifications,
      location,
    } = resolve.data;
    setAge(age);
    setGender(gender);
    setWeight(c_weight + ` lbs`);
    setHeight(height);
    setUserName(name);
    setuserimage(image);
    if (!Utility.getInstance().isEmpty(notifications)) {
      setIsNotificationEnabled(notifications == strings.one ? true : false);
    }
    if (!Utility.getInstance().isEmpty(location)) {
      setIsLocationEnabled(location == strings.one ? true : false);
    }
    if (props.route.params == ONE) {
      dropdownRef.current.openDropdown();
    }
  };
  const onFail = reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const onS = async resolve => {};
  const onF = async reject => {};
  const backPress = () => {
    navigation.goBack();
  };
  const onLogoutPress = async () => {
    setLoading(true);
    let payload = {
      uid: userId,
    };
    dispatch(logout());
    dispatch(logoutRequest(payload, onSS, onFF));
  };
  const onSS = async resolve => {
    await Utility.getInstance().removeStoreData(strings.location_data);
    await Utility.getInstance().removeStoreData(strings.clientId);
    await Utility.getInstance().removeStoreData(strings.fcToken);
    await Utility.getInstance().removeStoreData(strings.date);
    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'Splash'}],
    });
  };
  const onFF = async reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const changePasswordPress = () => {
    navigation.navigate('ChangePassword');
  };
  const toggleSwitchNotification = v => {
    setIsNotificationEnabled(previousState => !previousState);
    updateUserInfo({uid: userId, notifications: v ? 1 : 0});
  };

  const toggleSwitchLocation = v => {
    setIsLocationEnabled(previousState => !previousState);
    updateUserInfo({uid: userId, location: v ? 1 : 0});
  };

  const deleteUserAccount = () => {
    let payload = {uid: userId};
    dispatch(deleteUserAccountRequest(payload, onSSS, onFFF));
  };
  const onSSS = resolve => {
    onLogoutPress();
  };
  const onFFF = reject => {};

  const deleteConfirmationAlert = () =>
    Alert.alert(
      'Are you sure? You want to delete you Account',
      'If you delete your account,You will loose your all Data and Information.',
      [
        {
          text: 'Cancel',
          onPress: () => onCancelPress(),
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => deleteUserAccount(),
        },
      ],
    );

  const onCancelPress = () => {};

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <Loader isLoading={isLoading} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 0}}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.settings}
            </Text>

            <View style={[styles.profilec]}>
              <Image
                style={styles.userlogoSizeBig}
                source={{uri: userimage}}></Image>
              <View style={{marginLeft: 10}}>
                <Text style={[styles.why_heading, styles.font30, styles.white]}>
                  {userName}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: colors.secondary,
                borderBottomWidth: 0.6,
                width: '100%',
                marginTop: -10,
              }}></View>
          </View>
          <Text
            style={[
              styles.whydesc,
              styles.green,
              globalStyles.textAlignStart,
              globalStyles.medium,
              {paddingHorizontal: 30},
            ]}>
            {strings.profileB}
          </Text>

          <View style={styles.profileclist_lane}>
            <SelectDropdown
              data={dummyContent.age}
              onSelect={(selectedItem, index) => {
                setAge(selectedItem);
                updateUserInfo({uid: userId, age: selectedItem});
              }}
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
                    style={styles.nextimg}
                    source={images.PROFILE.NEXT}></Image>
                );
              }}
              buttonStyle={styles.dropdownSmall4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>

          <View style={styles.profileclist_lane}>
            <SelectDropdown
              data={dummyContent.gender}
              onSelect={(selectedItem, index) => {
                setGender(selectedItem);
                updateUserInfo({uid: userId, gender: selectedItem});
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
                    style={styles.nextimg}
                    source={images.PROFILE.NEXT}></Image>
                );
              }}
              buttonStyle={styles.dropdownSmall4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>

          <View style={styles.profileclist_lane}>
            <SelectDropdown
              disabled={!Utility.getInstance().isSunday()}
              ref={dropdownRef}
              data={dummyContent.weight}
              onSelect={(selectedItem, index) => {
                setWeight(selectedItem);
                updateUserInfo({uid: userId, c_weight: selectedItem});
              }}
              defaultButtonText={weight}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              renderDropdownIcon={() => {
                return (
                  <Image
                    style={styles.nextimg}
                    source={images.PROFILE.NEXT}></Image>
                );
              }}
              buttonStyle={styles.dropdownSmall4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>

          <View style={styles.profileclist_lane}>
            <SelectDropdown
              data={dummyContent.height}
              onSelect={(selectedItem, index) => {
                setHeight(selectedItem);
                updateUserInfo({uid: userId, height: selectedItem});
              }}
              defaultButtonText={height}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              renderDropdownIcon={() => {
                return (
                  <Image
                    style={styles.nextimg}
                    source={images.PROFILE.NEXT}></Image>
                );
              }}
              buttonStyle={styles.dropdownSmall4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>
          <Text
            style={[
              styles.whydesc,
              styles.green,
              globalStyles.textAlignStart,
              globalStyles.padding_30_hor,
              globalStyles.medium,
            ]}>
            {strings.permissionC}
          </Text>
          <View style={[styles.profileclist_lane]}>
            <Text
              style={[
                styles.whydesc,
                styles.white,
                globalStyles.mt_0,
                globalStyles.font17,
                {marginLeft: 50},
              ]}>
              {strings.notifications}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Switch
                trackColor={{false: '#767577', true: colors.secondary}}
                thumbColor={isNotificationEnabled ? colors.white : '#f4f3f4'}
                //ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchNotification}
                value={isNotificationEnabled}
              />
            </View>
          </View>
          <View style={[styles.profileclist_lane]}>
            <Text
              style={[
                styles.whydesc,
                styles.white,
                globalStyles.mt_0,
                globalStyles.font17,
                {marginLeft: 50},
              ]}>
              {strings.location}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Switch
                trackColor={{false: '#767577', true: colors.secondary}}
                thumbColor={isLocationEnabled ? colors.white : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchLocation}
                value={isLocationEnabled}
              />
            </View>
          </View>
          <Text
            style={[
              styles.whydesc,
              styles.green,
              globalStyles.textAlignStart,
              globalStyles.padding_30_hor,
              globalStyles.medium,
            ]}>
            {strings.accountC}
          </Text>
          <Pressable
            onPress={changePasswordPress}
            style={[styles.profileclist_lane, {paddingHorizontal: 30}]}>
            <Text
              style={[
                styles.whydesc,
                styles.white,
                globalStyles.mt_0,
                globalStyles.font17,
              ]}>
              {strings.changepass}
            </Text>
          </Pressable>
          <TouchableOpacity
            onPress={onLogoutPress}
            style={[styles.profileclist_lane, {paddingHorizontal: 30}]}>
            <Text
              style={[
                styles.whydesc,
                styles.green,
                globalStyles.mt_0,
                globalStyles.font17,
              ]}>
              {strings.logout}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.mr_10,
                ]}>
                {strings.logout}
              </Text>
              <Image
                style={styles.nextimg1}
                source={images.PROFILE.NEXT}></Image>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text
          onPress={() => deleteConfirmationAlert()}
          style={[
            styles.font23,
            globalStyles.textAlignCenter,
            styles.green,
            globalStyles.mb_20,
            {margin: 20, alignItems: 'center'},
          ]}>
          {strings.deleteaccount}
        </Text>
      </View>
    );
  };

  return DefautView();
};
export default Setting;
