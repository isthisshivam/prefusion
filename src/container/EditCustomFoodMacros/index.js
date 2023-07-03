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

import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import warning from '../../constants/warning';
import Utility from '../../utility/Utility';
import {
  getFoodProfileRequest,
  updateFoodProfileRequest,
} from '../../redux/action/FoodListAction';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
var userId = null;
var generateImageObj = '';

const EditCustomFoodMacros = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.addCustomFoodReducer.showLoader,
  );

  const [foodName, setFoodName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [majorValue, setMajorValue] = useState('');
  const [fat, setFat] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  const [grams, setGrams] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const [isPieceOrGrams, setPOrG] = useState(null);
  const [foodImage, setFoodImage] = useState(null);
  const [tempFoodId, setTempFoodId] = useState('');

  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    navigation.addListener('focus', () => {
      getFoodInformation();
    });
    return () => {};
  }, []);
  const getFoodInformation = async () => {
    dispatch(getFoodProfileRequest(props.route.params.foodId, onSS, onFF));
  };

  const onSS = resolve => {
    console.log('getFoodProfileRequest.resolve', resolve);
    const {
      name,
      description,
      calories,
      unit,
      measurement,
      nf_protein,
      nf_total_carbohydrate,
      nf_total_fat,
      image,
      food_id,
    } = resolve?.data;
    setFoodName(name);
    Utility.getInstance().isEmpty(image)
      ? setFoodImage(null)
      : setFoodImage(image);
    setCarbs(nf_total_carbohydrate);
    setFat(nf_total_fat);
    setProtein(nf_protein);
    setTempFoodId(food_id);
    setCalories(calories);
    if (!Utility.getInstance().isEmpty(nf_total_carbohydrate)) {
      setMajorValue(nf_total_carbohydrate);
    } else if (!Utility.getInstance().isEmpty(nf_total_fat)) {
      setMajorValue(nf_total_fat);
    } else if (!Utility.getInstance().isEmpty(nf_protein)) {
      setMajorValue(nf_protein);
    }
  };

  const onFF = reject => {
    Utility.getInstance().inflateToast(reject);
  };

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

  const getTotalCaloriesFromServings = (fat, protein, carbs) => {
    return parseInt(protein * 4) + parseInt(fat * 9) + parseInt(carbs * 4);
  };
  const onUpdatePress = () => {
    if (isFormValid()) {
      let payload = {
        created_by: userId,
        name: foodName,
        calories: getTotalCaloriesFromServings(fat, protein, carbs),
        carbs: carbs ? carbs : 0,
        fat: fat ? fat : 0,
        id: props?.route?.params?.foodId,
        protein: protein ? protein : 0,

        quantity: 1,
        unit: 'Piece',
        food_id: tempFoodId,
      };

      dispatch(updateFoodProfileRequest(payload, onS, onF));
    }
  };

  const onS = resolve => {
    if (foodImage) {
      uploadUserImage(generateImageObj);
    } else {
      if (resolve) {
        Utility.getInstance().inflateToast(strings.foodadded);
        clearStates();
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
    formdata.append('id', props?.route?.params?.foodId);
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
      Utility.getInstance().inflateToast(strings.foodupdated);
      clearStates();
    }
  };
  const clearStates = () => {
    setFoodName('');
    setCarbs('');
    setFat('');

    setProtein('');

    setGrams('');
    setQuantity('');
    setUnit('');

    setPOrG(null);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
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
          contentContainerStyle={{paddingVertical: 15}}
          enableOnAndroid
          keyboardShouldPersistTaps="always"
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
            <Text
              onPress={onLabelPress}
              style={[
                styles.guideT,
                styles.green,
                globalStyles.padding_20_hor,
                globalStyles.font17,
                {marginTop: 40, textAlign: 'center', lineHeight: 25},
              ]}>
              {strings.lableChages}
            </Text>

            {foodImage && (
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
            )}
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

            <TextInput
              value={foodName}
              onChangeText={v => setFoodName(v)}
              placeholder="Name this food..."
              placeholderTextColor={colors.black}
              style={styles.input}
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
            <TouchableOpacity
              onPress={onUpdatePress}
              style={[
                globalStyles.button_secondary,
                globalStyles.center,
                globalStyles.button,
                globalStyles.mt_30,
              ]}>
              {isLoading ? (
                <Indicator isLoading={isLoading} />
              ) : (
                <Text style={globalStyles.btn_heading_black}>UPDATE</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  return DefautView();
};
export default EditCustomFoodMacros;
