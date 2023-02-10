import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Header() {
  var str = 'Doctor';
  var str2 = 'Mr.';
  if (auth().currentUser.displayName !== null) {
    str = auth().currentUser.displayName;
    str2 = 'Dr.';
  }
  return (
    <View style={styles.header}>
      <View style={styles.firstHeader}>
        <View>
          <Text
            style={{fontWeight: 'bold', alignSelf: 'center', color: 'white'}}>
            Welcome
          </Text>
          <Text style={styles.headerText}>
            {str2} {str.replace(/^./, str[0].toUpperCase())}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstHeader: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  logoutIcon: {
    padding: 15,
    paddingStart: 10,
    position: 'absolute',
    left: 0,
  },
  profileIcon: {
    padding: 15,
    paddingEnd: 10,
    position: 'absolute',
    right: 0,
  },
});
