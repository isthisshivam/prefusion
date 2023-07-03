import React, {useState, useEffect} from 'react';
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
import moment from 'moment';
import ApiConstant from '../../constants/api';
import DialogView from '../../component/dialog';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Header from '../../component/headerWithBackControl';
import images from '../../assets/images/index';
import Utility from '../../utility/Utility';
import styles from '../AddFavoriteMeal/style';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import Loader from '../../component/loader';
import {addMealRequest} from '../../redux/action/MealAction';

import {favMealListRequest} from '../../redux/action/MealAction';

var userId = null;
const AddFavoriteMeal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [dateValue, setDate] = useState('');
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(state => state.other.mealReducer.showLoader);
  const [willInflate, setWillInflate] = useState(false);
  const [foods, setFoods] = useState([]);
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    const unsubscribe = navigation.addListener('focus', () => {
      getFavoriteList();
    });
    return () => {
      unsubscribe;
    };
  }, []);
  const getFavoriteList = () => {
    let payload = {
      uid: userId,
    };
    dispatch(favMealListRequest(payload, onS, onF));
  };
  const onS = resolve => {
    setFoods(resolve.data);
  };
  const onF = reject => {
    setFoods([]);
  };
  useEffect(() => {
    const dateSet = async () => {
      let date_ = await Utility.getInstance().getSelectedDate();
      if (date_) {
        setDate(date_);
      } else {
        const date = await Utility.getInstance().getCurrentDateOnlyUser();

        setDate(date);
      }
    };
    const unsubscribe = navigation.addListener('focus', () => {
      dateSet();
    });
    return () => {
      unsubscribe;
    };
  }, []);
  const backPress = () => {
    navigation.goBack();
  };

  const onPlusPress = async item => {
    const {isFavorite, id, food_id, quantity, fav_id, meal_name} = item.item;

    let payload = {
      meal_name: meal_name,
      date: dateValue,
      uid: userId,
      meal_id: id,
      endpoint: ApiConstant.MEAL_ADD_FROM_FAV_LISTING,
      fav_id: fav_id,
    };

    console.log('onDonePress.payload=>', JSON.stringify(payload));
    dispatch(addMealRequest(payload, onSS, onFF));
  };
  const onSS = resolve => {
    console.log('onDonePress.resolve=>', JSON.stringify(resolve));
    setWillInflate(true);
  };
  const onFF = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const onEditPress = () => {
    navigation.navigate('MyFavorites');
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
    const {names, image, foods, id, food_id, meal_name, quantity} = item.item;

    let foodId = food_id;

    let qty = quantity;
    return (
      <Pressable
        // onPress={() => [
        //   (global.favMealName = meal_name),
        //   onDetailsPress(item.item),
        // ]}
        style={[styles.myfavlistcontainer, {justifyContent: 'space-between'}]}>
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
            <Text
              numberOfLines={2}
              style={[styles.ml_15, styles.black, {marginRight: 30}]}>
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
            onPress={() => [(mealId = foodId), onPlusPress(item)]}
            style={[styles.minusc]}>
            <Image
              style={styles.minusimage}
              source={images.SIGNUP.PLUS}></Image>
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
        data={foods}
        ListEmptyComponent={emptyContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.myfavccs}
        renderItem={renderFavItems}></FlatList>
    );
  };
  const Modal = () => {
    return (
      <DialogView
        onTouchOutside={() => console.log('onTouchOutside')}
        willInflate={willInflate}
        onBackPress={() => setWillInflate(false)}
        children={ModalContent()}></DialogView>
    );
  };
  const ModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 40,
            // width: '100%',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => [
              setWillInflate(false),
              navigation.navigate('Home'),
            ]}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 25,
            }}>
            {` Meal 
Submitted`}
          </Text>

          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              marginTop: 20,
              color: colors.black,
            }}>
            {
              'Your Meal has been submitted. This meal is already in your favorite meals.'
            }
          </Text>
          <TouchableOpacity
            onPress={() => [setWillInflate(false), navigation.navigate('Home')]}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading_black}>{'CONTINUE'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <View style={[styles.flex_2]}>
          <Loader isLoading={isLoading} />
          <Header onBackPress={() => backPress()} />
        </View>
        <View style={styles.flex_8}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font30]}>
              {strings.addFavMeal}
            </Text>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignCenter,
              ]}>
              {strings.addFavMealDesc}
            </Text>
            <Text onPress={onEditPress} style={styles.edit_fav}>
              Edit My Favorites
            </Text>
          </View>
          {FavList()}
          {Modal()}
        </View>
      </View>
    );
  };

  return DefautView();
};
export default AddFavoriteMeal;
