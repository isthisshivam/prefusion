import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../Goal/style';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Utility from '../../utility/Utility';
import colors from '../../constants/colorCodes';
import DialogView from '../../component/dialog';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const Goal = props => {
  const navigation = useNavigation();
  const [isVisible, setVisible] = useState(false);
  const [willInflate, setWillInflate] = useState(false);
  const onSkipPress = () => {
    navigation.navigate('Calories');
  };
  const backPress = () => {
    navigation.goBack();
  };
  const onTouchOutside = () => {
    setWillInflate(false);
  };
  const Modal = () => {
    return (
      <DialogView
        onTouchOutside={() => onTouchOutside()}
        willInflate={willInflate}
        onBackPress={() => setWillInflate(false)}
        children={<ModalContent />}></DialogView>
    );
  };
  const ModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 25,
            width: '100%',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => setWillInflate(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text style={{textAlign: 'center', fontFamily: 'Poppins-SemiBold'}}>
            Entry Out of Range!
          </Text>
        </View>
        <View
          style={{
            marginTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center', fontFamily: 'Poppins-Light'}}>
            One of your selections is out of range for your 3 month goals.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-LightItalic',
              marginTop: 20,
            }}>
            Your goals should be within the proper range of your current state:
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Goal Weight Change Limits:
          </Text>
          <Text style={{textAlign: 'center', marginTop: 10}}>
            -24 to +10lb change
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Lean Tissue Goal Max: +10
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Fat Tissue Goal Max: -24 lbs
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              marginTop: 20,
            }}>
            Are your goals outside our recommended ranges? Talk to our health
            professionals about your desired changes
          </Text>
          {/* <TouchableOpacity
            onPress={() => [
              navigation.navigate('Chat', 0),
              setWillInflate(false),
            ]}
            style={[
              globalStyles.button_primary,
              globalStyles.center,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading}>{strings.chat_with_us}</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };
  const First = () => {
    return (
      <ScrollView
        style={{backgroundColor: colors.primary}}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <View style={[styles.flex_2]}>
            <View
              style={{
                width: SCREEN_WIDTH,
                height: 0,
                borderTopColor: colors.secondary,
                borderTopWidth: SCREEN_HEIGHT / 14,
                borderRightWidth: SCREEN_WIDTH + 50,
                borderRightColor: 'transparent',
              }}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  marginTop: Utility.getInstance().heightToDp(-15),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={backPress}>
                  <Image
                    style={globalStyles.backimgregister}
                    source={images.SIGNUP.BACK}></Image>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                alignContent: 'center',
                backgroundColor: 'transparent',
              }}>
              <ImageBackground
                source={images.APP.APPLOGO}
                resizeMode="contain"
                style={{
                  height: 50,
                  width: '90%',
                  marginTop: Utility.getInstance().heightToDp(10),
                  marginLeft: Utility.getInstance().widthToDp(8),
                  backgroundColor: 'transparent',
                }}></ImageBackground>
            </View>
          </View>
          <View style={styles.flex_8}>
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Text style={styles.why_heading}>{strings.goal}</Text>
              <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
                {strings.goaldesc}
              </Text>
              <View
                style={[
                  globalStyles.center,
                  globalStyles.mt_30,
                  globalStyles.padding_40,
                ]}>
                <Text style={[styles.input_heading]}>{strings.goalweight}</Text>
                <SelectDropdown
                  data={['12 lbs', '111 lbs']}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                  }}
                  defaultButtonText={'Select'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        style={{
                          height: 12,
                          width: 12,
                          resizeMode: 'contain',
                          //   transform: [{rotate: '270deg'}],
                        }}
                        source={images.SIGNUP.DOWN_ARROW}
                      />
                    );
                  }}
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
                <Text style={[styles.input_heading, globalStyles.mt_30]}>
                  {strings.goalweightc}
                </Text>
                <Text style={styles.goalval}>
                  {strings.lbs}
                  <Text style={styles.goalvalwhite}>{strings.lbss}</Text>
                </Text>
                <Text style={[styles.input_heading, globalStyles.mt_30]}>
                  {strings.Goalchange}
                </Text>
                <Text style={styles.goalval}>
                  {`-3`} <Text style={styles.goalvalwhite}>{strings.lbss}</Text>
                </Text>
                <Text style={[styles.input_heading, globalStyles.mt_30]}>
                  {strings.goaltissue}
                </Text>
                <Text style={styles.goalval}>
                  {`-9`} <Text style={styles.goalvalwhite}>{strings.lbss}</Text>
                </Text>
                <Text style={[styles.input_heading, globalStyles.mt_30]}>
                  {strings.golafat}
                </Text>
                <Text style={styles.goalval}>
                  {`21`} <Text style={styles.goalvalwhite}>{strings.lbss}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt_30,
                ]}>
                <Text style={globalStyles.btn_heading}>NEXT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  const Second = () => {
    return (
      <ScrollView
        style={{backgroundColor: colors.primary}}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <View style={[styles.flex_2]}>
            <View
              style={{
                width: SCREEN_WIDTH,
                height: 0,
                borderTopColor: colors.secondary,
                borderTopWidth: SCREEN_HEIGHT / 14,
                borderRightWidth: SCREEN_WIDTH + 50,
                borderRightColor: 'transparent',
              }}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  marginTop: Utility.getInstance().heightToDp(-15),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={backPress}>
                  <Image
                    style={globalStyles.backimgregister}
                    source={images.SIGNUP.BACK}></Image>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                alignContent: 'center',
                backgroundColor: 'transparent',
              }}>
              <ImageBackground
                source={images.APP.APPLOGO}
                resizeMode="contain"
                style={{
                  height: 80,
                  width: '90%',
                  marginTop: Utility.getInstance().heightToDp(10),
                  marginLeft: Utility.getInstance().widthToDp(8),
                  backgroundColor: 'transparent',
                }}></ImageBackground>
            </View>
          </View>
          <View style={styles.flex_8}>
            <View
              style={[
                globalStyles.center,
                globalStyles.padding_20_hor,
                globalStyles.mt_20,
              ]}>
              <Text style={styles.wecanhelp}>{strings.wehelp}</Text>
              <Text style={styles.wecanhelp}>{strings.yourreach}</Text>
              <Text style={styles.wecanhelp}>{strings.goal}</Text>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  globalStyles.textAlignCenter,
                ]}>
                {strings.schedule}
              </Text>
              <TouchableOpacity
                //onPress={() => setWillInflate(true)}
                onPress={() =>
                  navigation.navigate('Chat', {
                    message: strings.automaticMessage,
                  })
                }
                style={[
                  globalStyles.button_primary,
                  globalStyles.center,
                  globalStyles.mt_30,
                ]}>
                <Text
                  style={[
                    globalStyles.btn_heading,
                    globalStyles.green_heading,
                  ]}>
                  {strings.chat}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSkipPress}
                style={[
                  globalStyles.button_secondary,
                  globalStyles.center,
                  globalStyles.button,
                  globalStyles.mt20Per,
                ]}>
                <Text style={[globalStyles.btn_heading_black]}>
                  {strings.skipfor}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  return (
    <>
      {isVisible ? First() : Second()}
      {Modal()}
    </>
  );
};
export default Goal;
