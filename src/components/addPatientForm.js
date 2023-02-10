import React, {Component, useState} from 'react';
import {StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';
import {globalStyles} from '../styles/global.js';
import {Formik} from 'formik';
import * as yup from 'yup';
import {ProgressDialog} from 'react-native-simple-dialogs';
import FormData from 'form-data';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Button} from 'react-native-elements';
import {apiCredentails} from '../api-credentials';
import {Toast, Root} from 'native-base';
// import { createNewUser } from '../functions/createNewUser';

const AddPatientSchema = yup.object({
  Name: yup.string().required().min(4),
  Age: yup
    .string()
    .required()
    .max(3, 'Age must be at most 3 digits')
    .test('is-valid-age', 'Age must be less than 120', val => {
      return parseInt(val) <= 120;
    }),
  Email: yup.string().required().email(),
  Phone: yup
    .string()
    .required('Phone number is a required field')
    .length(10, 'Phone number must be exactly 10 digits'),
});

export default function AddPatientForm({closeModal}) {
  const [progressVisible, setVisible] = useState(false);

  const addUserToFirebase = data => {
    const user = auth().currentUser;
    const newuser = database()
      .ref('/users/' + user.uid + '/patients')
      .push();
    // console.log('newnode:', newuser);
    newuser.set(data, error => {
      if (error) {
        setVisible(false);
        // modalToast(error.message);
        Toast.show({
          text: error.message,
          buttonText: 'Okay',
          type: 'danger',
          position: 'top',
        });
      } else {
        Toast.show({
          text: 'Registration Successful',
          buttonText: 'Okay',
          type: 'success',
        });
        console.log('i was called');
        setVisible(false);
        closeModal(false);
        console.log('Save Successfully');
      }
    });
    // .then(() => {
    //   // mainToast('Registration Successful');

    // })
    // .catch(error => {

    //   });
    // });
  };

  const createNewUser = data => {
    console.log(apiCredentails.scriptURL);
    var bodyData = new FormData();
    bodyData.append('action', 'createNewUser');
    bodyData.append('sheetName', data.Phone);
    fetch(apiCredentails.scriptURL, {
      method: 'POST',
      body: bodyData,
    })
      .then(response => response.text())
      .then(json => {
        console.log(json + ' Adding');
        if (json === 'Success') {
          addUserToFirebase(data);
        } else {
          setVisible(false);
          Toast.show({
            text: 'Patient Already Exist!',
            buttonText: 'Okay',
            type: 'danger',
            duration: 2000,
            position: 'center',
          });
        }
        // Toast.show(json);
      })
      .catch(error => console.error(error));
  };

  return (
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}>
      <Root>
        <Formik
          initialValues={{Name: '', Age: '', Email: '', Phone: ''}}
          validationSchema={AddPatientSchema}
          onSubmit={values => {
            setVisible(true);
            createNewUser(values);
          }}>
          {props => (
            <View>
              <Text style={globalStyles.titleText}>Patient Details</Text>

              <Text style={globalStyles.errorText}>
                {props.touched.Name && props.errors.Name}
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Name"
                placeholderTextColor="#45454555"
                onChangeText={props.handleChange('Name')}
                value={props.values.Name}
                onBlur={props.handleBlur('Name')}
              />

              <Text style={globalStyles.errorText}>
                {props.touched.Age && props.errors.Age}
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Age"
                placeholderTextColor="#45454555"
                onChangeText={props.handleChange('Age')}
                value={props.values.Age}
                keyboardType="numeric"
                onBlur={props.handleBlur('Age')}
              />

              <Text style={globalStyles.errorText}>
                {props.touched.Email && props.errors.Email}
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="E-mail"
                placeholderTextColor="#45454555"
                onChangeText={props.handleChange('Email')}
                value={props.values.Email}
                keyboardType="email-address"
                onBlur={props.handleBlur('Email')}
              />

              <Text style={globalStyles.errorText}>
                {props.touched.Phone && props.errors.Phone}
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Phone Number"
                placeholderTextColor="#45454555"
                onChangeText={props.handleChange('Phone')}
                value={props.values.Phone}
                keyboardType="numeric"
                onBlur={props.handleBlur('Phone')}
              />
              <View style={{marginVertical: 40}}>
                <Button
                  raised
                  title="Add Patient"
                  onPress={() => {
                    props.handleSubmit();
                  }}
                  buttonStyle={{borderRadius: 30, backgroundColor: '#0fc1a7'}}
                />
              </View>
              <ProgressDialog
                visible={progressVisible}
                title="Adding Patient"
                message="Please, wait..."
                activityIndicatorColor="green"
                activityIndicatorSize={30}
              />
            </View>
          )}
        </Formik>
      </Root>
    </ScrollView>
  );
}
