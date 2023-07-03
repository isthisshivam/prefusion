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
import {sortBy, debounce} from 'lodash';
import ExpandableComponent from '../../component/ExpandableComponent';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import images from '../../assets/images/index';
import ApiConstant from '../../constants/api';
import styles from '../CustomFood/style';
import Indicator from '../../component/buttonIndicator';
import Header from '../../component/headerWithBackControl';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import warning from '../../constants/warning';
import Utility from '../../utility/Utility';
import {
  addLikeDislikeCommunityPostRequest,
  getRepliesCommunityPostRequest,
} from '../../redux/action/CommunitySectionAction';
import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
import moment from 'moment';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import CommPostrepliesLane from '../../component/CommunityPostRepliesLane';
const CommunityPosts = props => {
  const {
    data: {
      category_name,
      item: {id},
    },
  } = props.route.params;

  const {navigate, goBack} = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  var backPress = () => goBack();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const [replies, setReplies] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const [currentUserLikeUser, setcurrentUserLikeUser] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(
        getRepliesCommunityPostRequest(
          {id: id, uid: userData?.id},
          ongetRepliesCommunityPostSuccess,
          ongetRepliesCommunityPostFailure,
        ),
      );
    }, [props]),
  );
  const ongetRepliesCommunityPostSuccess = async resolve => {
    setReplies(resolve?.data?.replies);
    setPostDetails(resolve?.data);
    setLikes(resolve?.data?.likes);
    setcurrentUserLikeUser(resolve?.data.currentUserLikeUser);
    console.log({resolve});
  };
  const ongetRepliesCommunityPostFailure = async reject => {
    console.log({reject});
  };

  const onCommentAddLikeDislikePress = debounce(lb => {
    lb.currentUserLikeUser = !lb.currentUserLikeUser;
    if (lb.currentUserLikeUser) {
      lb.likes = lb.likes + 1;
    } else {
      lb.likes = lb.likes - 1;
    }
    setIsUpdating(isUpdating => !isUpdating);

    let payload = {
      uid: userData?.id,
      postId: id,
      isActive: lb.currentUserLikeUser ? 1 : 0,
      commentId: lb?.id,
    };
    return dispatch(
      addLikeDislikeCommunityPostRequest(
        payload,
        onAddLikeDislikePressSuccess,
        onAddLikeDislikePressFailure,
      ),
    );
  }, 350);
  const onPostAddLikeDislikePress = async () => {
    setTimeout(() => {
      postDetails.currentUserLikeUser = !postDetails.currentUserLikeUser;
      if (postDetails.currentUserLikeUser) {
        setLikes(likes => likes + 1);
      } else {
        setLikes(likes => likes - 1);
      }
      dispatch(
        addLikeDislikeCommunityPostRequest(
          {
            uid: userData?.id,
            postId: postDetails.id,
            isActive: postDetails.currentUserLikeUser ? 1 : 0,
          },
          onAddLikeDislikePressSuccess,
          onAddLikeDislikePressFailure,
        ),
      );
    }, 500);
  };
  const onAddLikeDislikePressSuccess = async resolve => {
    console.log({resolve});
  };
  const onAddLikeDislikePressFailure = async reject => {
    console.log({reject});
  };
  const Listheader = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              paddingVertical: 5,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={
                postDetails ? {uri: postDetails?.image} : images.FAVORITE.USER
              }
              style={{
                height: 30,
                width: 30,
                resizeMode: 'cover',
                borderRadius: 15,
              }}></Image>
            <Text style={[styles.headingtext, {marginLeft: 10}]}>
              {postDetails && postDetails?.name}
            </Text>
          </View>
          <Text style={[styles.headingbold]}>
            {/* {postDetails &&
              moment(new Date(postDetails?.created_at))
                .format('DD/MM/YYYY')
                .fromNow()} */}
            {postDetails &&
              moment(
                postDetails?.created_at,
                'ddd MMM DD YYYY HH:mm:ss GMT Z',
              ).fromNow()}
          </Text>
        </View>
        <View style={{height: 0.3, backgroundColor: colors.secondary}}></View>
        <View style={{marginHorizontal: 20, marginVertical: 12}}>
          <Text style={styles.headingboldbig}>
            {postDetails && postDetails?.title}
          </Text>
          <Text
            style={[
              styles.headingtext,
              {
                lineHeight: 24,
                fontSize: 13,

                marginVertical: 5,
              },
            ]}>
            {postDetails && postDetails?.post}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'red',
            paddingHorizontal: 20,
            marginTop: -20,
          }}>
          <Pressable
            onPress={() =>
              navigate('ReplyOnComment', {
                item: postDetails,
                category_name: category_name,
                isPost: true,
              })
            }
            style={{
              marginVertical: 20,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={images.FAVORITE.REPLY}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}></Image>
            <Text style={[styles.headingtext, {marginLeft: 10}]}>Reply</Text>
          </Pressable>
          <Pressable
            onPress={() => onPostAddLikeDislikePress()}
            style={{
              // paddingVertical: 20,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={
                currentUserLikeUser
                  ? images.FAVORITE.LIKE
                  : images.FAVORITE.LIKE
              }
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}></Image>
            <View>
              <Text
                key={currentUserLikeUser}
                style={[
                  styles.headingtext,
                  {marginLeft: 10, marginTop: -5, color: colors.secondary},
                ]}>
                {likes}
              </Text>
              <Text
                style={[styles.headingtext, {marginLeft: 10, marginTop: 0}]}>
                Like
              </Text>
            </View>
          </Pressable>
        </View>
        <View style={{height: 2, backgroundColor: colors.secondary}}></View>
        {replies.length > 0 && (
          <Text style={[styles.headingboldbig, {margin: 20}]}>Replies</Text>
        )}
      </View>
    );
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: '#2e2e2e'}]}>
        <Header onBackPress={() => backPress()} />
        <ImagePickerBottomSheet
          openCamera={() => pickORCapture('CAMERA')}
          openFiles={() => pickORCapture('GALLERY')}
          reference={refRBSheet}
        />

        <View style={[]}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              globalStyles.textAlignStart,
              globalStyles.white,
              {paddingHorizontal: 30},
            ]}>
            {`Community >`}
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignStart,
                globalStyles.green_heading,
                {paddingHorizontal: 30},
              ]}>
              {` ${category_name}`}
            </Text>
          </Text>
        </View>
        <FlatList
          key={isUpdating}
          extraData={replies}
          ListHeaderComponent={() => Listheader()}
          renderItem={({item}) => (
            <CommPostrepliesLane
              onCommentAddLikeDislikePress={onCommentAddLikeDislikePress}
              category_name={category_name}
              item={item}
            />
          )}
          data={replies}></FlatList>
      </View>
    );
  };
  return DefautView();
};
export default CommunityPosts;
