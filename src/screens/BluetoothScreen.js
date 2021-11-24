import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Switch,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Image,
  ToastAndroid,
  Alert
} from 'react-native';
var _ = require('lodash');
import BluetoothSerial from 'react-native-bluetooth-serial';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Button, Icon } from 'react-native-elements'
import Toast from '@remobile/react-native-toast';

const DeviceList = ({ devices, connectedId, showConnectedIcon, onDevicePress }) =>
  <ScrollView style={styles.container}>
    <View style={styles.listContainer}>
      {devices.map((device, i) => {
        return (
          <TouchableHighlight
            underlayColor='#DDDDDD'
            key={`${device.id}_${i}`}
            style={styles.listItem} onPress={() => onDevicePress(device)}>
            <View style={{ flexDirection: 'row' }}>
              {showConnectedIcon
                ? (
                  <View style={{ width: 48, height: 48, opacity: 0.4 }}>

                    {connectedId === device.id
                      ? (
                        <Image style={{ resizeMode: 'contain', width: 24, height: 24, flex: 1 }} source={require('../assets/images/ic_done_black_24dp.png')} />
                      ) : null}

                  </View>
                ) : null}
              <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>{device.name} </Text>
                <Text>{`<${device.id}>`}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )
      })}
    </View>
  </ScrollView>


