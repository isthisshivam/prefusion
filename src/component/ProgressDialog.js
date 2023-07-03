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

const ProgressDialogView = props => {
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
      dialogStyle={{margin: 10}}
      //containerStyle={{margin: 10}}
      onHardwareBackPress={() => (onBackPress ? onBackPress() : null)}
      onTouchOutside={() => onTouchOutside()}>
      <DialogContent style={{backgroundColor: 'black'}}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ProgressDialogView;
