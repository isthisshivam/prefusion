import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colorCodes';
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
  input_gray: {
    marginVertical: 10,
    height: 42,
    width: '100%',
    backgroundColor: colors.gray,
    padding: 10,
  },
  input: {
    marginVertical: 3,
    height: 42,
    width: '100%',
    backgroundColor: colors.white,
    padding: 10,
  },
  forgot_pass_heading: {
    color: colors.white,
    fontFamily: 'Poppins-Light',
    fontSize: 16,
  },
  flex_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  new_user_c: {width: '100%', marginTop: 15, alignItems: 'center'},
  new_user_heading: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 30,
    fontFamily: 'Poppins-Light',
  },
  signup_heading: {
    color: colors.secondary,
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
});
export default styles;
