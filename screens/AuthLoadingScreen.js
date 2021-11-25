import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import splashlogo from '../assets/splashlogo.png';
import groupimg from '../assets/groupimg.png';
export default class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('root');
  
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.

      // this.props.navigation.navigate(userToken!== null && userToken !== undefined && userToken === 'Auth' ? 'Auth' : 'App');
      setTimeout(()=>{
        if(userToken!== null && userToken !== undefined && userToken === 'Auth'){
          this.props.navigation.navigate('Auth');  
        }
        else {
          this.props.navigation.navigate('AuthSplashStart');
        }
        
      },2000);
      
      
    };
    componentDidMount(){
      // this._changeSplashStatus();
    }
    // Render any loading content that you like here
    render() {

      return (
        <View style={styles.container}>
          {/* <ActivityIndicator />
          <StatusBar barStyle="default" /> */}
          {/* {splashStatus ? 
            (<Image source={splashlogo} style={{width: '100%', height: 150, resizeMode: "contain"}} />) :
            (
              <Image source={groupimg} style={{width: '100%', height: 250, resizeMode: "contain"}} />
            )
          } */}
          {/* <Image source={groupimg} style={{width: '100%', height: 250, resizeMode: "contain"}} /> */}
          <Image source={splashlogo} style={{width: '100%', height: 150, resizeMode: "contain"}} />
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:"#111B46",
    },
    body:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
  