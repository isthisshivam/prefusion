import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  StatusBar,
  BackHandler,
} from 'react-native';
import images from '../assets/images';
import strings from '../constants/strings';
import globalStyles from '../assets/globalStyles';
import colorCodes from '../constants/colorCodes';
import styles from '../container/Home/style';

const BucketLane = props => {
  const {data, bucketCount, type, item, consumed} = props;
  const [isUpdating, setUpdating] = useState(false);

  //   const renderBuckets = item => {

  const {index} = item;
  let diffrence = bucketCount - index;
  let consumedDifference = consumed - index;
  console.log('itemis=>', item.item, diffrence, consumedDifference);
  if (type == 'Fat') {
    if (diffrence >= 1) {
      if (item?.item == 1) {
        return (
          <Image
            style={styles.bucketImg}
            source={images.FAT_IMAGE.ORANGE_100}></Image>
        );
      } else if (item?.item == 0.75)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.FAT_TARGET_75
                : consumedDifference > 0
                ? images.TARGET.FAT_TARGET_FILLED_75
                : images.FAT_IMAGE.ORANGE_75
            }></Image>
        );
      else if (item?.item == 0.5)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.FAT_TARGET_50
                : consumedDifference > 0
                ? images.TARGET.FAT_TARGET_FILLED_50
                : images.FAT_IMAGE.ORANGE_50
            }></Image>
        );
      else if (item?.item == 0.25)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.FAT_TARGET_25
                : consumedDifference > 0
                ? images.TARGET.FAT_TARGET_FILLED_25
                : images.FAT_IMAGE.ORANGE_25
            }></Image>
        );
      else if (item?.item == 0)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.FAT_TARGET_100
                : images.APP.ORANGE_EMPTY
            }></Image>
        );
      else {
        return (
          <ImageBackground
            resizeMode="contain"
            style={[
              styles.bucketImg,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            source={images.MAXIMIZE_IMAGE.MAXIMUM}>
            <Text>{`+${Math.abs(item.item)}`}</Text>
          </ImageBackground>
        );
      }
    } else {
      if (diffrence == 0.75)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.FAT_TARGET_75
                : images.OVEGARE_IMAGE.FAT_OVEGARE_75
            }></Image>
        );
      else if (diffrence == 0.5)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.FAT_TARGET_50
                : images.OVEGARE_IMAGE.FAT_OVEGARE_50
            }></Image>
        );
      else if (diffrence == 0.25)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.FAT_TARGET_25
                : images.OVEGARE_IMAGE.FAT_OVEGARE_25
            }></Image>
        );
      // else if (diffrence == 0)
      //   return (
      //     <Image
      //       style={styles.bucketImg}
      //       source={images.APP.ORANGE_EMPTY}></Image>
      //   );
      else {
        return (
          <ImageBackground
            resizeMode="contain"
            style={[
              styles.bucketImg,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            source={images.MAXIMIZE_IMAGE.MAXIMUM}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-regular',
                marginTop: 6,
              }}>{`+${Math.abs(item.item)}`}</Text>
          </ImageBackground>
        );
      }
    }
  } else if (type == 'Carbs') {
    if (diffrence >= 1) {
      if (item?.item == 1) {
        return (
          <Image
            style={styles.bucketImg}
            source={images.CARBS_IMAGE.CARBS_100}></Image>
        );
      } else if (item?.item == 0.75)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.CARBS_TARGET_75
                : consumedDifference > 0
                ? images.TARGET.CARBS_TARGET_FILLED_75
                : images.CARBS_IMAGE.CARBS_75
            }></Image>
        );
      else if (item?.item == 0.5)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.CARBS_TARGET_50
                : consumedDifference > 0
                ? images.TARGET.CARBS_TARGET_FILLED_50
                : images.CARBS_IMAGE.CARBS_50
            }></Image>
        );
      else if (item?.item == 0.25)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.CARBS_TARGET_25
                : consumedDifference > 0
                ? images.TARGET.CARBS_TARGET_FILLED_25
                : images.CARBS_IMAGE.CARBS_25
            }></Image>
        );
      else if (item?.item == 0)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.CARBS_TARGET_100
                : images.APP.RED_EMPTY
            }></Image>
        );
      else {
        return (
          <ImageBackground
            resizeMode="contain"
            style={[
              styles.bucketImg,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            source={images.MAXIMIZE_IMAGE.MAXIMUM}>
            <Text>{`+${Math.abs(item.item)}`}</Text>
          </ImageBackground>
        );
      }
    } else {
      if (diffrence == 0.75)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.CARBS_TARGET_75
                : images.OVEGARE_IMAGE.CARBS_OVEGARE_75
            }></Image>
        );
      else if (diffrence == 0.5)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.CARBS_TARGET_50
                : images.OVEGARE_IMAGE.CARBS_OVEGARE_50
            }></Image>
        );
      else if (diffrence == 0.25)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.CARBS_TARGET_25
                : images.OVEGARE_IMAGE.CARBS_OVEGARE_25
            }></Image>
        );
      else {
        return (
          <ImageBackground
            resizeMode="contain"
            style={[
              styles.bucketImg,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            source={images.MAXIMIZE_IMAGE.MAXIMUM}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-regular',
                marginTop: 6,
              }}>{`+${Math.abs(item.item)}`}</Text>
          </ImageBackground>
        );
      }
    }
  } else {
    if (diffrence >= 1) {
      if (item?.item == 1) {
        return (
          <Image
            style={styles.bucketImg}
            source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
        );
      } else if (item?.item == 0.75)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.PROTEIN_TARGET_75
                : consumedDifference > 0
                ? images.TARGET.PROTEIN_TARGET_FILLED_75
                : images.PROTEIN_IMAGE.PROTEIN_75
            }></Image>
        );
      else if (item?.item == 0.5)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.PROTEIN_TARGET_50
                : consumedDifference > 0
                ? images.TARGET.PROTEIN_TARGET_FILLED_50
                : images.PROTEIN_IMAGE.PROTEIN_50
            }></Image>
        );
      else if (item?.item == 0.25)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.PROTEIN_TARGET_25
                : consumedDifference > 0
                ? images.TARGET.PROTEIN_TARGET_FILLED_25
                : images.PROTEIN_IMAGE.PROTEIN_25
            }></Image>
        );
      else if (item?.item == 0)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.PROTEIN_TARGET_100
                : images.APP.GREEN_EMPTY
            }></Image>
        );
      else {
        return (
          <ImageBackground
            resizeMode="contain"
            style={[
              styles.bucketImg,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            source={images.MAXIMIZE_IMAGE.MAXIMUM}>
            <Text>{`+${Math.abs(item.item)}`}</Text>
          </ImageBackground>
        );
      }
    } else {
      if (diffrence == 0.75)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.PROTEIN_TARGET_75
                : images.OVEGARE_IMAGE.PROTEIN_OVEGARE_75
            }></Image>
        );
      else if (diffrence == 0.5)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.PROTEIN_TARGET_50
                : images.OVEGARE_IMAGE.PROTEIN_OVEGARE_50
            }></Image>
        );
      else if (diffrence == 0.25)
        return (
          <Image
            style={styles.bucketImg}
            source={
              consumedDifference <= 0
                ? images.TARGET.PROTEIN_TARGET_25
                : images.OVEGARE_IMAGE.PROTEIN_OVEGARE_25
            }></Image>
        );
      else {
        return (
          <ImageBackground
            resizeMode="contain"
            style={[
              styles.bucketImg,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            source={images.MAXIMIZE_IMAGE.MAXIMUM}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-regular',
                marginTop: 6,
              }}>{`+${Math.abs(item.item)}`}</Text>
          </ImageBackground>
        );
      }
    }
  }
};

export default BucketLane;
