import React, {useState} from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import Swiper from 'react-native-swiper';
import Header from '../../component/headerWithBackControl';
import styles from '../HandGuide/style';
import colors from '../../constants/colorCodes';
const HandGuide = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState(0);

  const backPress = () => {
    navigation.goBack();
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            color: colors.secondary,
            fontSize: 20,
            fontFamily: 'Poppins-medium',
          }}>
          Hand Guide for
        </Text>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            color: colors.secondary,
            fontSize: 20,
            fontFamily: 'Poppins-medium',
          }}>
          Measuring Portion size
        </Text>
        <View style={{marginTop: 0, height: '60%'}}>
          <Swiper
            showsPagination={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onIndexChanged={value => setValue(value)}
            nextButton={
              <Image
                source={images.APP.RIGHT}
                style={{height: 30, width: 30, resizeMode: 'contain'}}></Image>
            }
            prevButton={
              <Image
                source={images.APP.LEFT}
                style={{height: 30, width: 30, resizeMode: 'contain'}}></Image>
            }
            showsButtons
            loop={false}>
            <ImageBackground
              resizeMode="contain"
              source={images.APP.PROTEIN}
              style={styles.swiperimage}></ImageBackground>
            <ImageBackground
              resizeMode="contain"
              source={images.APP.CARBSC}
              style={styles.swiperimage}></ImageBackground>
            <ImageBackground
              resizeMode="contain"
              source={images.APP.FAT}
              style={styles.swiperimage}></ImageBackground>
          </Swiper>
        </View>
        <View
          style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
          {value == 0 && (
            <ImageBackground
              source={images.APP.PROTEINBUCKET}
              resizeMode="cover"
              style={{
                height: 90,
                width: 90,
                alignItems: 'center',
                justifyContent: 'center',
              }}></ImageBackground>
          )}
          {value == 2 && (
            <ImageBackground
              source={images.APP.DUCK}
              resizeMode="contain"
              style={{
                height: 90,
                width: 90,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.orange,
                  fontSize: 20,
                  marginTop: 15,
                  fontFamily: 'Poppins-medium',
                }}>
                10g
              </Text>
            </ImageBackground>
          )}
          {value == 1 && (
            <ImageBackground
              source={images.APP.RED_EMPTY}
              resizeMode="contain"
              style={{
                height: 90,
                width: 90,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.red,
                  fontSize: 20,
                  fontFamily: 'Poppins-medium',
                  marginTop: 15,
                }}>
                20g
              </Text>
            </ImageBackground>
          )}
          <Text
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              color: colors.white,
              fontSize: 20,
              marginTop: 10,
              fontFamily: 'Poppins-medium',
            }}>
            1 bucket
          </Text>
        </View>
      </View>
    );
  };

  return DefautView();
};
export default HandGuide;
