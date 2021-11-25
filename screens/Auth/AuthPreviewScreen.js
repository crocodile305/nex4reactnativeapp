import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Button, Icon} from 'native-base';
import lang from '../../config/Languages'
import Video from "react-native-video";

export default class AuthPreviewScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>

                <View>
                    <Text style={styles.textLogo}>CINEMAREX</Text>
                    <Text style={styles.textDesc}>Watch TV shows and movies anytime, anywhere</Text>
                </View>

                <Video
                    source={{
                        uri: "https://res.cloudinary.com/enlilweb/video/upload/v1548950713/android-intro_sjrosy.mp4"
                    }}
                    resizeMode="cover"
                    style={StyleSheet.absoluteFill}
                    muted={true}
                    repeat={true}
                />

                <View style={styles.buttonRows}>
                    <Button style={styles.button} onPress={() => this.props.navigation.navigate('ShowLogin')}>
                        <Text style={styles.buttonText}>{lang.login}</Text>
                    </Button>
                    <Button style={styles.button} onPress={() => this.props.navigation.navigate('ShowSignUp')}>
                        <Text style={styles.buttonText}>{lang.signup}</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textLogo: {
        position: 'relative',
        top: 50,
        fontSize: 40,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        zIndex: 2,
    },
    textDesc: {
        position: 'relative',
        top: 50,
        fontSize: 17,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        zIndex: 2,
    },
    buttonRows: {
        position: "absolute",
        height: 48,
        left: 0,
        bottom: 5,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#FFF"
    },
    button: {
        width: "50%",
        backgroundColor: "#1c1c1c",
        borderRadius: 0,
        borderWidth: 0.5,
        borderColor: '#303132',
        borderTopColor: 'transparent',
        height: 54
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
        width: "100%"
    }

});

