import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity, AsyncStorage
} from 'react-native'
import {
    createStackNavigator,
    createDrawerNavigator,
    createSwitchNavigator,
    createAppContainer,
    DrawerItems
} from 'react-navigation';
import {Icon} from 'native-base';
import { fromRight } from 'react-navigation-transitions';
import logo from '../assets/logo.png';

import LinearGradient from 'react-native-linear-gradient';
import HeaderApp from '../screens/Headers/HeaderApp';
import HeaderAuth from '../screens/Headers/HeaderAuth';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthSplashStartScreen from '../screens/AuthSplashStartScreen';

import AuthPreviewScreen from "../screens/Auth/AuthPreviewScreen";
import ShowMovieScreen from '../screens/ShowMovieScreen';
import ShowSeriesScreen from '../screens/ShowSeriesScreen';
import CastScreen from '../screens/CastScreen';
import SeriesScreen from '../screens/SeriesScreen';
import MoviesScreen from '../screens/MoviesScreen';
import KidsScreen from '../screens/KidsScreen';
import TvScreen from "../screens/TvScreen";
import SearchScreen from '../screens/SearchScreen';
import PlayerScreen from '../screens/Player/PlayerScreen';
import SeriesPlayerScreen from '../screens/Player/SeriesPlayerScreen';
import TvPlayerScreen from '../screens/Player/TvPlayerScreen';

// Settings
import ListSettingsScreen from '../screens/Settings/ListScreen';
import ProfileSettingsScreen from '../screens/Settings/ProfileScreen';
import SecuritySettingsScreen from '../screens/Settings/SecurityScreen';
import HistoryWatchScreen from '../screens/Settings/HistoryWatchScreen';
import DevicesActivityScreen from '../screens/Settings/DevicesActivityScreen'
import Logout from '../screens/Logout';

// Component
import CustomAuthDrawer from './CustomAuthDrawer'

// Collection
import MyListScreen from '../screens/MyList/MyListScreen'

// Languages
import lang from "./Languages";

/** Ghost Navigator  **/
const CustomDrawerContentComponentGhost = (props) => (
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
            <TouchableOpacity onPress={() => props.navigation.navigate('ShowAuthPreview')}>

                <View style={{margin: 30}}>
                    <View>
                        <Image style={{
                            width: 60,
                            height: 60,
                            borderWidth: 2,
                            borderColor: 'white',
                            borderTopLeftRadius: 1
                        }}
                               borderRadius={50}
                               source={logo}/>
                    </View>

                    <View>
                        <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 3}}>LOGIN</Text>
                    </View>
                </View>
            </TouchableOpacity>

        </View>
        <SafeAreaView style={{flex: 1, margin: 5}} forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
);

const AppStackTabs = createDrawerNavigator({
    showHome : {
        screen: HomeScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialCommunityIcons" name="home" style={{fontSize: 22, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_home
        }
    },
    'MOVIES': {
        screen: MoviesScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialCommunityIcons" name="movie-roll" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_movies
        },


    },
    'SHOWS': {
        screen: SeriesScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialIcons" name="video-library" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_show
        },

    },

    'KIDS': {
        screen: KidsScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialCommunityIcons" name="cat" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_kids
        }
    },
    'LIVE TV': {
        screen: TvScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialIcons" name="live-tv" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_tv
        }
    }

}, {
    contentComponent: CustomDrawerContentComponentGhost,
    contentOptions: {
        activeTintColor: '#F2994A',
        inactiveTintColor: '#FFF',
        activeBackgroundColor: 'transparent',
        inactiveBackgroundColor: 'transparent',
        labelStyle: {
            color: '#FFF',
        },
    },
    drawerBackgroundColor: '#111B46',
});

// Router Screen
const AppStack = createStackNavigator({
    Tabs: {
        screen: AppStackTabs,
        navigationOptions: {
            title: 'Home',
            header: props => <HeaderApp {...props}  title={'hello'} />
        }
    },
    ShowMovie: {
        screen: ShowMovieScreen,
        navigationOptions: {
            title: 'Show Movie',
            header: null
        }
    },
    ShowSeries: {
        screen: ShowSeriesScreen,
        navigationOptions: {
            title: 'Show Series',
            header: null
        }
    },
    ShowActor: {
        screen: CastScreen,
        navigationOptions: {
            title: 'Cast',
            header: null
        }
    },
    ShowSearch: {
        screen: SearchScreen,
        navigationOptions: {
            title: 'Search',
            header: null
        }
    },
    ShowLogin: {
        screen: LoginScreen,
        navigationOptions: {
            title: 'Login',
            header: null
        }
    },
    ShowSignUp: {
        screen: SignUpScreen,
        navigationOptions: {
            title: 'SignUp',
            header: null
        }
    },
    ShowAuthPreview: {
        screen: AuthPreviewScreen,
        navigationOptions: {
            title: 'Login',
            header: null
        }
    },
    showHome: {
        screen: HomeScreen,
        navigationOptions: {
            title: 'Home',
            header: null
        }
    }
}, {
    cardStyle: {backgroundColor: '#101010'},
    transitionConfig: () => fromRight(500),

});




