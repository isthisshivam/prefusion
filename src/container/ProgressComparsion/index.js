import React, {useState, useEffect} from 'react';
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
  TextInput,
  Alert,
} from 'react-native';
import moment from 'moment';
import DialogView from '../../component/dialog';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../ProgressComparsion/style';
import images from '../../assets/images';
import Utility from '../../utility/Utility';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Loader from '../../component/loader';
import colors from '../../constants/colorCodes';
import {
  progressDataRequest,
  compareProgressPhotosRequest,
} from '../../redux/action/ProgressReportAction';
import ImageView from 'react-native-image-viewing';
//const selectedImage = [];
const ProgressComparison = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const {weekOneStartDate, weekSecondStartDate} = props.route.params;
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  useEffect(() => {
    setLoading(true);
    dispatch(
      compareProgressPhotosRequest(
        {
          uid: userData?.id,
          weekOneDate: weekOneStartDate,
          weekTwoDate: weekSecondStartDate,
        },
        onCompareProgressPhotosSuccess,
        onCompareProgressPhotosFailure,
      ),
    );
  }, [props]);
  const backPress = () => {
    navigation.goBack();
  };

  const onCompareProgressPhotosSuccess = async resolve => {
    setLoading(false);
    console.log({resolve});
    setProgress(resolve?.data);
  };
  const onCompareProgressPhotosFailure = async reject => {
    console.log({reject});
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };
  useEffect(() => {
    if (selectedImage.length > 0) {
      console.log({selectedImage});
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedImage]);

  const NoPhotosUploadedView = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text
          style={{
            color: colors.green,
          }}>
          No photos uploaded!
        </Text>
      </View>
    );
  };
  const renderProgress = ({item}) => {
    const {
      type,
      img1,
      date1: {week_end, week_start},
      date2,
      img2,
    } = item;
    return (
      <View style={{marginTop: 10}}>
        <Text style={[styles.why_heading]}>{type}</Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            margin: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '49%',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.gray,
              }}>
              {week_start}
            </Text>
            <Text
              style={{
                marginLeft: 10,
                color: colors.gray,
                textAlign: 'center',
              }}>{` - `}</Text>
            <Text
              style={{
                textAlign: 'center',
                color: colors.gray,
              }}>
              {week_end}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '49%',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.gray,
              }}>
              {date2?.week_start}
            </Text>
            <Text
              style={{
                color: colors.gray,
                textAlign: 'center',
              }}>{` - `}</Text>
            <Text
              style={{
                textAlign: 'center',
                color: colors.gray,
              }}>
              {date2?.week_end}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 220,
              flex: 0.49,
              // width: '49%',
              backgroundColor: colors.white,
              borderRadius: 5,
            }}>
            {img1 ? (
              <Pressable
                onPress={() => [
                  //  selectedImage.push({uri: img2}),
                  setSelectedImage([{uri: img1}]),
                  //setIsVisible(true),
                ]}>
                <ImageBackground
                  borderRadius={5}
                  style={{
                    height: '100%',
                    width: '100%',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                  source={{uri: img1}}
                  resizeMode="cover"></ImageBackground>
              </Pressable>
            ) : (
              <NoPhotosUploadedView />
            )}
          </View>
          <View
            style={{
              height: 220,
              //width: '49%',
              flex: 0.49,
              borderRadius: 5,
              justifyContent: 'center',
              backgroundColor: colors.white,
              //  alignItems: 'center',
            }}>
            {img2 ? (
              <Pressable
                onPress={() => [
                  // selectedImage.push({uri: img2}),
                  setSelectedImage([{uri: img2}]),
                  // setSelectedImage(selectedImage),
                  //setIsVisible(true),
                ]}>
                <ImageBackground
                  borderRadius={5}
                  style={{
                    height: '100%',
                    width: '100%',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                  source={{uri: img2}}
                  resizeMode="cover"></ImageBackground>
              </Pressable>
            ) : (
              <NoPhotosUploadedView />
            )}
          </View>
        </View>
      </View>
    );
  };

  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />
          <Loader isLoading={isLoading} />
          <ImageView
            images={selectedImage}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => [setSelectedImage([]), setIsVisible(false)]}
          />
          <ScrollView contentContainerStyle={{paddingVertical: 0}}>
            <Text
              style={[
                styles.why_heading,
                styles.font30,
                {marginHorizontal: 15},
              ]}>
              {'Progress Comparison'}
            </Text>
            <Text
              style={{
                marginHorizontal: 35,

                color: colors.white,
                alignSelf: 'flex-start',
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
              }}>
              {strings.tapaphoto}
            </Text>

            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <FlatList
                extraData={progress}
                key={progress}
                renderItem={renderProgress}
                data={progress}></FlatList>
            </View>
          </ScrollView>
        </View>
      </>
    );
  };

  return DefautView();
};
export default ProgressComparison;
