import React from 'react';
import {ActivityIndicator, Linking, StyleSheet, Text, View, TouchableOpacity,Image} from 'react-native';
import {Container, Header, Body, Content, Form, Item, Input, Left, Button, Icon} from 'native-base';
import axios from 'axios';
import deviceStorage from '../../config/deviceStorage';
import Config from '../../config/config';
import lang from '../../config/Languages'
import splashlogo from '../../assets/splashlogo.png';


export default class LoginScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errMessage: '',
            validate: {
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
            inputFocus: '',
            isLoading: false,
            jwt: '',
            refersh: false
        };
        this.loginRequest = this.loginRequest.bind(this);

        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
    }


    validation(text, type) {

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

            if (type => 8) {
                this.state.validate.password.status = true;
            } else {
                this.state.validate.password.status = false;
            }
            this.setState({refersh: true});
        }

    }

    loginRequest() {

        if (this.state.validate.email.status && this.state.validate.password.status) {
            console.log("OK");
            this.setState({isLoading: true});

            var data = {
                grant_type: 'password',
                client_id: 2,
                client_secret: Config.oauth_client_secret,
                username: this.state.email,
                password: this.state.password,
                scope: ''
            };

            axios.post(Config.api_link + '/oauth/token', data)
                .then((response) => {
                    axios.get(Config.api_link + '/api/v1/get/check/user', {
                        headers: {
                            Authorization: 'Bearer ' + response.data.access_token
                        }
                    }).then(check => {
                        console.log(check);
                        // Clear Loading
                        this.setState({isLoading: false});

                        // Check user status
                        deviceStorage.setJWT('id_token', response.data.access_token);
                        deviceStorage.setJWT('username', check.data.name);
                        deviceStorage.setJWT('language', check.data.language);
                        deviceStorage.setJWT('email', check.data.email);
                        deviceStorage.setJWT('root', 'Auth');
                        deviceStorage.loadJWT.bind(this);
                        this.props.navigation.navigate('Auth');

                    });
                }, (error) => {
                    console.log("Failed");
                    console.log(error);
                    if (error.response.status === 401) {
                        // Clear Loading
                        this.setState({isLoading: false});

                        // Error message
                        this.setState({errMessage: error.response.data.message})
                    }
                });

        } else {
            this.state.validate.showValidate = true;
            this.setState({refersh: true})
        }
    }

    RedirectToForgetPage = () => {
        Linking.canOpenURL(Config.api_link + '/forget').then(supported => {
            if (supported) {
                Linking.openURL(Config.api_link + '/forget');
            } else {
                console.log("Don't know how to open URI: " + Config.api_link + '/forget');
            }
        });
    };



    render() {

        const inputFocus = {
            fontSize: 35,
            color: 'white'
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
                       <Text style={styles.headerText}>{lang.login}</Text>
                    </Body>
                </Header>
                <Content>

                    <Form style={{margin: 30}}>

                        {/* <Item style={{borderColor: 'transparent', marginBottom: 20}}>
                            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', letterSpacing: 1.3, }}>{lang.welcome_back}</Text>
                        </Item> */}
                        <Image source={splashlogo} style={{width: '100%',height:150, resizeMode: "contain",marginTop: 10}} />

                        <Item style={styles.itemInput}>
                            <Icon name={'user'} type={'EvilIcons'} style={this.state.inputFocus === 'email' ? inputFocus: inputInFocus} />
                            <Input
                                style={styles.input}
                                placeholder={lang.email}
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
                                placeholder={lang.password}
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

                        <Item style={{borderBottomColor: 'transparent', marginTop: 15,flex:1,justifyContent:"flex-end"}}>
                            <TouchableOpacity onPress={ () => this.RedirectToForgetPage()} style={{marginRight:20}}>
                                <Text style={{color: '#FFF'}}>{lang.forget_password} ?</Text>
                            </TouchableOpacity>
                        </Item>
                    </Form>

                    <View style={styles.errMessage}>
                        <Text style={styles.errMessageText}>{this.state.errMessage}</Text>
                    </View>

                    <View style={styles.parentButton}>
                        {
                            !this.state.isLoading &&
                            <Button block style={styles.buttonStyle} onPress={() => this.loginRequest()}>
                                <Text style={styles.buttonText}>{lang.login}</Text>
                            </Button>
                        }
                        {
                            this.state.isLoading &&
                            <Button block style={styles.buttonStyle} disabled={true}>
                                <ActivityIndicator color={"#142265"} size={15}/>
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
        backgroundColor: '##111B46',
        height: 55
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18
    },
    parent: {
        backgroundColor: '#111B46'
    },
    parentButton: {
        position: 'relative',
        marginTop: 20,
        left: '10%'
    },
    buttonStyle: {
        backgroundColor: 'white',
        width: '80%',
        borderRadius: 5
    },
    buttonText: {
        letterSpacing: 2,
        color:"#142265",fontSize:18,fontWeight:"bold"
    },
    itemInput: {
        flex: 1,
        position: 'relative',
        width: '95%',
        right: 5,
        height: 50,
        borderColor: '#00B1FF',
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
        color: 'white',
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
