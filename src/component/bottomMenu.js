import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  StatusBar,
  BackHandler,
} from 'react-native';
import images from '../assets/images';
import strings from '../constants/strings';
import globalStyles from '../assets/globalStyles';
import styles from '../container/BucketEntry/style';
import colors from '../constants/colorCodes';
import {useNavigation} from '@react-navigation/native';
const BottomTabMenu = props => {
  const {onClick, isFeedbackEnteredToday} = props;
  const navigation = useNavigation();
  return (
    <View style={globalStyles.bottom_tab_c}>
      <TouchableOpacity
        onPress={() => navigation.navigate('DailyDairy')}
        style={globalStyles.bottom_tab_item_c}>
        <Image
          source={images.APP.DAILYD}
          style={[globalStyles.bottom_tab_item_img, {tintColor: colors.white}]}
        />
        <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
          Daily Dairy
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={globalStyles.bottom_tab_item_c}>
        <Image
          source={images.APP.GOAL}
          style={[globalStyles.bottom_tab_item_img, {tintColor: colors.white}]}
        />
        <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
          Goals
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onClick()}
        style={globalStyles.bottom_tab_item_c}>
        <Text
          style={[
            globalStyles.bottom_tab_text,
            {marginTop: -10, color: colors.secondary},
          ]}>
          ADD
        </Text>
        <View style={globalStyles.bottom_tab_addmeal_c}>
          <Image
            source={images.SIGNUP.PLUS}
            style={[
              globalStyles.bottom_tab_item_img_plus,
              {tintColor: colors.secondary},
            ]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Progress')}
        style={globalStyles.bottom_tab_item_c}>
        <Image
          source={images.APP.PROGRESS}
          style={[globalStyles.bottom_tab_item_img, {tintColor: colors.white}]}
        />
        <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
          Progress
        </Text>
      </TouchableOpacity>
      {isFeedbackEnteredToday ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('DailyBioFeedback')}
          style={globalStyles.bottom_tab_item_c}>
          <Image
            source={images.APP.FEEDBACK}
            style={[
              globalStyles.bottom_tab_item_img,
              {tintColor: colors.white},
            ]}
          />
          <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
            Feedback
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('DailyBioFeedback')}
          style={globalStyles.bottom_tab_item_c}>
          <Image
            source={images.APP.FEEDBACK_WARNING}
            style={[
              {
                height: 35,
                width: 35,
                resizeMode: 'contain',
                marginTop: -11,
              },
            ]}
          />
          <Text style={[globalStyles.bottom_tab_text, {color: colors.white}]}>
            Feedback
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default BottomTabMenu;
