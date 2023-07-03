import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions} from 'react-native';
import Header from '../../component/headerWithBackControl';
import WebView from 'react-native-webview';
import colors from '../../constants/colorCodes';
import {useNavigation} from '@react-navigation/native';

import {indicatorLoadingView} from '../../component/webviewLoader';
const LINK = 'https://pubmed.ncbi.nlm.nih.gov/15883556/';
const NationalWebview = () => {
  const navigation = useNavigation();

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
export default NationalWebview;
