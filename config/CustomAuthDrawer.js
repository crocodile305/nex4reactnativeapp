import React from 'react';
import {Icon} from 'native-base';
import {DrawerItems} from "react-navigation";
import {
    ActivityIndicator,
    AsyncStorage,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import logo from '../assets/logo.png';
import deviceStorage from "./deviceStorage";

class CustomAuthDrawer extends React.Component {
    constructor() {
        super();
        this.state = {isLoading: true, username: 'LOGIN', jwt: ''};
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
        this._bootstrapAsync();
    }


    _bootstrapAsync = async () => {
        const rootAuth = await AsyncStorage.getItem('root');
        const userToken = await AsyncStorage.getItem('username');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        if(rootAuth === 'Auth') {
            this.setState({username: userToken, isLoading: false});
        }
    };


    render () {

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }

        return (
            <ScrollView>

                <View style={{backgroundColor: 'green', position: 'relative', height: '30%'}}>
                    <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                        <LinearGradient
                            colors={['#F2994A', '#F2C94C']} startPoint={[0.0, 0.5]} endPoint={[1.0, 0.5]} locations={[0.0, 1.0]}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}/>
                    </View>
                    <View style={{margin: 30}}>
                        <View>
                            <Image style={{width: 60, height: 60, borderWidth: 2, borderColor: 'white', borderTopLeftRadius: 1}}
                                   borderRadius={50}
                                   source={logo}/>
                        </View>

                        <View>
                            <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>{this.state.username}</Text>
                        </View>

                        <View style={{position: 'absolute', right: 0, top: 5,  zIndex: 1}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ListSettingsScreen')}>
                                <Icon name={'ios-settings'} type={'Ionicons'} style={{fontSize: 30, color: '#FFF'}} />
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
                <SafeAreaView style={{flex: 1, margin: 5}} forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerItems {...this.props} />
                </SafeAreaView>
            </ScrollView>
        );
    }
};

export default CustomAuthDrawer;
