import React, {useState, useEffect} from 'react';
import {
  Text,
  Image,
  Pressable,
  TextInput,
  ImageBackground,
  View,
} from 'react-native';
import Dialog, {DialogContent, FadeAnimation} from 'react-native-popup-dialog';
import globalStyle from '../assets/globalStyles/index';

const DialogView = props => {
  const {willInflate, onTouchOutside, children, onBackPress, dialog_Container} =
    props;
  return (
    <Dialog
      visible={willInflate}
      dialogAnimation={
        new FadeAnimation({
          initialValue: 0,
          animationDuration: 150,
          useNativeDriver: true,
        })
      }
      onHardwareBackPress={() => (onBackPress ? onBackPress() : null)}
      onTouchOutside={() => {
        onTouchOutside();
      }}>
      <DialogContent
        style={
          dialog_Container ? dialog_Container : globalStyle.dialog_Container
        }>
        <View style={globalStyle.dialog_wrapper_view}>{children}</View>
      </DialogContent>
    </Dialog>
  );
};

export default DialogView;
