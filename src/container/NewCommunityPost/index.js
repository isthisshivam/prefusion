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
import styles from '../NewCommunityPost/style';
import Indicator from '../../component/buttonIndicator';
import Header from '../../component/headerWithBackControl';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Loader from '../../component/loader';
import {addCommunityPostRequest} from '../../redux/action/CommunitySectionAction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dummyContent from '../../constants/dummyContent';
import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
import {isLandscape} from 'react-native-device-info';
var userId = null;
const NewCommunityPost = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const [section, setSection] = useState('');
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.communitySectionReducer.showLoader,
  );

  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
  }, []);

  const onCreatePost = async () => {
    console.log({
      post: body,
      title: title,
      created_by: userId,
      section: section,
    });
    dispatch(
      addCommunityPostRequest(
        {
          post: body,
          title: title,
          created_by: userId,
          section: section,
        },
        onCreatePostSuccess,
        onCreatePostFailure,
      ),
    );
  };
  const onCreatePostSuccess = async resolve => {
    console.log({resolve});
    navigation.goBack();
  };
  const onCreatePostFailure = async resolve => {
    console.log({resolve});
  };
  const backPress = () => {
    navigation.goBack();
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
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
                {paddingHorizontal: 30, fontSize: 22},
              ]}>
              New Community Post
            </Text>
            {/* <View style={styles.center}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CommunityPosts')}
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
            </View> */}
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignStart,
                globalStyles.white,
                {paddingHorizontal: 30, marginTop: 0},
              ]}>
              {strings.postselect}
            </Text>
            <View style={{alignItems: 'center', paddingHorizontal: 38}}>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.green_heading,
                ]}>
                Select Section
              </Text>
              <SelectDropdown
                data={[
                  {
                    value: '2',
                    title: 'Fitness Tips',
                  },
                  {
                    value: '3',
                    title: 'Nutrition',
                  },
                  {
                    value: '4',
                    title: 'Meal Prep',
                  },
                ]}
                onSelect={(selectedItem, index) => {
                  console.log(
                    'updateServingsThroughMeasurment.selectedItem===',
                    JSON.stringify(selectedItem),
                  );
                  setSection(selectedItem?.title);
                }}
                defaultButtonText={section ? section : 'Choose Section'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem?.title;
                }}
                rowTextForSelection={(item, index) => {
                  return item?.title;
                }}
                renderDropdownIcon={() => {
                  return (
                    <Image
                      style={{
                        height: 18,
                        width: 18,
                        resizeMode: 'contain',
                      }}
                      source={images.SIGNUP.DOWN_ARROW}
                    />
                  );
                }}
                buttonStyle={styles.dropdownSmall4BtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown4DropdownStyle}
                rowStyle={styles.dropdown4RowStyle}
                rowTextStyle={styles.dropdown4RowTxtStyle}
              />
            </View>
            <View style={{alignItems: 'center', paddingHorizontal: 38}}>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.green_heading,
                  globalStyles.mt_30,
                ]}>
                Create Title
              </Text>
              <TextInput
                onChangeText={setTitle}
                value={title}
                style={[
                  styles.dropdownSmall4BtnStyle,
                  {paddingHorizontal: 18},
                ]}></TextInput>
              {/* <SelectDropdown
                data={[{name: 'Fitness Tips'}]}
                onSelect={(selectedItem, index) => {
                  console.log(
                    'updateServingsThroughMeasurment.selectedItem===',
                    JSON.stringify(selectedItem),
                  );
                  setSection(selectedItem?.name);
                }}
                defaultButtonText={section ? section : 'Choose Section'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem?.name;
                }}
                rowTextForSelection={(item, index) => {
                  return item?.name;
                }}
                renderDropdownIcon={() => {
                  return (
                    <Image
                      style={{
                        height: 18,
                        width: 18,
                        resizeMode: 'contain',
                      }}
                      source={images.SIGNUP.DOWN_ARROW}
                    />
                  );
                }}
                buttonStyle={styles.dropdownSmall4BtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown4DropdownStyle}
                rowStyle={styles.dropdown4RowStyle}
                rowTextStyle={styles.dropdown4RowTxtStyle}
              /> */}
            </View>
            <View style={{alignItems: 'center', paddingHorizontal: 38}}>
              <Text
                style={[
                  styles.forgot_pass_heading,
                  styles.whydesc,
                  globalStyles.textAlignStart,
                  globalStyles.green_heading,
                  globalStyles.mt_30,
                ]}>
                Body
              </Text>
              <TextInput
                multiline
                onChangeText={setBody}
                value={body}
                style={{
                  height: 250,
                  backgroundColor: colors.white,
                  color: colors.black,
                  width: '100%',
                  borderRadius: 5,
                  paddingHorizontal: 20,
                  fontFamily: 'Poppins-Regular',
                }}></TextInput>
            </View>
            <View style={styles.center}>
              <TouchableOpacity onPress={onCreatePost} style={styles.minuscBig}>
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
                Create Post
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  return DefautView();
};
export default NewCommunityPost;
