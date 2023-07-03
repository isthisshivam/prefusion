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
const ExpandableComponent = ({
  item,
  onClickFunction,
  isExpanded,
  onHeadinClick,
  onSubPostClick,
}) => {
  // console.log('ExpandableComponent=====', item?.subcategory);
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [isExpanded]);
  const {category_name, subcategory} = item;
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{paddingHorizontal: 15, paddingVertical: 10, marginTop: 10}}
        onPress={() => onClickFunction(item)}>
        <View>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Text
              onPress={() =>
                onHeadinClick(
                  category_name === 'Recent Posts' ? 'recent' : category_name,
                )
              }
              style={styles.headingT1}>
              {category_name}
            </Text>
            <Image
              style={{
                height: 16,
                width: 16,
                resizeMode: 'contain',
                marginLeft: 20,
              }}
              source={
                isExpanded ? images.APP.arrow_up : images.APP.arrow_down
              }></Image>
          </View>
        </View>
      </TouchableOpacity>
      {subcategory.map((item, key) => (
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
            height: 80,
            backgroundColor: '#6c6c6c',
            justifyContent: 'center',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() =>
              onSubPostClick
                ? onSubPostClick({item: item, category_name: category_name})
                : null
            }
            key={item.id}>
            <View>
              <Text style={styles.headingT2underline}>{item?.title}</Text>
              <Text style={styles.headingT2}>
                {/* {item.created_at} */}
                {`posted at ${moment.unix(item.created_at).fromNow()} by ${
                  item.name
                }`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ExpandableComponent;
