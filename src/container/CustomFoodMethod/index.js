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
import styles from '../CustomFoodMethod/style';
import images from '../../assets/images';
import Utility from '../../utility/Utility';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Loader from '../../component/loader';
import colors from '../../constants/colorCodes';
import {userProfileInfoRequest} from '../../redux/action/UserProfileInfo';
import {updateUserInformationRequest} from '../../redux/action/UserProfileInfo';

const CustomFoodMethod = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );

  const controls = () => {
    return (
      <>
        <View style={styles.sapce}>
          <View style={styles.center}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomFood')}
              style={styles.minuscBig}>
              <Image
                style={styles.codeimage}
                source={images.SIGNUP.PLUS}></Image>
            </TouchableOpacity>
            <Text style={styles.text}>Macro Entry</Text>
          </View>
        </View>
        <View style={styles.center}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BucketEntry')}
            style={styles.minuscBig}>
            <Image
              style={styles.codeimage}
              source={images.APP.SEC_BUCK}></Image>
          </TouchableOpacity>
          <Text style={styles.text}>Bucket Entry</Text>
        </View>
      </>
    );
  };
  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => navigation.goBack()} />
          <Loader isLoading={isLoading} />
          <ScrollView contentContainerStyle={{paddingVertical: 0}}>
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={[styles.why_heading]}>{strings.addcustomfood}</Text>
              <Text
                style={{
                  marginTop: 10,
                  color: colors.white,
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                }}>
                {strings.addcustomfooddesc}
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
        </View>
      </>
    );
  };

  return DefautView();
};
export default CustomFoodMethod;
