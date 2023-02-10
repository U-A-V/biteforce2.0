import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {LogBox} from 'react-native';
import AccountScreen from './screens/AccountScreen';
import BluetoothScreen from './screens/BluetoothScreen';
import BiteForceScreen from './screens/BiteForceScreen';
import OfflineReadingScreen from './screens/OfflineReadingScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import OfflineDataScreen from './screens/OfflineDataScreen';
import PatientDetailScreen from './screens/PatientDetailScreen';
import DashboardScreen from './screens/DashboardScreen';
import {Provider as AuthProvider} from './context/AuthContext';
import {setNavigator} from './navigationRef';
import ResolveAuthScreen from './screens/ResolveAuthScreen';
import {GoogleSignin} from '@react-native-community/google-signin';
import database from '@react-native-firebase/database';
import {Icon} from 'react-native-elements';

GoogleSignin.configure({
  webClientId:
    '1087711913624-oj5ntbek6s7snijti7merfdu48s2gf8m.apps.googleusercontent.com',
});

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    Signin: SigninScreen,
    Signup: SignupScreen,
  }),
  mainFlow: createBottomTabNavigator({
    Dashboard: {
      screen: createStackNavigator({
        Dashboard: DashboardScreen,
        PatientDetail: PatientDetailScreen,
        BluetoothScreen: {
          screen: BluetoothScreen,
          navigationOptions: {
            header: () => {
              null;
            },
          },
        },
        BiteForce: BiteForceScreen,
        OfflineReading: OfflineReadingScreen,
      }),
      navigationOptions: ({navigation}) => {
        let tabBarVisible = false;

        let routeName =
          navigation.state.routes[navigation.state.index].routeName;

        if (routeName === 'Dashboard') {
          tabBarVisible = true;
        }

        return {
          tabBarVisible,
          tabBarOptions: {
            activeTintColor: 'crimson',
            labelStyle: {
              fontSize: 12,
            },
            style: {paddingTop: 5},
          },
          tabBarIcon: ({tintColor}) => (
            <Icon
              name="dashboard"
              type="material"
              size={25}
              color={tintColor}
            />
          ),
        };
      },
    },
    Offline: {
      screen: createStackNavigator({
        Offline: OfflineDataScreen,
      }),
      navigationOptions: {
        tabBarLabel: 'Offline Data',
        tabBarOptions: {
          activeTintColor: '#0fc1a7',
          labelStyle: {
            fontSize: 12,
          },
          style: {paddingTop: 5},
        },
        tabBarIcon: ({tintColor}) => (
          <Icon name="cloud-off" type="material" size={25} color={tintColor} />
        ),
      },
    },
    Account: {
      screen: createStackNavigator({
        Account: AccountScreen,
      }),
      navigationOptions: {
        title: 'Account',
        tabBarOptions: {
          activeTintColor: 'dodgerblue',
          labelStyle: {
            fontSize: 12,
          },
          style: {paddingTop: 5},
        },
        tabBarIcon: ({tintColor}) => (
          <Icon name="person" type="material" size={25} color={tintColor} />
        ),
      },
    },
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  LogBox.ignoreAllLogs();

  return (
    <AuthProvider>
      <App
        ref={navigator => {
          setNavigator(navigator);
        }}
      />
    </AuthProvider>
  );
};
