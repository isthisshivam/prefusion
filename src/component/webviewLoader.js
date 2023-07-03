import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import colorCodes from '../constants/colorCodes';
export const indicatorLoadingView = () => {
  return (
    <ActivityIndicator
      color={colorCodes.secondary_green}
      size="large"
      style={styless.IndicatorStyle}
    />
  );
};
const styless = StyleSheet.create({
  IndicatorStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
