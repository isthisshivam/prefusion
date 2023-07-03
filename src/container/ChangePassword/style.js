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
  flex_2: {
    flex: 0.2,
  },
  flex_8: {
    flex: 0.8,
  },
  flex_1: {
    flex: 0.1,
  },
  flex_9: {
    flex: 0.9,
  },
  font30: {
    fontSize: 30,
  },
  username: {
    color: colors.white,
    alignSelf: 'flex-start',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  dropdown4BtnTxtStyle: {color: colors.placeholder, textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},

  input: {
    marginVertical: 5,
    height: 42,
    width: '100%',
    backgroundColor: colors.white,
    padding: 10,
  },
  input_gray: {
    marginVertical: 10,
    height: 42,
    width: '100%',
    backgroundColor: colors.gray,
    padding: 10,
  },
  biginput: {
    marginVertical: 10,
    height: 200,
    width: '100%',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
  },
  forgot_pass_heading: {color: colors.white, fontFamily: 'Poppins-Light'},
  flex_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  new_user_c: {width: '100%', marginTop: 15, alignItems: 'center'},
  new_user_heading: {color: colors.white, fontSize: 12, lineHeight: 30},
  signup_heading: {color: colors.secondary, fontSize: 16, letterSpacing: 1},
  areyou: {textAlign: 'center', padding: 20, lineHeight: 20},
  whydesc: {
    padding: 0,
    lineHeight: 27,
    fontSize: 15,
    marginTop: 10,
  },
  why_heading: {color: colors.secondary, alignSelf: 'flex-start', fontSize: 20},
  dropdown4BtnStyle: {
    marginTop: 3,
    width: 240,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.placeholder,
  },
  dropdown4BtnTxtStyle: {color: colors.placeholder, textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
});
export default styles;
