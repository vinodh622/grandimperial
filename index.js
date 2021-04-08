/**
 * @format
 */
import React from 'react'

 import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {Provider} from 'react-redux';
import configureStore from './Store/store';
import {PersistGate} from 'redux-persist/integration/react';




const {store, persistor} = configureStore();


 

const Root = () => (



    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  
  
  
  );
AppRegistry.registerComponent(appName, () => Root);
