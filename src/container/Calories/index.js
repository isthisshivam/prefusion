import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import images from '../../assets/images/index';
import styles from '../Calories/style';
import Indicator from '../../component/buttonIndicator';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import warning from '../../constants/warning';
import Utility from '../../utility/Utility';
import colors from '../../constants/colorCodes';
import DialogView from '../../component/dialog';
import {TextInput} from 'react-native-gesture-handler';
import {
  getCalorieDropdownDataRequest,
  uploadUserCalorieDataRequest,
  changeCalorieCounterRequest,
} from '../../redux/action/CalorieDropdownAction';
import {clientInfoRequest} from '../../redux/action/ClientDataAction';
import Loader from '../../component/loader';
import {userProfileInfoRequest} from '../../redux/action/UserProfileInfo';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
var userId = null;
const Calories = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [willInflate, setWillInflate] = useState(false);
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );
  const [showLoader, setShowLoader] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [goalTypeArray, setGoalTypeArray] = useState([]);
  const [macroArray, setMarcoArray] = useState([]);
  const [suggestedCalories, setSuggestedCalories] = useState(0);
  const [customCalories, setcustomCalories] = useState(0);
  const [goalType, setGoalType] = useState('Select');
  const [goalType_id, setGoalTypeId] = useState('');
  const [carbs, setCarbs] = useState('35');
  const [fat, setFat] = useState('30');
  const [protien, setProtien] = useState('35');
  const [gotClientInfo, setGotClientInfo] = useState(false);
  const [isClientUser, setIsClientUser] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {}, []);
  useFocusEffect(
    React.useCallback(() => {
      if (userData) {
        userId = userData.id;
      }
      getClientId();
    }, []),
  );

  const getClientId = async () => {
    // const data = await Utility.getInstance().getStoreData(strings.clientId);
    // let clientCode = data ? JSON.parse(data) : null;
    // if (clientCode) {
    //   setLoggedIn(true);
    //   setGotClientInfo(true);
    //   setIsClientUser(true);

    //   getPrefilledCaloriesInformation(clientCode);
    // } else {
    //   getCalorieDropdownDataRequestCall();
    // }
    getCalorieDropdownDataRequestCall();
    getProfileInformation();
  };

  const getPrefilledCaloriesInformation = clientCode => {
    let payload = {
      client_id: clientCode,
    };
    dispatch(clientInfoRequest(payload, onSSClient, onFFClient));
  };

  const onSSClient = async resolve => {
    const {
      calories_macro,
      carbs_percentage,
      fat_percentage,
      protein_percentage,
    } = resolve.data;
    setSuggestedCalories(calories_macro);
    setFat(fat_percentage);
    setProtien(protein_percentage);
    setCarbs(carbs_percentage);
    setLoader(true);
  };
  const onFFClient = async reject => {};

  const getCalorieDropdownDataRequestCall = () => {
    let payload = {
      uid: userId,
    };
    dispatch(getCalorieDropdownDataRequest(payload, onS, onF));
  };
  const onS = resolve => {
    if (resolve.data) {
      const {goal_type, macro, suggested_calories} = resolve.data;
      setGoalTypeArray(goal_type);
      setMarcoArray(macro);
      setSuggestedCalories(suggested_calories);
    }
  };
  const onF = reject => {};

  const getProfileInformation = () => {
    dispatch(userProfileInfoRequest(userId, onSuccess, onFail));
  };
  const onSuccess = resolve => {
    const {
      carbo_percentage,
      fat_percentage,
      protein_percentage,
      goal_type,
      calories_macro,
    } = resolve.data;
    console.log('resolve.data=>', resolve.data);
    setTimeout(() => {
      if (
        !Utility.getInstance().isEmpty(carbo_percentage) &&
        !Utility.getInstance().isEmpty(fat_percentage) &&
        !Utility.getInstance().isEmpty(protein_percentage)
      ) {
        setCarbs(carbo_percentage);
        setFat(fat_percentage);
        setProtien(protein_percentage);
      }
    }, 100);
    if (!Utility.getInstance().isEmpty(goal_type)) {
      setGoalType(goal_type);
      if (goal_type?.name == 'Custom') {
        setcustomCalories(calories_macro);
      }
      setGoalTypeId(goal_type.id);
    }
  };
  const onFail = reject => {};
  const validateFields = () => {
    var message = '';
    if (goalType == 'Select' && !isLoggedIn) {
      message = warning.please_select_anyGoal;
    } else if (goalType.name == 'Custom' && customCalories == 0) {
      message = warning.please_select_custom_calories;
    } else if (Utility.getInstance().isEmpty(carbs)) {
      message = warning.please_select_carbs;
    } else if (Utility.getInstance().isEmpty(fat)) {
      message = warning.please_select_fat;
    } else if (Utility.getInstance().isEmpty(protien)) {
      message = warning.please_select_protien;
    }

    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const onNextPress = () => {
    if (validateFields()) {
      if (goalType.name == 'Custom') {
        if (customCalories < 300) {
          Utility.getInstance().inflateToast(warning.mincalories);
          setcustomCalories('');
        } else if (customCalories > 3500) {
          Utility.getInstance().inflateToast(warning.maxcalories);
          setcustomCalories('');
        } else {
          saveGoals();
        }
      } else {
        saveGoals();
      }
    }
  };
  const saveGoals = () => {
    let payload = {
      goal_type: goalType_id,
      calories:
        goalType.name == 'Custom'
          ? parseInt(customCalories)
          : suggestedCalories,
      carbo: carbs.toString(),
      fat: fat.toString(),
      protein: protien.toString(),
      uid: userId,
    };

    setShowLoader(true);
    dispatch(uploadUserCalorieDataRequest(payload, onSS, onFF));
  };

  const onSS = resolve => {
    console.log('saving golas succrss=>', resolve.data);
    setShowLoader(true);
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }, 100);
  };
  const onFF = reject => {
    setShowLoader(true);
    Utility.getInstance().inflateToast(reject);
  };
  const getCalorieChangeValue = type => {
    let payload = {
      uid: userId,
      goal_type: type,
    };
    dispatch(changeCalorieCounterRequest(payload, onSSS, onFFF));
  };
  const onSSS = resolve => {
    setSuggestedCalories(resolve.data.calories);
  };
  const onFFF = reject => {
    Utility.getInstance().inflateToast(reject);
  };
  const checkCarbsEntryOutOfRange = item => {
    let total = parseInt(fat) + parseInt(item) + parseInt(protien);
    if (total > strings.hundred_int || total < strings.hundred_int) {
      setWillInflate(true);
    }
  };
  const checkFatEntryOutOfRange = item => {
    let total = parseInt(item) + parseInt(carbs) + parseInt(protien);
    if (total > strings.hundred_int || total < strings.hundred_int) {
      setWillInflate(true);
    }
  };
  const checkProteinEntryOutOfRange = item => {
    let total = parseInt(fat) + parseInt(carbs) + parseInt(item);
    if (total > strings.hundred_int || total < strings.hundred_int) {
      setWillInflate(true);
    }
  };
  const checkTotalPercent = () => {
    let total = parseInt(fat) + parseInt(carbs) + parseInt(protien);
    if (total > strings.hundred_int || total < strings.hundred_int) {
      setWillInflate(true);
    } else {
      onNextPress();
    }
  };
  const backPress = () => {
    navigation.goBack();
  };
  const onCustomCalriesChange = value => {
    setcustomCalories(value);
  };

  const onTouchOutside = () => {
    setWillInflate(false);
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
            height: 20,
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => setWillInflate(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 20,
              marginTop: 0,
            }}>
            {`Custom Macro
 Entry Out of Range!`}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              marginTop: 20,
              color: colors.black,
              lineHeight: 25,
            }}>
            {strings.macro_out_of_range_desc}
          </Text>

          <TouchableOpacity
            onPress={() => [
              // navigation.navigate('Chat', 0),
              setWillInflate(false),
            ]}
            style={[
              globalStyles.button_primary,
              globalStyles.center,
              globalStyles.mt_40,
            ]}>
            <Text
              style={[globalStyles.btn_heading, globalStyles.green_heading]}>
              {strings.editrange}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const DefaultView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Loader isLoading={isLoading || showLoader} />
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
          {Modal()}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading, styles.font30]}>
                {strings.calories}
              </Text>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.white,
                ]}>
                {strings.caloriesdesc}
              </Text>
              <View
                style={[
                  globalStyles.center,
                  globalStyles.mt_30,
                  globalStyles.padding_30_hor,
                ]}>
                {!isLoggedIn && (
                  <View>
                    <Text style={[globalStyles.input_heading]}>
                      {strings.goaltype}
                    </Text>
                    <SelectDropdown
                      data={goalTypeArray}
                      onSelect={(selectedItem, index) => {
                        console.log('selectedItem.name==', selectedItem.name);
                        setGoalType(selectedItem);
                        setGoalTypeId(selectedItem.id);
                        getCalorieChangeValue(selectedItem.id);
                      }}
                      defaultButtonText={goalType.name}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.name;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item.name;
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
                      buttonStyle={styles.dropdownSmall4BtnStyle}
                      buttonTextStyle={styles.dropdown4BtnTxtStyle}
                      dropdownIconPosition={'right'}
                      dropdownStyle={styles.dropdown4DropdownStyle}
                      rowStyle={styles.dropdown4RowStyle}
                      rowTextStyle={styles.dropdown4RowTxtStyle}
                    />
                  </View>
                )}
                {goalType.name == 'Custom' ? (
                  <View
                    style={{
                      marginTop: 20,
                    }}>
                    <View
                      style={{
                        height: 45,
                        backgroundColor: 'white',
                        width: Utility.getInstance().dW(252),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}>
                      <TextInput
                        editable={isLoggedIn ? false : true}
                        keyboardType="numeric"
                        value={customCalories}
                        onChangeText={v => onCustomCalriesChange(v)}
                        style={{
                          height: 45,
                          backgroundColor: 'white',
                          width: 100,
                          marginHorizontal: 10,
                          fontSize: 16,
                          color: colors.green,
                        }}></TextInput>
                      <Text
                        style={{fontFamily: 'Poppins-Regular', fontSize: 16}}>
                        Calories
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 13,
                        color: colors.green,
                        alignSelf: 'center',
                        marginTop: 5,
                      }}>
                      (Min 300 Calories & Max 3500 Calories)
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.input_heading,
                        globalStyles.mt_30,
                        globalStyles.font20,
                      ]}>
                      {strings.suggcalor}
                    </Text>
                    <Text style={[styles.goalvalwhite, globalStyles.font20]}>
                      {suggestedCalories}
                    </Text>
                  </>
                )}
                <View style={styles.seperator}></View>
                <Text
                  style={[
                    styles.forgot_pass_heading,
                    styles.whydesc,
                    globalStyles.textAlignCenter,
                    globalStyles.font17,
                  ]}>
                  {strings.prefusion}
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,
                      globalStyles.textAlignCenter,
                      globalStyles.font17,
                      globalStyles.green_heading,
                    ]}>
                    {strings.Recommended}
                  </Text>
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,
                      globalStyles.textAlignCenter,
                      globalStyles.font14,
                    ]}>
                    {strings.Starting}
                  </Text>
                </Text>
                <View style={styles.carb}>
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,
                      styles.red,
                      {fontSize: Utility.getInstance().dH(12)},
                    ]}>
                    {`Carbohydrates`}
                  </Text>
                  {isLoggedIn ? (
                    <Text
                      style={[
                        styles.forgot_pass_heading,
                        styles.whydesc,
                        globalStyles.textAlignCenter,
                        globalStyles.font17,
                      ]}>
                      {carbs + `% of calories`}
                    </Text>
                  ) : (
                    <View style={{width: 160}}>
                      <SelectDropdown
                        data={macroArray}
                        onSelect={(selectedItem, index) => {
                          setCarbs(selectedItem);
                          checkCarbsEntryOutOfRange(selectedItem);
                        }}
                        defaultButtonText={carbs + '% of Calories'}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem + '% of Calories';
                        }}
                        rowTextForSelection={(item, index) => {
                          return item + '% of Calories';
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          if (index == 6) {
                            return (
                              <View
                                style={[
                                  styles.dropdown4RowStyle,
                                  {
                                    backgroundColor: 'green',
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  },
                                ]}>
                                <Text style={styles.dropdown4RowTxtStyle}>
                                  {item}
                                </Text>
                              </View>
                            );
                          } else {
                            return (
                              <Text style={styles.dropdown4RowTxtStyle}>
                                {item}
                              </Text>
                            );
                          }
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
                        // {
                        //   backgroundColor:
                        //     carbs == '35' ? colors.green : colors.white,
                        // },
                        buttonStyle={
                          !isLoggedIn && carbs == '35'
                            ? styles.dropdownSmall4BtnStyleGreen
                            : styles.dropdownSmall4BtnStyle
                        }
                        buttonTextStyle={styles.dropdown4BtnTxtStyle}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown4DropdownStyle}
                        rowStyle={styles.dropdown4RowStyle}
                        rowTextStyle={styles.dropdown4RowTxtStyle}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.carb}>
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,

                      styles.orange,
                      {fontSize: Utility.getInstance().dH(12)},
                    ]}>
                    Fat
                  </Text>
                  {isLoggedIn ? (
                    <Text
                      style={[
                        styles.forgot_pass_heading,
                        styles.whydesc,
                        globalStyles.textAlignCenter,
                        globalStyles.font17,
                      ]}>
                      {fat + `% of calories`}
                    </Text>
                  ) : (
                    <View style={{width: 160}}>
                      <SelectDropdown
                        data={macroArray}
                        onSelect={(selectedItem, index) => {
                          setFat(selectedItem);
                          checkFatEntryOutOfRange(selectedItem);
                        }}
                        defaultButtonText={fat + '% of Calories'}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem + '% of Calories';
                        }}
                        rowTextForSelection={(item, index) => {
                          return item + '% of Calories';
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          if (index == 5) {
                            return (
                              <View
                                style={[
                                  styles.dropdown4RowStyle,
                                  {
                                    backgroundColor: 'green',
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  },
                                ]}>
                                <Text style={styles.dropdown4RowTxtStyle}>
                                  {item}
                                </Text>
                              </View>
                            );
                          } else {
                            return (
                              <Text style={styles.dropdown4RowTxtStyle}>
                                {item}
                              </Text>
                            );
                          }
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
                        buttonStyle={
                          !isLoggedIn && fat == '30'
                            ? styles.dropdownSmall4BtnStyleGreen
                            : styles.dropdownSmall4BtnStyle
                        }
                        // buttonStyle={[
                        //   styles.dropdownSmall4BtnStyle,
                        //   {
                        //     backgroundColor:
                        //       fat == '30' ? colors.green : colors.white,
                        //   },
                        // ]}
                        buttonTextStyle={styles.dropdown4BtnTxtStyle}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown4DropdownStyle}
                        rowStyle={styles.dropdown4RowStyle}
                        rowTextStyle={styles.dropdown4RowTxtStyle}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.carb}>
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,
                      styles.green,
                      {fontSize: Utility.getInstance().dH(12)},
                    ]}>
                    Protein
                  </Text>
                  {isLoggedIn ? (
                    <Text
                      style={[
                        styles.forgot_pass_heading,
                        styles.whydesc,
                        globalStyles.textAlignCenter,
                        globalStyles.font17,
                      ]}>
                      {protien + `% of calories`}
                    </Text>
                  ) : (
                    <View style={{width: 160}}>
                      <SelectDropdown
                        data={macroArray}
                        onSelect={(selectedItem, index) => {
                          setProtien(selectedItem);
                          checkProteinEntryOutOfRange(selectedItem);
                        }}
                        defaultButtonText={protien + '% of Calories'}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem + '% of Calories';
                        }}
                        rowTextForSelection={(item, index) => {
                          return item + '% of Calories';
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          if (index == 6) {
                            return (
                              <View
                                style={[
                                  styles.dropdown4RowStyle,
                                  {
                                    backgroundColor: 'green',
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  },
                                ]}>
                                <Text style={styles.dropdown4RowTxtStyle}>
                                  {item}
                                </Text>
                              </View>
                            );
                          } else {
                            return (
                              <Text style={styles.dropdown4RowTxtStyle}>
                                {item}
                              </Text>
                            );
                          }
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
                        // buttonStyle={[
                        //   styles.dropdownSmall4BtnStyle,
                        //   {
                        //     backgroundColor:
                        //       protien == '35' ? colors.green : colors.white,
                        //   },
                        // ]}
                        buttonStyle={
                          !isLoggedIn && protien == '35'
                            ? styles.dropdownSmall4BtnStyleGreen
                            : styles.dropdownSmall4BtnStyle
                        }
                        buttonTextStyle={styles.dropdown4BtnTxtStyle}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown4DropdownStyle}
                        rowStyle={styles.dropdown4RowStyle}
                        rowTextStyle={styles.dropdown4RowTxtStyle}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.carb}>
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,
                      styles.blue,
                      {fontSize: Utility.getInstance().dH(12)},
                    ]}>
                    Water
                  </Text>
                  <Text
                    style={[
                      styles.forgot_pass_heading,
                      styles.whydesc,
                      globalStyles.textAlignCenter,

                      styles.blue,
                    ]}>
                    {strings.bdyweight}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={checkTotalPercent}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_30,
                  {marginBottom: 30},
                ]}>
                <Text style={globalStyles.btn_heading_black}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  return DefaultView();
};
export default Calories;
