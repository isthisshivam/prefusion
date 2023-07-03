import React from 'react';
import {View, Text, ActivityIndicator, Pressable} from 'react-native';
import colors from '../constants/colorCodes.js';

const Button = props => {
  return (
    <Pressable
      onPress={props.onClick}
      style={{
        backgroundColor: props.color,
        height: 40,
        width: 200,
        marginTop: props?.marginTop,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: colors.black,
          fontSize: 15,
          letterSpacing: 0.2,
          fontFamily: 'Poppins-Medium',
        }}>
        {props.heading}
      </Text>
    </Pressable>
  );
};
export default Button;
