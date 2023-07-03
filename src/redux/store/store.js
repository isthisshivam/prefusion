import {createStore, applyMiddleware} from 'redux';
import saga from '../saga/index';
import {combineReducers} from 'redux';

import {RootReducer, rootFoodIdReducer} from '../reducer/index';
import createSagaMiddleware from 'redux-saga';
import {
  persistStore,
  persistCombineReducers,
  persistReducer,
} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['loginReducer'],
};

const foodIdPersistConfig = {
  key: 'foodId',
  storage: AsyncStorage,
  whitelist: ['addFoodIdReducer'],
};
const rootReducer = combineReducers({
  food: persistReducer(foodIdPersistConfig, rootFoodIdReducer),
  other: persistReducer(rootPersistConfig, RootReducer),
});

const persistReduce = persistReducer(rootPersistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

//store
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);
sagaMiddleware.run(saga);
export {store, persistor};
