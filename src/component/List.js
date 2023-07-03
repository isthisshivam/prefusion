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
} from 'react-native';
import images from '../assets/images';
import styles from '../container/CommunityMesageBoard/style';
import colors from '../constants/colorCodes';
import moment from 'moment';
const List = ({item, onClickFunction, isExpanded, onHeadinClick}) => {
  //console.log('ExpandableComponent=====', item?.subcategory);
  const {title, name, created_at} = item;
  return (
    <View
      style={{
        //   height: layoutHeight,
        overflow: 'hidden',
        height: 80,
        backgroundColor: '#6c6c6c',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
      }}>
      <TouchableOpacity key={item.id}>
        <View>
          <Text style={styles.headingT2underline}>{title}</Text>
          <Text style={styles.headingT2}>
            {`posted at ${moment(created_at).format('ddd, hA')} by ${name}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default List;
