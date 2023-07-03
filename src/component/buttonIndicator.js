import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

import colors from '../constants/colorCodes.js';

const Indicator = props => {
  const {isAnimating} = props;
  return (
    <ActivityIndicator
      size={'small'}
      animating={isAnimating}
      color={colors.white}></ActivityIndicator>
  );
};
export default Indicator;
