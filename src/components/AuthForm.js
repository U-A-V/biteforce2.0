import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Button, Input} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Spacer from './Spacer';

const AuthForm = ({errorMessage, onSubmit, submitButtonText}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Input
        label="Your Email Address"
        placeholder="email@gmail.com"
        leftIcon={{type: 'material', name: 'email', color: 'grey'}}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <Input
        secureTextEntry
        label="Password"
        placeholder="Password"
        leftIcon={{type: 'material', name: 'lock', color: 'grey'}}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        errorMessage={errorMessage}
      />
      {
        // {errorMessage ? (
        //   <Text style={styles.errorMessage}>{errorMessage}</Text>
        // ) : null}
      }
      <TouchableOpacity
        style={styles.signIn}
        onPress={() => onSubmit({email, password})}>
        <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.signIn}>
          <Text
            style={[
              styles.textSign,
              {
                color: '#fff',
              },
            ]}>
            {submitButtonText}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
  },
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

export default AuthForm;
