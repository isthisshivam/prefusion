import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Alert,
} from 'react-native';
import {
  mailRequest,
  sendAutoResponseFailure,
  sendAutoResponseRequest,
} from '../../redux/action/MailAction';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../Chat/style';
import Message from '../../component/message';
import moment from 'moment';
import Header from '../../component/headerWithBackControl';
import Loader from '../../component/loader';
import Indicator from '../../component/buttonIndicator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import {sendMsgNotificationRequest} from '../../redux/action/SendMessageNotificationAction';
import colors from '../../constants/colorCodes';
import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
import Utility from '../../utility/Utility';
import {useSelector, useDispatch} from 'react-redux';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import warning from '../../constants/warning';
import ImagePicker from 'react-native-image-crop-picker';
var sender_Image = null;
const GALLERY = 'GALLERY';
const CAMERA = 'CAMERA';
var filename = '';
var localUri = null;
var obj = null;
var emailMessage = '';
var listeners = []; // list of listeners
var start = null; // start position of listener
var end = null; // end position of listener
const Chat = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [chatArray, setChatArray] = useState([]);
  const [fc_token, setfcToken] = useState('');
  const [receiver_id, setreceiver_id] = useState('');
  const [receiver_image, setreceiver_image] = useState('');
  const [receiver_name, setreceiver_name] = useState('');
  const [avatarSource, setAvatarSource] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isSent, setSent] = useState(false);
  const [willInflate, setWillInflate] = useState(false);
  const userData = useSelector(state => state.other.loginReducer.userData);

  useEffect(() => {
    if (userData) {
      setUserId(userData?.id);
      sender_Image = userData.image;
    }
    if (props) {
      if (props.route.params == 1) {
        setWillInflate(true);
      }
    }
  }, []);
  useEffect(() => {
    if (userId) {
      pullAdminDetails();
    }
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'props.route.params.message=>',
        props?.route?.params?.message,
      );
      if (userId && props?.route?.params?.message) {
        sendAutoResponse();
        // pushMessageToFireStore(props?.route?.params?.message, userId, 'text');
      }
    }, [receiver_id]),
  );
  const pullAdminDetails = async () => {
    await firestore()
      .collection('admin_profile')
      .onSnapshot(querySnapshot => {
        if (querySnapshot)
          querySnapshot.forEach(documentSnapshot => {
            setreceiver_id(documentSnapshot?._data.receiver_id);
            setreceiver_image(documentSnapshot?._data.receiver_image);
            setreceiver_name(documentSnapshot?._data.receiver_name);
            setfcToken(documentSnapshot?._data.fc_token);
            pullMessages(documentSnapshot?._data.receiver_id);
          });
      });
  };

  // const pulalMessages = async reciverID => {
  //   await firestore()
  //     .collection(strings.messages)
  //     .doc(reciverID + `_` + userId)
  //     .collection(strings.messages_collection)
  //     // .orderBy(strings.created_at)
  //     .orderBy(strings.created_atTimestamp, 'desc')
  //     .onSnapshot(querySnapshot => {
  //       const refArray = [];
  //       querySnapshot.forEach(documentSnapshot => {
  //         refArray.push(documentSnapshot.data());
  //       });
  //       console.log({refArray});
  //       setChatArray(refArray);
  //     });
  // };

  const pullMessages = async reciverID => {
    let ref = await firestore()
      .collection(strings.messages)
      .doc(reciverID + `_` + userId)
      .collection(strings.messages_collection);
    // .orderBy(strings.created_at)
    //.orderBy(strings.created_atTimestamp, 'desc')
    ref
      .orderBy(strings.created_atTimestamp, 'desc')
      .limit(10)
      .get()
      .then(snapshots => {
        start = snapshots.docs[snapshots.docs.length - 1];
        let listener = ref
          .orderBy(strings.created_atTimestamp)
          .startAt(start)
          .onSnapshot(querySnapshot => {
            const refArray = [];
            querySnapshot.forEach(documentSnapshot => {
              console.log('refarray=', documentSnapshot.data());
              refArray.push(documentSnapshot.data());
            });
            setChatArray(refArray);
          });

        listeners.push(listener);
      });
  };
  const getMoreMessages = async () => {
    let ref = await firestore()
      .collection(strings.messages)
      .doc(receiver_id + `_` + userId)
      .collection(strings.messages_collection);

    ref
      .orderBy(strings.created_atTimestamp, 'desc')
      .startAt(start)
      .limit(10)
      .get()
      .then(snapshots => {
        end = start;
        start = snapshots.docs[snapshots.docs.length - 1];
        let listener = ref
          .orderBy(strings.created_atTimestamp)
          .startAt(start)
          .endBefore(end)
          .onSnapshot(querySnapshot => {
            const refArray = [];
            querySnapshot.forEach(documentSnapshot => {
              refArray.push(documentSnapshot.data());
            });
            for (let i = 0; i < refArray.length; i++) {
              chatArray.unshift(refArray[i]);
            }
            setChatArray(chatArray);
          });
        listeners.push(listener);
      });
  };
  const pushMessageToFireStore = async (message, id, type) => {
    console.log('Push message=>', message, id, type);
    emailMessage = message;
    var messageToAdd = {
      message,
      sender_id: id,
      receiver_id: receiver_id,
      type: type,
      image: type == 'image' ? {uri: localUri} : null,
      receiver_image: receiver_image,
      receiver_name: receiver_name,
      sender_name: userData && userData.username,
      sender_profile: sender_Image,
      created_at: moment().format(), ///set current date to firestore
      created_atTimestamp: moment().unix(),
      is_seen: 0,
    };

    console.log('messageToAdd=>', messageToAdd);
    if (receiver_id && userId) {
      await firestore()
        .collection(strings.messages)
        .doc(receiver_id + `_` + userId)
        .collection(strings.messages_collection)
        .add(messageToAdd)
        .then(() => {
          chatArray.push(messageToAdd);
          console.log('chatArray=>', chatArray);
          setChatArray(chatArray);
          setMessage('');
          setAvatarSource('');
          setSent(false);
          // if (userId && props?.route?.params?.message) {
          //   sendAutoResponse();
          // }
        })
        .catch(e => {
          console.log(JSON.stringify(e));
        });
      if (type == 'text') {
        sendMail();
      }
      sendMessageNotification();
      await firestore()
        .collection(strings.messages)
        .doc(receiver_id + `_` + userId)
        .set({abc: moment().format()});
    } else {
      pullAdminDetails();
    }
  };

  const sendMessageNotification = async () => {
    let payload = {
      registration_ids: [fc_token],
      notification: {
        body: message,
        title: userData && userData.username + ` Sent a message.`,
        action: 'Chat',
      },
      data: {
        body: message,
        title: userData && userData.username + ` Text you.`,
        action: 'Chat',
      },
    };
    dispatch(sendMsgNotificationRequest(payload, onS, onF));
  };
  const sendMail = async () => {
    let payload = {
      uid: userId,
      emailBody: emailMessage,
    };
    console.log('onMailSentSuccess.payload>>>>', payload);
    dispatch(mailRequest(payload, onMailSentSuccess, onMailSentFailure));
  };
  const onMailSentSuccess = async resolve => {
    console.log('onMailSentSuccess.success>>>>', resolve);
  };
  const onMailSentFailure = async reject => {
    console.log('onMailSentSuccess.failure>>>>', reject);
  };
  const sendAutoResponse = async () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(
        sendAutoResponseRequest(
          {uid: userId},
          onAutoResponseSuccess,
          onAutoResponseFailure,
        ),
      );
    }, 1000);
  };
  const onAutoResponseSuccess = async resolve => {
    pullAdminDetails();
    setLoading(false);
    console.log('Push message success=>', resolve);
    console.log(' onAutoResponseSuccess.success>>>>', resolve);
  };
  const onAutoResponseFailure = async reject => {
    setLoading(false);
    console.log('Push message errror=>', reject);
    console.log('onAutoResponseFailure.failure>>>>', reject);
  };
  const validateFields = () => {
    var messageTo = '';
    if (Utility.getInstance().isEmpty(avatarSource)) {
      messageTo = warning.pls_choose_food_img;
    } else if (Utility.getInstance().isEmpty(message)) {
      message = warning.enter_desc;
    }
    if (messageTo == '') {
      return true;
    }
    Utility.getInstance().inflateToast(messageTo);
    return false;
  };
  const sendQueryToAdmin = () => {
    if (validateFields()) {
      chatArray.push(obj);
      setChatArray(chatArray);
      uploadFileToFirebaseStorage(localUri, filename);
      setWillInflate(false);
    }
  };
  const onS = async resolve => {
    console.log('sendMsgNotificationRequest.success>>>>', resolve);
  };
  const onF = async reject => {
    console.log('sendMsgNotificationRequest.failure>>>>', reject);
  };

  const backPress = () => {
    navigation.goBack();
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
          onPress: () => onPressChooseImageToCapture(GALLERY),
          style: 'default',
        },
        {
          text: 'CAMERA',
          style: 'default',
          onPress: () => onPressChooseImageToCapture(CAMERA),
        },
      ],
      {cancelable: true},
    );
  };
  const onPressChooseImageToCapture = TYPE => {
    if (TYPE == CAMERA) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
      }).then(image => {
        generateValidImage(image);
      });
    } else if (TYPE == GALLERY) {
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

    setAvatarSource(newData);
    obj = {
      sender_id: userId,
      type: 'image',
      mode: 'local',
      image: data.path,
      created_at: moment().format(), ///set current date to firestore
    };
  };
  const uploadFileToFirebaseStorage = (path, imageName) => {
    setSent(true);
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
            setAvatarSource(url);
            localUri = url;
            pushMessageToFireStore(message, userId, 'image');
            setTimeout(() => {
              setLoading(false);
              pushMessageToFireStore(message, userId, 'text');
            }, 3000);
          })
          .catch(e => {
            setSent(false);
            setLoading(false);
            console.log('getting downloadURL of image error => ', e);
          });
      })
      .catch(e => console.log('uploading image error => ', e));
  };

  const emptyView = () => {
    return (
      <View
        style={{
          flex: 1,
          height: Utility.getInstance().DH() / 1.3,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.forgot_pass_heading}>No messages yet</Text>
      </View>
    );
  };

  const MessageView = () => {
    return (
      <AutoScrollFlatList
        refreshing={isRefreshing}
        onRefresh={() => [getMoreMessages(), console.log('onRefresh====')]}
        onEndReached={() => console.log('onEndReached====')}
        ListEmptyComponent={() => emptyView()}
        extraData={isSent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: 20, paddingHorizontal: 20}}
        enabledAutoScrollToEnd
        threshold={20}
        data={chatArray}
        renderItem={item => (
          <Message
            calendlyUrl={item?.item?.calendlyUrl}
            receiver_image={item.item.receiver_image}
            index={item.index}
            userId={userId}
            created_at={item?.item?.created_at}
            type={item?.item?.type}
            sender_profile={item?.item?.sender_profile}
            sender_id={item?.item?.sender_id}
            image={item?.item?.image}
            message={item?.item?.message}
            side={userId == item?.item?.sender_id ? 'left' : 'right'}></Message>
        )}
        keyExtractor={item => item?.created_at}
      />
    );
  };
  const ChatView = () => {
    return (
      <KeyboardAvoidingView
        style={[styles.flex, {backgroundColor: colors.primary}]}
        //keyboardDismissMode="on-drag"
        //enabled

        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        keyboardVerticalOffset={40}>
        <Header onBackPress={() => backPress()} />
        <View style={[styles.flex]}>
          <SafeAreaProvider>
            {MessageView()}

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
                  value={message}
                  onChangeText={value => setMessage(value)}
                  placeholder="Write a message..."
                  style={{
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    height: 45,
                    backgroundColor: colors.white,
                    width: '85%',
                  }}></TextInput>
                <TouchableOpacity
                  onPress={() =>
                    !isLoading && message
                      ? pushMessageToFireStore(message, userId, 'text')
                      : Utility.getInstance().inflateToast(
                          'Please enter messsage!',
                        )
                  }
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: colors.secondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}>
                  {isSent ? (
                    <Indicator isLoading={isSent}></Indicator>
                  ) : (
                    <Image
                      style={styles.send}
                      source={images.CHAT.SEND}></Image>
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaProvider>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const SendQueryAdminView = () => {
    return (
      <Modal animationType="slide" visible={willInflate}>
        <View
          style={{
            marginTop: Utility.getInstance().heightToDp(10),
            height: '100%',
            width: '100%',
            flex: 1,
          }}>
          <View style={[{backgroundColor: colors.primary}]}>
            <Header onBackPress={() => setWillInflate(false)} />
            <ScrollView
              scrollEnabled
              contentContainerStyle={{
                paddingVertical: 60,
                marginTop: Utility.getInstance().heightToDp(-15),
              }}
              showsVerticalScrollIndicator={false}>
              <View style={[globalStyles.center, globalStyles.padding_40]}>
                <Text style={[styles.why_heading, styles.font30]}>
                  {strings.submitMealPhoto}
                </Text>
                <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
                  {strings.submitMealPhotoDesc}
                </Text>
                <TouchableOpacity
                  onPress={() => chooseMode()}
                  style={{
                    marginTop: 4,
                    backgroundColor: colors.white,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    shadowColor: 'gray',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{height: 20, width: 20, resizeMode: 'contain'}}
                    source={images.APP.CAMERAGREEN}></Image>
                </TouchableOpacity>
              </View>
              <ImageBackground
                style={{height: 200, width: '100%'}}
                source={
                  avatarSource
                    ? {uri: avatarSource.uri}
                    : images.PROFILE.CHICKEN
                }></ImageBackground>
              <View style={globalStyles.padding_40_hor}>
                <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
                  {strings.describemeal}
                </Text>
                <TextInput
                  value={message}
                  onChangeText={value => setMessage(value)}
                  multiline={true}
                  textAlignVertical={'top'}
                  style={[styles.biginput]}
                />
              </View>

              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={sendQueryToAdmin}
                  style={[
                    globalStyles.button_secondary,
                    globalStyles.center,
                    globalStyles.button,
                    globalStyles.mt_30,
                  ]}>
                  <Text style={globalStyles.btn_heading}>SUBMIT MEAL</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      {ChatView()}

      {<Loader fullScrreen={true} isLoading={isLoading} />}
      {SendQueryAdminView()}
    </>
  );
};
export default Chat;
