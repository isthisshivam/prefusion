import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../SubmitMealPhoto/style';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Header from '../../component/headerWithBackControl';
const SubmitMealPhoto = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState(0);

  const backPress = () => {
    navigation.goBack();
  };

  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.submitMealPhoto}
            </Text>
            <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
              {strings.submitMealPhotoDesc}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 4,
                backgroundColor: colors.white,
                height: 40,
                width: 40,
                borderRadius: 20,
                shadowColor: 'gray',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 20, width: 20, resizeMode: 'contain'}}
                source={images.APP.CAMERAGREEN}></Image>
            </TouchableOpacity>
          </View>
          <ImageBackground
            style={{height: 200, width: '100%'}}
            source={images.PROFILE.CHICKEN}></ImageBackground>

          <View style={globalStyles.padding_40_hor}>
            <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
              {strings.describemeal}
            </Text>
            <TextInput
              multiline={true}
              textAlignVertical={'top'}
              style={[styles.biginput]}
            />
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={backPress}
              style={[
                globalStyles.button_secondary,
                globalStyles.center,
                globalStyles.button,
                globalStyles.mt_30,
              ]}>
              <Text style={globalStyles.btn_heading}>SUBMIT MEAL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      <DefautView />
    </>
  );
};
export default SubmitMealPhoto;
