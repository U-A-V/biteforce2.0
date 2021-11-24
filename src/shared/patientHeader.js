import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Foundation } from '@expo/vector-icons';

export default function Header({ navigation }) {

    const goBackButton = () => {
        navigation.goBack(null);
    }
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.goBackIcon} onPress={goBackButton}>
                <Foundation name='home' size={30} />            
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    goBackIcon: {
        padding: 15,
        paddingStart: 10,
        position: 'absolute',
        left: 20
    }
});