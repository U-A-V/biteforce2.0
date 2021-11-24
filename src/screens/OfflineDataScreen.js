import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
// import Card from '../shared/card';
import _values from 'lodash.values';
import { Button, Accordion } from "native-base";
import FormData from 'form-data';
import { apiCredentails } from '../api-credentials';
import { ProgressDialog } from 'react-native-simple-dialogs';

const OfflineDataScreen = ({ navigation }) => {
  const [progressVisible, setProgressVisible] = useState(false);
  const [data, setData] = useState({});
  const [dataArray, setDataArray] = useState([]);

  // const dataArray = [
  //   { title: "First Element", content: "Lorem ipsum dolor sit amet" },
  //   { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
  //   { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
  // ];

  function _renderHeader(item, expanded) {
    return (
      <View>
        <Divider style={{ backgroundColor: 'grey', opacity: 0.5 }} />
        <View style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: 'space-between',
          alignItems: "center",
          backgroundColor: "white"
        }}>

          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {" "}{item.title}
          </Text>
          {
            // console.log(new Date(item.createdAt))
          }
          <Button style={{ borderColor: 'green', borderRadius: 10, backgroundColor: '#0fc1a7' }} onPress={() => { syncPatient(item.id) }}>
            <Text style={{ color: 'white', paddingHorizontal: 10 }}>Sync</Text>
          </Button>
          {expanded
            ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
            : <Icon style={{ fontSize: 18 }} name="add-circle" />}

        </View>
      </View>
    );
  }
  function _renderContent(item) {
    return (
      <View
        style={{
          backgroundColor: "#e3f1f1",
          fontStyle: "italic",
        }}
      >
        <Text
          style={{
            padding: 10,
            fontStyle: "italic",
          }}
        >
          {item.content}
        </Text>
        <Button style={{ margin: 10, marginTop: 0, backgroundColor: 'crimson', borderRadius: 10 }} onPress={() => { deletePatient(item.id) }}>
          <Text style={{ color: 'white', paddingHorizontal: 10 }}>Delete</Text>
        </Button>
      </View>
    );
  }

  useEffect(() => {
    const focused = navigation.isFocused();
    if (focused) {
      dataFetch();
    }
    const navFocusListener = navigation.addListener('didFocus', () => {
      // do some API calls here
      dataFetch();
      console.log('listener section');
    });
    return () => {
      navFocusListener.remove();
    };

    // return;
  }, []);

  async function dataFetch() {
    try {
      const getPatients = await AsyncStorage.getItem('patients')
      const parsedPatients = JSON.parse(getPatients)
      setData(parsedPatients);
      // console.log(data)
      var tmp = _values(parsedPatients);
      var tmp2 = [];
      tmp.forEach((item) => {
        // console.log(item)
        var str = `Left Bilateral: ${item.leftBilateral} \nRight Bilateral: ${item.rightBilateral} \nLeft Unilateral: ${item.leftUnilateral} \nRight Unilateral: ${item.rightUnilateral} \nIncisors: ${item.incissor}`;
        tmp2.push({ title: item.phoneNumber, content: str, id: item.id, createdAt: item.createdAt });
      })
      setDataArray(tmp2);
      // console.log(tmp);
    } catch (err) {
      alert('Application Error. Cannot load data.')
    }
  }

  function savePatients(newPatients) {
    const savePatients = AsyncStorage.setItem('patients', JSON.stringify(newPatients))
  }

  function deletePatient(id) {
    console.log(id)
    Alert.alert(
      "Alert!",
      `Are sure you want to delete?`,
      [
        {
          text: "NO",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "YES", onPress: () => {
            delete data[id];
            savePatients(data);
            dataFetch();
          }
        }
      ],
      { cancelable: false }
    );
  }

  function syncPatient(id) {
    // console.log(data);
    Alert.alert(
      "Alert!",
      `Are sure you want to sync?`,
      [
        {
          text: "NO",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "YES", onPress: () => {
            setProgressVisible(true);
            var obj = data[id];
            console.log(obj);
            var bodyData = new FormData();
            bodyData.append('action', 'addItem');
            bodyData.append('sheetName', obj.phoneNumber);
            bodyData.append('lb', obj.leftBilateral);
            bodyData.append('rb', obj.rightBilateral);
            bodyData.append('inc', obj.incissor);
            bodyData.append('lu', obj.leftUnilateral);
            bodyData.append('ru', obj.rightUnilateral);
            try {
              fetch(apiCredentails.scriptURL, {
                method: 'POST',
                body: bodyData,
              })
                .then((response) => response.text())
                .then((json) => {
                  // this.setVisible(false);
                  setProgressVisible(false);
                  if (json === 'Success') {
                    // this.refs.toast.show('Success');
                    delete data[id];
                    savePatients(data);
                    dataFetch();
                    console.log('success');
                  } else {
                    // this.refs.toast.show(json);
                  }
                  // Toast.show(json);
                })
                .catch((error) => console.error(error));
            } catch (e) {
              // this.setVisible(false);
              setProgressVisible(false);
              console.log(e.message);
            }
          }
        }
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Accordion
          dataArray={dataArray}
          animation={true}
          expanded={true}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
        />
        <ProgressDialog
          visible={progressVisible}
          title="Syncing Data"
          message="Please, wait..."
          activityIndicatorColor="green"
          activityIndicatorSize={30}
        />
      </View>
    </View>
  );
};

OfflineDataScreen.navigationOptions = {
  headerTitle: 'Offline Data',
  headerTintColor: '#fff',
  headerStyle: { height: 60, backgroundColor: '#0fc1a7' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,

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
});

export default OfflineDataScreen;
