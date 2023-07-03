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
import styles from '../container/BucketEntry/style';

const Buckets = props => {
  const {data, onClick, onSetBucketArray, type, heading, headingColor} = props;
  console.log('headingColor=', headingColor);
  const [isUpdating, setUpdating] = useState(false);
  const returnValuableBucket = (percent, i) => {
    var image = null;
    switch (percent) {
      case 0:
        image =
          type == 'CARBS'
            ? images.CARBS_IMAGE.CARBS_0
            : type == 'FAT'
            ? images.APP.ORANGE_EMPTY
            : images.APP.GREEN_EMPTY;
        break;
      case 50:
        image =
          type == 'CARBS'
            ? images.CARBS_IMAGE.CARBS_50
            : type == 'FAT'
            ? images.FAT_IMAGE.ORANGE_50
            : images.PROTEIN_IMAGE.PROTEIN_50;
        break;
      case 100:
        image =
          type == 'CARBS'
            ? images.CARBS_IMAGE.CARBS_100
            : type == 'FAT'
            ? images.FAT_IMAGE.ORANGE_100
            : images.PROTEIN_IMAGE.PROTEIN_100;
        break;

      default:
    }

    return image;
  };

  const returnBucketValues = i => {
    data[i].isSelected = true;
    if (data[i].percent == 0) {
      data[i].percent = 50;
    } else if (data[i].percent == 50) {
      data[i].percent = 100;
    }
    setUpdating(!isUpdating);
    onSetBucketArray(data);

    console.log('returnBucketValues==', data);
  };
  const RenderBucketItem = item => {
    return (
      <Pressable
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() => returnBucketValues(item.index)}>
        <Image
          style={styles.bucket}
          source={returnValuableBucket(item.item.percent, item.index)}></Image>
      </Pressable>
    );
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        flex: 1,
      }}>
      <Text
        style={[
          styles.forgot_pass_heading,
          styles.whydesc,
          headingColor,
          {flex: 0.19},
        ]}>
        {heading}
      </Text>
      <FlatList
        data={data}
        numColumns={5}
        extraData={isUpdating}
        style={{marginLeft: 20, flex: 0.89}}
        showsVerticalScrollIndicator={false}
        renderItem={item => RenderBucketItem(item)}></FlatList>
    </View>
  );
};

export default Buckets;
