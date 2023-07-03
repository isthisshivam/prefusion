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
import Header from '../../component/headerWithBackControl';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images/index';
import styles from '../BrowseOurRecipies/style';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import {addCustomFoodRequest} from '../../redux/action/CustomFoodAction';
import Loader from '../../component/loader';
import Utility from '../../utility/Utility';
import {getRecipiesRequest} from '../../redux/action/RecipieAction';
import colors from '../../constants/colorCodes';
import DialogView from '../../component/dialog';
import {
  CircularProgress,
  GradientCircularProgress,
} from 'react-native-circular-gradient-progress';
import {useDispatch, useSelector} from 'react-redux';

var pageNumber = 1;
var userId = null;
var totalPageCount = 1;
const BrowseOurRecipies = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');

  const [foodList, setFoodList] = useState([]);
  const userData = useSelector(state => state.other.loginReducer.userData);
  const recipieReducerData = useSelector(
    state => state.other.recipieReducer.userData,
  );
  const isLoadingAddFood = useSelector(
    state => state.other.addCustomFoodReducer.showLoader,
  );
  const isLoading =
    useSelector(state => state.other.recipieReducer.showLoader) || false;
  const [willInflate, setWillInflate] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  function hasWhiteSpace(s) {
    return /\s/g.test(s);
  }
  const manageQuantity = q => {
    if (hasWhiteSpace(q)) {
      console.log('empty food=>', q.split(' ')[0]);
      return q.split(' ')[0];
    } else {
      return q;
    }
  };
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    const focusChangeListener = navigation.addListener('focus', () => {
      getRecipiesCall(searchValue);
    });
    return () => {
      focusChangeListener;
    };
  }, []);
  const getRecipiesCall = data => {
    setShowLoader(true);
    let payload = {search: data, page: pageNumber, perpage: 10};
    dispatch(getRecipiesRequest(payload, onS, onF));
  };
  const onS = resolve => {
    const {data} = resolve;
    console.log({data});
    totalPageCount = data.pages_array.length;
    setShowLoader(false);
    setTimeout(() => {
      if (searchValue != '') {
        setFoodList(data.list);
      } else {
        if (foodList.length == 0) {
          setFoodList(data.list);
        } else {
          let dataArray = foodList.concat(data.list);
          setFoodList(dataArray);
        }
      }
    }, 100);

    console.log(
      'foodList.concat(data.list)',
      JSON.stringify(foodList.concat(data.list)),
    );
  };
  const onF = reject => {
    setShowLoader(false);
  };
  const onEndReachedCall = () => {
    if (!searchValue) {
      if (pageNumber != totalPageCount) {
        pageNumber++;
        getRecipiesCall('');
      }
    }
  };

  const backPress = () => {
    navigation.goBack();
  };

  const onAddPress = () => {
    setSearchValue('');
    setWillInflate(false);
    navigation.navigate('MacroEstimation');
  };
  const onTouchOutside = () => {
    setWillInflate(!willInflate);
  };

  const onPlusPress = async (item, i) => {
    const {name, calories, carbs, fat, protein, quantity, unit} = item;
    let payload = {
      created_by: userId,
      name: name,
      calories: calories,
      carbs: carbs,
      fat: fat,
      protein: protein,
      base_qty: manageQuantity(quantity),
      quantity: manageQuantity(quantity),
      unit: unit,
      food_id: Date.now() + `/app`,
      base_food_details: JSON.stringify({
        base_calories: calories,
        base_carbs: parseFloat(carbs),
        base_fat: parseFloat(fat),
        base_protein: parseFloat(protein),
      }),
    };

    dispatch(addCustomFoodRequest(payload, onAddFoodSuccess, onAddFoodFailure));
  };

  const onAddFoodSuccess = resolve => {
    const {data} = resolve;

    console.log({foodId: data?.id, qty: data?.quantity});

    navigation.navigate('MealView', {
      foodId: data?.id,
      qty: manageQuantity(data?.quantity),
    });
  };
  const onAddFoodFailure = reject => {
    console.log({reject});
    Utility.getInstance().inflateToast(reject);
  };
  const renderFoodistItems = item => {
    const {name, image, category, calories, id} = item.item;
    let recipie_id = id;
    return (
      <Pressable
        onPress={() => [
          (pageNumber = 1),
          setSearchValue(''),
          navigation.navigate('RecipieDetails', recipie_id),
        ]}
        style={[styles.addfoodc]}>
        <View style={[styles.myfavlistcontainerchild, {flex: 0.8}]}>
          <Image
            style={styles.image}
            source={image ? {uri: image} : images.SPLASH.SPLASH}></Image>
          <View>
            <Text style={styles.ml_15}>{calories + ` cal`} </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={2} style={[styles.ml_1, {marginRight: 120}]}>
                {name}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
          <Pressable
            onPress={() => onPlusPress(item.item)}
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{height: 22, width: 22, resizeMode: 'contain'}}
              source={images.SIGNUP.PLUS}></Image>
          </Pressable>
        </View>
      </Pressable>
    );
  };
  const FoodList = () => {
    return (
      <FlatList
        data={foodList}
        showsVerticalScrollIndicator={false}
        style={{marginTop: -25}}
        onEndReached={() => onEndReachedCall()}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => emptyComp()}
        contentContainerStyle={[styles.myfavccs, globalStyles.mt_0]}
        renderItem={renderFoodistItems}></FlatList>
    );
  };
  const emptyComp = () => {
    return (
      <View
        style={{
          height: 300,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: colors.white, fontFamily: 'Poppins-Medium'}}>
          No Food Found.
        </Text>
      </View>
    );
  };
  const renderFoodItems = item => {
    const {image, name, id} = item.item;
    let recipie_id = id;
    return (
      <Pressable
        onPress={() => [
          (pageNumber = 1),
          setSearchValue(''),
          navigation.navigate('RecipieDetails', recipie_id),
        ]}
        style={styles.addfoodc1}>
        <View style={styles.myfavlistcontainerchildColumn}>
          <Image
            style={styles.imagea}
            source={image ? {uri: image} : images.SPLASH.SPLASH}></Image>
          <View>
            <Text style={styles.ml_0}>{name}</Text>
          </View>
        </View>
      </Pressable>
    );
  };
  const FeaturedFoodList = () => {
    return (
      <FlatList
        horizontal
        data={recipieReducerData && recipieReducerData.featured}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.myfavccs, globalStyles.mt_0]}
        renderItem={renderFoodItems}></FlatList>
    );
  };
  const Modal = () => {
    return (
      <DialogView
        onTouchOutside={() => onTouchOutside()}
        willInflate={willInflate}
        onBackPress={() => setWillInflate(false)}
        children={<ModalContent />}></DialogView>
    );
  };
  const ModalContent = () => {
    return (
      <View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => onTouchOutside()}>
            <Image
              style={globalStyles.backimgregister}
              source={images.FAVORITE.ARROW}></Image>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: colors.black,
              fontSize: 20,
            }}>
            Add Food
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Light',
              color: colors.black,
            }}>
            Are you sure you would like to add this food to Meal3 ?
          </Text>

          <View style={styles.addfoodcn}>
            <Text style={styles.foodname}>Banana</Text>
            <SelectDropdown
              data={['12 piece', '111 piece']}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem);
              }}
              defaultButtonText={'1 piece'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              renderDropdownIcon={() => {
                return (
                  <Image
                    style={{
                      height: 12,
                      width: 12,
                      resizeMode: 'contain',
                      //   transform: [{rotate: '270deg'}],
                    }}
                    source={images.SIGNUP.DOWN_ARROW}
                  />
                );
              }}
              buttonStyle={styles.dropdownSmall4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>

          <TouchableOpacity style={styles.favmealsC}>
            <View style={styles.mealc}>
              <View style={{flex: 0.6}}>
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
              <View style={{flex: 0.4}}>
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

          <TouchableOpacity
            onPress={onAddPress}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_30,
            ]}>
            <Text style={globalStyles.btn_heading}>ADD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onTouchOutside}
            style={[
              globalStyles.button_secondary,
              globalStyles.center,
              globalStyles.button,
              globalStyles.mt_10,
            ]}>
            <Text style={globalStyles.btn_heading}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <Header onBackPress={() => backPress()} />
        <Loader fullScrreen isLoading={isLoading || isLoadingAddFood} />
        <View style={styles.flex}>
          <View style={[globalStyles.center, globalStyles.padding_40]}>
            <Text style={[styles.why_heading, styles.font23]}>
              {strings.BrowseOurRecipies}
            </Text>
            <Text
              style={[
                styles.forgot_pass_heading,
                styles.whydesc,
                globalStyles.textAlignStart,
                globalStyles.mt_0,
                {color: 'white'},
              ]}>
              {strings.featured}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%',
                paddingVertical: 0,
              }}>
              {FeaturedFoodList()}
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                width: '100%',
                backgroundColor: colors.white,
                //padding: 10,
                paddingHorizontal: 30,
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={images.APP.SEARCH}
                resizeMode="cover"
                style={{height: 20, width: 20}}></Image>
              <TextInput
                value={searchValue}
                onChangeText={value => setSearchValueAndPerformSearch(value)}
                placeholder="Search your food...."
                style={[styles.input, {marginTop: 0}]}
              />
            </View> */}
          </View>

          {FoodList()}
        </View>
      </View>
    );
  };
  return (
    <>
      {DefautView()}
      {Modal()}
    </>
  );
};
export default BrowseOurRecipies;
