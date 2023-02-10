import React, {Component, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';
import {globalStyles} from '../styles/global.js';
import {Formik} from 'formik';
import * as yup from 'yup';
import FlatButton from '../shared/button';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {createNewUser} from '../functions/createNewUser';

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

export default function AddPatientForm({closeModal, modalToast, mainToast}) {
  const [progressVisible, setVisible] = useState(false);

  return (
    <ScrollView style={globalStyles.container}>
      <Formik
        initialValues={{Name: '', Age: '', Email: '', Phone: ''}}
        validationSchema={AddPatientSchema}
        onSubmit={async values => {
          // console.log(values);
          setVisible(true);
          var result = await createNewUser(values);
          console.log('form : ' + result);
          if (result === 1) {
            mainToast('Registration Successful');
            closeModal(false);
          } else {
            // await toastRef('User Already Exists!');
            modalToast('Patient Already Exist!');
          }
          setVisible(false);
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
              onChangeText={props.handleChange('Phone')}
              value={props.values.Phone}
              keyboardType="numeric"
              onBlur={props.handleBlur('Phone')}
            />

            <FlatButton
              title="Add Patient"
              onPress={() => {
                props.handleSubmit();
              }}
            />
            <ProgressDialog
              visible={progressVisible}
              title="Adding Patient"
              message="Please, wait..."
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
