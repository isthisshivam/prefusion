import React from 'react';
import {
  Dimensions,
  PixelRatio,
  AsyncStorage,
  Platform,
  StatusBar,
  View,
  Modal,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const Loader = props => {
  const {isLoading, fullScrreen} = props;
  return (
    <>
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            start: 0,
            right: 0,
          }}>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '00FFFFFF',
            }}
          />
          <View style={{backgroundColor: 'transparent', position: 'absolute'}}>
            <ActivityIndicator
              size={34}
              animating={isLoading}
              color="#4fde40"
            />
          </View>
        </View>
      )}
      {isLoading && fullScrreen && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <ActivityIndicator size={34} animating={isLoading} color="#4fde40" />
        </View>
      )}
    </>
  );
};

export default Loader;
