import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Switch,
  Animated,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Header from '../../component/headerWithBackControl';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../AddBloodWork/style';
import moment from 'moment';
import SliderComponent from '../../component/sliderComponent';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';

import Loader from '../../component/loader';
import {
  updateUserInformationRequest,
  userProfileInfoRequest,
} from '../../redux/action/UserProfileInfo';
import Utility from '../../utility/Utility';
var userId = null;
var ldl = 'ldl';
var viewWidth = 0;
var date = null;
var today = new Date();
const AddBloodWork = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [chValue, setChValue] = useState(0);
  const [irValue, setIrValue] = useState(0);
  const [vitValue, setVitValue] = useState(0);
  const [translateX, setX] = useState(new Animated.Value(0));
  const [translateXIron, setXIron] = useState(new Animated.Value(0));
  const [translateXVitamin, setXVitamin] = useState(new Animated.Value(0));
  const userData = useSelector(state => state.other.loginReducer.userData);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    getProfileInformation();
  }, [viewWidth]);

  //user information call
  const getProfileInformation = () => {
    setLoading(true);
    dispatch(userProfileInfoRequest(userId, onSucc, onFail));
  };
  const onSucc = resolve => {
    const {cholesterol, iron, vitamin_d, bloodwork_updated_at} = resolve.data;
    console.log('resolve.data', resolve.data);
    setLoading(false);
    if (viewWidth != 0) {
      setX(parseInt(viewWidth / (200 / cholesterol)));
      setXVitamin(viewWidth / (200 / vitamin_d));
      setChValue(cholesterol);
      setIrValue(iron);
      setVitValue(vitamin_d);
      setXIron(viewWidth / (200 / iron));
      date = bloodwork_updated_at;
    }
  };
  const onFail = reject => {
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };

  const updateBloodDetails = () => {
    let payload = {
      cholesterol: chValue,
      iron: irValue,
      vitamin_d: vitValue,
      uid: userId,
      bloodwork_updated_at: date,
    };
    dispatch(updateUserInformationRequest(payload, onS, onF));
  };
  const onS = async resolve => {
    clearStates();
  };
  const onF = async reject => {};
  const clearStates = () => {
    setTimeout(() => {
      Utility.getInstance().inflateToast('Values has been Updated.');
    }, 100);
  };

  const backPress = () => {
    navigation.goBack();
  };
  const onEnded = () => {
    date = moment(today).format('LLL');
    setTimeout(() => {
      updateBloodDetails();
    }, 100);
  };
  const onPanGestureEventLdl = x => {
    setX(x);
    let data = parseInt(x / (viewWidth / 200));
    setChValue(data);
  };
  const onPanGestureEventIron = x => {
    setXIron(x);
    let data = parseInt(x / (viewWidth / 200));
    setIrValue(data);
  };
  const onPanGestureEventVitamin = x => {
    setXVitamin(x);
    let data = parseInt(x / (viewWidth / 200));
    setVitValue(data);
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <Loader isLoading={isLoading} />
        <ScrollView>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.mybloodwork}
            </Text>
            <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
              {strings.latestblood + ` ` + date}
            </Text>

            <SliderComponent
              onLayoutCall={width => [(viewWidth = width)]}
              translateX={translateX}
              calculatedValue={chValue}
              headingValue={
                userData && strings.high + `(` + userData.cholesterol + `)`
              }
              heading={strings.ldl}
              type={ldl}
              onEnded={() => onEnded()}
              onPanGesture={value =>
                onPanGestureEventLdl(value.absoluteX, value)
              }
            />
            <SliderComponent
              //onLayoutCall={width => [(viewWidth = width)]}
              translateX={translateXIron}
              calculatedValue={irValue}
              headingValue={
                userData && strings.normal + `(` + userData.iron + `)`
              }
              heading={strings.iron}
              type={strings.iron}
              onEnded={() => onEnded()}
              onPanGesture={value => onPanGestureEventIron(value.absoluteX)}
            />
            <SliderComponent
              //onLayoutCall={width => [(viewWidth = width)]}
              calculatedValue={vitValue}
              translateX={translateXVitamin}
              headingValue={
                userData && strings.high + `(` + userData.vitamin_d + `)`
              }
              heading={'Vitamin'}
              type={strings.vitamin}
              onEnded={() => onEnded()}
              onPanGesture={value => onPanGestureEventVitamin(value.absoluteX)}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={[styles.minuscBig, globalStyles.mt_30]}>
              <Image
                style={styles.codeimage}
                source={images.SIGNUP.PLUS}></Image>
            </TouchableOpacity>
            <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
              {strings.addBlood}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  return DefautView();
};
export default AddBloodWork;
{
  /* <PanGestureHandler
  style={{height: 120, margin: 10}}
  onGestureEvent={value => [
    onPanGestureEvent(
      value.nativeEvent.absoluteX,
      value.nativeEvent.absoluteY,
    ),
    //console.error('ValueERROR =>', value.nativeEvent.absoluteX),
  ]}>
  <View
    //onLayout={value => console.log('onLayout=>', value)}
    style={{
      // flex: 1,
      height: 120,
      margin: 10,
      backgroundColor: 'red',
    }}>
    <Animated.View
      style={[
        {height: 120, width: 10, backgroundColor: 'black'},
        {
          transform: [
            {
              translateX: translateX,
            },
            {
              translateY: translateY,
            },
          ],
        },
      ]}
    />
  </View>
</PanGestureHandler> */
}
