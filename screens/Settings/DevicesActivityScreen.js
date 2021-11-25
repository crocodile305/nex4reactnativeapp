import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator, AsyncStorage, TouchableOpacity
} from 'react-native';
import {Icon, List, ListItem, Container, Header, Content, Left, Right, Button, Body} from 'native-base';
import deviceStorage from "../../config/deviceStorage";
import Config from '../../config/config'
import axios from "axios";
import lang from '../../config/Languages'

let arryList = null;

class DevicesActivityScreen extends React.Component {

    constructor() {
        super();
        this.state = {isLoading: true, devicesData: {}, jwt: ''};
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
        this.sendRequest = this.sendRequest.bind(this);

        setTimeout(() => {
            this.sendRequest();
        }, 250);

    }


    sendRequest() {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.get(Config.api_link + '/api/v1/get/device/activity', {headers: headers}).then(response => {
            if (response.status === 200) {
                this.setState({isLoading: false, devicesData: response.data.data});
            }
        }, (error) => {
            // Error message
            this.setState({isLoading: false, devicesData: null});

        });

    }


    render() {

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return (
            <Container style={styles.parent}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" style={{fontSize: 25, color: '#FFFFFF'}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 2}}>
                    <Text style={styles.headerText}>{lang.device_activity}</Text>
                    </Body>
                </Header>
                <Content>
                    <List
                        dataArray={this.state.devicesData}
                        renderRow={(item, k) => {
                                return (<ListItem>
                                        <Left>
                                            <Text style={styles.textList}>{item.country} / {item.city}</Text>
                                        </Left>
                                        <Right>
                                            <Icon name="arrow-forward"/>
                                        </Right>
                                    </ListItem>
                                )
                        }
                        }
                    />

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1B1B1B',
        height: 55
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18
    },
    parent: {
        backgroundColor: '#101010'
    },
    textList: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    }

});

export default DevicesActivityScreen;
