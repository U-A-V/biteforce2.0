import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Context as AuthContext} from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import {Divider, Text, Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {ScrollView} from 'react-native-gesture-handler';

const SignupScreen = ({navigation}) => {
  const {state, signup, clearErrorMessage} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={clearErrorMessage} />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <ScrollView showsVerticalScrollIndicator={false}>
          <AuthForm
            errorMessage={state.errorMessage}
            onSubmit={signup}
            submitButtonText="Sign Up"
          />
          <NavLink text="Sign In" routeName="Signin" />
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

SignupScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
  },
  signIn: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  googleSignin: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  textSign: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerStyle: {
    width: 100,
    height: 2,
    backgroundColor: 'grey',
  },
  dividerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    fontSize: 18,
    textAlignVertical: 'top',
    marginHorizontal: 10,
    color: 'grey',
  },
});

export default SignupScreen;
