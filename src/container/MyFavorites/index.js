import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import Header from '../../component/headerWithBackControl';
import styles from '../MyFavorites/style';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Utility from '../../utility/Utility';
import {addMealToFavRequest} from '../../redux/action/MealAction';
import Loader from '../../component/loader';
import {favMealListRequest} from '../../redux/action/MealAction';

var userId = null;
const MyFavorites = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const [deleted, setIsDeleted] = useState(false);
  const isLoading = useSelector(
    state => state.other.favoriteReducer.showLoader,
  );
  const [myFavFood, setFavFoods] = useState([]);
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    getFavoriteList();
  }, []);

  const getFavoriteList = () => {
    let payload = {
      uid: userId,
    };
    dispatch(favMealListRequest(payload, onS, onF));
  };
  const onS = resolve => {
    console.log('getFavoriteList==', resolve.data);
    setFavFoods(resolve.data);
  };
  const onF = reject => {};

  const onMinusPress = item => {
    console.log('onMinusPress==', JSON.stringify(item));
    const {id, fav_id} = item.item;
    let payload = {
      uid: userId,
      meal_id: id,
      favorite: '0',
      fav_id: fav_id,
      favorite_seperation: true,
    };
    setIsDeleted(true);
    dispatch(addMealToFavRequest(payload, onDeleteSuccess, onDeleFailure));
  };
  const onDeleteSuccess = resolve => {
    setIsDeleted(false);
    setTimeout(() => {
      getFavoriteList();
    }, 300);
  };
  const onDeleFailure = reject => {
    Utility.getInstance().inflateToast(reject);
    console.log('onDeleFailure==', JSON.stringify(reject));
    setIsDeleted(false);
  };

  const backPress = () => {
    navigation.goBack();
  };
  const onDetailsPress = async item => {
    global.is_fav_meal = true;
    const {id, food_id, quantity, meal_name, fav_id} = item;
    global.fav_id = fav_id;
    Global = meal_name;
    let foodId = food_id.toString();
    let mealId = id;

    await Utility.getInstance()
      .setStoreData('MEAL_ID', id)
      .then(() => {
        navigation.navigate('MealView', {
          foodId,
          qty: quantity.toString(),
          mealId,
        });
      });
  };

  const renderFavItems = item => {
    const {names, image, foods, id, meal_name} = item.item;
    return (
      <Pressable
        onPress={() => [
          (global.favMealName = meal_name),
          onDetailsPress(item.item),
        ]}
        style={styles.myfavlistcontainer}>
        <View
          style={[
            styles.myfavlistcontainerchild,
            {flex: 0.85, marginRight: '20%'},
          ]}>
          <Image
            style={styles.image}
            source={image ? {uri: image} : images.SPLASH.SPLASH}></Image>
          <View>
            <Text style={[styles.ml_15, styles.mealName]}>
              {meal_name && meal_name}
            </Text>
            <Text numberOfLines={2} style={[styles.ml_15, {marginRight: 30}]}>
              {names}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => onMinusPress(item)}
            style={styles.minusc}>
            <Image
              style={styles.minusimage}
              source={images.SIGNUP.MINUS}></Image>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };
  const emptyContainer = () => {
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignSelf: 'center',
          marginVertical: 100,
        }}>
        <Text style={[styles.whydesc, globalStyles.white]}>No Food Found.</Text>
      </View>
    );
  };
  const FavList = () => {
    return (
      <FlatList
        data={myFavFood}
        ListEmptyComponent={emptyContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.myfavccs}
        renderItem={renderFavItems}></FlatList>
    );
  };
  const First = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Loader isLoading={isLoading || deleted} />
        <View style={[styles.flex_2]}>
          <Header onBackPress={() => backPress()} />
        </View>

        <View style={styles.flex_8}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.favmeal}
            </Text>
            <Text style={[styles.forgot_pass_heading, styles.whydesc]}>
              {strings.favmealdesc}
            </Text>
          </View>
          {FavList()}
        </View>
      </View>
    );
  };

  return First();
};
export default MyFavorites;
