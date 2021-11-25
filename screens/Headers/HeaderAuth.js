import React from 'react';
import { Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import {Image, ListView} from "react-native";
import deviceStorage from "../../config/deviceStorage";
import logo from "../../assets/logo.png";
export default class HeaderApp extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            jwt: ''
        };
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
    }

    render() {
        return (
            <Header style={{backgroundColor: '#111B46', height: 60}}>
                <Left style={{ flex: 1}}>
                    <Button transparent onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}>
                        <Icon type="Ionicons" name="ios-menu" style={{fontSize: 25, color: '#FFFFFF'}} />
                    </Button>
                </Left>
                <Body style={{ flex: 1}}>

                <Image source={logo} style={{width: '100%', height: 45, resizeMode: "contain"}} />

                </Body>
                <Right style={{ flex: 1}}>

                    <Button transparent onPress={() => this.props.navigation.navigate('MyListScreen')}>
                        <Icon name={'collections-bookmark'} type={'MaterialIcons'} />
                    </Button>

                    <Button transparent onPress={() => this.props.navigation.navigate('ShowSearch')}>
                        <Icon name='search' />
                    </Button>
                </Right>
            </Header>
        );
    }
}
