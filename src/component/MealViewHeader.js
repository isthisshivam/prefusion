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
import colorCodes from '../constants/colorCodes';

const MealViewHeader = props => {
  const {onBackPress, profileClick} = props;
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const userData = useSelector(state => state.other.loginReducer.userData);

  useEffect(() => {
    if (userData) {
      setImageUri(userData?.image);
    }
    const unsubscribe = navigation.addListener('focus', () => {
      if (userData) {
        setImageUri(userData?.image);
      }
    });
    return () => {
      unsubscribe;
    };
  }, [imageUri, userData]);
  const onProfileClick = () => {
    navigation.navigate('Profile');
  };
  return (
    <View style={styles.appHeader}>
      <TouchableOpacity onPress={() => onBackPress()}>
        <Image style={globalStyles.backimg} source={images.SIGNUP.BACK}></Image>
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: 'Poppins-Medium',
          color: colorCodes.secondary,
          fontSize: 15,
          marginTop: 25,
        }}>
        Meal Details
      </Text>
      <TouchableOpacity
        onPress={() =>
          profileClick ? [profileClick(), onProfileClick()] : onProfileClick()
        }>
        <Image style={styles.userlogo} source={{uri: imageUri}}></Image>
      </TouchableOpacity>
    </View>
  );
};

export default MealViewHeader;
