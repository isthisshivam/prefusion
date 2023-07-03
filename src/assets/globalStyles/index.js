import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colorCodes from '../../constants/colorCodes';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
const globalStyles = StyleSheet.create({
  newheading: {
    width: 240,
    //paddingHorizontal: 25,
  },
  bucketImg: {
    height: 15,
    width: 15,
    marginLeft: 1,
    marginTop: 0,
    resizeMode: 'contain',
  },
  flex: {
    flex: 1,
  },
  flex_6: {
    flex: 0.6,
  },
  lineheight_40: {
    lineHeight: 40,
  },
  flex_4: {
    flex: 0.4,
  },
  font20: {
    fontSize: 20,
  },
  font25: {
    fontSize: 25,
  },
  margin_horizontal_40: {
    marginHorizontal: 40,
  },
  margin_horizontal_20: {
    marginHorizontal: 20,
  },
  bucketImg_new: {height: 16, width: 16, resizeMode: 'contain', marginTop: 0},
  flex_row: {flexDirection: 'row'},
  font17: {
    fontSize: 13,
  },
  font14: {
    fontSize: 14,
  },
  font_12: {
    fontSize: 12,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignItems_c: {
    alignItems: 'center',
  },
  justifyContent_c: {
    justifyContent: 'center',
  },
  textAlignStart: {
    color: colors.secondary,
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-Light',
    fontSize: 15,
  },
  textAlignEnd: {
    color: colors.secondary,
    alignSelf: 'flex-end',
    fontFamily: 'Poppins-Light',
    fontSize: 16,
  },
  italicFont: {
    fontFamily: 'Poppins-Italic',
  },
  padding_40: {
    padding: 20,
  },
  padding_40_: {
    padding: 40,
  },
  padding_40_hor: {
    padding: 30,
  },
  padding_30_hor: {
    paddingHorizontal: 30,
  },
  button_primary: {
    borderColor: colors.secondary,
    borderRadius: 28,
    borderWidth: 1.5,
    height: 45,
    width: 250,
    backgroundColor: colors.primary,
  },
  button_secondary: {
    borderColor: colors.secondary,
    borderRadius: 28,
    borderWidth: 1.5,
    height: 40,
    width: 250,
    backgroundColor: colors.secondary,
  },
  button_secondary_extra_width: {
    borderColor: colors.secondary,
    borderRadius: 28,
    borderWidth: 1.5,
    height: 45,
    paddingHorizontal: 30,
    // width: 300,
    backgroundColor: colors.secondary,
  },
  button_secondarywithoutBlackBack: {
    borderColor: colors.secondary,
    borderRadius: 28,
    borderWidth: 1.5,
    height: 45,
    width: 250,
    backgroundColor: colors.white,
  },

  mt_30: {
    marginTop: 30,
  },
  mt_40: {
    marginTop: 40,
  },
  // mt_20_per:{
  //     marginTop:Utility.getInstance().heightToDp(0)
  // },

  green_heading: {
    color: colors.secondary,
  },
  input_heading: {
    color: colors.secondary,
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 18,
  },
  backimg: {height: 20, width: 20, margin: 15},
  backimgregister: {height: 20, width: 20, margin: 0, marginHorizontal: 10},
  textAlignCenter: {
    textAlign: 'center',
  },
  mt30Per: {
    marginTop: Utility.getInstance().heightToDp(30),
  },
  mt20Per: {
    marginTop: Utility.getInstance().heightToDp(30),
  },
  applogoheader: {
    height: 80,
    width: 120,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  applogoheadersmall: {
    height: 40,
    width: 60,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  btn_heading: {
    color: colors.white,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
  },
  mr_left: {marginLeft: 10},
  btn_heading_black: {
    color: colors.black,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
  },
  btn_heading_black_small: {
    color: colors.black,
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
  },
  btn_heading_black_dropdown: {
    color: colors.black,
    fontSize: 16,
    letterSpacing: 1,
  },
  // fonts name
  bold: {
    fontFamily: 'Poppins-Bold',
  },
  black: {
    fontFamily: 'Poppins-Black',
  },
  bold_black_italic: {
    fontFamily: 'Poppins-BlackItalic',
  },
  bold_italic: {
    fontFamily: 'Poppins-BoldItalic',
  },
  extra_bold: {
    fontFamily: 'Poppins-ExtraBold',
  },
  extra_bold_italic: {
    fontFamily: 'Poppins-ExtraBoldItalic',
  },
  extra_light: {
    fontFamily: 'Poppins-ExtraLight',
  },

  extra_light_italic: {
    fontFamily: 'Poppins-ExtraLightItalic',
  },
  italic: {
    fontFamily: 'Poppins-Italic',
  },

  light: {
    fontFamily: 'Poppins-Light',
  },
  light_italic: {
    fontFamily: 'Poppins-LightItalic',
  },
  medium: {
    fontFamily: 'Poppins-Medium',
  },
  medium_italic: {
    fontFamily: 'Poppins-MediumItalic',
  },

  regular: {
    fontFamily: 'Poppins-Regular',
  },
  semibold: {
    fontFamily: 'Poppins-SemiBold',
  },
  semibold: {
    fontFamily: 'Poppins-SemiBoldItalic',
  },
  thin: {
    fontFamily: 'Poppins-Thin',
  },
  thin_italic: {
    fontFamily: 'Poppins-ThinItalic',
  },
  dialog_Container_a_bit_large: {
    width: Utility.getInstance().DW() / 1.15,
    backgroundColor: 'white',
  },
  dialog_Container: {
    width: Utility.getInstance().DW() / 1.3,
    backgroundColor: 'white',
  },
  dialog_wrapper_view: {
    marginTop: 20,

    width: '100%',
    backgroundColor: 'white',
  },
  padding_20_hor: {paddingHorizontal: 20},
  padding_10_hor: {paddingHorizontal: 10},
  mt_20: {marginTop: 20},
  mb_20: {marginBottom: 20},
  mt_10: {marginTop: 10},
  underline_green: {textDecorationLine: 'underline'},
  underline_greendark: {
    textDecorationLine: 'underline',
    color: colors.green,
    fontFamily: 'Poppins-Medium',
  },
  underline_white: {textDecorationLine: 'underline', color: colors.white},
  mt_0: {marginTop: 0},
  mr_10: {marginRight: 10},
  flex_68: {flex: 0.8, padding: 5},
  flex_32_aligncenter: {
    flex: 0.2,
    alignItems: 'center',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
  },
  justifyContent_space_between: {justifyContent: 'space-between'},
  radiobutton: {
    width: 150,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  white: {
    color: colorCodes.white,
  },
  BottomSheet_container: {
    alignItems: 'center',
    borderRadius: 19,
  },
  bottomSheet_btn: {
    backgroundColor: colors.secondary,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btn_heading_sheet: {
    fontSize: 18,
    color: colors.white,
    marginLeft: 5,
  },
  parent_contaier_bottomsheet: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet_btn_margin: {
    backgroundColor: colors.secondary,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  bottom_tab_c: {
    height: 70,
    padding: 20,
    backgroundColor: colors.primary,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottom_tab_item_c: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
  },
  bottom_tab_item_img: {
    height: 25,
    width: 25,

    resizeMode: 'contain',
  },
  bottom_tab_item_img_plus: {
    height: 20,
    width: 20,

    resizeMode: 'contain',
  },
  bottom_tab_text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  bottom_tab_addmeal_c: {
    marginTop: 4,
    backgroundColor: colors.white,
    height: 35,
    width: 35,
    borderRadius: 20,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  width_100_percent: {width: '100%'},
});
export default globalStyles;
