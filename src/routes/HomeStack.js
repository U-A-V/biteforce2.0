import {createStackNavigator} from 'react-navigation-stack';
import TestScreen from '../screens/TestScreen';

import React from 'react';

const screens = {
  TestScreen: {
    screen: TestScreen,
  },
  // DashboardScreen: {
  //     screen: DashboardScreen,
  //     navigationOptions: ({ navigation }) => {
  //         return {
  //             headerTitle: () => <DashboardHeader navigation={navigation}/>,
  //             headerTintColor: '#fff',
  //             headerStyle: { height: 90, backgroundColor: '#0fc1a7'}
  //         }
  //     }

  // },
  // PatientDataScreen: {
  //     screen: PatientDataScreen,
  //     navigationOptions: ({ navigation }) => {
  //         return {
  //             headerLeft: () => <PatientHeader navigation={navigation}/>,
  //             headerTitle: () => {null},
  //             headerTransparent: true
  //         }
  //     }
  // },
  // BiteForceScreen: {
  //     screen: BiteForceScreen,
  //     navigationOptions: ({ navigation }) => {
  //         return {
  //             headerLeft: () => {null},
  //             headerTitle: () => <BiteForceHeader navigation={navigation} />,
  //             headerTintColor: 'white',
  //             headerStyle: { backgroundColor: '#0fc1a7' },

  //         }
  //     }
  // },
};

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#fff',
    headerStyle: {backgroundColor: '#0fc1a7'},
  },
});

export default HomeStack;
