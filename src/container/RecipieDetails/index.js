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
import Utility from '../../utility/Utility';
import styles from '../RecipieDetails/style';
import SelectDropdown from 'react-native-select-dropdown';
import globalStyles from '../../assets/globalStyles/index';
import strings from '../../constants/strings';
import {
  getRecipieInfoRequest,
  addRecipieToFavRequest,
  removeRecipieToFavRequest,
} from '../../redux/action/RecipieAction';
import HTMLView from 'react-native-htmlview';
import {
  addFoodToFavRequest,
  removeFoodToFavRequest,
} from '../../redux/action/AddFoodToFavAction';
import colors from '../../constants/colorCodes';
import DialogView from '../../component/dialog';
import {
  CircularProgress,
  GradientCircularProgress,
} from 'react-native-circular-gradient-progress';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../component/loader';
var userId = null;
var recipie_id = null;
const RecipieDetails = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLiked, setLike] = useState(false);
  const [recipieDetails, setRecipieDetails] = useState(null);
  const userData = useSelector(state => state.other.loginReducer.userData);
  const isLoading = useSelector(state => state.other.recipieReducer.showLoader);

  if (props) {
    recipie_id = props.route.params;
  }
  const backPress = () => {
    navigation.goBack();
  };
  useEffect(() => {
    if (userData) {
      userId = userData.id;
    }
    getRecipieDetails();
  }, []);

  const getRecipieDetails = () => {
    let payload = {rid: recipie_id, uid: userId};
    dispatch(getRecipieInfoRequest(payload, onS, onF));
  };
  const onS = resolve => {
    const {data, is_multiple} = resolve;
    setRecipieDetails(data);
  };

  const onF = reject => {
    Utility.getInstance().inflateToast(reject);
  };

  const CarbsBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: colors.primary,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.redC,
              styles.font20,
            ]}>
            {`Carbs: `}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          {recipieDetails?.is_multiple ? (
            <FlatList
              key={'#'}
              data={recipieDetails?.carbs}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => '+' + item?.item?.name.toString() + 1.1}
              contentContainerStyle={{alignItems: 'flex-start'}}
              renderItem={item => multiple(item, 'carbs')}></FlatList>
          ) : (
            <FlatList
              key={'_'}
              data={recipieDetails?.carbs}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => '_' + item.toString() + 80}
              contentContainerStyle={{alignItems: 'flex-start'}}
              renderItem={renderCarbsItem}></FlatList>
          )}
        </View>
      </View>
    );
  };
  const multiple = (data, type) => {
    const {item} = data;
    return (
      <View style={{flexDirection: 'column'}}>
        <Text
          style={[
            styles.forgot_pass_heading,
            styles.whydesc,
            styles.redC,
            styles.font16,
            {color: colors.white},
          ]}>
          {item?.name}
        </Text>
        {type == 'carbs' && (
          <FlatList
            numColumns={5}
            horizontal={false}
            data={item?.data}
            renderItem={renderCarbsItem}></FlatList>
        )}
        {type == 'fat' && (
          <FlatList
            numColumns={5}
            horizontal={false}
            data={item?.data}
            renderItem={renderFatItem}></FlatList>
        )}
        {type == 'protein' && (
          <FlatList
            numColumns={5}
            horizontal={false}
            data={item?.data}
            renderItem={rendeProteinItem}></FlatList>
        )}
      </View>
    );
  };

  const renderCarbsItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.CARBS_IMAGE.CARBS_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image style={styles.bucketImg} source={images.APP.RED_EMPTY}></Image>
      );
  };

  const FatBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          backgroundColor: colors.primary,
          //alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.orange,
              styles.font20,
            ]}>
            {`Fats:`}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          {recipieDetails?.is_multiple ? (
            <FlatList
              key={'##'}
              data={recipieDetails?.fat}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => '##' + item?.item?.name.toString() + 1.1}
              contentContainerStyle={{alignItems: 'flex-start'}}
              renderItem={item => multiple(item, 'fat')}></FlatList>
          ) : (
            <FlatList
              key={'__'}
              data={recipieDetails?.fat}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => '__' + item.toString() + 80}
              contentContainerStyle={{alignItems: 'flex-start'}}
              renderItem={renderFatItem}></FlatList>
          )}
        </View>
      </View>
    );
  };
  const renderFatItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.FAT_IMAGE.ORANGE_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image
          style={styles.bucketImg}
          source={images.APP.ORANGE_EMPTY}></Image>
      );
  };
  const ProteinBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 20,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.green,
              styles.font20,
            ]}>
            {`Protein: `}
          </Text>
        </View>

        <View style={{flex: 0.8}}>
          {/* <Text
            style={[
              styles.forgot_pass_heading,
              styles.whydesc,
              styles.green,
              styles.font20,
            ]}>
            {recipieDetails?.protein_serving}
          </Text> */}

          {recipieDetails?.is_multiple ? (
            <FlatList
              key={'###_'}
              data={recipieDetails?.protein}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => '###_' + item?.item?.name.toString() + 1.12}
              contentContainerStyle={{alignItems: 'flex-start'}}
              renderItem={item => multiple(item, 'protein')}></FlatList>
          ) : (
            <FlatList
              key={'___+'}
              data={recipieDetails?.protein}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => '___+' + item.toString() + 0.1}
              contentContainerStyle={{alignItems: 'flex-start'}}
              renderItem={rendeProteinItem}></FlatList>
          )}
        </View>
      </View>
    );
  };
  const rendeProteinItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.PROTEIN_IMAGE.PROTEIN_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image style={styles.bucketImg} source={images.APP.GREEN_EMPTY}></Image>
      );
  };
  const WaterBucketView = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 20,
          flex: 1,
        }}>
        <View style={{flex: 0.2}}>
          <Text
            style={[styles.forgot_pass_heading, styles.whydesc, styles.blue]}>
            {`Water:`}
          </Text>
        </View>
        <View style={{flex: 0.8}}>
          <FlatList
            data={recipieDetails?.water}
            numColumns={6}
            keyExtractor={item => item.toString() + 20.1}
            contentContainerStyle={{alignItems: 'flex-start'}}
            renderItem={renderWaterItem}></FlatList>
        </View>
      </View>
    );
  };
  const renderWaterItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.WATER_IMAGE.WATER_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image style={styles.bucketImg} source={images.APP.BLUE_EMPTY}></Image>
      );
  };

  const renderVegItem = item => {
    if (item.item == 100) {
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_100}></Image>
      );
    } else if (item.item == 75)
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_75}></Image>
      );
    else if (item.item == 50)
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_50}></Image>
      );
    else if (item.item == 25)
      return (
        <Image
          style={styles.bucketImg}
          source={images.VEG_IMAGE.VEG_25}></Image>
      );
    else if (item.item == 0)
      return (
        <Image
          style={styles.bucketImg}
          source={images.APP.VEGGIE_EMPTY}></Image>
      );
  };
  const DefautView = () => {
    return (
      <View style={[styles.flex, {backgroundColor: colors.primary}]}>
        <View style={styles.flex}>
          <View style={[globalStyles.center]}>
            <Text
              style={[
                styles.why_heading,
                styles.font23,
                globalStyles.padding_20_hor,
              ]}>
              {recipieDetails?.name}
            </Text>
            <Text
              style={[
                styles.why_heading,
                styles.font16,
                globalStyles.padding_20_hor,
              ]}>
              {'Preperation time: ' +
                recipieDetails?.prep_time +
                ', Cook time: ' +
                recipieDetails?.cook_time}
            </Text>
            {recipieDetails && (
              <Text
                style={[
                  styles.why_heading,
                  styles.font16,
                  globalStyles.padding_20_hor,
                ]}>
                {'Quantity: ' +
                  recipieDetails?.quantity +
                  ` ` +
                  recipieDetails?.unit}
              </Text>
            )}

            {recipieDetails?.serves != '' && (
              <Text
                style={[
                  styles.why_heading,
                  styles.font16,
                  globalStyles.padding_20_hor,
                ]}>
                {'Serves: ' + recipieDetails?.serves}
              </Text>
            )}
            <View style={[styles.addfoodc1, styles.flex_row]}>
              <View style={styles.myfavlistcontainerchildColumn}>
                <Image
                  style={styles.imageDrop}
                  source={
                    recipieDetails?.image
                      ? {uri: recipieDetails?.image}
                      : images.SPLASH.SPLASH
                  }></Image>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.progressbar}>
                  <GradientCircularProgress
                    startColor={colors.primary}
                    middleColor={colors.secondary}
                    endColor={colors.primary}
                    size={65}
                    emptyColor={colors.black}
                    progress={recipieDetails?.progress_bar}
                    style={{backgroundColor: 'black'}}
                    strokeWidth={7}>
                    <Text style={[styles.lbs, {color: colors.white}]}>
                      {recipieDetails?.calories}
                    </Text>
                  </GradientCircularProgress>
                  <Text
                    style={[
                      styles.bucketSize,
                      globalStyles.mt_10,
                      styles.headingtextBlack,
                      {color: colors.white},
                    ]}>
                    {strings.calories}
                  </Text>
                </View>
              </View>
            </View>
            {recipieDetails?.ingredients != '' && (
              <View
                style={{
                  paddingHorizontal: 20,
                  marginTop: 7,
                  paddingVertical: 15,
                  backgroundColor: 'white',
                  width: '100%',
                }}>
                <Text style={[styles.why_heading, styles.font23]}>
                  {'Ingredients'}
                </Text>
                {recipieDetails?.ingredients != '' && (
                  <HTMLView value={recipieDetails?.ingredients} />
                )}
              </View>
            )}

            {recipieDetails?.directions != '' && (
              <View
                style={{
                  paddingHorizontal: 20,
                  marginTop: 20,
                  paddingVertical: 15,
                  backgroundColor: 'white',
                  width: '100%',
                }}>
                <Text style={[styles.why_heading, styles.font23]}>
                  {'Directions'}
                </Text>

                {recipieDetails?.directions != '' && (
                  <HTMLView value={recipieDetails?.directions} />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
  return (
    <ScrollView
      style={{backgroundColor: colors.primary}}
      showsVerticalScrollIndicator={false}>
      <Header onBackPress={() => backPress()} />
      {isLoading ? (
        <View
          style={{
            height: Utility.getInstance().dH(120),
          }}>
          <Loader isLoading={isLoading}></Loader>
        </View>
      ) : (
        <>
          {DefautView()}
          {CarbsBucketView()}
          {FatBucketView()}
          {ProteinBucketView()}
        </>
      )}
    </ScrollView>
  );
};
export default RecipieDetails;
