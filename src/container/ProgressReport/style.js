import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
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
  lbs: {
    marginTop: -55,
    width: 60,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: colors.white,
    letterSpacing: 1,
  },
  progressgoalcb: {
    height: 160,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  progressgoalchildc: {flex: 1, backgroundColor: 'transparent'},
  progressgoalchildcborder0: {
    height: 160,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0,
    flexDirection: 'row',
  },
  codeimage: {height: 30, width: 30, resizeMode: 'contain'},
  flex_8: {
    flex: 0.8,
  },
  white: {color: colors.white},
  bucketImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    marginTop: 5,
  },
  userBucket: {height: 30, width: 30, resizeMode: 'contain', marginTop: 5},
  userlogo: {height: 35, width: 65, resizeMode: 'contain', borderRadius: 10},
  send: {height: 10, width: 10, resizeMode: 'contain'},
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressbar: {alignItems: 'center', marginTop: 20},
  radio: {alignSelf: 'flex-start', marginTop: 20},
  carb: {
    height: 30,
    width: Utility.getInstance().DW(),
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 30,
    flexDirection: 'row',
  },
  input: {
    marginVertical: 10,
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
  textAlignCenter: {
    textAlign: 'center',
  },
  font30: {
    fontSize: 30,
  },
  whydesc: {
    padding: 0,
    lineHeight: 27,
    fontSize: 15,
    marginTop: 10,
  },
  why_heading: {
    color: colors.secondary,
    alignSelf: 'flex-start',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  dropdown1BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown2BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {backgroundColor: '#444'},
  dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  dropdown3BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#444',
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    color: '#444',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderBottomColor: '#444',
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },

  dropdown4BtnStyle: {
    marginTop: 10,
    width: '100%',
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.placeholder,
  },
  red: {
    color: colors.red,
  },
  orange: {
    color: colors.orange,
  },
  blue: {
    color: colors.blue,
  },
  green: {
    color: colors.secondary,
  },

  dropdown4BtnTxtStyle: {color: colors.placeholder, textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},

  input_heading: {color: colors.secondary, alignSelf: 'center'},
  goalval: {
    color: colors.secondary,
    alignSelf: 'center',
    fontSize: 22,
    marginTop: 10,
  },
  goalvalwhite: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 22,
    marginTop: 10,
  },
  wecanhelp: {
    color: colors.secondary,
    alignSelf: 'center',
    fontSize: 30,
    letterSpacing: 2,
    paddingHorizontal: 40,
    textAlign: 'center',
    lineHeight: 40,
  },
  dateView_: {
    margin: 3,
    height: 35,
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  addView_green: {
    margin: 5,
    height: 28,
    backgroundColor: colors.green,
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  addView_blue: {
    margin: 5,
    height: 28,
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  headingT: {
    fontFamily: 'Poppins-Light',
    color: colors.white,
    fontSize: 12,
  },
  addView_orange: {
    margin: 5,
    height: 28,
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  addView_red: {
    margin: 5,
    height: 28,
    backgroundColor: colors.darkred,
    borderColor: colors.darkred,
    borderWidth: 1,
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  addView_darkgreen: {
    margin: 5,
    height: 28,
    backgroundColor: colors.secondary_green,
    borderColor: colors.secondary_green,
    borderWidth: 1,
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  headingtext: {
    fontFamily: 'Poppins-Regular',
    color: colors.white,
    fontSize: 12,
  },
  headingtextBlack: {
    fontFamily: 'Poppins-Regular',
    color: colors.black,
    fontSize: 12,
  },
  guideT: {
    alignSelf: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
    color: colors.white,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    letterSpacing: 0.7,
  },
  bucketSize: {
    alignSelf: 'center',
    marginTop: 0,
    color: colors.white,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    letterSpacing: 0.7,
  },
  mealimg: {
    height: 110,
    width: 160,
    borderRadius: 10,
    marginTop: 6,
  },
  myfavlistcontainer: {
    marginTop: 10,
    backgroundColor: colors.offwhite,
    height: 75,
    paddingHorizontal: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  myfavlistcontainerchild: {flexDirection: 'row', alignItems: 'center'},
  image: {height: 50, width: 65, resizeMode: 'cover', borderRadius: 10},
  ml_15: {marginLeft: 15, fontFamily: 'Poppins-Light'},
  minusc: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
