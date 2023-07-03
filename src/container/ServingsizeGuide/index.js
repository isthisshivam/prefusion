import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../ServingsizeGuide/style';

import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Header from '../../component/headerWithBackControl';

import Utility from '../../utility/Utility';
import api from '../../constants/api';
var x = 0;
var y = 0;
const ServingsizeGuide = () => {
  const navigation = useNavigation();
  const scrollviewRef = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [haveClientCode, setHaveClientCode] = useState(false);

  useEffect(() => {
    getProfileInformation();
  }, []);

  const scrollToElement = (x, y) => {
    scrollviewRef.current.scrollTo({x: x, y: y, animated: true});
  };
  const getProfileInformation = async () => {
    let data = await Utility.getInstance().getStoreData(strings.clientId);
    let c_c = data ? JSON.parse(data) : null;
    if (c_c) {
      setHaveClientCode(true);
    }
  };
  const backPress = () => {
    navigation.goBack();
  };

  const onApprovedPress = () => {
    navigation.navigate('ApprovedFoods');
  };
  const onHandGuidePress = () => {
    navigation.navigate('HandGuide');
  };
  const onChatPress = () => {
    navigation.navigate('Chat');
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <ScrollView ref={scrollviewRef} showsVerticalScrollIndicator={false}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font24]}>
              {strings.servingsizeguide}
            </Text>
            <Text style={[styles.gettingstarted, styles.whydesc]}>
              {strings.gettingstart}
            </Text>

            <Text style={{color: colors.secondary, marginTop: 20}}>
              1.
              {/* <Text style={[styles.gettingstarted, styles.whydesc]}>
                {haveClientCode
                  ? strings.sevingdesc1
                  : strings.servingDesc_non_user}
              </Text> */}
              <Text style={[styles.gettingstarted, styles.whydesc]}>
                {strings.servingDesc_non_user}
                <Text style={{color: colors.secondary, marginTop: 20}}>
                  {` HomePage.`}
                </Text>
              </Text>
            </Text>
            <Text style={{color: colors.secondary, marginTop: 20}}>
              2.
              <Text style={[styles.gettingstarted, styles.whydesc]}>
                {strings.servingsizeguide2}
              </Text>
            </Text>
            <Text style={{color: colors.secondary, marginTop: 20}}>
              3.
              <Text style={[styles.gettingstarted, styles.whydesc]}>
                {strings.servingsizeguide3}
                <Text style={{color: colors.secondary, marginTop: 20}}>
                  {` Help Guide.`}
                </Text>
              </Text>
              {/* <Text
                onPress={() =>
                  navigation.navigate('Help', {
                    LINK: api.HELP_GUIDE,
                  })
                }
                style={{
                  fontWeight: 'bold',
                  textDecorationLine: 1,
                }}>
                {` Help Guide `}
              </Text> */}
            </Text>

            <View
              style={[
                globalStyles.center,
                globalStyles.mt_30,
                globalStyles.padding_30_hor,
              ]}>
              {/* <Text
                onPress={onHandGuidePress}
                style={[
                  styles.input_heading,
                  globalStyles.mt_30,
                  globalStyles.font20,
                  globalStyles.underline_green,
                ]}>
                {strings.handandVguide}
              </Text>
              <Text
                onPress={onApprovedPress}
                style={[
                  styles.input_heading,
                  globalStyles.mt_30,
                  globalStyles.font20,
                  globalStyles.underline_white,
                ]}>
                {strings.approvedlist}
              </Text> */}
              <View style={styles.seperator}></View>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  globalStyles.textAlignCenter,
                  globalStyles.mt_30,
                  globalStyles.italicFont,
                ]}>
                {strings.stillneed}
              </Text>
            </View>
          </View>
        </ScrollView>
        {/* <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#fff',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            alignSelf: 'flex-end',
            elevation: 8,
            margin: 10,
          }}
          onPress={() => [
            setForceUpdate(!forceUpdate),
            x == 0 ? (x = 1200) : (x = 0),
            y == 0 ? (y = 1200) : (y = 0),
            scrollToElement(x, y),
          ]}>
          <Image
            style={{height: 20, width: 20, resizeMode: 'contain'}}
            source={
              x == 0 ? images.APP.arrow_down : images.APP.arrow_up
            }></Image>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={onChatPress}
          style={[
            globalStyles.button_secondary_extra_width,
            globalStyles.center,
            globalStyles.button,
            globalStyles.font17,
            {width: 300, alignSelf: 'center', marginBottom: 15},
          ]}>
          <Text style={globalStyles.btn_heading_black_small}>
            CHAT WITH PREFUSION HEALTH
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return DefautView();
};
export default ServingsizeGuide;
