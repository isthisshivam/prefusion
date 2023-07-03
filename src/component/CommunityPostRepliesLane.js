import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Platform,
  ImageBackground,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  UIManager,
  LayoutAnimation,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../assets/images';
import styles from '../container/CommunityMesageBoard/style';
import colors from '../constants/colorCodes';
import moment from 'moment';
import globalStyles from '../assets/globalStyles';
const CommPostrepliesLane = props => {
  const {navigate, goBack} = useNavigation();
  const {item, onCommentAddLikeDislikePress, category_name} = props;
  const {id, uid, text, date, likes, postId, name, image, currentUserLikeUser} =
    item;
  console.log('renderitema=>', currentUserLikeUser);
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
        <Pressable
          onPress={() =>
            navigate('ReplyOnComment', {
              item: item,
              postId: id,
              category_name: category_name,
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
              // key={item.item.likes}
              style={[
                styles.headingtext,
                {marginLeft: 10, marginTop: -5, color: colors.secondary},
              ]}>
              {likes}
            </Text>
            <Text style={[styles.headingtext, {marginLeft: 10, marginTop: 0}]}>
              Like
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
export default CommPostrepliesLane;
