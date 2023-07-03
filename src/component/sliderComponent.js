import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import colors from '../constants/colorCodes';
import strings from '../constants/strings';
import {PanGestureHandler} from 'react-native-gesture-handler';
import globalStyles from '../assets/globalStyles/index';
import styles from '../container/AddBloodWork/style';
const SliderComponent = props => {
  const {
    headingValue,
    heading,
    type,
    onPanGesture,
    translateX,
    onLayoutCall,
    calculatedValue,
    onEnded,
  } = props;

  return (
    <View
      style={{
        backgroundColor: colors.primary,
        height: 150,
        width: '100%',
        margin: 10,
      }}>
      <Text style={[styles.whydesc, globalStyles.textAlignStart, styles.white]}>
        {heading}
        <Text
          style={[
            styles.whydesc,
            globalStyles.textAlignStart,
            type == 'iron' ? styles.green : styles.red,
            {fontFamily: 'Poppins-Medium'},
          ]}>
          {headingValue}
        </Text>
      </Text>
      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, color: colors.white}}>0</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, color: colors.white}}>99</Text>
        </View>
      </View>
      <View
        style={{backgroundColor: 'yellow', margin: 0}}
        onLayout={value => [
          onLayoutCall && onLayoutCall(value.nativeEvent.layout.width),
        ]}>
        <PanGestureHandler
          onGestureEvent={value => [onPanGesture(value.nativeEvent)]}
          onEnded={value => [onEnded()]}>
          <View style={{flex: 1}}>
            {type == strings.ldlh && (
              <View style={{flexDirection: 'row', flex: 1, height: 120}}>
                <View
                  style={{
                    flex: 1,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.green,
                  }}></View>
                <View
                  style={{
                    flex: 1,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.red_D,
                  }}></View>
              </View>
            )}
            {type == strings.iron && (
              <View style={{flexDirection: 'row', flex: 1, height: 120}}>
                <View
                  style={{
                    flex: 0.2,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.red_D,
                  }}></View>
                <View
                  style={{
                    flex: 0.35,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.green,
                  }}></View>
                <View
                  style={{
                    flex: 0.45,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.red_D,
                  }}></View>
              </View>
            )}
            {type == strings.vitamin && (
              <View style={{flexDirection: 'row', flex: 1, height: 120}}>
                <View
                  style={{
                    flex: 0.28,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.red_D,
                  }}></View>
                <View
                  style={{
                    flex: 0.38,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.green,
                  }}></View>
                <View
                  style={{
                    flex: 0.42,
                    height: 50,
                    //margin: 10,
                    backgroundColor: colors.red_D,
                  }}></View>
              </View>
            )}

            <Animated.View
              style={[
                {
                  height: 50,
                  width: 10,
                  backgroundColor: 'black',
                  position: 'absolute',
                },
                {
                  transform: [
                    {
                      translateX:
                        calculatedValue > 200 ? width / 1.2 : translateX,
                      //translateX: translateX,
                    },
                    {
                      translateY: 0,
                    },
                  ],
                },
              ]}></Animated.View>
          </View>
        </PanGestureHandler>
      </View>
    </View>
  );
};
export default SliderComponent;