const AuthStackTabs = createDrawerNavigator({
    'HOME': {
        screen: HomeScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialCommunityIcons" name="home" style={{fontSize: 22, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_home
        }
    },
    'MOVIES': {
        screen: MoviesScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialCommunityIcons" name="movie-roll" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_movies
        }
    },
    'SHOWS': {
        screen: SeriesScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialIcons" name="video-library" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_show
        }
    },

    'KIDS': {
        screen: KidsScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialCommunityIcons" name="cat" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_kids
        }
    },
    'LIVE TV': {
        screen: TvScreen,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="MaterialIcons" name="live-tv" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_tv
        }
    },
    "LOGOUT": {
        screen: Logout,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon type="SimpleLineIcons" name="logout" style={{fontSize: 20, color: tintColor}}/>
            ),
            drawerLabel: lang.nav_logout
        }
    },

}, {
    contentComponent: CustomAuthDrawer,
    contentOptions: {
        activeTintColor: '#F2994A',
        inactiveTintColor: '#FFF',
        activeBackgroundColor: 'transparent',
        inactiveBackgroundColor: 'transparent',
        labelStyle: {
            color: '#FFF',
        },
    },
    drawerBackgroundColor: '#111B46'
});

// Router Screen
const AuthStack = createStackNavigator({
    Tabs: {
        screen: AuthStackTabs,
        navigationOptions: {
            header: props => <HeaderAuth {...props} />,
        }
    },
    ShowMovie: {
        screen: ShowMovieScreen,
        navigationOptions: {
            title: 'Show Movie',
            header: null
        }
    },
    ShowSeries: {
        screen: ShowSeriesScreen,
        navigationOptions: {
            title: 'Show Series',
            header: null
        }
    },
    ShowActor: {
        screen: CastScreen,
        navigationOptions: {
            title: 'Cast',
            header: null
        }
    },
    ShowSearch: {
        screen: SearchScreen,
        navigationOptions: {
            title: 'Search',
            header: null
        }
    },
    ShowLogin: {
        screen: LoginScreen,
        navigationOptions: {
            title: 'Login',
            header: null
        }
    },
    ShowHome: {
        screen: HomeScreen,
        navigationOptions: {
            title: 'Home',
            header: props => <HeaderAuth {...props} />,
        }
    },
    ShowMSPlayer: {
        screen: PlayerScreen,
        navigationOptions: {
            title: 'Player',
            header: null
        }
    },
    SeriesPlayerScreen: {
        screen: SeriesPlayerScreen,
        navigationOptions: {
            title: 'Player',
            header: null
        }
    },
    TvPlayerScreen: {
        screen: TvPlayerScreen,
        navigationOptions: {
            title: 'Player',
            header: null
        }
    },
    ListSettingsScreen: {
        screen: ListSettingsScreen,
        navigationOptions: {
            title: 'List Settings',
            header: null
        }
    },
    ProfileSettingsScreen: {
        screen: ProfileSettingsScreen,
        navigationOptions: {
            title: 'Profile Settings',
            header: null
        }
    },

    SecuritySettingsScreen: {
        screen: SecuritySettingsScreen,
        navigationOptions: {
            title: 'Profile Settings',
            header: null
        }
    },
    HistoryWatchScreen: {
        screen: HistoryWatchScreen,
        navigationOptions: {
            title: 'History Watch',
            header: null
        }
    },

    DevicesActivityScreen: {
        screen: DevicesActivityScreen,
        navigationOptions: {
            title: 'Device Activity',
            header: null
        }
    },

    MyListScreen: {
        screen: MyListScreen,
        navigationOptions: {
            title: 'My List',
            header: null
        }
    },

}, {
    cardStyle: {backgroundColor: '#101010'},
    transitionConfig: () => fromRight(500),

});


export const RootNavg = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        AuthSplashStart :AuthSplashStartScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    });
