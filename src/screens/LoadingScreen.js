import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-community/google-signin';

class LoadingScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        auth().onAuthStateChanged(() => {this.onAuthStateChanged()});
    }

    onAuthStateChanged(user) {
        if (user) {
            this.props.navigation.navigate('TestScreen', { name: user.displayName });
            console.log(user);
        } else {
            this.props.navigation.navigate('LoginScreen');
            console.log('navigating to login screen')
        }
    }
    
    async checkIfLoggedIn() {
        console.log('Loading Screen')
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            this.props.navigation.navigate('TestScreen');
        } else {
            this.props.navigation.navigate('LoginScreen');
        }
        // auth().onAuthStateChanged(user => {
        //     if (user) {
        //         this.props.navigation.navigate('TestScreen', {name: user.displayName});
        //     } else {
        //         this.props.navigation.navigate('LoginScreen');
        //     }
        // })
        // isSignedIn = async () => {
            
        //     this.setState({ isLoginScreenPresented: !isSignedIn });
        //   };
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>
        );
    }
}

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});