import React from "react";
import { RootNavg } from "./config/Routes";
import SplashScreen from "react-native-splash-screen";
import Orientation from "react-native-orientation";
import {
  Text,
  View,
} from 'react-native';


// import AuthLoadingScreen from './screens/AuthLoadingScreen';
export default class App extends React.Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    // Lock screen
    Orientation.lockToPortrait();

    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }

  render() {
     const Layout = RootNavg;
     return <Layout />;
    
  }
}
