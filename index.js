/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import Video from './Video';
import {name as appName} from './app.json';
console.disableYellowBox = true;

console.reportErrorsAsExceptions = false;
LogBox.ignoreLogs(['Warning: ...']); //Hide warnings
AppRegistry.registerComponent(appName, () => App);
