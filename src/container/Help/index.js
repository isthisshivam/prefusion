import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions, ActivityIndicator, StyleSheet} from 'react-native';
import Header from '../../component/headerWithBackControl';
import {indicatorLoadingView} from '../../component/webviewLoader';
import WebView from 'react-native-webview';

import colors from '../../constants/colorCodes';
import {useNavigation} from '@react-navigation/native';

//const LINK = 'http://52.206.87.221/backend/web/uploads/site_data/guide.pdf';
const Help = props => {
  const navigation = useNavigation();
  const {LINK} = props.route.params;
  console.log('props', LINK);
  const backPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[{backgroundColor: colors.primary, flex: 1}]}>
      <Header onBackPress={() => backPress()} />

      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => indicatorLoadingView()}
        source={{
          uri: LINK,
        }}
      />
    </View>
  );
};
const styless = StyleSheet.create({
  IndicatorStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
export default Help;
