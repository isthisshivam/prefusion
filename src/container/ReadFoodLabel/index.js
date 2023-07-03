import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../ReadFoodLabel/style';
import colors from '../../constants/colorCodes';
import Header from '../../component/headerWithBackControl';
import ImageZoom from 'react-native-image-pan-zoom';
const ReadFoodLabel = () => {
  const navigation = useNavigation();

  const backPress = () => {
    navigation.goBack();
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        {/* <View
          style={{
            height: '82%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'red',
          }}> */}
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <ImageBackground
              resizeMode="cover"
              style={{
                //  marginTop: Dimensions.get('window').height / 10,
                height: Dimensions.get('window').height / 1.4,
                width: Dimensions.get('window').width,
                marginLeft: Dimensions.get('window').width / 10,
              }}
              source={images.SPLASH.LABEL1}></ImageBackground>
          </View>

          <ImageBackground
            resizeMode="cover"
            style={{
              alignContent: 'center',

              alignSelf: 'center',
              //  marginTop: Dimensions.get('window').height / 10,
              height: Dimensions.get('window').height / 1.4,
              width: Dimensions.get('window').width,
            }}
            source={images.SPLASH.LABEL}></ImageBackground>
          {/* <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height / 1.2}
            imageWidth={Dimensions.get('window').width}
            imageHeight={Dimensions.get('window').height / 1.2}>
            <ImageBackground
              resizeMode="cover"
              style={{
                marginTop: Dimensions.get('window').height / 10,
                height: Dimensions.get('window').height / 1.4,
                width: Dimensions.get('window').width,
              }}
              source={images.SPLASH.LABEL}></ImageBackground>
          </ImageZoom> */}
        </ScrollView>

        {/* <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height / 1.2}
            imageWidth={Dimensions.get('window').width}
            imageHeight={Dimensions.get('window').height / 1.2}>
            <ImageBackground
              resizeMode="cover"
              style={{
                marginTop: Dimensions.get('window').height / 10,
                height: Dimensions.get('window').height / 1.4,
                width: Dimensions.get('window').width,
              }}
              source={images.SPLASH.LABEL}></ImageBackground>
          </ImageZoom> */}
      </View>
    );
  };

  return DefautView();
};
export default ReadFoodLabel;
