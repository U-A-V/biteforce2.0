import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

class TestScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    async signOut() {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.props.navigation.navigate('LoginScreen');
        //   this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };
    render() {
        return (
            <View style={styles.container}>
                <Text>Test Screen</Text>
                <Button title='Sign Out' onPress={this.signOut}/>
            </View>
        );
    }
}

export default TestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});