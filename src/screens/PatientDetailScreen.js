import React from 'react';
import { StyleSheet, Image, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';

const PatientDetailScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <UserAvatar size={150} name={navigation.state.params.Name} style={styles.profileImage}/>
      <Text style={styles.text}>{navigation.state.params.Name}</Text>
      <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 10, color: 'black', fontWeight: '500' }}>Select Mode</Text>
      <View style={styles.buttonContainer}>
        <Button raised
          icon={
            <Icon
              name='bluetooth'
              type='material'
              size={30}
              color="white"
              containerStyle={{ marginRight: 10 }}
            />
          }
          title='Bluetooth'
          buttonStyle={{...styles.button, backgroundColor: 'royalblue'}}
          titleStyle={styles.buttonText}
          onPress={() => navigation.navigate('BluetoothScreen', navigation.state.params)} />
      </View>
      <View style={styles.buttonContainer}>
        <Button raised
          icon={
            <Icon
              name='wifi'
              type='material'
              size={30}
              color="white"
              containerStyle={{ marginRight: 10 }}
            />
          }
          title='Wifi'
          buttonStyle={{...styles.button, backgroundColor: 'red'}}
          iconContainerStyle={{marginRight: 10}}
          titleStyle={styles.buttonText}
          onPress={() => navigation.navigate('BiteForce', navigation.state.params)} />
      </View>
    </ScrollView>
  )
};

PatientDetailScreen.navigationOptions = {
  headerTitle: 'Patient Details',
  headerTintColor: '#fff',
  headerStyle: { height: 60, backgroundColor: '#0fc1a7' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    alignContent: 'center',
    // justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  text: {
    color: '#275f8e',
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 20
  },
  buttonContainer: {
    marginHorizontal: 40,
    marginVertical: 10
  },
  button: {
    backgroundColor: '#275f8e',
    paddingHorizontal: 20, 
    height: 50,
    borderRadius: 10,
    justifyContent: 'flex-start'
  },
  buttonText: {
    fontSize: 22,
    color: 'white',
  }
});

export default PatientDetailScreen;
