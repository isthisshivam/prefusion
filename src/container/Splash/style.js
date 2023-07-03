import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flex_7: {
    flex: 0.7,
  },
  flex_6: {
    flex: 0.6,
  },
  flex_4: {
    flex: 0.4,
  },
  flex_3: {
    flex: 0.3,
  },
  backgroundVideo: {
    height: 230,
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    //resizeMode: 'stretch',
    //position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
  },
});
export default styles;
