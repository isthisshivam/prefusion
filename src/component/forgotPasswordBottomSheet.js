import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import colors from '../constants/colorCodes';
import globalStyles from '../assets/globalStyles/index';
import {TextInput} from 'react-native-gesture-handler';
import Indicator from './buttonIndicator';
const ForgotPasswordBottomSheet = props => {
  const [email, setEmail] = useState('');
  const {reference, onPress, inputRefV, isLoading} = props;
  return (
    <RBSheet
      ref={reference}
      height={280}
      closeOnPressMask={true}
      closeOnDragDown={true}
      customStyles={{
        container: globalStyles.BottomSheet_container,
        draggableIcon: {
          backgroundColor: colors.black,
        },
      }}>
      <View style={globalStyles.parent_contaier_bottomsheet}>
        <Text
          style={{
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontSize: 18,
            fontFamily: 'Poppins-Medium',
          }}>
          Forgot Password
        </Text>
        <TextInput
          ref={inputRefV}
          placeholder="Enter Registered Email"
          placeholderTextColor={colors.primary}
          keyboardType="email-address"
          value={email}
          onChangeText={value => setEmail(value)}
          style={{
            marginTop: 15,
            height: 50,
            paddingHorizontal: 10,
            borderColor: 'gray',
            width: '100%',
            borderWidth: 1,
          }}
        />
        <TouchableOpacity
          style={[globalStyles.bottomSheet_btn, {marginTop: 30}]}
          onPress={() => onPress(email)}>
          {isLoading ? (
            <Indicator isAnimating={isLoading} />
          ) : (
            <Text
              style={globalStyles.btn_heading_black}>{`Reset Password`}</Text>
          )}
          {/* <Text
            style={[globalStyles.btn_heading_black]}>{`Reset Password`}</Text> */}
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={globalStyles.bottomSheet_btn}
          onPress={() => openCamera()}>
          <Text style={[globalStyles.btn_heading_black]}>{`Open Camera`}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openFiles()}
          style={globalStyles.bottomSheet_btn_margin}>
          <Text
            style={[
              globalStyles.btn_heading_black,
            ]}>{`Choose From Gallery`}</Text>
        </TouchableOpacity> */}
      </View>
    </RBSheet>
  );
};

export default ForgotPasswordBottomSheet;
