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
  Switch,
  TextInput,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import SelectDropdown from 'react-native-select-dropdown';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../MyGoal/style';
import dummyContent from '../../constants/dummyContent';
import ApiConstant from '../../constants/api';
import images from '../../assets/images';
import Utility from '../../utility/Utility';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Loader from '../../component/loader';
import ImagePicker from 'react-native-image-crop-picker';
import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
import colors from '../../constants/colorCodes';
import {loginSuccess, loginRequest} from '../../redux/action/LoginAction';
import {userProfileInfoRequest} from '../../redux/action/UserProfileInfo';
import {
  updateUserInformationRequest,
  deleteUserAccountRequest,
} from '../../redux/action/UserProfileInfo';
import {
  CircularProgress,
  GradientCircularProgress,
} from 'react-native-circular-gradient-progress';
import BottomTabMenu from '../../component/bottomMenu';
import {logout, logoutRequest} from '../../redux/action/LoginAction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
var userId = null;
var currentWeight = 0;
const ONE = '1';
const Profile = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const refRBSheet = useRef();
  const dropdownRef = useRef();
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );
  const [isProfile, setProfileSaved] = useState(false);
  const [isSaveButtonVisible, setSaveButtonVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [clientCode, setClientCode] = useState('');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [isLocationEditableEnabled, setLocationEditableEnabled] =
    useState(false);
  console.log({userInformationReducer});
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
  const updateUserInfo = payload => {
    console.log('updateUserInfo.payload=>', payload);
    dispatch(
      updateUserInformationRequest(
        payload,
        updateUserInfoSuccess,
        updateUserInfoFailure,
      ),
    );
  };
  const updateUserInfoSuccess = resolve => {
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
    if (!Utility.getInstance().isEmpty(notifications)) {
      setIsNotificationEnabled(notifications == 1 ? true : false);
    }
    if (!Utility.getInstance().isEmpty(location)) {
      setIsLocationEnabled(location == 1 ? true : false);
    }
  };
  const updateUserInfoFailure = reject => {
    console.log('updateUserInfo.reject=>', reject);
    Utility.getInstance().inflateToast(reject);
  };
  const onLogoutPress = async () => {
    //setLoading(true);
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
    //setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'Splash'}],
    });
  };
  const onFF = async reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const onEditGoalPress = () =>
    navigation.navigate('Calories', {
      FROM: 'MyGoal',
      CURRENT_WEIGHT: currentWeight + `lbs`,
    });
  // navigation.navigate('MonthGoal', {
  //   FROM: 'MyGoal',
  //   CURRENT_WEIGHT: currentWeight + `lbs`,
  // });
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    const focus = navigation.addListener('focus', () => {
      getUserProfileInformation();
    });
    return () => {
      focus;
    };
  }, []);

  const getUserProfileInformation = () => {
    dispatch(userProfileInfoRequest(userId, onSucc, onFail));
  };
  const onSucc = resolve => {
    console.log('resolve', resolve);

    const {data} = resolve;
    setUserImage(data?.image);

    setDescription(data?.description);

    currentWeight = data?.c_weight;

    setAge(data?.age);
    setGender(data?.gender);
    setWeight(data?.c_weight + ` lbs`);
    setHeight(data?.height);

    let client_code = resolve.data.client_code;
    if (client_code) {
      setLoggedIn(true);
      setClientCode(client_code);
    }
    if (!Utility.getInstance().isEmpty(data?.notifications)) {
      setIsNotificationEnabled(data?.notifications == 1 ? true : false);
    }
    if (!Utility.getInstance().isEmpty(data?.location)) {
      setIsLocationEnabled(data?.location == 1 ? true : false);
    }
    if (resolve.data.location_details) {
      let location = JSON.parse(resolve.data.location_details);
      console.log('formattedlocation=>', location?.formattedAddress);
      setLocation(location?.formattedAddress);
    } else {
      getLoctionFromLocalStorage();
    }

    if (props?.route?.params == ONE) {
      dropdownRef?.current?.openDropdown();
    }
  };
  const getLoctionFromLocalStorage = async () => {
    let locationData = await Utility.getInstance().getStoreData(
      strings.location_data,
    );
    if (locationData) {
      const data = JSON.parse(locationData);
      setLocation(data?.formattedAddress);
    }
  };
  const onFail = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const backPress = () => {
    navigation.goBack();
  };
  const onUpdateProfilePress = () => {
    refRBSheet.current.open();
  };
  const pickORCapture = TYPE => {
    refRBSheet.current.open();
    if (TYPE == 'CAMERA') {
      ImagePicker.openCamera({
        width: 400,
        height: 300,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 300,
      })
        .then(image => {
          refRBSheet.current.close();
          generateImage(image);
        })
        .catch(e => {
          Utility.getInstance().inflateToast(JSON.stringify(e.message));
        });
    } else if (TYPE == 'GALLERY') {
      ImagePicker.openPicker({
        width: 400,
        height: 300,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 300,
      })
        .then(image => {
          generateImage(image);
          refRBSheet.current.close();
        })
        .catch(e => {});
    }
  };
  const generateImage = async data => {
    const localUri = data.path;
    const filename = localUri.split('/').pop();
    let fileType = data.mime;
    const File = {
      uri: localUri,
      name: filename,
      type: fileType,
    };
    setUserImage(localUri);
    setTimeout(() => {
      uploadUserImage(File);
    }, 100);
  };

  const uploadUserImage = async imageFile => {
    setProfileSaved(true);
    var formdata = new FormData();
    formdata.append('uid', userId);
    formdata.append('image', imageFile);
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };
    await fetch(
      ApiConstant.BASE_URL + ApiConstant.UPLOAD_USER_IMAGE,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => onSUploadImage(JSON.parse(result)))
      .catch(error => onFUploadImage(error));
  };

  const onSUploadImage = resolve => {
    setProfileSaved(false);
    if (resolve) {
      let updatedImageUri = resolve.data.image;
      if (userData) {
        let payload = {
          data: {
            ...userData,
            image: updatedImageUri,
          },
        };
        dispatch(loginSuccess(payload, {}, {}));
      }
    }
  };
  const onFUploadImage = reject => {
    setProfileSaved(false);
  };

  // const GoalView = () => {
  //   return (
  //     <Pressable
  //       onPress={onEditGoalPress}
  //       style={[styles.addView_green, {alignSelf: 'flex-end'}]}>
  //       <Text
  //         style={[
  //           styles.headingtextBlack,
  //           {fontSize: 15, fontFamily: 'Poppins-Medium'},
  //         ]}>
  //         EDIT MY GOALS
  //       </Text>
  //     </Pressable>
  //   );
  // };

  const onSavePress = () => {
    if (description) {
      dispatch(
        updateUserInformationRequest(
          {
            uid: userId,
            description: description,
          },
          onS,
          onF,
        ),
      );
    } else {
      Utility.getInstance().inflateToast('Please enter description.');
    }
  };
  const onS = resolve => {
    console.log('onStepsCompletedPress==', resolve);
    setTimeout(() => {
      Utility.getInstance().inflateToast('Your description saved sucessfully');
    }, 100);
  };
  const onF = reject => {};
  const onSettingPress = () => {
    navigation.navigate('EditWeightGoals');
  };
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

  const deleteUserAccount = () => {
    let payload = {uid: userId};
    dispatch(deleteUserAccountRequest(payload, onSSS, onFFF));
  };
  const onSSS = resolve => {
    onLogoutPress();
  };
  const onFFF = reject => {};

  const WhatIsWhySection = () => {
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
            onFocus={() => setSaveButtonVisible(true)}
            onChangeText={text => setDescription(text)}
            value={description}
            textAlignVertical="top"
            multiline={true}
            style={styles.biginput}
          />
          {isSaveButtonVisible && (
            <Text
              onPress={() => onSavePress()}
              style={[
                globalStyles.btn_heading,
                {color: colors.secondary, padding: 10},
              ]}>
              {'SAVE'}
            </Text>
          )}
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              {textAlign: 'center'},
            ]}>
            {`Intrested in working 1:1 with
a health professional?`}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {
                message: strings.automaticMessage,
              })
            }
            //onPress={() => navigation.navigate('Chat')}
            style={[
              globalStyles.button_primary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={[globalStyles.btn_heading, {color: colors.secondary}]}>
              {'CHAT NOW'}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const GoalView = () => {
    return (
      <Pressable onPress={onEditGoalPress} style={[styles.addView_green]}>
        <Text
          style={[
            styles.headingtextBlack,
            {fontSize: 15, fontFamily: 'Poppins-Medium'},
          ]}>
          EDIT MY GOALS
        </Text>
      </Pressable>
    );
  };
  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />
          <ImagePickerBottomSheet
            openCamera={() => pickORCapture('CAMERA')}
            openFiles={() => pickORCapture('GALLERY')}
            reference={refRBSheet}
          />

          <Loader isLoading={isLoading} />
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraHeight={240}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{paddingVertical: 0}}>
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading, styles.font30]}>
                {strings.profile}
              </Text>
              <View style={styles.profilec}>
                <ImageBackground
                  borderRadius={5}
                  style={styles.userlogoSizeBig}
                  source={{uri: userImage}}></ImageBackground>
                <View
                  style={{
                    marginLeft: 20,
                    marginVertical: 10,
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={[styles.why_heading, styles.font25, styles.white]}>
                    {userInformationReducer && userInformationReducer.name}
                  </Text>
                  <Text
                    onPress={onUpdateProfilePress}
                    style={[
                      styles.forgot_pass_heading,
                      styles.green,
                      globalStyles.underline_green,
                      {marginTop: -5},
                    ]}>
                    {strings.updateprofile}
                  </Text>
                </View>
              </View>
              {/* <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
                {strings.plancode}
              </Text>
              {isLoggedIn ? (
                <Text style={[styles.forgot_pass_heading, styles.green]}>
                  {clientCode}
                </Text>
              ) : (
                <>
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,
                      styles.green,
                    ]}>
                    {strings.noplan}
                  </Text>
                  <Text
                    onPress={() => navigation.navigate('Chat', 0)}
                    style={[
                      styles.forgot_pass_heading,
                      styles.green,
                      globalStyles.underline_green,
                    ]}>
                    {strings.signupnow}
                  </Text>
                </>
              )} */}
              <Text
                style={[
                  styles.whydesc,
                  styles.green,
                  globalStyles.textAlignStart,
                  {marginBottom: -20},
                ]}>
                {strings.profileB}
              </Text>
            </View>
            {/* <Pressable
              onPress={() => navigation.navigate('Setting', 0)}
              style={styles.profileclist}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                ]}>
                {strings.age}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                    globalStyles.font17,
                  ]}>
                  {userInformationReducer && userInformationReducer.age}
                </Text>
                <Image
                  style={styles.nextimg}
                  source={images.PROFILE.NEXT}></Image>
              </View>
            </Pressable> */}
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
            {/* <Pressable
              onPress={() => navigation.navigate('Setting', 0)}
              style={styles.profileclist}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                ]}>
                {strings.gender}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                    globalStyles.font17,
                  ]}>
                  {userInformationReducer && userInformationReducer.gender}
                </Text>
                <Image
                  style={styles.nextimg}
                  source={images.PROFILE.NEXT}></Image>
              </View>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('Setting', 0)}
              style={styles.profileclist}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                ]}>
                {strings.weight}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                    globalStyles.font17,
                  ]}>
                  {userInformationReducer &&
                    userInformationReducer.c_weight + ' lbs'}
                </Text>
                <Image
                  style={styles.nextimg}
                  source={images.PROFILE.NEXT}></Image>
              </View>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Setting', 0)}
              style={styles.profileclist}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                ]}>
                {strings.height}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                    globalStyles.font17,
                  ]}>
                  {userInformationReducer && userInformationReducer?.height}
                </Text>
                <Image
                  style={styles.nextimg}
                  source={images.PROFILE.NEXT}></Image>
              </View>
            </Pressable>
            */}
            <Pressable
              //  onPress={() => navigation.navigate('Setting', 0)}
              onPress={() => setLocationEditableEnabled(true)}
              style={[styles.profileclist]}>
              <View
                style={{
                  flex: 0.98,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.font17,
                  ]}>
                  {'Location'}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                    globalStyles.font17,
                    {width: '75%', alignSelf: 'flex-end', textAlign: 'right'},
                  ]}>
                  {location}
                </Text>
              </View>
              <Image
                style={styles.nextimg}
                source={images.PROFILE.NEXT}></Image>
            </Pressable>
            {isLocationEditableEnabled && (
              // <View style={styles.profileclist_lane}>
              //   <SelectDropdown
              //     disabled={!Utility.getInstance().isSunday()}
              //     ref={dropdownRef}
              //     data={dummyContent.weight}
              //     onSelect={(selectedItem, index) => {
              //       setWeight(selectedItem);
              //       updateUserInfo({uid: userId, c_weight: selectedItem});
              //     }}
              //     defaultButtonText={weight}
              //     buttonTextAfterSelection={(selectedItem, index) => {
              //       return selectedItem;
              //     }}
              //     rowTextForSelection={(item, index) => {
              //       return item;
              //     }}
              //     renderDropdownIcon={() => {
              //       return (
              //         <Image
              //           style={styles.nextimg}
              //           source={images.PROFILE.NEXT}></Image>
              //       );
              //     }}
              //     buttonStyle={styles.dropdownSmall4BtnStyle}
              //     buttonTextStyle={styles.dropdown4BtnTxtStyle}
              //     dropdownIconPosition={'right'}
              //     dropdownStyle={styles.dropdown4DropdownStyle}
              //     rowStyle={styles.dropdown4RowStyle}
              //     rowTextStyle={styles.dropdown4RowTxtStyle}
              //   />
              // </View>
              <GooglePlacesAutocomplete
                styles={{
                  textInputContainer: {
                    margin: 10,
                    height: 37,
                    marginTop: '1%',
                    backgroundColor: 'black',
                  },
                  textInput: {color: 'black'},
                  description: {color: 'black'},
                }}
                placeholder=""
                fetchDetails={true}
                onPress={(data: any, details: any = null) => {
                  let streetAddress = data?.description.split(',');
                  console.log('datatata=>', data);
                  // console.log(
                  //   'datatata=>',
                  //   streetAddress.length == 1
                  //     ? streetAddress[0] + ` ` + streetAddress[1]
                  //     : streetAddress[0],
                  // );
                  setLocation(data?.description);
                  setLocationEditableEnabled(false);
                  updateUserInfo({
                    uid: userId,
                    location_details: JSON.stringify({
                      formattedAddress: data?.description,
                    }),
                  });
                  // if (data?.description) {
                  //
                  //   setSelectedAddress({
                  //     vicinity:
                  // streetAddress.length == 1
                  //   ? streetAddress[0] + ` ` + streetAddress[1]
                  //   : streetAddress[0],
                  //     lat: details?.geometry?.location?.lat,
                  //     lng: details?.geometry?.location?.lng,
                  //   });
                  // } else {
                  //   setSelectedAddress({
                  //     vicinity: data?.description,
                  //     lat: details?.geometry?.location?.lat,
                  //     lng: details?.geometry?.location?.lng,
                  //   });
                  // }
                  // getPlacedetails(
                  //   details?.geometry?.location?.lat,
                  //   details?.geometry?.location?.lng,
                  //   details
                  // );
                }}
                query={{
                  key: 'AIzaSyAg75Ekm-fJV3fmMWULmwxp-z3E5P0p3RM',
                  language: 'en',
                }}
              />
            )}
            <Pressable
              onPress={() => navigation.navigate('MealHistory')}
              style={[styles.profileclist, {flex: 1}]}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                  {flex: 0.4},
                ]}>
                {'Meal History'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  flex: 0.6,
                }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                    globalStyles.font17,
                    {color: colors.secondary},
                  ]}>
                  {'View'}
                </Text>
              </View>
            </Pressable>

            <Text
              style={[
                styles.whydesc,
                styles.green,
                globalStyles.textAlignStart,
                globalStyles.padding_20_hor,
                //  globalStyles.medium,
                //styles.whydesc,
                //styles.green,
                //globalStyles.textAlignStart,
                //{marginBottom: -20},
              ]}>
              {strings.permissionC}
            </Text>
            <View style={[styles.profileclist_lane1]}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                  // {marginLeft: 50},
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
            <View style={[styles.profileclist_lane1]}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                  // {marginLeft: 50},
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
                globalStyles.padding_20_hor,
                //globalStyles.medium,
              ]}>
              {strings.accountC}
            </Text>
            <Pressable
              onPress={changePasswordPress}
              style={[styles.profileclist_lane1, {paddingHorizontal: 20}]}>
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
              style={[styles.profileclist_lane1, {paddingHorizontal: 20}]}>
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

            {/* <Text
              onPress={() => navigation.navigate('Setting')}
              style={[
                styles.forgot_pass_heading,
                styles.green,
                globalStyles.underline_green,
                {marginTop: 20, alignSelf: 'center'},
              ]}>
              {strings.setting}
            </Text> */}
            {/* <View style={[globalStyles.padding_40]}>
              <Text style={[styles.why_heading, styles.font25, styles.green]}>
                {strings.mygoals}
              </Text>
              <GoalView />
            </View> */}
            <View
              style={[
                globalStyles.padding_40,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                },
              ]}>
              <Text style={[styles.why_heading, styles.font30, styles.white]}>
                {strings.mygoals}
              </Text>
              <GoalView />

              {/* {!userInformationReducer?.client_code && <GoalView />} */}
            </View>
            <View style={styles.progressgoalc}>
              <View style={styles.progressgoalchildc}>
                <View style={styles.progressbar}>
                  <GradientCircularProgress
                    startColor={colors.primary}
                    middleColor={colors.secondary}
                    endColor={colors.primary}
                    size={85}
                    emptyColor={colors.black}
                    progress={70}
                    strokeWidth={6}>
                    <Text style={styles.lbs}>
                      {userInformationReducer &&
                        userInformationReducer.c_weight + `\nlbs`}
                    </Text>
                  </GradientCircularProgress>
                  <Text style={[styles.bucketSize, globalStyles.mt_10]}>
                    {strings.currenweight}
                  </Text>
                </View>
              </View>
              <View style={styles.progressgoalchildc}>
                <View style={styles.progressbar}>
                  <GradientCircularProgress
                    startColor={colors.primary}
                    middleColor={colors.secondary}
                    endColor={colors.primary}
                    size={85}
                    emptyColor={colors.black}
                    progress={70}
                    strokeWidth={6}>
                    <Text style={styles.lbs}>
                      {userInformationReducer &&
                        userInformationReducer.g_weight + `\nlbs`}
                    </Text>
                  </GradientCircularProgress>
                  <Text style={[styles.bucketSize, globalStyles.mt_10]}>
                    {strings.goalweights}
                  </Text>
                </View>
              </View>
            </View>
            {Utility.getInstance().isSunday() && (
              <Pressable
                onPress={onSettingPress}
                style={[
                  globalStyles.mt_20,
                  {
                    width: 190,
                    height: 40,
                    backgroundColor: colors.secondary,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  },
                ]}>
                <Text
                  style={[
                    {fontSize: 15, margin: 0, letterSpacing: 0.2},
                    globalStyles.textAlignCenter,
                  ]}>
                  {strings.editweight}
                </Text>
              </Pressable>
            )}
            <View
              style={[
                //styles.flex_9,
                globalStyles.center,
                {paddingHorizontal: 20},
                globalStyles.mt_30,
              ]}>
              <Text style={[styles.why_heading, globalStyles.regular]}>
                {strings.DailyFeedback}
              </Text>
              <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
                {strings.DailyFeedback_desc}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('DailyBioFeedback')}
              style={[
                globalStyles.button_secondary,
                globalStyles.center,
                //globalStyles.button,
                globalStyles.mt_30,
                {alignItems: 'center', alignSelf: 'center'},
              ]}>
              <Text style={[globalStyles.btn_heading, {color: colors.black}]}>
                {'ENTER DAILY FEEDBACK'}
              </Text>
            </TouchableOpacity>
            {WhatIsWhySection()}
          </KeyboardAwareScrollView>
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
      </>
    );
  };

  return DefautView();
};
export default Profile;
