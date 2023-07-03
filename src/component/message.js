import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

import styles from '../container/Chat/style';
import moment from 'moment';
import images from '../assets/images';
import colorCodes from '../constants/colorCodes';
const Message = props => {
  const isValidUrl = urlString => {
    var urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  const checkRedirection = str => {
    if (isValidUrl(str)) {
      Linking.openURL(str);
    } else {
    }
  };
  const {
    receiver_image,
    type,
    message,
    sender_id,
    created_at,
    sender_profile,
    receiver_id,
    image,
    mode,
    userId,
    side,
    calendlyUrl,
  } = props;

  if (side == 'right') {
    return (
      <TouchableOpacity
        onPress={() => checkRedirection(calendlyUrl)}
        style={[styles.left_msg_c]}>
        <Image
          source={sender_profile ? {uri: sender_profile} : images.FAVORITE.USER}
          style={styles.sender_img}></Image>
        <View>
          <Text style={styles.left_msg_time}>
            {moment(created_at).calendar()}
          </Text>
          {type == 'text' && (
            <View style={styles.left_msg}>
              <Text>{message}</Text>
            </View>
          )}
          {type == 'image' && image?.uri != '' && message == '' && (
            <ImageBackground
              style={{height: 200, width: 200, marginTop: 10}}
              imageStyle={{borderRadius: 10}}
              resizeMode="cover"
              source={{uri: image?.uri}}></ImageBackground>
          )}
          {message != '' && image?.uri && (
            <View
              style={{
                backgroundColor: colorCodes.secondary,
                borderRadius: 10,
                padding: 10,
                width: 230,
                marginTop: 10,
              }}>
              <ImageBackground
                style={{height: 200, width: 200}}
                imageStyle={{borderRadius: 10}}
                resizeMode="cover"
                source={{uri: image?.uri}}></ImageBackground>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  marginTop: 10,
                  fontSize: 13,
                }}>
                {message}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.right_msg_c}>
        <View style={styles.right_msg_c_c}>
          <Text style={styles.right_msg_text}>
            {moment(created_at).calendar()}
          </Text>
          {type == 'text' && (
            <View style={styles.right_msg}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  // marginTop: 10,
                  fontSize: 13,
                }}>
                {message}
              </Text>
            </View>
          )}

          {type == 'image' && image != '' && (
            <ImageBackground
              style={{height: 200, width: 200, margin: 5}}
              imageStyle={{borderRadius: 10}}
              resizeMode="cover"
              source={{uri: image?.uri}}></ImageBackground>
          )}
        </View>

        <Image
          source={sender_profile ? {uri: sender_profile} : images.FAVORITE.USER}
          style={styles.sender_img}></Image>
      </TouchableOpacity>
    );
  }
};
export default Message;
