import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Image, TouchableHighlight, AsyncStorage} from 'react-native';
import {Container, Header, Body, Content, Form, Item, Input, Left, Button, Icon} from 'native-base';
import axios from 'axios';
import deviceStorage from '../../config/deviceStorage';
import Config from '../../config/config';
import lang from '../../config/Languages'

export default class LoginScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            username: '',
            password: '',
            errMessage: '',
            validate: {
                username: {
                    msg: 'Your username must be at least 6 characters',
                    status: true
                },
                email: {
                    msg: 'E-mail is incorrect',
                    status: true
                },
                password: {
                    msg: 'Your password must be at least 8 characters',
                    status: false
                },
                showValidate: false,
            },
            inputFocus: '',
            isLoading: false,
            jwt: '',
            refersh: false
        };
        this._bootstrapAsync()
        this.updateRequest = this.updateRequest.bind(this);
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
    }


    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const user = await AsyncStorage.getItem('username');
        const email = await AsyncStorage.getItem('email');

        this.setState({
            email: email,
            username: user
        })
    };



    validation(text, type) {

        if(type === 'username') {

            const re = /^[a-zA-Z\s]+$/;
            const check = re.test(String(text).toLowerCase());

            this.setState({username: text});

            if (check) {
                if(text.length >= 6){
                    this.state.validate.username.status = true;
                }else{
                    this.state.validate.username.msg = 'Your password must be at least 6 characters.';
                    this.state.validate.username.status = false;
                }
            }else {
                this.state.validate.username.msg = 'The username field may only contain alphabetic characters as well as spaces.';
                this.state.validate.username.status = false;
            }

            this.setState({refersh: true});
        }

        if (type === 'email') {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const check = re.test(String(text).toLowerCase());

            this.setState({email: text});

            if (check) {
                this.state.validate.email.status = true;
            }else {
                this.state.validate.email.status = false;
            }
            this.setState({refersh: true});
        }

        if (type === 'password') {

            this.setState({password: text});

            if (text.length >= 8) {
                this.state.validate.password.status = true;
            } else {
                this.state.validate.password.status = false;
            }
            this.setState({refersh: true});
        }

    }

    updateRequest() {

        if (this.state.validate.email.status && this.state.validate.password.status && this.state.validate.username.status ) {

            this.setState({isLoading: true});

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.state.jwt
            };

            axios.post(Config.api_link + '/api/v1/update/profile/details', {
                name: this.state.username,
                email: this.state.email,
                current_password: this.state.password
            }, {headers: headers}).then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    deviceStorage.setJWT('username', this.state.username);
                    deviceStorage.setJWT('email', this.state.email);
                    this.setState({isLoading: false, succMessage: response.data.message, errMessage: ''});

                }
            }, (error) => {
                if (error.response.status === 422) {
                    // Error message
                    this.setState({isLoading: false, errMessage: error.response.data.message, succMessage: ''});
                }
            });

        } else {
            this.state.validate.showValidate = true;
            this.setState({refersh: true})
        }
    }

    render() {

        const inputFocus = {
            fontSize: 35,
            color: '#FFF'
        };
        const inputInFocus = {
            fontSize: 35,
            color: '#7c7c7c'
        };


        return (
            <Container style={styles.parent}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" style={{fontSize: 25, color: '#FFFFFF'}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 2}}>
                    <Text style={styles.headerText}>{lang.profile}</Text>
                    </Body>
                </Header>
                <Content>

                    <Form style={{margin: 30}}>

                        <Item style={styles.itemInput}>
                            <Icon name={'user'} type={'EvilIcons'} style={this.state.inputFocus === 'username' ? inputFocus: inputInFocus} />
                            <Input
                                style={styles.input}
                                placeholder={lang.username}
                                value={this.state.username}
                                onFocus={(val) => this.setState({inputFocus: 'username'})}
                                onChangeText={(text) => this.validation(text, 'username')}
                            />
                        </Item>
                        {
                            this.state.validate.showValidate && !this.state.validate.username.status &&
                            <Item style={styles.validateMsg}>
                                <Text style={styles.errMessageText}>{this.state.validate.username.msg}</Text>
                            </Item>
                        }


                        <Item style={styles.itemInput}>
                            <Icon name={'envelope'} type={'EvilIcons'} style={this.state.inputFocus === 'email' ? inputFocus: inputInFocus} />
                            <Input
                                style={styles.input}
                                placeholder={lang.email}
                                value={this.state.email}
                                onFocus={(val) => this.setState({inputFocus: 'email'})}
                                onChangeText={(text) => this.validation(text, 'email')}
                            />
                        </Item>
                        {
                            this.state.validate.showValidate && !this.state.validate.email.status &&
                            <Item style={styles.validateMsg}>
                                <Text style={styles.errMessageText}>{this.state.validate.email.msg}</Text>
                            </Item>
                        }
                        <Item style={styles.itemInput}>
                            <Icon name={'lock'} type={'EvilIcons'} style={this.state.inputFocus === 'pass' ? inputFocus: inputInFocus}  />
                            <Input
                                style={styles.input}
                                placeholder={lang.current_password}
                                secureTextEntry={true}
                                onFocus={(val) => this.setState({inputFocus: 'pass'})}
                                onChangeText={(text) => this.validation(text, 'password')}/>
                        </Item>
                        {
                            this.state.validate.showValidate && !this.state.validate.password.status  &&
                            <Item style={styles.validateMsg}>
                                <Text style={styles.errMessageText}>{this.state.validate.password.msg}</Text>
                            </Item>
                        }
                    </Form>

                    <View style={styles.errMessage}>
                        <Text style={styles.errMessageText}>{this.state.errMessage}</Text>
                    </View>
                    <View style={styles.errMessage}>
                        <Text style={styles.successMessageText}>{this.state.succMessage}</Text>
                    </View>

                    <View style={styles.parentButton}>
                        {
                            !this.state.isLoading &&
                            <Button block style={styles.buttonStyle} onPress={() => this.updateRequest()}>
                                <Text style={styles.buttonText}>{lang.update}</Text>
                            </Button>
                        }
                        {
                            this.state.isLoading &&
                            <Button block style={styles.buttonStyle} disabled={true}>
                                <ActivityIndicator color={"#FFF"} size={15}/>
                            </Button>
                        }
                    </View>


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
    parentButton: {
        position: 'relative',
        marginTop: 20,
        left: '10%'
    },
    buttonStyle: {
        backgroundColor: '#f3ac00',
        width: '80%',
        borderRadius: 5
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 2
    },
    itemInput: {
        flex: 1,
        position: 'relative',
        width: '95%',
        right: 5,
        height: 50,
        borderColor: '#232a3b',
        marginTop: 5,
        padding: 5,
    },
    validateMsg: {
        flex: 1,
        position: 'relative',
        left: '8%',
        width: '95%',
        height: 50,
        borderColor: 'transparent',
        padding: 5,
    },
    input: {
        color: '#FFFFFF',
        fontSize: 16,
        borderRadius: 40
    },
    errMessage: {
        margin: 5
    },
    errMessageText: {
        color: '#F44336',
        fontSize: 11,
        textAlign: 'center'
    },
    successMessageText: {
        color: '#7df462',
        fontSize: 11,
        textAlign: 'center'
    },
    buttonRows: {
        position: "relative",
        height: 48,
        left: 0,
        top: 5,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderColor: 'transparent'
    },
    topButtonText: {
        width: '100%',
        color: '#7d7e7f',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
