import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { Button } from 'react-native-elements';
import { ProgressDialog } from 'react-native-simple-dialogs';
import BluetoothSerial from 'react-native-bluetooth-serial';
import uuid from 'react-native-uuid';

class OfflineReadingScreen extends Component {

  constructor(props) {
    super(props);
    this.connectionLost = this.connectionLost.bind(this);
    this.state = {
      selectedIndex: -1,
      patients: {},
      phoneNumber: this.props.navigation.state.params.Phone_Number,
      progressVisible: false,
      tableHead: ['Mode', 'Force Value'],
      tableTitle: ['Left Bilateral', 'Right Bilateral', 'Incisors', 'Left Unilateral', 'Right Unilateral'],
      tableData: [
        ['0'],
        ['0'],
        ['0'],
        ['0'],
        ['0']
      ],
      lb: 0,
      rb: 0,
      lu: 0,
      ru: 0,
      in: 0,
      data: [{
        value: 'Left Bilateral',
      }, {
        value: 'Right Bilateral',
      }, {
        value: 'Incisors',
      }, {
        value: 'Left Unilateral',
      }, {
        value: 'Right Unilateral',
      }]
    }
  }

  componentDidMount() {
    this.loadPatients();
    BluetoothSerial.on('connectionLost', this.connectionLost);
  }

  componentWillUnmount() {
    BluetoothSerial.removeListener('connectionLost', this.connectionLost);
  }

  setVisible(flag) {
    this.setState({
      'progressVisible': flag
    });
  }

  loadPatients = async () => {
    try {
      const getPatients = await AsyncStorage.getItem('patients');
      const parsedPatients = JSON.parse(getPatients);
      this.setState({ patients: parsedPatients || {} });
    } catch (err) {
      alert('Application Error. Cannot load data.')
    }
  }

  savePatients = newPatients => {
    const savePatients = AsyncStorage.setItem('patients', JSON.stringify(newPatients))
  }

  addPatient = () => {
    this.setState({
      progressVisible: true
    });
    const newPatientItem = 'sdf';
    if (newPatientItem !== '') {
      this.setState(prevState => {
        const ID = uuid.v1();
        const newPatientObject = {
          [ID]: {
            id: ID,
            phoneNumber: this.state.phoneNumber,
            leftBilateral: this.state.lb,
            rightBilateral: this.state.rb,
            leftUnilateral: this.state.lu,
            rightUnilateral: this.state.ru,
            incissor: this.state.in,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          patients: {
            ...prevState.patients,
            ...newPatientObject
          }
        }
        this.savePatients(newState.patients)
        this.setState({
          progressVisible: false
        });
        return { ...newState }
      })
    }
  }


  addPatientData = async (data) => {
    // console.log(data);
    // this.setVisible(true);
    this.addPatient();
    // await AsyncStorage.clear();
    console.log(this.state.patients);
  }

  connectionLost() {
    console.log('connectionLost');
    Alert.alert(
      "Connection Lost",
      "Please connect again to Bite Force Device",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            BluetoothSerial.list()
              .then((val) => {
                this.setState({ devices: val, discovering: false });
              });
          }
        }
      ],
      { cancelable: false }
    );
  }


  isDropDownSelected = () => {
    if (this.state.selectedIndex == -1) {
      Alert.alert(
        "Alert",
        "Please Select Mode",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    } else {
      this.modalToggle(true);
    }
  }

  readDataFromBluetooth() {
    // console.log('read started');
    BluetoothSerial.readFromDevice()
      .then((data) => {
        var tmp = data.trim();
        if (tmp === '') {
          Alert.alert(
            "Alert",
            "No data found!",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        } else {
          console.log(tmp);
          var res = tmp.split(" ");
          // console.log(res);
          switch (res[0]) {
            case '1': this.setState({
              lu: res[1]
            })
              break;
            case '2': this.setState({
              ru: res[1]
            })
              break;
            case '3': this.setState({
              lb: res[1]
            })
              break;
            case '4': this.setState({
              rb: res[1]
            })
              break;
            case '5': this.setState({
              in: res[1]
            })
              break;
          }
          this.setState({
            'tableData': [
              [this.state.lb],
              [this.state.rb],
              [this.state.in],
              [this.state.lu],
              [this.state.ru]
            ]
          });
        }
      })
  }

  render() {
    const state = this.state;
    const { navigate } = this.props.navigation;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderWidth: 1 }}>
              <Row data={state.tableHead} flexArr={[1, 1]} style={styles.head} textStyle={styles.headText} />
              <TableWrapper style={styles.wrapper}>
                <Col data={state.tableTitle} style={styles.title} heightArr={[28, 28]} textStyle={styles.tableText} />
                <Rows data={state.tableData} flexArr={[1]} style={styles.row} textStyle={styles.tableText} />
              </TableWrapper>
            </Table>
          </View>

          <View style={styles.horizontalButtonContainer}>
            <View style={{ flex: 1, marginRight: 5 }} >
              <Button raised title='Measure' type="outline" buttonStyle={styles.buttonOutline} onPress={() => { this.readDataFromBluetooth() }} titleStyle={{ color: '#0fc1a7' }} />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Button raised title='Save' buttonStyle={styles.button} onPress={() => { this.addPatientData(this.props.navigation.state.params.Phone_Number); }} />
            </View>
          </View>
          <ProgressDialog
            visible={state.progressVisible}
            title="Adding Data"
            message="Please, wait..."
            activityIndicatorColor="green"
            activityIndicatorSize={30}
          />
        </View>
      </ScrollView>
    )
  }
}

OfflineReadingScreen.navigationOptions = {
  headerTitle: 'Offline Readings',
  headerTintColor: '#fff',
  headerStyle: { height: 60, backgroundColor: '#0fc1a7' },
};

export default OfflineReadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flex-start',
  },
  heading: {
    marginTop: 50,
    marginBottom: 5,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  horizontalButtonContainer: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
  },
  tableContainer: {
    marginHorizontal: 20,
    marginVertical: 30,

  },
  head: {
    height: 40,
    backgroundColor: '#28728f'
  },
  wrapper: {
    flexDirection: 'row'
  },
  title: {
    flex: 1,
    backgroundColor: 'white'
  },
  row: {
    height: 28,
    backgroundColor: 'white'
  },
  tableText: {
    textAlign: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  headText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  dropDown: {
    marginHorizontal: 40,
    marginVertical: 10
  },
  buttonContainer: {
    marginHorizontal: 40,
    marginVertical: 20
  },
  button: {
    backgroundColor: '#0fc1a7',
    borderRadius: 30,
  },
  buttonOutline: {
    color: '#0fc1a7',
    borderColor: '#0fc1a7',
    borderWidth: 1,
    borderRadius: 30
  },
  divider: {
    height: 2,
    width: '50%',
    backgroundColor: '#275f8e',
    alignSelf: 'center'
  },
  modalClose: {
    marginTop: 25,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'red',
    color: 'white',
    elevation: 5,
    backgroundColor: 'red',
    borderRadius: 30,
    alignSelf: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
