import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image,Text,TouchableOpacity
} from 'react-native';
import { Button, Icon} from 'native-base';
import splashlogo from '../assets/splashlogo.png';
import splashimg1 from '../assets/splashimg1.png';


export default class AuthSplashStartScreen extends React.Component {
    constructor() {
      super();
    }
    componentDidMount(){

    }
    GoToLoginScreen=async ()=>{
        const userToken = await AsyncStorage.getItem('root');
        this.props.navigation.navigate(userToken!== null && userToken !== undefined && userToken === 'Auth' ? 'Auth' : 'App');
    }
    // Render any loading content that you like here
    render() {

      return (
        <View style={styles.container}>
            <Image source={splashimg1} style={{width: '100%', resizeMode: "contain",marginTop: 50}} />
            <View style = {styles.buttonbody}>
                <TouchableOpacity style ={styles.button} onPress = {this.GoToLoginScreen}>
                    <Text style={{color:"#142265",fontSize:18,fontWeight:"bold"}}>Get Started</Text>
                </TouchableOpacity>
            </View>
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
    buttonbody:{
        width:"100%",
        alignItems:"center",
        justifyContent:"center",
    },
    button:{
        width:"80%",
        marginLeft:"10%",
        height: 50,
        backgroundColor:"white",
        borderRadius: 15,
        opacity:0.8901960784313725,
        textAlign:"center",
        alignItems:"center",
        justifyContent:"center",
        
    }
  });
  