import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../MyGoal/style';
import images from '../../assets/images';
import Utility from '../../utility/Utility';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Loader from '../../component/loader';
import colors from '../../constants/colorCodes';
import {userProfileInfoRequest} from '../../redux/action/UserProfileInfo';
import {updateUserInformationRequest} from '../../redux/action/UserProfileInfo';
import {
  CircularProgress,
  GradientCircularProgress,
} from 'react-native-circular-gradient-progress';
import BottomTabMenu from '../../component/bottomMenu';
var userId = null;
var currentWeight = 0;
const MyGoal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );
  const [isSaveButtonVisible, setSaveButtonVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [clientCode, setClientCode] = useState('');

  const onEditGoalPress = () =>
    // navigation.navigate('MonthGoal', {
    //   FROM: 'MyGoal',
    //   CURRENT_WEIGHT: currentWeight + `lbs`,
    // });
    navigation.navigate('Calories', {
      FROM: 'MyGoal',
      CURRENT_WEIGHT: currentWeight + `lbs`,
    });
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

    let client_code = resolve.data.client_code;
    if (client_code) {
      setLoggedIn(true);
      setClientCode(client_code);
    }
    if (resolve.data.location_details) {
      let location = JSON.parse(resolve.data.location_details);
      console.log(
        'getUserProfileInformation.LOCATION===',
        ///resolve.data.location_details,
        location.formattedAddress,
      );
      if (location.formattedAddress) {
        setLocation(location.formattedAddress);
      }
    } else {
      getLoctionFromLocalStorage();
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

  const onSavePress = () => {
    if (description) {
      let payloadToSend = {
        uid: userId,
        description: description,
      };
      dispatch(updateUserInformationRequest(payloadToSend, onS, onF));
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
    navigation.navigate('Setting');
  };
  const step3 = () => {
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
            onPress={() => navigation.navigate('Chat')}
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
  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />

          <Loader isLoading={isLoading} />
          <ScrollView contentContainerStyle={{paddingVertical: 0}}>
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading, styles.font30]}>
                {strings.profile}
              </Text>
              <View style={styles.profilec}>
                <Image
                  style={styles.userlogoSizeBig}
                  source={{uri: userImage}}></Image>
                <View
                  style={{
                    marginLeft: 20,
                    marginVertical: 10,
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={[styles.why_heading, styles.font30, styles.white]}>
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

              <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
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
              )}
              <Text
                style={[
                  styles.whydesc,
                  styles.green,
                  globalStyles.textAlignStart,
                  {marginBottom: -20},
                ]}>
                {strings.profiles}
              </Text>
            </View>
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
                {strings.age}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                  ]}>
                  {userInformationReducer && userInformationReducer.age}
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
                {strings.gender}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
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
              style={[styles.profileclist, {flex: 1}]}>
              <Text
                style={[
                  styles.whydesc,
                  styles.white,
                  globalStyles.mt_0,
                  globalStyles.font17,
                  {flex: 0.4},
                ]}>
                {'Location'}
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 0.6}}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.whydesc,
                    styles.white,
                    globalStyles.mt_0,
                    globalStyles.mr_10,
                  ]}>
                  {location}
                </Text>
                <Image
                  style={styles.nextimg}
                  source={images.PROFILE.NEXT}></Image>
              </View>
            </Pressable>
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

            {step3()}
          </ScrollView>
        </View>
      </>
    );
  };

  return DefautView();
};
export default MyGoal;
