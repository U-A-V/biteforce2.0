import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {ProgressDialog} from 'react-native-simple-dialogs';
import FormData from 'form-data';
import {apiCredentails} from '../api-credentials';
import {LineChart} from 'react-native-chart-kit';
// import { Rect, Text as TextSVG, Svg } from "react-native-svg";
// import firebase from 'firebase';
// import { createNewUser } from '../functions/createNewUser';

export default function PatientDataChart({data}) {
  const [progressVisible, setVisible] = useState(false);
  const [labelData, setLabelData] = useState(['Dummy1', 'Dummy2']);
  const [graphData, setGraphData] = useState([50, 0]);
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  useEffect(() => {
    setVisible(true);
    viewPatientData(data);
    return () => {};
  }, []);

  const viewPatientData = data => {
    // console.log(data);
    var bodyData = new FormData();
    bodyData.append('action', 'getItems');
    bodyData.append('sheetName', data.Phone);
    bodyData.append('x_Axis', '0');
    bodyData.append('y_Axis', data.Index + 1);
    fetch(apiCredentails.scriptURL, {
      method: 'POST',
      body: bodyData,
    })
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json().then(json => {
            // process your JSON data further
            // console.log(json);
            // console.log(json.items.length);
            var date = [],
              forceValue = [];
            for (var i = 0; i < json.items.length; i++) {
              // console.log(json.items[i].date);
              date.push(json.items[i].date);
              // console.log(json.items[i].forceValue);
              forceValue.push(json.items[i].forceValue);
            }
            if (date.length < 2) {
              date.push('eg- 1-Jan-20');
              forceValue.push(0);
            }
            setLabelData(date);
            setGraphData(forceValue);
            // console.log(date);
            console.log(forceValue);
            setVisible(false);
            // Toast.show(json);
          });
        } else {
          return response.text().then(text => {
            // this is text, do something with it
            setVisible(false);
            Alert.alert(
              'Alert',
              'No data found!',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
            console.log(text);
          });
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <View>
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          {!progressVisible ? (
            <LineChart
              data={{
                labels: labelData,
                datasets: [
                  {
                    data: graphData,
                    strokeWidth: 5,
                  },
                ],
              }}
              width={labelData.length < 6 ? 400 : labelData.length * 55} // from react-native
              height={500}
              yAxisSuffix=" N"
              yAxisLabel=" "
              yAxisInterval={1} // optional, defaults to 1
              // xLabelsOffset={5}
              // yLabelsOffset={5}

              fromZero
              // withScrollableDot={true}
              withHorizontalLabels={true}
              segments={4}
              // renderDotContent={() => {}}
              // renderDotContent={({x, y, index}) => <Text>{index}</Text>}
              renderDotContent={({x, y, index}) => {
                // console.log(graphData[index]);
                return (
                  <View
                    key={index}
                    style={{
                      height: 24,
                      width: 36,
                      backgroundColor: 'transparent',
                      position: 'absolute',
                      top: y - 25, // <--- relevant to height / width (
                      left: x - 10, // <--- width / 2
                    }}>
                    <Text style={{fontSize: 12, color: 'white'}}>
                      {graphData[index]} N
                    </Text>
                  </View>
                );
              }}
              verticalLabelRotation={60}
              chartConfig={{
                backgroundColor: '#444',
                backgroundGradientFrom: '#444',
                backgroundGradientTo: '#444',
                fillShadowGradient: '#ffff',
                fillShadowGradientOpacity: 0.7,
                decimalPlaces: 0, // optional, defaults to 2dp
                // strokeWidth: 5,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 0,
                  // marginLeft: 10
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                },
                propsForLabels: {
                  fontSize: 13,
                  fontWeight: 'bold',
                },
                scrollableInfoSize: {width: 65, height: 30},
                scrollableInfoOffset: 15,
              }}
              bezier
              style={{
                paddingTop: 30,
                paddingBottom: 20,
                marginBottom: 10,
                borderRadius: 16,
              }}

              // decorator={() => {
              //     return <View>
              //     <Svg>
              //         <Rect x={80} y={110} width="40" height="30" fill="black" />
              //         <TextSVG
              //             x={100}
              //             y={130}
              //             fill="white"
              //             fontSize="16"
              //             fontWeight="bold"
              //             textAnchor="middle">0.0</TextSVG>
              //             </Svg>
              //             </View>}}
              //     decorator={() => {
              //         return tooltipPos.visible ? <View>
              //             <Svg>
              //                 <Rect x={tooltipPos.x - 15}
              //                     y={tooltipPos.y + 10}
              //                     width="40"
              //                     height="30"
              //                     fill="black" />
              //                 <TextSVG
              //                     x={tooltipPos.x + 5}
              //                     y={tooltipPos.y + 30}
              //                     fill="white"
              //                     fontSize="16"
              //                     fontWeight="bold"
              //                     textAnchor="middle">
              //                     {tooltipPos.value}
              //                 </TextSVG>
              //             </Svg>
              //         </View> : null
              //     }}
              // onDataPointClick={(data) => {
              //     console.log("works");
              //     console.log(data.x + " " + data.y);
              //     let isSamePoint = (tooltipPos.x === data.x
              //         && tooltipPos.y === data.y)

              //     isSamePoint ? setTooltipPos((previousState) => {
              //         return {
              //             ...previousState,
              //             value: data.value,
              //             visible: !previousState.visible
              //         }
              //     })
              //         :
              //         setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });

              // }}
            />
          ) : (
            <ProgressDialog
              visible={progressVisible}
              title="Loading Graph"
              message="Please, wait..."
              activityIndicatorColor="green"
              activityIndicatorSize={30}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
