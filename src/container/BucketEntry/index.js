import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import images from '../../assets/images/index';
import ApiConstant from '../../constants/api';
import styles from '../BucketEntry/style';
import Indicator from '../../component/buttonIndicator';
import Header from '../../component/headerWithBackControl';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import warning from '../../constants/warning';
import Utility from '../../utility/Utility';
import {addCustomFoodRequest} from '../../redux/action/CustomFoodAction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dummyContent from '../../constants/dummyContent';
import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
import Buckets from '../../component/buckets';
var userId = null;
var generateImageObj = '';
var FOOD_ID_ = null;

const BucketEntry = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.addCustomFoodReducer.showLoader,
  );
  const foodIdData = useSelector(state => state.food.addFoodIdReducer.data);
  const [foodName, setFoodName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [majorValue, setMajorValue] = useState('');
  const [fat, setFat] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fiber, setFiber] = useState('');
  const [grams, setGrams] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [isPieceOrGrams, setPOrG] = useState(null);
  const [foodImage, setFoodImage] = useState(null);
  const [isUpdating, setUpdating] = useState(false);
  const [carbsBucketArray, setCarbsBucketArray] = useState(
    new Array(
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
    ),
  );
  const [fatBucketArray, setFatBucketArray] = useState(
    new Array(
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
    ),
  );
  const [proteinBucketArray, setProteinBucketArray] = useState(
    new Array(
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
      {
        isSelected: false,
        percent: 0,
      },
    ),
  );
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    return () => {};
  }, []);
  const backPress = () => {
    navigation.goBack();
  };
  const onLabelPress = () => {
    setCarbs('');
    setFat('');
    setMajorValue('');
    setProtein('');
    navigation.navigate('ReadFoodLabel');
  };
  const onContinuePress = () => {
    if (isFormValid()) {
      let payload = {
        created_by: userId,
        name: foodName,
        calories: getTotalCaloriesFromServings(
          getGrams(fatBucketArray, 'F'),
          getGrams(proteinBucketArray, 'P'),
          getGrams(carbsBucketArray, 'C'),
        ),
        carbs: getGrams(carbsBucketArray, 'C'),
        fat: getGrams(fatBucketArray, 'F'),
        protein: getGrams(proteinBucketArray, 'P'),
        base_qty: 1,
        quantity: 1,
        unit: 'Piece',
        food_id: Date.now() + `/app`,
        base_food_details: JSON.stringify({
          base_calories: getTotalCaloriesFromServings(
            getGrams(fatBucketArray, 'F'),
            getGrams(proteinBucketArray, 'P'),
            getGrams(carbsBucketArray, 'C'),
          ),
          base_carbs: parseFloat(getGrams(carbsBucketArray)),
          base_fat: parseFloat(getGrams(fatBucketArray)),
          base_protein: parseFloat(getGrams(proteinBucketArray)),
        }),
      };
      console.log('payload==', payload);
      dispatch(addCustomFoodRequest(payload, onS, onF));
    }
  };

  const getTotalCaloriesFromServings = (fat, protein, carbs) => {
    return parseInt(protein * 4) + parseInt(fat * 9) + parseInt(carbs * 4);
  };

  const onS = resolve => {
    global.backRoute = 'AddMeal';
    FOOD_ID_ = resolve.data.id;
    Utility.getInstance().inflateToast(strings.foodadded);
    let foodId = FOOD_ID_;
    setTimeout(() => {
      navigation.navigate('MealView', {
        foodId,
        qty: 1,
      });
    }, 1000);
    // if (foodImage) {
    //   uploadUserImage(generateImageObj);
    // } else {
    //   if (resolve) {
    //     Utility.getInstance().inflateToast(strings.foodadded);
    //     clearStates(FOOD_ID_);
    //   }
    // }
  };
  const onF = reject => {
    //Utility.getInstance().inflateToast(reject);
  };

  const isFormValid = () => {
    var message = '';

    //console.log('grams in value==', getGrams(carbsBucketArray));
    // return;
    if (Utility.getInstance().isEmpty(foodName)) {
      message = warning.please_e_foodname;
    } else if (
      !check(carbsBucketArray) &&
      !check(fatBucketArray) &&
      !check(proteinBucketArray)
    ) {
      message = warning.atleast_one_requried;
    }

    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const getGrams = (array, T) => {
    let grams = 0;
    array.forEach(e => {
      if (e.isSelected) {
        if (e.percent === 50) {
          if (T == 'F') {
            grams += 5;
          } else {
            grams += 10;
          }
        } else if (e.percent === 100) {
          if (T == 'F') {
            grams += 10;
          } else {
            grams += 20;
          }
        }
      }
    });
    return grams;
  };
  const check = array => {
    let has = false;
    array.forEach(e => {
      if (e.isSelected) {
        has = true;
      }
    });
    return has;
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <ImagePickerBottomSheet
          openCamera={() => pickORCapture('CAMERA')}
          openFiles={() => pickORCapture('GALLERY')}
          reference={refRBSheet}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{paddingVertical: 15}}
          enableOnAndroid
          extraHeight={120}>
          <View style={[globalStyles.center, globalStyles.padding_20_hor]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.bucketen}
            </Text>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignStart,
                globalStyles.white,
              ]}>
              {strings.data}
            </Text>
            <Text
              onPress={onLabelPress}
              style={[
                styles.guideT,
                styles.green,
                globalStyles.padding_20_hor,
                globalStyles.font17,
                {marginTop: 40, textAlign: 'center', lineHeight: 25},
              ]}>
              {strings.label}
            </Text>

            <TextInput
              value={foodName}
              onChangeText={v => setFoodName(v)}
              placeholder="Name this food..."
              placeholderTextColor={colors.black}
              style={[styles.input, globalStyles.mt_20]}
            />
          </View>
          <Text style={styles.requireText}>
            Tap a bucket to add food information
          </Text>
          <Buckets
            heading={`Carbs :
20g`}
            type={'CARBS'}
            headingColor={styles.redC}
            onSetBucketArray={setCarbsBucketArray}
            data={carbsBucketArray}
          />
          <Buckets
            heading={`Fat :
10g`}
            type={'FAT'}
            headingColor={styles.orange}
            onSetBucketArray={setFatBucketArray}
            data={fatBucketArray}
          />
          <Buckets
            heading={`Protein :
20g`}
            type={'PROTEIN'}
            headingColor={styles.green}
            onSetBucketArray={setProteinBucketArray}
            data={proteinBucketArray}
          />
          <Text
            onPress={() => navigation.navigate('HandGuide')}
            style={{
              marginTop: 40,
              color: colors.white,
              alignSelf: 'center',
              fontSize: 13,
              // textDecorationLine: 'underline',
              fontFamily: 'Poppins-Regular',
            }}>
            Hand Guide Entry
          </Text>

          <View style={{alignItems: 'center', marginTop: 20, marginBottom: 30}}>
            <TouchableOpacity
              onPress={onContinuePress}
              style={[
                globalStyles.button_secondary,
                globalStyles.center,
                globalStyles.button,
                globalStyles.mt_30,
              ]}>
              {isLoading ? (
                <Indicator isLoading={isLoading} />
              ) : (
                <Text style={globalStyles.btn_heading_black}>ADD TO MEAL</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  return DefautView();
};
export default BucketEntry;
