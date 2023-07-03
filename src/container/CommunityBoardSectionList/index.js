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
import List from '../../component/List';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
import {getCommunityPostBySectionRequest} from '../../redux/action/CommunitySectionAction';
const CommunityBoardSectionList = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const [posts, setPosts] = useState([]);
  const [section, setSection] = useState(null);
  const isLoading = useSelector(
    state => state.other.communitySectionReducer.showLoader,
  );
  useEffect(() => {
    setSection(props?.route?.params?.sectionName);
    dispatch(
      getCommunityPostBySectionRequest(
        {
          section: props?.route?.params?.sectionName,
          page: '1',
          perpage: '40',
        },
        onGetCommunityPostBySectionSuccess,
        onGetCommunityPostBySectionFailure,
      ),
    );
  }, []);
  const onGetCommunityPostBySectionSuccess = async resolve => {
    console.log(JSON.stringify(resolve?.data?.listing));
    setPosts(resolve?.data?.listing);
  };

  const onGetCommunityPostBySectionFailure = async reject => {
    console.log({reject});
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
                styles.font25,
                {paddingHorizontal: 30},
              ]}>
              {`Community
Message Board`}
            </Text>

            <Text
              style={[
                styles.why_heading,
                {paddingHorizontal: 30, color: colors.white, fontSize: 15},
              ]}>
              {section}
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

            <FlatList
              style={{marginTop: 20}}
              data={posts}
              extraData={posts}
              renderItem={item => (
                <List key={item.item.id} item={item.item} />
              )}></FlatList>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  return DefautView();
};
export default CommunityBoardSectionList;
