import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Text,
  StatusBar,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

class LoginScreen extends Component {

   constructor(props) {
     super(props);
     this.state = {
        // progressVisible: false
     };
   }

   componentDidMount() {
    GoogleSignin.configure({
      webClientId: '805396833886-tj3lhpjom972d3fvhq1n7dk3kttndvmd.apps.googleusercontent.com',
    });
  }

   async onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

   render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              this.onGoogleButtonPress().then(() => {
                console.log('Sign in works');
                this.props.navigation.navigate('TestScreen');
              })
            }}/>
            <Button title='Press me' onPress={() => {
              console.log('button pressed')
              this.props.navigation.navigate('TestScreen');
            }}/>
        </SafeAreaView>
      </>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
      marginEnd: 15
    }
});