export default class BluetoothScreen extends Component {
  constructor(props) {
    super(props)
    this.connectionLost = this.connectionLost.bind(this);
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      connectedDevice: {},
      unpairedDevices: [],
      data: '',
      readData: '',
      connected: false,
    }
  }

  componentDidMount() {

    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
      .then((values) => {
        const [isEnabled, devices] = values

        this.setState({ isEnabled, devices })
      })

    BluetoothSerial.on('bluetoothEnabled', () => {

      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
        .then((values) => {
          const [isEnabled, devices] = values
          this.setState({ devices })
        })

      BluetoothSerial.on('bluetoothDisabled', () => {

        this.setState({ devices: [], isEnabled: false })

      })

      BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))

    });

    BluetoothSerial.on('connectionLost', this.connectionLost);

  }

  componentWillUnmount() {
    BluetoothSerial.removeListener('connectionLost', this.connectionLost);
  }

  connectionLost() {
    console.log('connectionLost');
    this.setState({
      connected: false
    })
  }


  connect(device) {
    // console.log('isConnected : ' + BluetoothSerial.isConnected());
    BluetoothSerial.isConnected()
      .then((val) => {
        console.log('isConnected :' + val);
        if (val && this.state.connectedDevice.id === device.id) {
          this.props.navigation.navigate('OfflineReading', this.props.navigation.state.params);
        } else if (val) {
          Alert.alert(
            "Alert!",
            `Please disconnect from the ${this.state.connectedDevice.name} device`,
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "OK", onPress: () => {
                  console.log("ok pressed")
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          this.setState({ connecting: true })
          BluetoothSerial.connect(device.id)
            .then((res) => {
              this.setState({ connecting: false, connected: true, connectedDevice: device })
              console.log(`Connected to device ${device.name}`);
              this.props.navigation.navigate('OfflineReading', this.props.navigation.state.params);
              ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT);

            })
            .catch((err) => {
              this.setState({ connecting: false })
              console.log(err.message)
              Alert.alert(
                "Unable to connect",
                "Please connect only to Bite Force Device or make sure both the devices have bluetooth enabled.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "OK", onPress: () => {
                      console.log("ok pressed")
                    }
                  }
                ],
                { cancelable: false }
              );
            })
        }
      })
  }
  _renderItem(item) {

    return (<TouchableOpacity onPress={() => this.connect(item.item)}>
      <View style={styles.deviceNameWrap}>
        <Text style={this.state.connected ? styles.connectedDevice : styles.deviceName}>{item.item.name ? item.item.name : item.item.id}</Text>
      </View>
    </TouchableOpacity>)
  }
  enable() {
    BluetoothSerial.enable()
      .then((res) => this.setState({ isEnabled: true }))
      .catch((err) => Toast.showShortBottom(err.message))
  }

  disable() {
    BluetoothSerial.disable()
      .then((res) => this.setState({ isEnabled: false }))
      .catch((err) => Toast.showShortBottom(err.message))
  }

  toggleBluetooth(value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
      this.setState({ devices: [] });
    }
  }

  disconnect() {
    // console.log('disconnected')
    BluetoothSerial.disconnect()
      .then(() => {
        console.log('disconnected');
        Toast.showShortBottom(`Disconnected from ${this.state.connectedDevice.name}`);
        this.setState({ connected: false })
      })
      .catch((err) => Toast.showShortBottom(err.message))
  }

  discoverPairedDevices() {
    BluetoothSerial.list()
      .then((devices) => {
        this.setState({
          devices: devices
        })
      })
  }

  discoverAvailableDevices() {
    if (this.state.isEnabled) {
      if (this.state.discovering) {
        this.setState({
          discovering: false
        });
        console.log('discovering : false');
        return false
      } else {
        this.setState({ discovering: true })
        BluetoothSerial.discoverUnpairedDevices()
          .then((unpairedDevices) => {
            const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
            console.log(uniqueDevices);
            this.setState({ devices: uniqueDevices, discovering: false })
          })
          .catch((err) => console.log(err.message))
      }
    } else {
      ToastAndroid.show('Please enable bluetooth', ToastAndroid.SHORT);
    }
  }

  onDevicePress(device) {
    console.log('devicePressed')
    if (true) {
      this.connect(device)
    }
  }

  onBackPress() {
    var flag = this.state.connected;
    if (flag) {
      Alert.alert(
        "Alert!",
        `Please disconnect from the ${this.state.connectedDevice.name} device`,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK", onPress: () => {
              console.log("ok pressed")
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      console.log('not connected')
      this.props.navigation.goBack(null);
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => { this.onBackPress() }} style={styles.toolbarIcon}>
            <Icon name='arrow-back' type='material' size={30}/>
          </TouchableOpacity>
          <Text style={styles.toolbarTitle}>Bluetooth Device List</Text>
          <View style={styles.toolbarButton}>
            {Platform.OS === 'android' ? (
              <Switch
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                value={this.state.isEnabled}
                onValueChange={(val) => this.toggleBluetooth(val)}
              />) : null}
          </View>
        </View>
        {Platform.OS === 'android' ? (
          <View style={styles.buttonContainer}>
            <View style={{ flex: 1, marginRight: 5, marginVertical: 10 }}>
              <Button
                raised
                type="outline"
                buttonStyle={styles.buttonOutline}
                onPress={this.discoverPairedDevices.bind(this)}
                title="Paired Devices"
                titleStyle={{ color: '#0fc1a7' }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 5, marginVertical: 10 }} >
              <Button
                raised
                buttonStyle={styles.button}
                onPress={this.discoverAvailableDevices.bind(this)}
                title="Unpaired Devices"
              />
            </View>
          </View>
        ) : null}
        {(this.state.devices.length == 0) &&
          <View style={{ flex: 1, margin: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>No Devices found</Text>
          </View>
        }
        <DeviceList
          showConnectedIcon={this.state.connected}
          connectedId={this.state.connectedDevice.id}
          devices={this.state.devices}
          onDevicePress={(device) => this.onDevicePress(device)} />

        {this.state.connected ?
          <View>
            <Button
              raised
              title='Disconnect'
              onPress={this.disconnect.bind(this)}
              buttonStyle={{ backgroundColor: '#0fc1a7', marginVertical: 10, marginHorizontal: 50 }}
            />
          </View> : null}
        <ProgressDialog
          visible={this.state.discovering}
          title="Scanning Devices"
          message="Please, wait..."
          activityIndicatorColor="green"
          activityIndicatorSize={30}
        />

        <ProgressDialog
          visible={this.state.connecting}
          title="Connecting to Device"
          message="Please, wait..."
          activityIndicatorColor="green"
          activityIndicatorSize={30}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 10
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  toolbarButton: {
    width: 50,
    marginTop: 8,
    marginHorizontal: 10
  },
  toolbarTitle: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    marginTop: 5
  },
  toolbarIcon: {
    marginHorizontal: 10,
    marginTop: 5
  },
  buttonOutline: {
    color: '#0fc1a7',
    borderColor: '#0fc1a7',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#0fc1a7',
  },
  listContainer: {
    borderColor: '#ccc',
    borderTopWidth: 0.5
  },
  listItem: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderColor: '#ccc',
    borderBottomWidth: 0.5,
    justifyContent: 'center'
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth: 1
  },
  connectedDevice: {
    fontSize: 17,
    color: "red"
  }
});