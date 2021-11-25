import React from 'react';
import {
    StyleSheet, View, ActivityIndicator, AsyncStorage, StatusBar
} from 'react-native';
import deviceStorage from '../config/deviceStorage'; 

export default class App extends React.Component {
    constructor() {
        super();
        this.deleteJWT = deviceStorage.deleteJWT;
        this.deleteJWT();
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('root');
        console.log(userToken)
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate('App');
    }

    render() {
        return (
            <View style={styles.container}>
              <ActivityIndicator />
              <StatusBar barStyle="default" />
            </View>
          );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
