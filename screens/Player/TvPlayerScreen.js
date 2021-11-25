import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Text,
    Slider,
    StatusBar,
    Modal,
    Alert, FlatList, TouchableOpacity, Image
} from 'react-native';
import Video from 'react-native-video'
import Orientation from 'react-native-orientation';
import axios from "axios";
import {Icon} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Config from '../../config/config';
import lang from '../../config/Languages'
import {Card} from "react-native-elements";

function secondsToTime(time) {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}


export default class PlayerScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            playlist: {},
            currentPlay: "",
            buffering: true,
            paused: false,
            duration: 0,
            opacity: false,
            modalVisible: false,
            modalResolutionVisible: false,
            showChannelsCollection: false
        };
    }

    componentDidMount() {
        StatusBar.setHidden(true);


        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.props.navigation.state.params.jwt
        };


        return axios.get(Config.api_link + '/api/v1/get/watch/tv/' + this.props.navigation.state.params.id, {
            headers: headers
        })
            .then(response => {
                this.setState({
                    playlist: response.data.data.current_channel,
                    suggestions: response.data.data.suggestions,
                    isLoading: false
                });
                console.log(this.state.playlist.streaming_url);

                this.player.presentFullscreenPlayer();
                Orientation.lockToLandscape();
                // this locks the view to Portrait Mode

            }, (error) => {
                console.log(error)
            });

    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
    }


    handleBuffer = meta => {
        this.setState({
            buffering: meta.isBuffering,
        });
    };

    handleMainButtonTouch = () => {
        if (this.state.progress >= 1) {
            this.player.seek(0);
        }
        if (this.state.paused) {
            this.setState({paused: false});
        } else {
            this.setState({paused: true});
        }
        this.triggerShowHide();
    };


    handleEnd = () => {
        this.setState({paused: true});
        this.handlePlayNext();
    };

    handleLoad = meta => {
        this.setState({
            duration: meta.duration,
        });
        this.setState({opacity: true});
        this.hideTimeout = setTimeout(() => {
            this.setState({opacity: false})
        }, 7000);
    };

    handleVideoPress = () => {
        this.setState({opacity: true});
        this.hideTimeout = setTimeout(() => {
            this.setState({opacity: false})
        }, 7000);
    };

    triggerShowHide = () => {
        clearTimeout(this.hideTimeout);
        if (this.state.paused) {
            // play
            this.setState({opacity: true});
            this.hideTimeout = setTimeout(() => {
                this.setState({opacity: false})
            }, 7000);
        }

        if (!this.state.paused) {
            // Pause
            this.setState({opacity: true});
        }

    };

    handleFullScreen = () => {
        Orientation.getOrientation((err, orientation) => {
            if (orientation === 'LANDSCAPE') {
                Orientation.lockToPortrait();
            } else {
                this.player.presentFullscreenPlayer();
                Orientation.lockToLandscape();
            }
        })
    };

    changeChannel = (item) => {

        if(item.id === this.state.playlist.id) {
            console.log("it's already play")
            return
        }

        this.setState({playlist: item});
        this.player.seek(0);
    };


    render() {

        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;

        const {buffering} = this.state;


        if (this.state.isLoading) {
            return (
                <View style={styles.videoCover}>
                    <ActivityIndicator color={"#F44336"} size={60}/>
                    <Text style={{color: "#FFF"}}>{lang.loading}</Text>
                </View>
            );
        }
        else {

            return <View style={styles.container}>
                <View style={buffering ? styles.buffering : undefined}>

                    {this.state.opacity &&

                    <View style={[styles.topControls]}>
                        <LinearGradient
                            colors={['#151a24', 'rgba(21, 26, 36, 0.30)', 'transparent']}
                            style={{
                                position: 'absolute',
                                right: 0,
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: 30,
                            }}/>


                        <View style={{position: "absolute", left: 20, top: 20, zIndex: 3}}>
                            <TouchableWithoutFeedback
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon type="AntDesign" name="arrowleft" style={{fontSize: 35, color: '#FFFFFF'}}/>

                            </TouchableWithoutFeedback>

                        </View>


                        <View style={{zIndex: 3}}>

                            <Text style={{color: "#FFF", fontSize: 17}}>{this.state.playlist.name}</Text>

                        </View>
                    </View>
                    }


                    <TouchableWithoutFeedback onPress={this.handleVideoPress} style={{flex: 1}}>
                        <Video
                            style={{width: "100%", height: "100%"}}
                            paused={this.state.paused}
                            source={{
                                uri: this.state.playlist.streaming_url
                            }}
                            resizeMode="cover"
                            onLoad={this.handleLoad}
                            onBuffer={this.handleBuffer}
                            onEnd={this.handleEnd}
                            ref={ref => {
                                this.player = ref;
                            }}

                        />
                    </TouchableWithoutFeedback>

                    {this.state.opacity &&

                    <View style={[{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}>
                        <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                            <Icon name={!this.state.paused ? "pause" : "play"} type={"FontAwesome"}
                                  style={{fontSize: 60, color: '#FFF', padding: 30}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    }


                    {this.state.opacity &&

                    <View style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        width: '100%'}}>
                        <View style={[styles.leftControl]}>

                            <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                                <Icon name={!this.state.paused ? "pause" : "play"}
                                      style={{fontSize: 30, padding: 10, color: '#FFF'}}/>
                            </TouchableWithoutFeedback>

                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-around",
                                paddingHorizontal: 15
                            }}>
                                <Icon name={'dot-single'}
                                      type={'Entypo'}
                                      style={{fontSize: 40, color: 'red'}}/>
                                <Text style={{color: '#FFF',fontWeight: 'bold'}}> {lang.live}</Text>

                            </View>
                        </View>


                        <View style={[styles.rightControl]}>

                            <TouchableWithoutFeedback
                                onPress={() => this.setState({showChannelsCollection: !this.state.showChannelsCollection})}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    paddingHorizontal: 15
                                }}>
                                    <Icon name={"playlist-play"}
                                          type={"MaterialIcons"}
                                          style={{fontSize: 24, color: '#FFF', position: 'relative', top:2}}/>
                                    <Text style={{fontSize: 15, marginLeft: 5, color: '#FFF'}}>Channels</Text>

                                </View>
                            </TouchableWithoutFeedback>

                        </View>



                    </View>
                    }


                    {this.state.showChannelsCollection &&

                    <View style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 60,
                        width: '100%',
                        backgroundColor: '#101010',
                        zIndex: 100
                    }}>

                        <FlatList
                            horizontal
                            data={this.state.suggestions}
                            keyExtractor={item => item.name}
                            renderItem={({item}) =>
                                <TouchableOpacity
                                    onPress={() => this.changeChannel(item)}
                                    style={[{backgroundColor: '#1c1c1c', margin: 3}, this.state.playlist.id === item.id ? {backgroundColor: '#F2994A'} :  { backgroundColor: 'transparent'} ]}>
                                    <Card
                                        containerStyle={{
                                            padding: 0,
                                            width: 60,
                                            borderRadius: 50,
                                            borderColor: '#000'
                                        }}>
                                        <Image
                                            style={{width: 60, height: 60, borderRadius: 50}}
                                            source={{uri: Config.api_link + '/storage/posters/' + item.image}}
                                        />
                                    </Card>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#FFFFFF',
                                        flex: 1,
                                        flexWrap: 'wrap',
                                        textAlign: 'center',
                                        marginTop: 5,
                                        marginBottom: 15
                                    }}>{item.name}</Text>
                                </TouchableOpacity>
                            }
                        />

                    </View>
                    }


                </View>
                {buffering &&
                <View style={styles.videoCover}>
                    <ActivityIndicator color={"#F44336"} size={60}/>
                    <Text style={{color: "#FFF"}}>{lang.loading}</Text>
                </View>
                }
            </View>
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    videoContainer: {
        overflow: "hidden",
    },
    videoCover: {
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 100
    },
    leftControl: {
        position: "absolute",
        height: 48,
        left: 30,
        bottom: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 10,
        zIndex: 2,
    },
    rightControl: {
        position: "absolute",
        height: 48,
        right: 30,
        bottom: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 10,
        zIndex: 2
    },

    topControls: {
        position: "absolute",
        height: 48,
        left: 0,
        top: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 10,
    },
    captionBox: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "white",
        width: 250,
        height: 400,
        padding: 10,
    },
    hideCaptionBox: {
        position: "absolute",
        width: 0,
        height: 0,
        top: -100,
    },
    captionIcon: {
        position: "absolute",
        right: 10,
        top: 10,
        padding: 5,
    },
    captionInactive: {
        color: "#b1b1b1"
    },
    captionActive: {
        color: "#FFF"
    },
    multiBitRateIcon: {
        position: "absolute",
        right: 60,
        top: 7,
        padding: 5,
    },
    mainButton: {
        marginRight: 15,
    },
    duration: {
        color: "#FFF",
        marginLeft: 25,

    },
    current: {
        color: "#FFF",
        marginRight: 25,
    },

});
