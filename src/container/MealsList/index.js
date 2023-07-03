import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../MealsList/style';

import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';

import {
  CircularProgress,
  GradientCircularProgress,
} from 'react-native-circular-gradient-progress';
import Header from '../../component/headerWithBackControl';
const MealsList = () => {
  const navigation = useNavigation();

  const backPress = () => {
    navigation.goBack();
  };
  const onSettingPress = () => {
    navigation.navigate('Setting', 0);
  };
  const onDonePress = () => {
    navigation.navigate('Home');
  };
  const onItemPress = () => {
    navigation.navigate('MealView');
  };

  const MealListView = () => {
    return (
      <FlatList
        style={{margin: 10}}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1, 1, 1, 1]}
        renderItem={renderMealItem}></FlatList>
    );
  };
  const renderMealItem = () => {
    return (
      <TouchableOpacity onPress={onItemPress} style={styles.favmealsC}>
        <View style={styles.mealc}>
          <View style={globalStyles.flex_68}>
            <Text numberOfLines={1} style={styles.melaname}>
              Grilled Chicken Breast
            </Text>
            <Text numberOfLines={1} style={styles.mealcategory}>
              Brands Food Company
            </Text>
            <View style={globalStyles.flex_row}>
              <ImageBackground
                source={images.PROFILE.CHICKEN}
                borderRadius={10}
                style={styles.mealimg}></ImageBackground>
              <View style={styles.mealinnerc}>
                <Text
                  style={[
                    styles.forgot_pass_heading,
                    styles.whydesc,
                    styles.orange,
                  ]}>
                  {`Fats:`}
                </Text>
                <Image
                  style={styles.smallbucket}
                  source={images.CONTAINER.ORANGE}></Image>
                <Image
                  style={styles.smallbucket}
                  source={images.CONTAINER.ORANGE}></Image>
                <Image
                  style={styles.smallbucket}
                  source={images.CONTAINER.ORANGE}></Image>
              </View>
            </View>
          </View>
          <View style={globalStyles.flex_32_aligncenter}>
            <View style={styles.progressbar}>
              <GradientCircularProgress
                startColor={colors.primary}
                middleColor={colors.secondary}
                endColor={colors.primary}
                size={47}
                emptyColor={colors.black}
                progress={70}
                style={{backgroundColor: 'black'}}
                strokeWidth={6}>
                <Text style={styles.lbs}>60.75</Text>
              </GradientCircularProgress>
              <Text
                style={[
                  styles.bucketSize,
                  globalStyles.mt_10,
                  styles.headingtextBlack,
                ]}>
                {strings.calories}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const CarbsBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Text style={[styles.forgot_pass_heading, styles.whydesc, styles.red]}>
          {`Carbs:  `}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.userlogo}
              source={images.CONTAINER.RED}></Image>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.userlogo}
              source={images.CONTAINER.RED}></Image>
          </View>
        </View>
      </View>
    );
  };
  const FatBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Text
          style={[styles.forgot_pass_heading, styles.whydesc, styles.orange]}>
          {`Fats:      `}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.userlogo}
              source={images.CONTAINER.ORANGE}></Image>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.userlogo}
              source={images.CONTAINER.ORANGE}></Image>
          </View>
        </View>
      </View>
    );
  };
  const ProteinBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Text
          style={[styles.forgot_pass_heading, styles.whydesc, styles.green]}>
          {`Protein:      `}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.userlogo}
              source={images.CONTAINER.GREEN}></Image>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.userlogo}
              source={images.CONTAINER.GREEN}></Image>
          </View>
        </View>
      </View>
    );
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <ScrollView>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.brockly}
            </Text>
          </View>

          <MealListView />
          <Text
            onPress={onSettingPress}
            style={[
              globalStyles.textAlignCenter,
              styles.white,
              globalStyles.mt_20,
              globalStyles.font17,
            ]}>
            {strings.totalBuckets}
          </Text>
          <View style={globalStyles.padding_40_hor}>
            <CarbsBucketView />
            <FatBucketView />
            <ProteinBucketView />
          </View>
        </ScrollView>
        <View style={styles.donec}>
          <Text
            onPress={onDonePress}
            style={[
              globalStyles.textAlignEnd,
              styles.white,
              styles.mt_minus_20,
            ]}>
            {strings.done}
          </Text>
        </View>
      </View>
    );
  };

  return DefautView();
};
export default MealsList;
