import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Modal, TouchableOpacity, Image } from 'react-native';
import AddPatientForm from '../components/addPatientForm';
import { SafeAreaView } from 'react-navigation';
import DashboardHeader from '../shared/dashboardHeader';
import { SearchBar } from 'react-native-elements';
import { Icon, Fab, Button } from 'native-base';
import Card from '../shared/card';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import UserAvatar from 'react-native-user-avatar';

const DashboardScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dataFetch();
    // return;
    
  }, []);

  function dataFetch() {
    const user = auth().currentUser;
    const onValueChange = database()
      .ref('/users/' + user.uid)
      .on('value', function (snapshot) {
        var temp = [];
        snapshot.forEach((data) => {
          var list = data.val();
          list.key = data.key;
          temp.push(list);
        })
        temp.reverse();
        setPatientList(temp);
        setSearchList(temp);
    });
    return () => {
      database()
      .ref('/users/' + user.uid)
      .off('value', onValueChange);
    }
  }

  function modalToggle(flag) {
    setModalOpen(flag);
  }

  function updateSearch(search) {
    setSearch(search);
    console.log(search);
    const text = search.toLowerCase().trim();
    const list = patientList.filter((item) => {
      if (item.Name.toLowerCase().includes(text)) {
        return true;
      }
      return false;
    });
    setSearchList(list);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        round
        searchIcon={{ size: 24 }}
        placeholder="Search patient..."
        lightTheme
        onChangeText={updateSearch}
        value={search}
        inputStyle={{ margin: 0 }}
        inputContainerStyle={{ backgroundColor: 'white' }}
        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent', }}
      />
      <FlatList
        data={searchList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PatientDetail', item)}>
            <Card>
              <View style={{ flexDirection: 'row' }}>
                <UserAvatar size={60} name={item.Name} style={styles.profileImage} />
                <View style={{ flexDirection: 'column', justifyContent: 'center', marginStart: 10, }}>
                  <Text style={styles.text}>{item.Name}</Text>
                  <Text style={styles.subText}>{item.Age}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalOpen} animationType='slide'>
        <View style={styles.modalContent}>
          <Icon
            name='arrow-back'
            size={28}
            style={styles.modalClose}
            onPress={() => modalToggle(false)}
          />
          <AddPatientForm closeModal={modalToggle} />
        </View>
      </Modal>
      <Fab
        style={styles.modalToggle}
        onPress={() => modalToggle(true)}>
        <Icon name="add" />
      </Fab>
    </SafeAreaView>
  );
};

DashboardScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => <DashboardHeader />,
    headerTintColor: '#fff',
    headerStyle: { height: 60, backgroundColor: '#0fc1a7' },
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginBottom: 10,
    padding: 10,
  },
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0fc1a7',
    color: 'white',
    elevation: 5,
    backgroundColor: '#0fc1a7',
    padding: 12,
    borderRadius: 30,
    alignSelf: 'center',
  },
  modalClose: {
    marginTop: 15,
    left: 5,
    padding: 8,
    marginBottom: 10,
    color: 'black',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#333',
  },
  subText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'grey',
  },
  profileImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    margin: -2,
    marginRight: 0,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10
  },
  searchInputContainer: {
    backgroundColor: 'white',
  }
});

export default DashboardScreen;
