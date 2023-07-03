import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import DialogView from '../../component/dialog';
import {useNavigation} from '@react-navigation/native';
import styles from '../ApprovedFoods/style';
import Loader from '../../component/loader';
import images from '../../assets/images';
import Header from '../../component/headerWithBackControl';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import colors from '../../constants/colorCodes';
import {useDispatch, useSelector} from 'react-redux';
import {getApprovedFoodsRequest} from '../../redux/action/ApprovedFoodAction';
import {addCustomFoodRequest} from '../../redux/action/CustomFoodAction';

var combinedFoods = [];
var userId = null;
const ApprovedFoods = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(
    state => state.other.approvedFoodReducer.showLoader,
  );
  const isLoadingAddFood = useSelector(
    state => state.other.addCustomFoodReducer.showLoader,
  );
  const [selectedFoods, setselectedFoods] = useState({
    protein: [],
    carbs: [],
    fat: [],
  });
  const [isUpdating, setUpdating] = useState(false);
  const [isCarbs, setCarbs] = useState(false);
  const [isFat, setFat] = useState(false);
  const [isProtein, setProtein] = useState(true);
  const [proteinArray, setProteinArray] = useState([]);
  const [fatArray, setFatArray] = useState([]);
  const [carbsArray, setCarbsArray] = useState([]);
  const [selectFoodMdal, setSelectFoodModal] = useState(
    props?.route.params?.toSelectFavorites,
  );

  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    getApprovedFoods();
  }, []);
  const getApprovedFoods = () => {
    dispatch(getApprovedFoodsRequest({}, onS, onF));
  };

  const onS = resolve => {
    const {data} = resolve;
    console.log({data});
    setProteinArray(data.protein.map(obj => ({...obj, isSelected: false})));
    setCarbsArray(data.carbs.map(obj => ({...obj, isSelected: false})));
    setFatArray(data.fat.map(obj => ({...obj, isSelected: false})));
  };

  const onF = reject => {};
  const backPress = () => {
    navigation.goBack();
  };
  const onSelect = (i, item) => {
    // console.log({i, item});
    //when select 5 food from each nutrients
    if (props?.route.params?.toSelectFavorites) {
      if (isProtein) {
        if (selectedFoods.protein.length == 4) {
          setProtein(false);
          setFat(false);
          setCarbs(true);
          return;
        }
        proteinArray[i].isSelected = !proteinArray[i].isSelected;
        if (proteinArray[i].isSelected) {
          selectedFoods.protein.push({
            ...item,
            food_id: Date.now() + `/app`,
            created_by: userId,
            base_qty: item.quantity,
            base_food_details: JSON.stringify({
              base_calories: item.calories,
              base_carbs: parseFloat(item.carbs),
              base_fat: parseFloat(item.fat),
              base_protein: parseFloat(item.protein),
            }),
          });
        } else {
          if (i > -1) {
            selectedFoods.protein.splice(i, 1);
          }
        }
      } else if (isCarbs) {
        if (selectedFoods.carbs.length == 4) {
          setProtein(false);
          setFat(true);
          setCarbs(false);
          return;
        }
        carbsArray[i].isSelected = !carbsArray[i].isSelected;
        if (carbsArray[i].isSelected) {
          selectedFoods.carbs.push({
            ...item,
            food_id: Date.now() + `/app`,
            created_by: userId,
            base_qty: item.quantity,
            base_food_details: JSON.stringify({
              base_calories: item.calories,
              base_carbs: parseFloat(item.carbs),
              base_fat: parseFloat(item.fat),
              base_protein: parseFloat(item.protein),
            }),
          });
        } else {
          if (i > -1) {
            selectedFoods.carbs.splice(i, 1);
          }
        }
      } else if (isFat) {
        if (selectedFoods.fat.length == 4) {
          // setProtein(false);
          // setFat(true);
          // setCarbs(false);
          alert('Please post data.');
          return;
        }
        fatArray[i].isSelected = !fatArray[i].isSelected;
        if (fatArray[i].isSelected) {
          selectedFoods.fat.push({
            ...item,
            food_id: Date.now() + `/app`,
            created_by: userId,
            base_qty: item.quantity,
            base_food_details: JSON.stringify({
              base_calories: item.calories,
              base_carbs: parseFloat(item.carbs),
              base_fat: parseFloat(item.fat),
              base_protein: parseFloat(item.protein),
            }),
          });
        } else {
          if (i > -1) {
            selectedFoods.fat.splice(i, 1);
          }
        }
      }
    }
    //when
    else {
      if (isProtein) {
        proteinArray[i].isSelected = !proteinArray[i].isSelected;
        if (proteinArray[i].isSelected) {
          selectedFoods.protein.push({
            ...item,
            food_id: Date.now() + `/app`,
            created_by: userId,
            base_qty: item.quantity,
            base_food_details: JSON.stringify({
              base_calories: item.calories,
              base_carbs: parseFloat(item.carbs),
              base_fat: parseFloat(item.fat),
              base_protein: parseFloat(item.protein),
            }),
          });
        } else {
          if (i > -1) {
            selectedFoods.protein.splice(i, 1);
          }
        }
      } else if (isCarbs) {
        carbsArray[i].isSelected = !carbsArray[i].isSelected;
        if (carbsArray[i].isSelected) {
          selectedFoods.carbs.push({
            ...item,
            food_id: Date.now() + `/app`,
            created_by: userId,
            base_qty: item.quantity,
            base_food_details: JSON.stringify({
              base_calories: item.calories,
              base_carbs: parseFloat(item.carbs),
              base_fat: parseFloat(item.fat),
              base_protein: parseFloat(item.protein),
            }),
          });
        } else {
          if (i > -1) {
            selectedFoods.carbs.splice(i, 1);
          }
        }
      } else if (isFat) {
        fatArray[i].isSelected = !fatArray[i].isSelected;
        if (fatArray[i].isSelected) {
          selectedFoods.fat.push({
            ...item,
            food_id: Date.now() + `/app`,
            created_by: userId,
            base_qty: item.quantity,
            base_food_details: JSON.stringify({
              base_calories: item.calories,
              base_carbs: parseFloat(item.carbs),
              base_fat: parseFloat(item.fat),
              base_protein: parseFloat(item.protein),
              // base_carbs: item.carbs,
              // base_fat: item.fat,
              // base_protein: item.protein,
            }),
          });
        } else {
          if (i > -1) {
            selectedFoods.fat.splice(i, 1);
          }
        }
      }
    }
    setselectedFoods(selectedFoods => selectedFoods);
    setUpdating(!isUpdating);
  };
  const onAddFoodPress = () => {
    var data = selectedFoods.protein,
      b = selectedFoods.carbs,
      c = selectedFoods.fat;
    combinedFoods = data.concat(b, c);
    let payload;
    if (combinedFoods.length == 1) {
      payload = combinedFoods[0];
    } else {
      payload = combinedFoods;
    }
    console.log('onAddFoodPress.payolad=>', payload);
    //return;
    dispatch(addCustomFoodRequest(payload, onAddFoodSuccess, onAddFoodFailure));
  };

  const onAddFoodSuccess = resolve => {
    const {data} = resolve;
    combinedFoods = [];
    //console.log({resolve});
    let foodId = [];
    let qty = [];
    if (Array.isArray(data)) {
      data.forEach(e => {
        foodId.push(e.id);
        qty.push(e.quantity);
      });
      foodId = foodId.toString();
      qty = qty.toString();
    } else {
      foodId = data.id;
      qty = data.quantity;
    }
    //console.log('onAddPressV2==', foodId, qty);
    global.backRoute = 'NewMeal';
    navigation.navigate('MealView', {foodId, qty: qty});
  };
  const onAddFoodFailure = reject => {
    console.log({reject});
    Utility.getInstance().inflateToast(reject);
  };

  const renderRow = item => {
    const {image, name, quantity, unit, amount, isSelected} = item.item;
    // console.log(`renderRow===`, name);
    return (
      <Pressable
        style={{
          height: 70,
          backgroundColor: item.index % 2 == 0 ? colors.white : colors.offwhite,
          // marginTop: 10,
          paddingHorizontal: 20,
          // borderBottomColor: 'gray',
          // borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={[styles.myfavlistcontainerchild, {flex: 0.8}]}>
          <Image style={styles.image} source={{uri: image}}></Image>
          <Text
            numberOfLines={1}
            style={[styles.ml_15, styles.black, {marginRight: '30%'}]}>
            {name}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          style={[styles.ml_15, styles.black, {textAlign: 'auto'}]}>
          {amount}
        </Text>
        <View
          style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => onSelect(item.index, item.item)}>
            {isSelected ? (
              <Image
                source={images.APP.SELECTED}
                style={{height: 30, width: 30, resizeMode: 'contain'}}></Image>
            ) : (
              <Image
                source={images.APP.UNSELECTED}
                style={{height: 30, width: 30, resizeMode: 'contain'}}></Image>
            )}
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };
  const FoodItemListProtein = data => {
    return (
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={renderRow}></FlatList>
    );
  };
  const FoodItemListFat = data => {
    return (
      <FlatList
        data={data}
        style={{marginTop: 10}}
        showsVerticalScrollIndicator={false}
        renderItem={renderRow}></FlatList>
    );
  };

  const FoodItemListCarbs = data => {
    return (
      <FlatList
        data={data}
        style={{marginTop: 10}}
        showsVerticalScrollIndicator={false}
        renderItem={renderRow}></FlatList>
    );
  };

  const Select5FoodsModal = () => {
    return (
      <DialogView
        onTouchOutside={() => setSelectFoodModal(false)}
        willInflate={selectFoodMdal}
        onBackPress={() => setSelectFoodModal(false)}
        children={<Select5FoodsModalContent />}></DialogView>
    );
  };
  const Select5FoodsModalContent = () => {
    return (
      <View>
        <View
          style={{
            //height: 30,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => setSelectFoodModal(false)}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 19,
              lineHeight: 22,
            }}>
            {`Select 5
Favorites`}
          </Text>
          <View style={globalStyles.backimgregister}></View>
        </View>
        <View
          style={{
            marginTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              margin: 20,
              fontSize: 13,
              lineHeight: 18,
            }}>
            Welcome to our Prefusion Health's Food Exchange List, you will find
            a number of foods you like to eat, choose 5 foods from each macro
            categorv to be added automaticallv to vour favorite foods list. When
            creating an meal. vou can easilv access these items and an other
            foods you save as favorites when usinc the app to create a meal
          </Text>

          <TouchableOpacity
            onPress={() => [setSelectFoodModal(false)]}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              //   globalStyles.mt_30,
            ]}>
            <Text
              style={[
                globalStyles.btn_heading,
                globalStyles.green_heading,
                {color: colors.black},
              ]}>
              {strings.continue}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const DefautView = () => {
    const {protein, carbs, fat} = selectedFoods;
    console.log({protein, carbs, fat});
    return (
      <View style={[{backgroundColor: colors.primary, flex: 1}]}>
        <Header onBackPress={() => backPress()} />

        {Select5FoodsModal()}
        <View style={[globalStyles.center, globalStyles.padding_40]}>
          <Text style={[styles.why_heading, styles.font25]}>
            {strings.approvedfoods}
          </Text>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              globalStyles.textAlignStart,
              styles.white,
            ]}>
            {strings.item}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: 100,
          }}>
          <Pressable
            onPress={() => [setCarbs(false), setFat(false), setProtein(true)]}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomColor: isProtein ? colors.secondary : colors.primary,
              borderBottomWidth: 5,
              height: 38,
              //width: 120,
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: isProtein ? 16 : 14,
                fontFamily: isProtein ? 'Poppins-Medium' : 'Poppins-Light',
                color: colors.secondary,
              }}>
              Protein
            </Text>
          </Pressable>
          <Pressable
            onPress={() => [setCarbs(true), setFat(false), setProtein(false)]}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomColor: isCarbs ? colors.red : colors.primary,
              borderBottomWidth: 5,
              height: 38,
              // fontSize: isCarbs ? 16 : 14,
              // width: 80,
              flex: 1,
            }}>
            <Text
              style={{
                fontFamily: isCarbs ? 'Poppins-Medium' : 'Poppins-Light',
                color: isCarbs ? colors.red : colors.gray,
              }}>
              Carbohydrates
            </Text>
          </Pressable>
          <Pressable
            onPress={() => [setCarbs(false), setFat(true), setProtein(false)]}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomColor: isFat ? colors.orange : colors.primary,
              borderBottomWidth: 5,
              height: 38,
              flex: 1,
            }}>
            <Text
              style={{
                fontFamily: isFat ? 'Poppins-Medium' : 'Poppins-Light',
                color: isFat ? colors.orange : colors.gray,
              }}>
              Fat
            </Text>
          </Pressable>
        </ScrollView>

        <TouchableOpacity
          key={isUpdating}
          onPress={() =>
            selectedFoods.protein.length > 0 ||
            selectedFoods.carbs.length > 0 ||
            selectedFoods.fat.length > 0
              ? onAddFoodPress()
              : null
          }
          style={[
            globalStyles.button_secondary,
            globalStyles.center,
            globalStyles.button,
            {
              alignSelf: 'center',
              opacity:
                selectedFoods.protein.length > 0 ||
                selectedFoods.carbs.length > 0 ||
                selectedFoods.fat.length > 0
                  ? 1
                  : 0.3,
            },
          ]}>
          <Text style={globalStyles.btn_heading_black}>ADD FOODS</Text>
        </TouchableOpacity>

        <View style={{height: 20}}></View>
        {isProtein && FoodItemListProtein(proteinArray)}
        {isCarbs && FoodItemListCarbs(carbsArray)}
        {isFat && FoodItemListFat(fatArray)}
        <Loader isLoading={isLoading || isLoadingAddFood} />
      </View>
    );
  };

  return DefautView();
};
export default ApprovedFoods;
