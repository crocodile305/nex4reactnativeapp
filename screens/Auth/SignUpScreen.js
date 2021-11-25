import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Container, Header, Body, Content, Form, Item, Input, Left, Button, Icon} from 'native-base';
import axios from 'axios';
import deviceStorage from '../../config/deviceStorage';
import Config from '../../config/config';
import lang from '../../config/Languages'

export default class LoginScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
            errMessage: '',
            validate: {
                username: {
                    msg: 'Your username must be at least 6 characters',
                    status: false
                },
                email: {
                    msg: 'E-mail is incorrect',
                    status: false
                },
                password: {
                    msg: 'Your password must be at least 8 characters',
                    status: false
                },
                showValidate: false,
            },
            isLoading: false,
            jwt: '',
            refersh: false
        };
        this.SignUpRequest = this.SignUpRequest.bind(this);

        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
    }


    validation(text, type) {

        if(type === 'username') {

            const re = /^[a-zA-Z\s]+$/;
            const check = re.test(String(text).toLowerCase());


            if (check) {
                if(text.length >= 6){
                    this.setState({username: text});
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

            if (check) {
                this.setState({email: text});
                this.state.validate.email.status = true;
            }else {
                this.state.validate.email.status = false;
            }
            this.setState({refersh: true});
        }

        if (type === 'password') {
            this.setState({password: text});
            if (text.length >= 8)  {
                if( this.state.password === this.state.password_confirmation) {
                    this.state.validate.password.status = true;
                }else{
                    this.state.validate.password.status = false;
                    this.state.validate.password.msg = 'Password not match.';
                }
            } else {
                this.state.validate.password.status = false;
                this.state.validate.password.msg = 'Your password must be at least 8 characters.';
            }
            this.setState({refersh: true});
        }

        if(type === 'password_confirmation') {
            this.setState({password_confirmation: text});

             if (text.length >= 8)  {
                if(this.state.password === text) {
                    this.state.validate.password.status = true;
                }else{
                    this.state.validate.password.status = false;
                    this.state.validate.password.msg = 'Password not match.';
                }
            } else {
                this.state.validate.password.status = false;
                this.state.validate.password.msg = 'Your password must be at least 8 characters.';
            }
            this.setState({refersh: true});

        }

    }

    SignUpRequest() {

        if (this.state.validate.email.status && this.state.validate.password.status && this.state.validate.username.status) {


            this.setState({isLoading: true});

            axios.post(Config.api_link + '/api/v1/create/register', {
                name: this.state.username,
                email: this.state.email,
                password: this.state.password,
                password_confirmation: this.state.password
            })
                .then((response) => {
                    if (response.status === 200) {

                        var data = {
                            grant_type: 'password',
                            client_id: 2,
                            client_secret: Config.oauth_client_secret,
                            username: this.state.email,
                            password: this.state.password,
                            scope: ''
                        };

                        axios.post(Config.api_link + '/oauth/token', data).then(oauthRes => {
                            // Check user status
                            deviceStorage.setJWT('id_token', oauthRes.data.access_token);
                            deviceStorage.setJWT('username', this.state.username);
                            deviceStorage.setJWT('language', 'en');
                            deviceStorage.setJWT('email', this.state.email);
                            deviceStorage.setJWT('root', 'Auth');
                            deviceStorage.loadJWT.bind(this);
                            // Clear Loading
                            this.setState({isLoading: false});
                            this.props.navigation.navigate('Auth')
                        });

                    }
                }, (error) => {
                    if (error.response.status === 401 || error.response.status === 422) {
                        // Error message
                        this.setState({errMessage: error.response.data.message})
                    }else{
                        this.setState({errMessage: error.response.data.message})
                    }
                    // Clear Loading
                    this.setState({isLoading: false});
                });

        } else {
            this.state.validate.showValidate = true;
            this.setState({refersh: true})
        }
    }

    render() {
        return (
            <Container style={styles.parent}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" style={{fontSize: 25, color: '#FFFFFF'}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 2}}>
                    <Text style={styles.headerText}>{lang.login}</Text>
                    </Body>
                </Header>
                <Content>
                    <Form style={{margin: 30}}>
                        <Item style={{borderColor: 'transparent', marginBottom: 20}}>
                            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', letterSpacing: 1.3, }}>{lang.create_account}</Text>
                        </Item>


                        <Item style={styles.itemInput}>
                            <Input
                                style={styles.input}
                                placeholder={lang.username}
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
                            <Input
                                style={styles.input}
                                placeholder={lang.email}
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
                            <Input
                                style={styles.input}
                                placeholder={lang.password}
                                secureTextEntry={true}
                                onChangeText={(text) => this.validation(text, 'password')}/>
                        </Item>
                        <Item style={styles.itemInput}>
                            <Input
                                style={styles.input}
                                placeholder={lang.re_password}
                                secureTextEntry={true}
                                onChangeText={(text) => this.validation(text, 'password_confirmation')}/>
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

                    <View style={styles.parentButton}>
                        {
                            !this.state.isLoading &&
                            <Button block style={styles.buttonStyle} onPress={() => this.SignUpRequest()}>
                                <Text style={styles.buttonText}>{lang.continue}</Text>
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
        right: 5,
        width: '95%',
        height: 50,
        borderColor: '#232a3b',
        marginTop: 5,
        padding: 5,
    },
    validateMsg: {
        flex: 1,
        position: 'relative',
        right: 5,
        width: '95%',
        height: 50,
        borderColor: 'transparent',
        padding: 5,
    },
    input: {
        color: '#FFFFFF',
        fontSize: 13,
        borderRadius: 40
    },
    errMessage: {
        margin: 5
    },
    errMessageText: {
        color: '#F44336',
        fontSize: 11
    }

});
