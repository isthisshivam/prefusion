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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import images from '../../assets/images/index';
import ApiConstant from '../../constants/api';
import styles from '../CustomFood/style';
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
var userId = null;
var generateImageObj = '';
var FOOD_ID_ = null;
const CustomFood = props => {
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
  const [description, setDescription] = useState('');
  const [isPieceOrGrams, setPOrG] = useState(null);
  const [foodImage, setFoodImage] = useState(null);

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
        calories: getTotalCaloriesFromServings(fat, protein, carbs),
        carbs: carbs ? carbs : 0,
        fat: fat ? fat : 0,
        protein: protein ? protein : 0,
        base_qty: 1,
        quantity: 1,
        unit: 'Piece',
        food_id: Date.now() + `/app`,
        base_food_details: JSON.stringify({
          base_calories: getTotalCaloriesFromServings(fat, protein, carbs),
          base_carbs: parseFloat(carbs),
          base_fat: parseFloat(fat),
          base_protein: parseFloat(protein),
        }),
      };
      dispatch(addCustomFoodRequest(payload, onS, onF));
    }
  };

  const getTotalCaloriesFromServings = (fat, protein, carbs) => {
    return parseInt(protein * 4) + parseInt(fat * 9) + parseInt(carbs * 4);
  };

  const onS = resolve => {
    global.backRoute = 'AddMeal';
    FOOD_ID_ = resolve.data.id;
    if (foodImage) {
      uploadUserImage(generateImageObj);
    } else {
      if (resolve) {
        Utility.getInstance().inflateToast(strings.foodadded);
        clearStates(FOOD_ID_);
      }
    }
  };
  const onF = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const isFormValid = () => {
    var message = '';

    if (Utility.getInstance().isEmpty(foodName)) {
      message = warning.please_e_foodname;
    } else if (Utility.getInstance().isEmpty(majorValue)) {
      message = warning.atleast_one_requried;
    }

    if (message == '') {
      return true;
    }
    Utility.getInstance().inflateToast(message);
    return false;
  };
  const chooseCameraPress = () => {
    refRBSheet.current.open();
  };
  const pickORCapture = TYPE => {
    refRBSheet.current.open();
    if (TYPE == 'CAMERA') {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
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
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
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
    setFoodImage(localUri);
    generateImageObj = File;
  };

  const uploadUserImage = async imageFile => {
    var formdata = new FormData();
    formdata.append('id', FOOD_ID_);
    formdata.append('image', imageFile);
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };
    await fetch(ApiConstant.BASE_URL + ApiConstant.FOOD_IMAGE, requestOptions)
      .then(response => response.text())
      .then(result => onSUploadImage(JSON.parse(result)))
      .catch(error => onFUploadImage(error));
  };

  const onSUploadImage = resolve => {
    console.log('onSUploadImage', JSON.stringify(resolve));
    if (resolve) {
      Utility.getInstance().inflateToast(strings.foodadded);
      clearStates(FOOD_ID_);
    }
  };
  const clearStates = f_id => {
    setFoodName('');
    setCarbs('');
    setFat('');

    setProtein('');

    setGrams('');
    setQuantity('');
    setUnit('');

    setPOrG(null);
    let foodId = f_id;
    setTimeout(() => {
      navigation.navigate('MealView', {
        foodId,
        qty: 1,
      });
    }, 1000);
  };
  const onFUploadImage = reject => {};
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
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingVertical: 15}}
          enableOnAndroid
          extraHeight={120}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.customfood}
            </Text>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignStart,
                globalStyles.white,
              ]}>
              {strings.customfoodDesc}
            </Text>
            {/* <Text
              onPress={onLabelPress}
              style={[
                styles.guideT,
                styles.green,
                globalStyles.padding_20_hor,
                globalStyles.font17,
                {marginTop: 40, textAlign: 'center', lineHeight: 25},
              ]}>
              {strings.lableChages}
            </Text> */}
            {/* {foodImage ? (
              <ImageBackground
                style={{
                  height: 200,
                  width: '100%',
                  flex: 1,
                  resizeMode: 'cover',
                  margin: 20,
                }}
                borderRadius={10}
                source={{uri: foodImage}}></ImageBackground>
            ) : (
              <TouchableOpacity
                onPress={() => chooseCameraPress()}
                style={{
                  height: 80,
                  width: 80,
                  backgroundColor: 'white',
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 10,
                }}>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    resizeMode: 'contain',
                    marginTop: -6,
                  }}
                  source={images.APP.CAMERAGREEN}></Image>
              </TouchableOpacity>
            )} */}

            <TextInput
              value={foodName}
              onChangeText={v => setFoodName(v)}
              placeholder="Name this food..."
              placeholderTextColor={colors.black}
              style={[styles.input, globalStyles.mt_30]}
            />
          </View>
          <Text style={styles.requireText}>*at least one required</Text>

          <View style={styles.profileclist}>
            <Text
              style={[
                styles.whydesc,
                styles.white,
                globalStyles.mt_0,
                globalStyles.font17,
              ]}>
              {strings.carb}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                value={carbs}
                onChangeText={v => [setMajorValue(v), setCarbs(v)]}
                placeholderTextColor={colors.offwhite}
                placeholder={`Enter amount`}
                keyboardType="numeric"
                style={[styles.input1]}></TextInput>
            </View>
          </View>
          <View style={styles.profileclist}>
            <Text
              style={[
                styles.whydesc,
                styles.white,
                globalStyles.mt_0,
                globalStyles.font17,
              ]}>
              {strings.fat}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                value={fat}
                onChangeText={v => [setMajorValue(v), setFat(v)]}
                placeholderTextColor={colors.offwhite}
                placeholder={`Enter amount`}
                keyboardType="numeric"
                style={[styles.input1]}></TextInput>
            </View>
          </View>
          <View style={styles.profileclist}>
            <Text
              style={[
                styles.whydesc,
                styles.white,
                globalStyles.mt_0,
                globalStyles.font17,
              ]}>
              {strings.protineg}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                value={protein}
                onChangeText={v => [setMajorValue(v), setProtein(v)]}
                placeholderTextColor={colors.offwhite}
                placeholder={`Enter amount`}
                keyboardType="numeric"
                style={[styles.input1]}></TextInput>
            </View>
          </View>

          <View style={globalStyles.padding_20_hor}></View>

          <View style={{alignItems: 'center', marginTop: 20, marginBottom: 30}}>
            <Text
              onPress={() => navigation.navigate('HandGuide')}
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,

                globalStyles.white,
              ]}>
              {'Use The Hand Guide'}
            </Text>
            <Text
              onPress={onLabelPress}
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,

                globalStyles.green_heading,
              ]}>
              {'How to Read a Food Label'}
            </Text>
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
export default CustomFood;
