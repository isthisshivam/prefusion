import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Text,
  PermissionsAndroid,
  Alert,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AppNavigator from './src/navigation/Navigator.js';
import {Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/store/store';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation'; //get user current location
import Geocoder from 'react-native-geocoder'; // get address from lat lng
import Utility from './src/utility/Utility.js';
import secrets from './src/constants/secrets.js';
import RNPermissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {memoize} from 'lodash';
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  // function memoize() {
  //   var cache = {};
  //   return function (num) {
  //     if (num in cache) {
  //       console.log('memoizeifffffff=>', num in cache);
  //       return cache[num];
  //     } else {
  //       cache[num] = num + 2;
  //       console.log('memoizelelse=>', cache[num]);
  //       return cache[num];
  //     }
  //   };
  // }
  // var data = memoize();
  // data(20);

  useEffect(() => {
    // const arry = [1, 2, 1, 3, 4, 3, 5];
    // const ToFindDuplicates = arry =>
    //  {
    // return   arry.filter((item, index) => arry.indexOf(item) !== index);
    //  }
    // const duplicateElementa = ToFindDuplicates(arry);
    // console.log({duplicateElementa});

    //  AsyncStorage.clear();
    if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: secrets.apiKey,
        authDomain: secrets.authDomain,
        projectId: secrets.projectId,
        storageBucket: secrets.storageBucket,
        messagingSenderId: secrets.messagingSenderId,
        appId: secrets.appId,
        measurementId: secrets.measurementId,
      };
      firebase.initalizing(firebaseConfig);
    }
    signInAnonymously();
    requestLocationPermission();
    // requestAppTrackingPermission();
  }, []);

  signInAnonymously = async () => {
    try {
      await auth().signInAnonymously();
    } catch (e) {
      console.error(e);
    }
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      let locationData = await Utility.getInstance().getStoreData(
        'LOCATION_DATA',
      );
      if (locationData) {
        getOneTimeLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
          } else {
            commonUtility.displayToast('Permission denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }
  };

  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //console.log('getOneTimeLocation position ', position);
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //console.log('getOneTimeLocation currentLongitude ', currentLongitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        // console.log('getOneTimeLocation currentLatitude ', currentLongitude);

        getLocationNameThroughLatLng(currentLatitude, currentLongitude);
        //getPlacedetails(currentLatitude, currentLongitude);
      },
      error => {
        //alert(JSON.stringify(error));
        console.log('error', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
      },
    );
  };

  const getLocationNameThroughLatLng = async (
    currentLatitude,
    currentLongitude,
  ) => {
    let alreadyLocation = await Utility.getInstance().getStoreData(
      'LOCATION_DATA',
    );
    if (alreadyLocation) {
      return;
    }
    let res = await Geocoder.geocodePosition({
      lat: parseFloat(currentLatitude),
      lng: parseFloat(currentLongitude),
    });
    var currentLocation = res[0]?.locality; /// got the city name
    var postalCode = res[0]?.postalCode; //got the postalCode
    var subAdminArea = res[0]?.subAdminArea; //got the sub city name
    var formattedAddress = res[0]?.formattedAddress;
    console.log('getLocationNameThroughLatLng=>', res);

    var location = {
      postalCode: postalCode,
      city: subAdminArea,
      currentLatitude: currentLatitude,
      currentLongitude: currentLongitude,
      locationName: currentLocation,
      formattedAddress: formattedAddress,
    };

    //storing location data in to store
    await Utility.getInstance().setStoreData('LOCATION_DATA', location);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
