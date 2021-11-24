import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Header({ navigation }) {

    const goBackButton = () => {
        navigation.goBack(null);
    }
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={goBackButton}>
                <MaterialIcons name='arrow-back' size={28} color='white'/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyIcon} >
                <MaterialIcons name='history' size={30} color='white'/>            
            </TouchableOpacity>
            <View>
                <Text style={styles.headerText}>Bite Force</Text>
            </View>
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
    firstHeader: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        alignSelf: 'center'
    },
    backIcon: {
        padding: 15,
        paddingStart: 10,
        position: 'absolute',
        left: 0
    },
    historyIcon: {
        padding: 15,
        paddingEnd: 10,
        position: 'absolute',
        right: 0
    }
});