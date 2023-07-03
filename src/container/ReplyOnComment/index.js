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
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {sortBy, debounce} from 'lodash';
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
  addCommentCommunityPostRequest,
  getRepliesCommunityPostRequest,
  repliedCommentsPostRequest,
  addLikeDislikeCommunityPostRequest,
} from '../../redux/action/CommunitySectionAction';
import ImagePickerBottomSheet from '../../component/imagePickerBottomSheet';
import moment from 'moment';
import Loader from '../../component/loader';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const ReplyOnComment = props => {
  const {category_name, item, postId} = props.route.params;

  console.log('ReplyOnComment=>', JSON.stringify(item));
  const {navigate, goBack} = useNavigation();
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  var backPress = () => goBack();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.communitySectionReducer.showLoader,
  );
  const [replies, setReplies] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [isSent, setSent] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  console.log('ReplyOnComment=>', props?.route?.params?.posts);
  useFocusEffect(
    React.useCallback(() => {
      //post information
      if (props.route.params.isPost) {
        dispatch(
          getRepliesCommunityPostRequest(
            {id: item?.id, uid: userData?.id},
            onGetRepliedCommunityPostSuccess,
            onGetRepliedCommunityPostFailure,
          ),
        );
      }
      //replied comments information
      else {
        dispatch(
          repliedCommentsPostRequest(
            {commentId: item?.id, uid: userData?.id},
            ongetRepliesCommunityPostSuccess,
            ongetRepliesCommunityPostFailure,
          ),
        );
      }
    }, [props]),
  );

  const ongetRepliesCommunityPostSuccess = async resolve => {
    console.log('ongetRepliesCommunityPostSuccess=>', resolve);
    setPostDetails(resolve.data.comment);
    setReplies(resolve?.data.replies);
  };
  const ongetRepliesCommunityPostFailure = async reject => {
    console.log('ongetRepliesCommunityPostFailure=>', reject);
  };
  const onGetRepliedCommunityPostSuccess = async resolve => {
    console.log('onGetRepliedCommunityPostSuccess=>', resolve);
    setPostDetails(resolve.data);
    setReplies(resolve?.data.replies);
  };
  const onGetRepliedCommunityPostFailure = async reject => {
    console.log('onGetRepliedCommunityPostFailure=>', reject);
  };
  const addReply = async () => {
    if (comment.length == 0) {
      Utility.getInstance().inflateToast('Please enter a comment');
      return;
    }
    setSent(true);
    // alert(props?.route?.params?.isPost ? item?.id : postId);
    console.log('addReply.payload=>', {
      uid: userData?.id,
      state: '1',
      postId: props?.route?.params?.isPost ? item?.id : postId,
      text: comment,
      //commentId: item?.id,
    });
    let payload = {
      uid: userData?.id,
      state: '1',
      postId: props?.route?.params?.isPost ? item?.id : postId,
      text: comment,
      commentId: item?.id,
    };
    if (props?.route?.params?.isPost) {
      delete payload.commentId;
    }
    dispatch(
      addCommentCommunityPostRequest(
        payload,
        addCommentCommunityPostSuccess,
        addCommentCommunityPostFailure,
      ),
    );
  };
  const addCommentCommunityPostSuccess = async resolve => {
    setSent(false);
    setComment('');
    //post information
    if (props.route.params.isPost) {
      dispatch(
        getRepliesCommunityPostRequest(
          {id: item?.id, uid: userData?.id},
          onGetRepliedCommunityPostSuccess,
          onGetRepliedCommunityPostFailure,
        ),
      );
    }
    //replied comments information
    else {
      dispatch(
        repliedCommentsPostRequest(
          {commentId: item?.id, uid: userData?.id},
          ongetRepliesCommunityPostSuccess,
          ongetRepliesCommunityPostFailure,
        ),
      );
    }
    console.log('addCommentCommunityPostSuccess=>', resolve);
  };
  const addCommentCommunityPostFailure = async reject => {
    setSent(false);
    console.log('addCommentCommunityPostFailure=>', reject);
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
      postId: postId,
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
            {postDetails && moment(postDetails?.created_at).format('')}
          </Text>
        </View>
        {/* <View style={{height: 0.3, backgroundColor: colors.secondary}}></View> */}
        <View style={{marginHorizontal: 20, marginVertical: 12}}>
          {props?.route?.params?.isPost && (
            <Text style={styles.headingboldbig}>
              {postDetails && postDetails?.title}
            </Text>
          )}
          <Text
            style={[
              styles.headingtext,
              {
                lineHeight: 24,
                fontSize: 13,
                marginVertical: 5,
              },
            ]}>
            {props?.route?.params?.isPost
              ? postDetails && postDetails?.post
              : postDetails && postDetails?.name}
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'red',
            paddingHorizontal: 20,
            marginTop: -20,
          }}>
          <View
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
          </View>
          <View
            style={{
              // paddingVertical: 20,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={images.FAVORITE.LIKE}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}></Image>
            <View>
              <Text
                style={[styles.headingtext, {marginLeft: 10, marginTop: 4}]}>
                Like
              </Text>
            </View>
          </View>
        </View> */}
        {replies.length > 0 && (
          <View style={{height: 2, backgroundColor: colors.secondary}}></View>
        )}
        <Text style={[styles.headingboldbig, {margin: 20}]}>
          {replies.length > 0 && `Replies`}
        </Text>
      </View>
    );
  };
  const renderItem = ({item}) => {
    const {id, uid, text, date, likes, postId, name, image} = item;
    return (
      <View style={{backgroundColor: '#363636', marginTop: 15}}>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 14,
          }}>
          <View
            style={{
              paddingVertical: 5,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={{uri: image}}
              style={{
                height: 30,
                width: 30,
                resizeMode: 'cover',
                borderRadius: 15,
              }}></Image>
            <View>
              <Text style={[styles.headingtext, {marginLeft: 10}]}>{name}</Text>
              <Text
                style={[
                  styles.headingT,
                  {marginLeft: 10},
                  globalStyles.green_heading,
                ]}>
                {moment(date).format()}
              </Text>
            </View>
          </View>
        </View>

        <View style={{marginHorizontal: 20, marginVertical: 12}}>
          {/* <Text style={styles.headingboldbig}>
            Tips for filling all of my buckets
          </Text> */}
          <Text
            style={[
              styles.headingtext,
              {
                lineHeight: 24,
                fontSize: 13,

                marginVertical: 5,
              },
            ]}>
            {text}
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
          <View
            style={{
              marginVertical: 20,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {/* <Image
              source={images.FAVORITE.REPLY}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}></Image>
            <Text style={[styles.headingtext, {marginLeft: 10}]}>Reply</Text> */}
          </View>
          <Pressable
            onPress={() => onCommentAddLikeDislikePress(item)}
            style={{
              // paddingVertical: 20,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={images.FAVORITE.LIKE}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}></Image>
            <View>
              <Text
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
      </View>
    );
  };
  const DefautView = () => {
    return (
      <KeyboardAvoidingView
        style={[styles.flex, {backgroundColor: '#2e2e2e'}]}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        keyboardVerticalOffset={40}>
        <Header onBackPress={() => backPress()} />
        <Loader isLoading={isLoading}></Loader>
        <ImagePickerBottomSheet
          openCamera={() => pickORCapture('CAMERA')}
          openFiles={() => pickORCapture('GALLERY')}
          reference={refRBSheet}
        />

        <View style={{height: 55}}>
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
          renderItem={renderItem}
          data={replies}></FlatList>
        <KeyboardAvoidingView>
          <View
            style={{
              height: 60,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 15,
              marginBottom: 10,
            }}>
            <TextInput
              value={comment}
              onChangeText={value => setComment(value)}
              placeholder="Reply to this comment.."
              style={{
                paddingHorizontal: 20,
                borderRadius: 20,
                height: 45,
                backgroundColor: colors.white,
                width: '85%',
              }}></TextInput>
            <TouchableOpacity
              onPress={() => addReply()}
              style={{
                height: 40,
                width: 40,
                backgroundColor: colors.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              {isSent ? (
                <ActivityIndicator animating={isSent}></ActivityIndicator>
              ) : (
                <Image style={styles.send} source={images.CHAT.SEND}></Image>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
    );
  };

  return DefautView();
};
export default ReplyOnComment;
