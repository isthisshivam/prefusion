import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
  LayoutAnimation,
} from 'react-native';
import ExpandableComponent from '../../component/ExpandableComponent';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import images from '../../assets/images/index';
import ApiConstant from '../../constants/api';
import styles from '../CustomFood/style';
import Loader from '../../component/loader';
import Indicator from '../../component/buttonIndicator';
import Header from '../../component/headerWithBackControl';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import warning from '../../constants/warning';
import Utility from '../../utility/Utility';
import {addCustomFoodRequest} from '../../redux/action/CustomFoodAction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dummyContent from '../../constants/dummyContent';
import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
import {getCommunityPostRequest} from '../../redux/action/CommunitySectionAction';
const CommunityMesageBoard = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const [posts, setPosts] = useState([]);
  const [pinnedPost, setPinnedPost] = useState(null);
  const isLoading = useSelector(
    state => state.other.communitySectionReducer.showLoader,
  );
  useEffect(() => {
    dispatch(
      getCommunityPostRequest(
        {},
        onGetCommunityPostSuccess,
        onGetCommunityPostFailure,
      ),
    );
  }, []);
  const onGetCommunityPostSuccess = async resolve => {
    console.log(JSON.stringify(resolve?.data?.listing));
    setPosts(resolve?.data?.listing);
    setPinnedPost(resolve?.data?.pinnedPost);
    //  setRecentPost(resolve?.data?.recentPost);
  };

  const onGetCommunityPostFailure = async reject => {
    console.log({reject});
  };
  const updateDailyRehabLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const array = [...posts];

    // If single select is enabled
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );

    setPosts(array);
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => navigation.goBack()} />
        <Loader fullScrreen isLoading={isLoading}></Loader>
        <ImagePickerBottomSheet
          openCamera={() => pickORCapture('CAMERA')}
          openFiles={() => pickORCapture('GALLERY')}
          reference={refRBSheet}
        />

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingVertical: 15}}
          enableOnAndroid
          extraHeight={120}>
          <View style={[]}>
            <Text
              style={[
                styles.why_heading,
                styles.font30,
                {paddingHorizontal: 30},
              ]}>
              {`Community
Message Board`}
            </Text>

            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignStart,
                globalStyles.white,
                {paddingHorizontal: 30, marginTop: 20},
              ]}>
              {strings.ccmdesc}
            </Text>
            <View style={styles.center}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NewCommunityPost')}
                style={styles.minuscBig}>
                <Image
                  style={styles.codeimage}
                  source={images.SIGNUP.PLUS}></Image>
              </TouchableOpacity>
              <Text
                style={{
                  marginTop: 8,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 13,
                  color: colors.white,
                  textAlign: 'center',
                }}>
                New Post
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 30,
              }}>
              <Image
                style={globalStyles.applogoheadersmall}
                source={images.FAVORITE.APPLOGO}></Image>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  // styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.green_heading,
                  {marginLeft: 20, marginTop: 10},
                ]}>
                Pinned Post
              </Text>
            </View>

            <View style={{backgroundColor: '#325a35', padding: 15}}>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  // styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.white,
                ]}>
                {pinnedPost?.post}
              </Text>
            </View>
            <FlatList
              data={posts}
              extraData={posts}
              renderItem={item => (
                <ExpandableComponent
                  onSubPostClick={data =>
                    navigation.navigate('CommunityPosts', {data: data})
                  }
                  onHeadinClick={value =>
                    navigation.navigate('CommunityBoardSectionList', {
                      sectionName: value,
                    })
                  }
                  key={item.item.id}
                  onClickFunction={data => {
                    console.log('item==', item);
                    updateDailyRehabLayout(item.index);
                  }}
                  item={item.item}
                  isExpanded={item.item.isExpanded}
                />
              )}></FlatList>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  return DefautView();
};
export default CommunityMesageBoard;
