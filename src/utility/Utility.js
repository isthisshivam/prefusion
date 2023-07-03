import {Dimensions, PixelRatio} from 'react-native';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
export const standardDeviceSize = {width: 375, height: 667};
const SUNDAY = 'Sunday';
export default class Utility {
  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new Utility();
    }
    return this.myInstance;
  }
  removeDuplicates(arr) {
    const unique = arr.filter((obj, index) => {
      return index === arr.findIndex(o => obj.measure === o.measure);
    });
    return unique;
    // return arr.filter((item, index) => console.log('remove=>', item));
  }
  // arr.indexOf(item.measure) === index
  isSunday() {
    const date = moment().format('dddd');
    console.log('isSunday=>', date);
    if (date === SUNDAY) return true;
    else false;
  }
  setGoalBucketCounts(goalBucketCounts) {
    global.goalBucketCounts = goalBucketCounts;
  }
  getGoalBucketCounts() {
    return global.goalBucketCounts;
  }
  splitStartDate = date => {
    var startDate = date.split(' ');
    return startDate[0];
  };
  setBackRoute = route => {
    global.backRoute = route;
  };
  capitalize = str => {
    if (str) return `${str[0].toUpperCase()}${str.slice(1)}`;
    // return str[0].toUpperCase() + str.slice(1)   // without template string
  };

  isUpdatingFavoriteMeals = is_fav_meal => {
    global.is_fav_meal = is_fav_meal;
  };
  creatingAndUpdatingMeal = _ => {
    global.updateAndAddMeal = _;
  };
  isCreatingMealAndUpdatingMeal = () => {
    return global.updateAndAddMeal;
  };
  isFavoriteMeals = () => {
    return global.is_fav_meal;
  };
  GetCurrentDate() {
    return new Date();
  }
  GetNextDaysToStartDate(startDate) {
    if (!startDate) {
      console.log('No start date provided.');
      return;
    }
    var currentDate = moment(startDate);
    var weekStart = currentDate.clone().startOf('isoWeek');

    var days = [];
    for (i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format('MM/DD/YYYY'));
    }
    console.log('daysssss=>', weekStart, days, `${days[0]} - ${days[6]}`);
    return `${days[0]} - ${days[6]}`;
  }
  MonthAsString(monthIndex) {
    var d = new Date();
    var month = new Array();
    month[0] = 'January';
    month[1] = 'February';
    month[2] = 'March';
    month[3] = 'April';
    month[4] = 'May';
    month[5] = 'June';
    month[6] = 'July';
    month[7] = 'August';
    month[8] = 'September';
    month[9] = 'October';
    month[10] = 'November';
    month[11] = 'December';

    return month[monthIndex];
  }

  DayAsString(dayIndex) {
    var weekdays = new Array(7);
    weekdays[0] = 'Sunday';
    weekdays[1] = 'Monday';
    weekdays[2] = 'Tuesday';
    weekdays[3] = 'Wednesday';
    weekdays[4] = 'Thursday';
    weekdays[5] = 'Friday';
    weekdays[6] = 'Saturday';

    return weekdays[dayIndex];
  }
  async getCurrentDate() {
    return await moment.utc().format('MM/DD/YYYY,HH:mm:ssa');
  }
  async getCurrentDateUser() {
    return await moment().format('MM/DD/YYYY,HH:mm:ssa');
  }
  async getCurrentDateUserTime() {
    return await moment().format('HH:mm:ssa');
  }
  async getCurrentDateOnlyUser() {
    return await moment().format('MM/DD/YYYY');
  }

  dH = actualHeight => {
    const heightRatio = (actualHeight + 0) / standardDeviceSize.height;
    const windowHeight = Dimensions.get('window').height;
    const reqHeight = heightRatio * windowHeight;
    return reqHeight;
  };

  dW = actualWidth => {
    const widthRatio = (actualWidth + 0) / standardDeviceSize.width;
    const windowWidth = Dimensions.get('window').width;
    const reqWidth = widthRatio * windowWidth;
    return reqWidth;
  };
  inflateToast(message) {
    return Toast.show(message, Toast.SHORT);
  }

  async getStoreData(Key_to_be_fetched) {
    try {
      const value = await AsyncStorage.getItem(Key_to_be_fetched);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log('ERROR IN FETCHING ASYNC STORAGE DATA');
      return null;
    }
  }
  async saveSelectedDate(selected_date) {
    try {
      console.log('STORING DATA', 'DATE', 'data_to_save=', selected_date);
      await await AsyncStorage.setItem('DATE', JSON.stringify(selected_date));
    } catch (e) {
      console.log('ERROR WHILE STORING  DATA', e);
    }
  }
  async getSelectedDate() {
    try {
      const value = await AsyncStorage.getItem('DATE');
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (e) {
      console.log('ERROR WHILE STORING  DATA', e);
    }
  }

  async setStoreData(Key_to_be_paired, data_to_save) {
    try {
      console.log(
        'STORING DATA',
        Key_to_be_paired,
        'data_to_save=',
        data_to_save,
      );
      const value = await AsyncStorage.setItem(
        Key_to_be_paired,
        JSON.stringify(data_to_save),
      );
    } catch (e) {
      console.log('ERROR WHILE STORING  DATA', e);
    }
  }

  async clearDate() {
    await AsyncStorage.removeItem('DATE');
  }

  async removeStoreData(Key_to_be_removed) {
    try {
      await AsyncStorage.removeItem(Key_to_be_removed);
    } catch (e) {
      console.log('ERROR WHILE REMOVING  DATA', e);
    }
  }
  DH = () => {
    return height;
  };
  DW = () => {
    return width;
  };
  CC_BURL_WSURL(BASE_URL, API_URL) {
    return BASE_URL + API_URL;
  }
  widthToDp = number => {
    let givenWidth = typeof number === 'number' ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
    //will return a DPI(Density pixel ratio);
  };

  heightToDp = number => {
    let givenHeight = typeof number === 'number' ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((width * givenHeight) / 100);
    //will return a DPI(Density pixel ratio);
  };
  async hasWhiteSpace(s) {
    //return /\s/g.test(s);
    return s.indexOf(' ') >= 0;
  }
  isEmpty(item_to_check) {
    if (
      item_to_check == null ||
      item_to_check == undefined ||
      item_to_check == '' ||
      item_to_check == 'null'
    )
      return true;
    else return false;
  }
  isEmptyString(item_to_check) {
    if (item_to_check == '') return true;
    else return false;
  }
  isEmail = email => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
    );

    return pattern.test(email);
  };
  setTimeOut = (task, time) => {
    this.setTimeOut(() => {
      task;
    }, time);
  };
}
