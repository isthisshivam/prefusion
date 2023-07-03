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
  Modal,
  Dimensions,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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
import QRCodeScanner from 'react-native-qrcode-scanner';
const NewMeal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );
  const [isBarCodeScannerVisible, setBarcodeVisible] = useState(false);

  const barcodeReceived = async e => {
    setTimeout(() => {
      setMeasurments('');
      setBarcodeVisible(false);
      setTimeout(() => {
        //  fetchFoodDetailsThroughBarcode(e.data);
      }, 700);
    }, 1000);
  };
  const controls = () => {
    return (
      <>
        <View style={styles.sapce}>
          <View style={styles.center}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomFoodMethod')}
              style={styles.minuscBig}>
              <Image
                style={styles.codeimage}
                source={images.SIGNUP.PLUS}></Image>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 8,
                fontFamily: 'Poppins-Regular',
                fontSize: 11,
                color: colors.white,
              }}>
              Custom Food
            </Text>
          </View>
          <View style={styles.center}>
            <TouchableOpacity
              // onPress={() => [clearGlobalSearch(), setBarcodeVisible(true)]}
              onPress={() => [
                Utility.getInstance().setBackRoute('NewMeal'),
                navigation.navigate('AddFoods', {isScanning: true}),
              ]}
              style={styles.minuscBig}>
              <Image
                style={styles.codeimage}
                source={images.PROFILE.CODE}></Image>
            </TouchableOpacity>
            <Text style={styles.text}>Scan Barcode</Text>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: 140,
          }}>
          <TouchableOpacity
            onPress={() => [
              Utility.getInstance().setBackRoute('NewMeal'),
              navigation.navigate('AddFoods'),
            ]}
            style={styles.minuscBig}>
            <Image style={styles.codeimage} source={images.APP.SEARCH}></Image>
          </TouchableOpacity>
          <Text style={styles.text}>Search Food</Text>
        </View>
        <View style={styles.sapce}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FavoriteFoods')}
              style={styles.minuscBig}>
              <Image
                style={styles.codeimage}
                source={images.APP.LIKEDHEART}></Image>
            </TouchableOpacity>
            <Text style={styles.text}>Favorite Food</Text>
          </View>
          <View style={styles.center}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ApprovedFoods')}
              // onPress={() => [clearGlobalSearch(), setBarcodeVisible(true)]}
              style={styles.minuscBig}>
              <Image
                style={styles.codeimage}
                source={images.APP.APPLOGO}></Image>
            </TouchableOpacity>
            <Text style={styles.text}>Approved Foods</Text>
          </View>
        </View>
      </>
    );
  };
  const CameraModalContent = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBarCodeScannerVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <View
          style={{
            marginTop: Platform.OS == 'android' ? 0 : windowHeight / 18.5,
            height: windowHeight,
            width: windowWidth,
          }}>
          <Header onBackPress={() => setBarcodeVisible(false)} />

          <QRCodeScanner
            onRead={barcodeReceived}
            showMarker={true}
            markerStyle={{
              borderWidth: 2,
              width: 250,
              height: 250,
              borderColor: 'green',
              borderRadius: 5,
              marginTop: -windowHeight / 7,
            }}
            cameraStyle={{
              height: windowHeight / 1.12,
              width: windowWidth,
            }}
            flashMode={RNCamera.Constants.FlashMode.auto}
          />
        </View>
      </Modal>
    );
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => navigation.goBack()} />
        <Loader isLoading={isLoading} />
        <ScrollView contentContainerStyle={{paddingVertical: 0}}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading]}>{strings.newmeal_add}</Text>
            <Text
              style={{
                marginTop: 10,
                color: colors.white,
                alignSelf: 'flex-start',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              {strings.addNewMealDesc}
            </Text>
            <Text
              style={{
                marginTop: 20,
                color: colors.secondary,
                alignSelf: 'center',
                fontSize: 13,
                textDecorationLine: 'underline',
                fontFamily: 'Poppins-Regular',
              }}>
              Help
            </Text>
          </View>
          {controls()}
        </ScrollView>
        {/* {CameraModalContent()} */}
      </View>
    );
  };

  return DefautView();
};
export default NewMeal;
