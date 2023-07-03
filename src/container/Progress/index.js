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
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';

import Loader from '../../component/loader';
import colors from '../../constants/colorCodes';

const Progress = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const isLoading = useSelector(
    state => state.other.userProfileInfoReducer.showLoader,
  );

  const backPress = () => {
    navigation.goBack();
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
                {strings.progrss}
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  color: colors.white,
                  alignSelf: 'flex-start',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                }}>
                {strings.manage}
              </Text>
            </View>
            <View style={styles.btn}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProgressReport')}
                style={styles.btn_}>
                <Image
                  style={{height: 45, width: 45, resizeMode: 'contain'}}
                  source={images.APP.NEWD}></Image>
              </TouchableOpacity>
              <Text style={styles.heading_}>
                {`View Progress
Reports`}
              </Text>
            </View>
            <View style={styles.upper}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProgressPhotos')}
                style={styles.btn_}>
                <Image
                  style={{height: 45, width: 45, resizeMode: 'contain'}}
                  source={images.APP.NAP}></Image>
              </TouchableOpacity>
              <Text style={styles.heading_}>
                {`My Progress
Photos`}
              </Text>
            </View>
          </ScrollView>
        </View>
      </>
    );
  };

  return DefautView();
};
export default Progress;
