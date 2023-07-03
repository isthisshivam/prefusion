import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Pressable,
  Image,
  ImageBackground,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';

import styles from '../container/ServingsizeGuide/style';
import globalStyles from '../assets/globalStyles';
import images from '../assets/images';
import {useNavigation} from '@react-navigation/native';
var imageUri = null;
const MenuHeader = props => {
  const {onBackPress, Menu} = props;
  const navigation = useNavigation();
  const userData = useSelector(state => state.other.loginReducer.userData);

  useEffect(() => {
    if (userData) {
      imageUri = userData.image;
    }
    const unsubscribe = navigation.addListener('focus', () => {
      if (userData) {
        imageUri = userData.image;
      }
    });
    return () => {
      unsubscribe;
    };
  }, [userData]);

  return (
    <View style={styles.appHeader}>
      <Menu />

      <TouchableOpacity>
        <Image
          style={globalStyles.applogoheader}
          source={images.FAVORITE.APPLOGO}></Image>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image style={styles.userlogo_image} source={{uri: imageUri}}></Image>
      </TouchableOpacity>
    </View>
  );
};

export default MenuHeader;
