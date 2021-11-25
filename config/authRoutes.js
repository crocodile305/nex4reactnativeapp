import React from 'react';
import {createStackNavigator, createDrawerNavigator} from 'react-navigation';

import HeaderNav from '../screens/HeaderNav';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import ShowMovieScreen from '../screens/ShowMovieScreen';
import ShowSeriesScreen from '../screens/ShowSeriesScreen';
import CastScreen from '../screens/CastScreen';
import SeriesScreen from '../screens/SeriesScreen';
import MoviesScreen from '../screens/MoviesScreen';
import KidsScreen from '../screens/KidsScreen';
import SearchScreen from '../screens/SearchScreen';
import Logout from '../screens/Logout';

export const Tabs = createDrawerNavigator({
    Home: {
        screen: HomeScreen,
    },
    Movies: {
        screen: MoviesScreen,
    },
    Series: {
        screen: SeriesScreen,
    },
    Kids: {
        screen: KidsScreen,
    },
    Tv: {
        screen: KidsScreen
    },
    Logout: {
        screen: Logout
    }
}, {
    contentOptions: {
        activeTintColor: '#FFFFFF',
        inactiveTintColor: 'black',
        activeBackgroundColor: '#151c2f',
        inactiveBackgroundColor: 'transparent',
        labelStyle: {
            color: '#a9b0c3',
        },
    }
});

// Router Screen
export const AuthRoot = createStackNavigator({
    Tabs: {
        screen: Tabs,
        navigationOptions: {
            header: props => <HeaderNav {...props} />,
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
            header: props => <HeaderNav {...props} />,
        }
    }
}, {
    cardStyle: {backgroundColor: '#151a24'}
});
