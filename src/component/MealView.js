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
import Utility from '../utility/Utility';
import images from '../assets/images';
import {useNavigation} from '@react-navigation/native';
import strings from '../constants/strings';
import globalStyles from '../assets/globalStyles';
import colorCodes from '../constants/colorCodes';
import styles from '../container/Home/style';

const MealView = props => {
  const {data, onClick, onEditPress, onPlusPress} = props;

  const RenderMeals = props => {
    console.log('rendermeals==', props);
    const {index} = props.item;
    const {item, onClick} = props;

    return (
      <View
        style={[
          styles.myfavlistcontainer,
          {
            backgroundColor:
              index % 2 == 0 ? colorCodes.white : colorCodes.offwhite,
          },
        ]}>
        <View style={[styles.myfavlistcontainerchild]}>
          <Image style={styles.image} source={{uri: item?.item?.image}}></Image>
          <View>
            <Text
              style={[
                styles.ml_15,
                styles.mealName,
                {color: colorCodes.black, fontFamily: 'Poppins-Medium'},
              ]}>
              {`${
                item?.item?.calories &&
                parseFloat(item?.item?.calories).toFixed(2)
              } cal`}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.ml_15, styles.black, {width: 100}]}>
              {item?.item?.meal_name}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity
          onPress={() => onEditPress(props.item)}
          style={[
            styles.minusc,
            {
              backgroundColor:
                index % 2 == 0 ? colorCodes.offwhite : colorCodes.white,
            },
          ]}>
          <Image style={styles.minusimage} source={images.APP.PENCIL}></Image>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => onClick(props.item)}
          style={[
            styles.minusc,
            {
              backgroundColor:
                index % 2 == 0 ? colorCodes.offwhite : colorCodes.white,
            },
          ]}>
          <Image style={styles.minusimage} source={images.SIGNUP.PLUS}></Image>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <FlatList
      extraData={data}
      data={data}
      // contentContainerStyle={{marginBottom: 102}}
      contentInsetAdjustmentBehavior="automatic"
      onEndReached={() => console.log('onEndReached')}
      showsVerticalScrollIndicator={false}
      renderItem={item => (
        <RenderMeals item={item} onClick={onClick} />
      )}></FlatList>
  );
};

export default MealView;
