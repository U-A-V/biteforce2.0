import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';
import {Button, Divider, Icon} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown';
import database from '@react-native-firebase/database';
import {ProgressDialog} from 'react-native-simple-dialogs';
import FormData from 'form-data';
import PatientDataChart from '../components/patientDataChart';
import {apiCredentails} from '../api-credentials';
// import { TouchableOpacity } from 'react-native-gesture-handler';

class BiteForceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      progressVisible: false,
      modalOpen: false,
      tableHead: ['Mode', 'Force Value'],
      tableTitle: [
        'Left Bilateral',
        'Right Bilateral',
        'Incisors',
        'Left Unilateral',
        'Right Unilateral',
      ],
      tableData: [['0'], ['0'], ['0'], ['0'], ['0']],
      mUserRef: null,
      data: [
        {
          value: 'Left Bilateral',
        },
        {
          value: 'Right Bilateral',
        },
        {
          value: 'Incisors',
        },
        {
          value: 'Left Unilateral',
        },
        {
          value: 'Right Unilateral',
        },
      ],
    };
  }

  componentDidMount() {
    this.state.mUserRef = database().ref('tempData/');
    this.state.mUserRef
      .once('value')
      .then(snap => {
        let data = snap.toJSON();
        this.setState({
          tableData: [
            [data.LeftBilateral],
            [data.RightBilateral],
            [data.Incissor],
            [data.LeftUnilateral],
            [data.RightUnilateral],
          ],
        });
      })
      .catch(error => {
        console.log(error.message);
        // Toast.show({
        //     text: error.message,
        //     buttonText: "Okay",
        //     type: "danger",
        //     position: 'top'
        // })
      });
  }

  componentWillUnmount() {
    this.state.mUserRef.off('value');
  }

  setVisible(flag) {
    this.setState({
      progressVisible: flag,
    });
  }

  modalToggle = flag => {
    this.setState({modalOpen: flag});
  };

  addPatientData = data => {
    // console.log(data);
    this.setVisible(true);
    const state = this.state;

    var bodyData = new FormData();
    bodyData.append('action', 'addItem');
    bodyData.append('sheetName', data);
    bodyData.append('lb', state.tableData[0][0]);
    bodyData.append('rb', state.tableData[1][0]);
    bodyData.append('inc', state.tableData[2][0]);
    bodyData.append('lu', state.tableData[3][0]);
    bodyData.append('ru', state.tableData[4][0]);
    try {
      fetch(apiCredentails.scriptURL, {
        method: 'POST',
        body: bodyData,
      })
        .then(response => response.text())
        .then(json => {
          this.setVisible(false);
          if (json === 'Success') {
            // this.refs.toast.show('Success');
          } else {
            // this.refs.toast.show(json);
          }
          // Toast.show(json);
        })
        .catch(error => console.error(error));
    } catch (e) {
      this.setVisible(false);
      console.log(e.message);
    }
  };

  isDropDownSelected = () => {
    if (this.state.selectedIndex === -1) {
      Alert.alert(
        'Alert',
        'Please Select Mode',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } else {
      this.modalToggle(true);
    }
  };

  measureValue = () => {
    console.log('measure');
    this.state.mUserRef.once('value').then(snap => {
      let data = snap.toJSON();
      this.setState({
        tableData: [
          [data.LeftBilateral],
          [data.RightBilateral],
          [data.Incissor],
          [data.LeftUnilateral],
          [data.RightUnilateral],
        ],
      });
    });
  };

  resetValues = () => {
    this.state.mUserRef
      .set({
        LeftBilateral: 0,
        RightBilateral: 0,
        Incissor: 0,
        LeftUnilateral: 0,
        RightUnilateral: 0,
      })
      .then(() => {
        this.measureValue();
        console.log('reset success!');
      });
    // console.log(this.state.mUserRef)
  };

  render() {
    const state = this.state;
    const {navigate} = this.props.navigation;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.resetContainer}
            onPress={() => this.resetValues()}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', marginHorizontal: 5}}>
              Reset
            </Text>
            <Icon name="refresh" size={20} />
          </TouchableOpacity>
          <View style={styles.tableContainer}>
            <Table borderStyle={{borderWidth: 1}}>
              <Row
                data={state.tableHead}
                flexArr={[1, 1]}
                style={styles.head}
                textStyle={styles.headText}
              />
              <TableWrapper style={styles.wrapper}>
                <Col
                  data={state.tableTitle}
                  style={styles.title}
                  heightArr={[28, 28]}
                  textStyle={styles.tableText}
                />
                <Rows
                  data={state.tableData}
                  flexArr={[1]}
                  style={styles.row}
                  textStyle={styles.tableText}
                />
              </TableWrapper>
            </Table>
          </View>

          <View style={styles.horizontalButtonContainer}>
            <View style={{flex: 1, marginRight: 5}}>
              <Button
                raised
                title="Measure"
                type="outline"
                buttonStyle={styles.buttonOutline}
                onPress={() => {
                  this.measureValue();
                }}
                titleStyle={{color: '#0fc1a7'}}
              />
            </View>
            <View style={{flex: 1, marginLeft: 5}}>
              <Button
                raised
                title="Save"
                buttonStyle={styles.button}
                onPress={() => {
                  this.addPatientData(this.props.navigation.state.params.Phone);
                }}
              />
            </View>
          </View>

          <View style={styles.heading}>
            <Text style={styles.text}>Generate Graph</Text>
          </View>
          <Divider style={styles.divider} />
          <Dropdown
            label="Select Mode"
            containerStyle={styles.dropDown}
            data={state.data}
            onChangeText={(value, index) => {
              this.setState({
                selectedIndex: index,
              });
              // console.log(this.state.selectedIndex);
            }}
          />

          <Modal visible={this.state.modalOpen} animationType="slide">
            <View style={styles.modalContent}>
              <Icon
                name="close"
                size={20}
                iconStyle={styles.modalClose}
                onPress={() => this.modalToggle(false)}
              />
              <PatientDataChart
                data={{
                  Phone: this.props.navigation.state.params.Phone,
                  Index: this.state.selectedIndex,
                }}
              />
            </View>
          </Modal>
          <View style={{...styles.buttonContainer, marginBottom: 80}}>
            <Button
              raised
              title="Generate"
              onPress={this.isDropDownSelected}
              buttonStyle={styles.button}
            />
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
    );
  }
}

BiteForceScreen.navigationOptions = {
  headerTitle: 'Online Readings',
  headerTintColor: '#fff',
  headerStyle: {height: 60, backgroundColor: '#0fc1a7'},
};

export default BiteForceScreen;

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
    justifyContent: 'center',
  },
  horizontalButtonContainer: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  tableContainer: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  resetContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginVertical: 10,
    marginBottom: -20,
    marginHorizontal: 20,
  },
  head: {
    height: 40,
    backgroundColor: '#28728f',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    height: 28,
    backgroundColor: 'white',
  },
  tableText: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  dropDown: {
    marginHorizontal: 40,
    marginVertical: 10,
  },
  buttonContainer: {
    marginHorizontal: 40,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#0fc1a7',
    borderRadius: 30,
  },
  buttonOutline: {
    color: '#0fc1a7',
    borderColor: '#0fc1a7',
    borderWidth: 1,
    borderRadius: 30,
  },
  divider: {
    height: 2,
    width: '50%',
    backgroundColor: '#275f8e',
    alignSelf: 'center',
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
