import React from 'react';
import { Image } from 'react-native';
import { AppLoading, Asset, Font, registerRootComponent, KeepAwake, Notifications, Linking } from 'expo';
import { AppContainer } from './nav/router';
import NavigationService from './nav/NavigationService';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

import { Provider, connect, dispatch } from 'react-redux';
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import constants from './constants';
const { c, storeData, retrieveData } = constants;

import SocketIO from './components/SocketIO';
import BackgroundPedometer from './components/BackgroundPedometer';
import NotificationListeners from './components/NotificationListeners';

import { withNavigation } from 'react-navigation';

if (__DEV__) {
  KeepAwake.activate();
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isReady: false,
      newPlayerModalVisible: false,
      notification: false
    }
  }

  cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  _loadResourcesAsync = async () => {
    const { dispatch } = this.props

    const imageAssets = this.cacheImages([
      require('../assets/logo.png'),
      require('../assets/bg.png'),
      require('../assets/blankavatar.png'),
      require('../assets/buttontexture1.png'),
      require('../assets/buttontexture2.png'),
      require('../assets/buttontexture3.png'),
      require('../assets/checked.png'),
      require('../assets/selected.png'),
      require('../assets/splash2.png'),
      require('../assets/safehouse_bg.png'),
      require('../assets/event_bg.png'),
      require('../assets/victory_bg.png'),
      require('../assets/use_item_bg.png'),
      require('../assets/attack_bg.png'),
      require('../assets/food/Apple.png'),
      require('../assets/food/Baked_Beans.png'),
      require('../assets/food/Beer.png'),
      require('../assets/food/Dry_meat.png'),
      require('../assets/food/Energy_Drink.png'),
      require('../assets/food/Pasta.png'),
      require('../assets/food/Pepsi.png'),
      require('../assets/food/Pure_water.png'),
      require('../assets/food/Sugar.png'),
      require('../assets/medication/Bandages-0.png'),
      require('../assets/medication/First_Aid_Kit.png'),
      require('../assets/medication/Healing_salve.png'),
      require('../assets/medication/Metocaine.png'),
      require('../assets/medication/Tidocycline.png'),
      require('../assets/medication/Tratodonide.png'),
      require('../assets/weapons/Baseball_Bat.png'),
      require('../assets/weapons/Cleveland.png'),
      require('../assets/weapons/Colt_Python.png'),
      require('../assets/weapons/Crowbar.png'),
      require('../assets/weapons/Golf_Club.png'),
      require('../assets/weapons/Hammer.png'),
      require('../assets/weapons/Hockey_Stick.png'),
      require('../assets/weapons/Iron_Pickaxe.png'),
      require('../assets/weapons/Shotgun-0.png'),
    ]);

    await Promise.all([
      Font.loadAsync({
        'gore': require('../assets/fonts/goreRough.otf'),
        'verdana': require('../assets/fonts/verdana.ttf'),
        'verdanaBold': require('../assets/fonts/verdanaBold.ttf'),
      }),
      ...imageAssets,
    ]);


    let localPlayer = await retrieveData('playerInfo')
    
    const dud = {
      id: false,
      campaignId: false
    }
    if (!localPlayer) {
      localPlayer = dud
      await this.setState({
        newPlayerModalVisible: true,
      })
    } else {
      localPlayer = JSON.parse(localPlayer) 
    }
    await this.setState({ localPlayer })

  };

  _handleLoadingError = error => {
    console.warn(error);
  }

  _handleFinishLoading = async () => {

    await this.setState({
      isReady: true
    });

    Linking.addEventListener('url', event => this.handleOpenURL(event.url));
  }
  
  _passNotificationToStart = (notification) => {
    this.setState({ notification })
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  async handleOpenURL(url) {
    let { path, queryParams } = await Linking.parse(url);
    
    store.dispatch( { type : c.SET_REDIRECT_ACTION, path: path, queryParams: queryParams });

    NavigationService.navigate('AuthCheck');
  }

  render() {
    if (!this.state.isReady) {
      console.log("Loading App Initialized");
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onFinish={this._handleFinishLoading}
          onError={this._handleLoadingError}
        />
      );
    }
    
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <SocketIO />
          <NotificationListeners />
          
          <AppContainer
            onNavigationStateChange={(prevState, currentState, action) => {
              
            }}

            ref={ async (navigatorRef) => {
              const { path, queryParams } = await Linking.parseInitialURLAsync();
    
            if (path) {
              console.log("inside AppContainer" + navigatorRef.router);
              store.dispatch( { type: c.SET_REDIRECT_ACTION ,  path: path, queryParams: queryParams }  );
            }
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            
            screenProps={{
              backgroundImage: require('../assets/bg.png'),
              notification: this.state.notification,
            }}
          />
        </PersistGate>
      </Provider>
    );
  }
}

registerRootComponent(App)

const mapStateToProps = (state) => {
  return {
    player: state.player,
  }
}

export default connect(mapStateToProps)(App);
