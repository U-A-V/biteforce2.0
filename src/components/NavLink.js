import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';

const NavLink = ({navigation, text, routeName}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(routeName)}
      style={[
        styles.signIn,
        {
          borderColor: '#009387',
          borderWidth: 1,
          marginTop: 15,
        },
      ]}>
      <Text
        style={[
          styles.textSign,
          {
            color: '#009387',
          },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  signIn: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default withNavigation(NavLink);
