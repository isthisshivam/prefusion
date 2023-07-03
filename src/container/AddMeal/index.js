import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../AddMeal/style';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import dummyContent from '../../constants/dummyContent';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import Header from '../../component/headerWithBackControl';
import RadioForm from 'react-native-simple-radio-button';

var loggedInUserData = [
  {label: 'Favorite Meals', value: 0},
  {label: 'Custom Meal', value: 1},
  {label: 'Take a photo of My Food', value: 2},
];

Global = null;
const AddMeal = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState(0);
  const [haveClientCode, setHaveClientCode] = useState(false);

  const [mealName, setMealName] = useState('');
  const [customMealName, setCustomMealName] = useState('');

  useEffect(() => {
    getProfileInformation();
  }, []);

  const getProfileInformation = async () => {
    let data = await Utility.getInstance().getStoreData(strings.clientId);
    let c_c = data ? JSON.parse(data) : null;
    if (c_c) {
      setHaveClientCode(true);
    }
  };
  const backPress = () => {
    navigation.goBack();
  };
  const onNextPress = () => {
    global.backRoute = 'AddMeal';
    switch (value) {
      case 0:
        validateFoodName(2);
        break;
      case 1:
        validateFoodName(1);
        break;
      case 2:
        navigation.navigate('Chat', 1);
        break;
      default:
    }
  };

  const validateFoodName = type => {
    if (Utility.getInstance().isEmpty(mealName)) {
      Utility.getInstance().inflateToast('Please Select Meal Name');
    } else if (
      mealName == 'Custom' &&
      Utility.getInstance().isEmpty(customMealName)
    ) {
      Utility.getInstance().inflateToast('Please enter Meal Name');
    } else {
      if (mealName == 'Custom') Global = customMealName;
      else Global = mealName;

      type == 1
        ? navigation.navigate('AddFoods', {foodId: [], qty: []})
        : navigation.navigate('AddFavoriteMeal');
    }
  };
  const BottomTabMenu = () => {
    return (
      <View style={globalStyles.bottom_tab_c}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyGoal')}
          style={globalStyles.bottom_tab_item_c}>
          <Image
            source={images.APP.GOAL}
            style={[
              globalStyles.bottom_tab_item_img,
              {tintColor: colors.white},
            ]}
          />
          <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
            Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('AddMeal')}
          style={globalStyles.bottom_tab_item_c}>
          <Text
            style={[
              globalStyles.bottom_tab_text,
              {marginTop: -10, color: colors.secondary},
            ]}>
            Add Meal
          </Text>
          <View style={globalStyles.bottom_tab_addmeal_c}>
            <Image
              source={images.SIGNUP.PLUS}
              style={[
                globalStyles.bottom_tab_item_img_plus,
                {tintColor: colors.secondary},
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ProgressReport')}
          style={globalStyles.bottom_tab_item_c}>
          <Image
            source={images.APP.PROGRESS}
            style={[
              globalStyles.bottom_tab_item_img,
              {tintColor: colors.white},
            ]}
          />
          <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
            Progress
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const DefaultView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <View style={[styles.flex_2]}>
            <Header onBackPress={() => backPress()} />
          </View>
          <View style={styles.flex_8}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              extraHeight={150}
              keyboardShouldPersistTaps="always"
              style={[styles.flex, {backgroundColor: colors.primary}]}>
              <View style={[globalStyles.center, globalStyles.padding_40]}>
                <Text style={[styles.why_heading, styles.font30]}>
                  {strings.newmeal}
                </Text>
                <Text
                  style={[
                    styles.forgot_pass_heading,
                    styles.whydesc,
                    globalStyles.textAlignCenter,
                  ]}>
                  {strings.entermeal}
                </Text>
                <Text
                  style={[
                    styles.why_heading,
                    styles.font30,
                    globalStyles.mt30Per,
                  ]}>
                  {strings.selectmeal}
                </Text>
                <View style={styles.radio}>
                  <RadioForm
                    labelStyle={{fontSize: 15, color: colors.white}}
                    labelWrapStyle={{
                      margin: 20,
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                    }}
                    buttonColor={colors.secondary}
                    selectedButtonColor={colors.secondary}
                    buttonStyle={{
                      height: 20,
                      width: 20,
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                    }}
                    labelColor={colors.white}
                    radio_props={loggedInUserData}
                    style={{
                      //height: haveClientCode ? 120 : 80,
                      height: 120,
                      justifyContent: 'space-between',
                    }}
                    initial={0}
                    onPress={value => {
                      setValue(value);
                    }}
                  />
                </View>
                {value == strings.one || value == strings.zero ? (
                  <View
                    style={[
                      globalStyles.mt_30,
                      globalStyles.width_100_percent,
                    ]}>
                    <Text
                      style={[
                        globalStyles.input_heading,
                        {color: colors.gray},
                      ]}>
                      {strings.nameMeal}
                    </Text>

                    <SelectDropdown
                      data={dummyContent.food}
                      onSelect={(selectedItem, index) => {
                        console.log(selectedItem);
                        setMealName(selectedItem);
                      }}
                      defaultButtonText={mealName}
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
                      buttonStyle={styles.dropdownSmall4BtnStyle}
                      buttonTextStyle={styles.dropdown4BtnTxtStyle}
                      dropdownIconPosition={'right'}
                      dropdownStyle={styles.dropdown4DropdownStyle}
                      rowStyle={styles.dropdown4RowStyle}
                      rowTextStyle={styles.dropdown4RowTxtStyle}
                    />
                    {mealName == 'Custom' && (
                      <TextInput
                        value={customMealName}
                        placeholder="Enter Meal Name"
                        placeholderTextColor={'gray'}
                        onChangeText={text => setCustomMealName(text)}
                        style={styles.input}
                      />
                    )}
                  </View>
                ) : (
                  <></>
                )}
                <TouchableOpacity
                  onPress={onNextPress}
                  style={[
                    globalStyles.button_secondary,
                    globalStyles.center,
                    globalStyles.button,
                    globalStyles.mt_40,
                  ]}>
                  <Text style={globalStyles.btn_heading_black}>CONTINUE</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
        {BottomTabMenu()}
      </>
    );
  };

  return DefaultView();
};
export default AddMeal;
