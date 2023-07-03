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
  Dimensions,
} from 'react-native';
import moment from 'moment';

const {width, height} = Dimensions.get('window');
import DialogView from '../../component/dialog';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../MyGoal/style';
import images from '../../assets/images';
import Utility from '../../utility/Utility';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import Loader from '../../component/loader';
import colors from '../../constants/colorCodes';
import {progressDataRequest} from '../../redux/action/ProgressReportAction';
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app';
import Button from '../../component/smallButton';
import {weekelyListRequest} from '../../redux/action/WeekelyDataAction';
import ImagePicker from 'react-native-image-crop-picker';
import dummyContent from '../../constants/dummyContent';
import {LocaleConfig, Calendar, Arrow} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
var userId = null;
var localUri = null;
//var date = null;
var selectedIndex = 0;

const ProgressPhotos = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const userInformationReducer = useSelector(
    state => state.other.userProfileInfoReducer.userData,
  );
  const weekelyListReducer = useSelector(
    state => state.other.weekelyListReducer.userData,
  );
  const [weekValue, setWeek] = useState(
    weekelyListReducer && weekelyListReducer[0].week,
  );
  const [photoAddedModalInflate, setPhotoAddedModalInflate] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [compareModalInflate, setCompareModalInflate] = useState(false);
  const [weekGettinChange, setWeekGettinChange] = useState(true);
  const [isOpenWeekOneDatePicker, setOpenWeekOneDatePicker] = useState(false);
  const [isOpenWeekTwoDatePicker, setOpenWeekTwoDatePicker] = useState(false);
  const [progress, setProgress] = useState(dummyContent.progress);
  const [date, setDate] = useState(null);
  const [selectedWeekOneDate, setSelectedWeekOneDate] = useState('');
  const [selectedWeekTwoDate, setSelectedWeekTwoDate] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      if (userData) {
        userId = userData.id;
      }
      getWeekelyRangeList();
    }, []),
  );
  useEffect(() => {}, []);

  const getWeekelyRangeList = () => {
    setLoading(true);
    let payload = {};
    dispatch(weekelyListRequest(payload, onSS, onFF));
  };

  const onSS = resolve => {
    const {data} = resolve;
    // date = data[0].week_start;
    setDate(data[0].week_start);
    setWeek(data[0].week);
    setLoading(false);
    // getProgressInfo();
  };
  useEffect(() => {
    if (date) {
      setTimeout(() => {
        getProgressInfo();
      }, 10);
    }
  }, [date]);

  const onFF = reject => {
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };
  const backPress = () => {
    navigation.goBack();
  };
  const saveProgressInfo = async () => {
    setLoading(true);
    let payload = {
      uid: userId,
      date: date,
      front: progress[0].image,
      side: progress[1].image,
      back: progress[2].image,
    };
    console.log('saveProgressInfo.payload==>', payload);
    dispatch(
      progressDataRequest(
        payload,
        onSaveProgressInfoSucess,
        onSaveProgressInfoFailure,
      ),
    );
  };
  const onSaveProgressInfoSucess = async resolve => {
    const {
      data: {front, back, side},
    } = resolve;
    progress[0].image = front;
    progress[1].image = side;
    progress[2].image = back;

    console.log('saveProgressInfo.resolve==', resolve);
    setLoading(false);
    setProgress(progress);
    setPhotoAddedModalInflate(true);
  };
  const onSaveProgressInfoFailure = async reject => {
    console.log('reject==', reject);
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };
  const getProgressInfo = () => {
    setLoading(true);
    let payload = {
      uid: userId,
      date: date,
    };
    console.log('getprogressinfo.payload==>', payload);
    dispatch(
      progressDataRequest(payload, onProgressInfoSucess, onProgressInfoFailure),
    );
  };
  const onProgressInfoSucess = async resolve => {
    const {
      data: {front, back, side},
    } = resolve;
    progress[0].image = front;
    progress[1].image = side;
    progress[2].image = back;

    console.log('getprogressinfo.resolve==', resolve);
    setLoading(false);
    //setProgress(...progress);
  };
  const onProgressInfoFailure = async reject => {
    console.log('reject==', reject);
    setLoading(false);
    Utility.getInstance().inflateToast(reject);
  };

  const chooseMode = () => {
    Alert.alert(
      'Selection',
      'Choose From where you want to send Pictures',
      [
        {
          text: 'CANCEL',
          style: 'destructive',
          onPress: () => console.log('cancel'),
        },
        {
          text: 'GALLERY',
          onPress: () => onPressChooseImageToCapture(`GALLERY`),
          style: 'default',
        },
        {
          text: 'CAMERA',
          style: 'default',
          onPress: () => onPressChooseImageToCapture(`CAMERA`),
        },
      ],
      {cancelable: true},
    );
  };
  const onPressChooseImageToCapture = TYPE => {
    if (TYPE == `CAMERA`) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
      }).then(image => {
        generateValidImage(image);
      });
    } else if (TYPE == `GALLERY`) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
      }).then(image => {
        generateValidImage(image);
      });
    }
  };
  const generateValidImage = data => {
    localUri = data.path;
    filename = localUri.split('/').pop();
    let fileType = data.mime;
    var newData = {
      uri: localUri,
      name: filename,
      type: fileType,
    };

    //setAvatarSource(newData);
    uploadFileToFirebaseStorage(localUri, filename);
  };
  const uploadFileToFirebaseStorage = (path, imageName) => {
    setLoading(true);
    let reference = storage().ref(imageName);
    let task = reference.putFile(path);
    task
      .then(() => {
        console.log(`${imageName} has been successfully uploaded.`);
        let imageRef = firebase.storage().ref('/' + imageName);
        imageRef
          .getDownloadURL()
          .then(url => {
            console.log(`${imageName} has been downloaded uploaded.`, url);
            progress[selectedIndex].image = url;
            console.log('progress.array=>', progress);
            setProgress(progress);
            setLoading(false);
          })
          .catch(e => {
            setLoading(false);
            console.log('getting downloadURL of image error => ', e);
          });
      })
      .catch(e => {
        setLoading(false);
        console.log('uploading image error => ', e);
      });
  };
  var onWeekChangePress = (week, week_start) => {
    setWeek(week);
    getProgressInfo();
    // date = week_start;
    setDate(week_start);
    setWeekGettinChange(true);
    setProgress(dummyContent.progress);
  };
  const isWeeksValid = () => {
    console.log('isWeekEquals=>', selectedWeekOneDate === selectedWeekTwoDate);
    var message = '';
    if (!selectedWeekOneDate) {
      message = 'Please select Week One';
    } else if (!selectedWeekTwoDate) {
      message = 'Please select Week Two';
    } else if (selectedWeekOneDate === selectedWeekTwoDate) {
      message =
        "You can't select same weeks to compare please select different week.";
    }

    if (message) {
      Utility.getInstance().inflateToast(message);
      return false;
    } else return true;
  };
  var onComparePress = () => {
    if (isWeeksValid()) {
      setCompareModalInflate(false);
      navigation.navigate('ProgressComparison', {
        weekOneStartDate:
          Utility.getInstance().splitStartDate(selectedWeekOneDate),
        weekSecondStartDate:
          Utility.getInstance().splitStartDate(selectedWeekTwoDate),
      });
    }
  };
  const PhotoAddedModal = () => {
    return (
      <DialogView
        onTouchOutside={() => setPhotoAddedModalInflate(false)}
        willInflate={photoAddedModalInflate}
        onBackPress={() => setPhotoAddedModalInflate(false)}
        children={PhotoAddedModalContent()}></DialogView>
    );
  };
  const PhotoAddedModalContent = () => {
    return (
      <View>
        <View
          style={{
            // height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => setPhotoAddedModalInflate(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontFamily: 'Poppins-SemiBold',
            color: colors.black,
            fontSize: 20,
            marginTop: 0,
          }}>
          {`Progress
Photo Added`}
        </Text>
        <View
          style={{
            width: '100%',
            marginTop: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.abs}>{strings.successfullyAdded}</Text>

          <TouchableOpacity
            onPress={() => [
              setPhotoAddedModalInflate(false),
              setWeekGettinChange(true),
            ]}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>
              {strings.continue}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderProgress = item => {
    return (
      <View
        key={progress || date}
        style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
        <Text style={[styles.why_heading, {alignSelf: 'center'}]}>
          {item.item.type}
        </Text>
        <View
          key={progress || date}
          style={{
            height: 220,
            width: 250,
            backgroundColor: colors.white,
            borderRadius: 5,
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {item?.item?.image ? (
            <ImageBackground
              key={progress || date}
              style={{height: 200, width: 220}}
              source={{uri: item.item.image}}
              resizeMode="cover">
              <Pressable
                onPress={() => [
                  (selectedIndex = item.index),
                  chooseMode(item),
                ]}>
                <Image
                  style={{
                    height: 24,
                    width: 24,
                    alignSelf: 'flex-end',
                    margin: 10,
                  }}
                  source={images.APP.DRAW}></Image>
              </Pressable>
            </ImageBackground>
          ) : (
            <Pressable
              onPress={() => [(selectedIndex = item.index), chooseMode(item)]}>
              <Text>{item.item.heading}</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };
  const WeekView = () => {
    return (
      <FlatList
        horizontal
        style={{marginTop: 15}}
        renderItem={renderWeekItem}
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        data={weekelyListReducer && weekelyListReducer}></FlatList>
    );
  };
  const renderWeekItem = item => {
    const {week, week_end, week_start} = item.item;
    return (
      <Pressable
        onPress={() => [onWeekChangePress(week, week_start)]}
        style={[
          styles.dateView_,
          {
            borderWidth: weekValue == week ? 2 : 0.3,
          },
        ]}>
        <Text
          style={[
            styles.headingT,
            {color: weekValue == week ? colors.white : colors.gray},
          ]}>
          {week}
        </Text>
      </Pressable>
    );
  };
  const CompareModal = () => {
    return (
      <DialogView
        onTouchOutside={() => setCompareModalInflate(false)}
        willInflate={compareModalInflate}
        onBackPress={() => setCompareModalInflate(false)}
        children={CompareModalContent()}></DialogView>
    );
  };
  const CompareModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => setCompareModalInflate(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text
            style={{
              // alignSelf: 'center',
              // textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 20,
              marginLeft: 10,
            }}>
            Select Weeks
          </Text>
          <View
            style={{
              width: 1,
              marginHorizontal: 20,
            }}></View>
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.abs}>{strings.compareDesc}</Text>
          <View
            style={[
              styles.addfoodcn,
              {
                justifyContent: 'space-between',
                marginTop: 10,
              },
            ]}>
            <View
              style={{
                backgroundColor: 'transparent',
                paddingHorizontal: 10,
                marginTop: 20,
              }}>
              <Text style={[styles.select]}>{'Select week 1'}</Text>
              <Pressable
                onPress={() => setOpenWeekOneDatePicker(true)}
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 34,
                  backgroundColor: colors.gray,
                  paddingHorizontal: 10,
                }}>
                <Image
                  style={{height: 18, width: 18, resizeMode: 'contain'}}
                  source={images.APP.CALENDARB}></Image>
                <Text style={{marginLeft: 10}}>{selectedWeekOneDate}</Text>
                <Image
                  style={{
                    height: 18,
                    width: 18,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={images.SIGNUP.DOWN_ARROW}></Image>
              </Pressable>
            </View>
            <View
              style={{
                backgroundColor: 'transparent',
                paddingHorizontal: 10,
                marginTop: 20,
                width: width / 1.4,
              }}>
              <Text style={[styles.select]}>{'Select week 2'}</Text>
              <Pressable
                onPress={() => setOpenWeekTwoDatePicker(true)}
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 34,
                  backgroundColor: colors.gray,
                  paddingHorizontal: 10,
                }}>
                <Image
                  style={{height: 18, width: 18, resizeMode: 'contain'}}
                  source={images.APP.CALENDARB}></Image>
                <Text style={{marginLeft: 10}}>{selectedWeekTwoDate}</Text>
                <Image
                  style={{
                    height: 18,
                    width: 18,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={images.SIGNUP.DOWN_ARROW}></Image>
              </Pressable>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => [onComparePress()]}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const DefautView = () => {
    return (
      <>
        <View style={[styles.flex, {backgroundColor: colors.primary}]}>
          <Header onBackPress={() => backPress()} />
          <Loader fullScrreen isLoading={isLoading} />

          {CompareModal()}
          {PhotoAddedModal()}
          <DatePicker
            modal
            mode="date"
            open={isOpenWeekOneDatePicker}
            date={new Date()}
            onConfirm={date => {
              setOpenWeekOneDatePicker(false);
              setSelectedWeekOneDate(
                Utility.getInstance().GetNextDaysToStartDate(date),
              );
            }}
            androidVariant="iosClone"
            textColor={colors.primary}
            placeholder="select date"
            format="DD-MM-YYYY"
            // minDate="01-01-2016"
            // maxDate="01-01-2019"
            onCancel={() => {
              setOpenWeekOneDatePicker(false);
            }}
            theme="auto"
          />
          <DatePicker
            modal
            mode="date"
            open={isOpenWeekTwoDatePicker}
            date={new Date()}
            onConfirm={date => {
              setOpenWeekTwoDatePicker(false);
              setSelectedWeekTwoDate(
                Utility.getInstance().GetNextDaysToStartDate(date),
              );
            }}
            androidVariant="iosClone"
            textColor={colors.primary}
            placeholder="select date"
            format="DD-MM-YYYY"
            // minDate="01-01-2016"
            // maxDate="01-01-2019"
            onCancel={() => {
              setOpenWeekTwoDatePicker(false);
            }}
            theme="auto"
          />
          <ScrollView contentContainerStyle={{paddingVertical: 0}}>
            <Text style={[styles.why_heading, styles.font30, {margin: 15}]}>
              {'Progress Photos'}
            </Text>
            {WeekView()}
            <View style={[globalStyles.center, globalStyles.padding_40]}>
              <Pressable
                onPress={() => setCompareModalInflate(true)}
                style={{
                  backgroundColor: colors.secondary,
                  height: 34,
                  width: 120,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: 20,
                  textAlign: 'center',
                  textDecorationColor: colors.secondary,
                  color: colors.black,
                  // textDecorationLine: 'underline',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 13,
                  letterSpacing: 0.7,
                }}>
                <Text
                  ///onPress={() => navigation.navigate('ProgressReport')}
                  style={styles.bucketSize_green}>
                  {'COMPARE'}
                </Text>
              </Pressable>

              <Text
                style={{
                  marginTop: 22,
                  color: colors.white,
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}
                onPress={() => navigation.navigate('ProgressReport')}>
                {'Help'}
              </Text>
              <FlatList
                extraData={progress || date}
                key={progress || date}
                renderItem={renderProgress}
                data={progress}></FlatList>
              <Button
                marginTop={40}
                onClick={() => saveProgressInfo()}
                heading="SAVE"
                color={colors.secondary}></Button>
            </View>
          </ScrollView>
        </View>
      </>
    );
  };

  return DefautView();
};
export default ProgressPhotos;
