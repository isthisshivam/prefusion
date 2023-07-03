import React from 'react';
import {View, Text, ActivityIndicator, Pressable} from 'react-native';
import colors from '../constants/colorCodes.js';

const ListEmptyComponent = props => {
  const {heading} = props;
  return (
    <View>
      <Text>{heading}</Text>
    </View>
  );
};
export default ListEmptyComponent;
