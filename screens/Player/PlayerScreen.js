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
    Alert
} from 'react-native';
import Video, {TextTrackType} from 'react-native-video'
import Orientation from 'react-native-orientation';
import axios from "axios";
import {Button, Icon} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import {Content, List, ListItem} from 'native-base';
import Config from '../../config/config';
import lang from '../../config/Languages'

function secondsToTime(time) {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

export default class PlayerScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            playlist: {},
            current_movie: {},
            currentPlay: "",
            currentVideo: 0,
            currentItem: 0,
            currentVideoType: "hls",
            videoTrack: [],
            textTrack: [],
            textTracksLength: false,
            textSelectedTrack: {
                type: "index",
                value: -1
            },
            textTrackDisabled: false,
            disableNextPlayer: false,
            buffering: true,
            paused: false,
            progress: 0,
            duration: 0,
            opacity: false,
            stopProgress: false,
            moveProgress: 0,
            modalVisible: false,
            modalResolutionVisible: false,
            showErrorComponent: false,
            errorMessage: 'An error has occurred playing this video',
            timeRequest: 120
        };
    }

    componentDidMount() {
        StatusBar.setHidden(true);


        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.props.navigation.state.params.jwt
        };


        return axios.post(Config.api_link + '/api/v1/get/watch/movie', {movie_id: this.props.navigation.state.params.id}, {
            headers: headers
        })
            .then(response => {
                this.setState({
                    playlist: response.data.data.playlist.playlist,
                    currentPlay: response.data.data.playlist.playlist[0],
                    current_movie: response.data.data.current_movie
                });


                const textArr = [];
                for (var i = 0; i < response.data.data.playlist.playlist[0].tracks.length; i++) {
                    textArr.push({
                        title: response.data.data.playlist.playlist[0].tracks[i].label,
                        language: "en",
                        type: TextTrackType.VTT,
                        uri: response.data.data.playlist.playlist[0].tracks[i].file
                    });

                    this.setState({
                        textTracksLength: true
                    })
                }


                const videoArr = [];
                if (this.state.playlist[this.state.currentItem].sources[this.state.currentVideo].type !== "application/vnd.apple.mpegurl") {
                    for (var i = 0; i < this.state.playlist[this.state.currentItem].sources.length; i++) {
                        videoArr.push(
                            {
                                resolution: this.state.playlist[this.state.currentItem].sources[i].label,
                                uri: this.state.playlist[this.state.currentItem].sources[i].file
                            },
                        );
                    }

                    this.setState({
                        videoTrack: videoArr,
                        currentVideoType: 'mp4'
                    });
                }

                this.setState({
                    isLoading: false,
                    textTrack: textArr
                });


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

    componentDidUpdate(prevProps, prevState) {
        if (this.state.moveProgress !== prevState.moveProgress) {
            if (this.state.stopProgress) {
                this.setState({stopProgress: false});
                const progress = this.state.progress * this.state.duration;
                const isPlaying = !this.state.paused;
                this.player.seek(progress);
            }
        }
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


    handleProgress = progress => {
        if (!this.state.stopProgress) {
            this.setState({
                progress: progress.currentTime / this.state.duration,
            });

            if (progress.currentTime.toFixed() >= this.state.timeRequest) {
                this.setState({
                    timeRequest: parseInt(progress.currentTime.toFixed()) + 120
                });

                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + this.props.navigation.state.params.jwt
                };
                axios.post(Config.api_link + '/api/v1/create/watch/movie/recently', {
                    current_time: progress.currentTime.toFixed(),
                    duration_time: this.state.duration,
                    movie_id: this.state.current_movie.id
                }, {headers: headers});
            }
        }
    };

    handleEnd = () => {
        this.setState({paused: true});
        this.handlePlayNext();
    };

    handleLoad = meta => {

        if(this.state.current_movie.current_time !== null) {
            this.player.seek(this.state.current_movie.current_time)
        }



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

    handlePlayNext = () => {

        // Load Spinner
        this.setState({
            isLoading: true,
            currentVideo: 0,
            currentVideoType: "hls",
            videoTrack: [],
            textTrack: [],
            textTracksLength: false,
            textSelectedTrack: {
                type: "index",
                value: -1
            },
            textTrackDisabled: false,
        });


        // Check if there next movie
        const checkNextKey = this.state.playlist[this.state.currentItem + 1];
        const checkAferNextKey = this.state.playlist[this.state.currentItem+2];

        // Check after the next
        if(checkAferNextKey === undefined) {
            this.setState({
                disableNextPlayer: true
            })
        }



        if (checkNextKey !== undefined) {
            this.setState({currentItem: this.state.currentItem + 1})
            this.setState({currentPlay: this.state.playlist[this.state.currentItem]});
            // Add subtitle
            const textArr = [];
            this.setState({
                textTracksLength: false
            });
            for (var i = 0; i < this.state.playlist[this.state.currentItem].tracks.length; i++) {
                textArr.push({
                    title: this.state.playlist[this.state.currentItem].tracks[i].label,
                    language: "en",
                    type: TextTrackType.VTT,
                    uri: this.state.playlist[this.state.currentItem].tracks[i].file
                });

                if (!this.state.textTracksLength) {
                    this.setState({
                        textTracksLength: true
                    })
                }
            }


            // Add Video if there is mp4

            const videoArr = [];
            if (this.state.playlist[this.state.currentItem].sources[this.state.currentVideo].type !== "application/vnd.apple.mpegurl") {
                for (var i = 0; i < this.state.playlist[this.state.currentItem].sources.length; i++) {
                    videoArr.push(
                        {
                            resolution: this.state.playlist[this.state.currentItem].sources[i].label,
                            uri: this.state.playlist[this.state.currentItem].sources[i].file
                        },
                    );
                }

                this.setState({
                    videoTrack: videoArr,
                    currentVideoType: 'mp4'
                });
            }

            this.setState({
                isLoading: false,
                textTrack: textArr
            });

            this.player.seek(0);
        }
    };

    changeVideoTrack = (index) => {
        this.setState({
            currentVideo: index,
            modalResolutionVisible: false,
            paused: false
        });
        const progress = this.state.progress * this.state.duration;
        this.player.seek(progress);
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

    changeTextTrack = (index) => {
        console.log(index);
        this.setState({textTrackDisabled: false});
        if (this.state.currentVideoType === "hls") {
            this.setState({textSelectedTrack: {type: "index", value: index + 1}});
        } else {
            this.setState({textSelectedTrack: {type: "index", value: index}});
        }

    };

    disableTextTrack = () => {
        console.log("disable text track");
        this.setState({textSelectedTrack: {type: "index", value: -1}});

        this.setState({textTrackDisabled: true});
    };

    setModalVisible = (visible) => {
        if (visible) {
            this.setState({modalVisible: visible, paused: true});
        } else {
            this.setState({modalVisible: visible, paused: false});
        }
    };

    setModalResolutionVisible = (visible) => {
        if (visible) {
            this.setState({modalResolutionVisible: visible, paused: true});
        } else {
            this.setState({modalResolutionVisible: visible, paused: false});
        }
    };

    handleError = meta => {
        const { error: { code } } = meta;

        let error = "An error has occurred playing this video";
        switch (code) {
            case -11800:
                error = "Could not load video from URL";
                break;
        }

        this.setState({
            isLoading: false,
            showErrorComponent: true,
            errorMessage:error
        })
    };



    render() {

        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;

        const {buffering} = this.state;


        if (this.state.isLoading) {
            return (
                <View style={styles.videoCover}>
                    <ActivityIndicator color={"#F44336"} size={60}/>
                    <Text style={{color: "#FFF"}}>Loading</Text>
                </View>
            );
        }
        if(this.state.showErrorComponent) {

            return (
                <View style={styles.videoCover}>
                    <Text style={{color: "#FFF"}}>{this.state.errorMessage}</Text>
                </View>
            );


        } else {
            let textTrackList;
            if (this.state.currentVideoType === "hls") {
                textTrackList = this.state.textTrack.map((track, index) =>
                    <ListItem key={index} onPress={() => this.changeTextTrack(index)}><Text
                        style={index + 1 == this.state.textSelectedTrack.value ? styles.captionActive : styles.captionInactive}>{track.title}</Text></ListItem>
                );
            } else {
                textTrackList = this.state.textTrack.map((track, index) =>
                    <ListItem key={index} onPress={() => this.changeTextTrack(index)}><Text
                        style={index == this.state.textSelectedTrack.value ? styles.captionActive : styles.captionInactive}>{track.title}</Text></ListItem>
                );
            }

            const textVideoList = this.state.videoTrack.map((track, index) =>
                <ListItem key={index} onPress={() => this.changeVideoTrack(index)}><Text
                    style={index == this.state.currentVideo ? styles.captionActive : styles.captionInactive}>{track.resolution}P</Text></ListItem>
            );


            return <View style={styles.container}>
                <View style={buffering ? styles.buffering : undefined}>


                    {this.state.opacity &&

                    <View style={[styles.topControls]}>
                        <LinearGradient
                            colors={['#101010', 'rgba(16, 16, 16, 0.30)', 'transparent']}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
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

                            <Text style={{color: "#FFF", fontSize: 17}}>{this.state.currentPlay.title}</Text>

                        </View>

                    </View>
                    }


                    {

                        this.state.modalVisible &&

                        <View style={{
                            flex: 1,
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            top: 0,
                            zIndex: 3,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "rgba(0, 0, 0, 0.51)"
                        }}
                        >
                            <View style={{
                                width: 300,
                                height: 300,
                                backgroundColor: "#101010"
                            }}>
                                <Content>
                                    <List>
                                        {textTrackList}
                                        <ListItem onPress={() => this.disableTextTrack()}>
                                            <Text
                                                style={this.state.textTrackDisabled ? styles.captionActive : styles.captionInactive}>{lang.disable}</Text>
                                        </ListItem>
                                    </List>

                                </Content>


                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                    <Text
                                        style={{color: "#FFF", margin: 10, marginLeft: 20}}
                                    >{lang.ok}</Text>
                                </TouchableWithoutFeedback>

                            </View>
                        </View>

                    }


                    {

                        this.state.modalResolutionVisible &&

                        <View style={{
                            flex: 1,
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            top: 0,
                            zIndex: 3,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "rgba(0, 0, 0, 0.51)"
                        }}
                        >
                            <View style={{
                                width: 300,
                                height: 300,
                                backgroundColor: "#101010"
                            }}>
                                <Content>
                                    <List>
                                        {textVideoList}
                                    </List>

                                </Content>


                            </View>
                        </View>


                    }


                    <TouchableWithoutFeedback onPress={this.handleVideoPress} style={{flex: 1}}>
                        <Video
                            style={{width: "100%", height: "100%"}}
                            paused={this.state.paused}
                            source={{
                                uri: this.state.currentPlay.sources[this.state.currentVideo].file
                            }}
                            poster={this.state.currentPlay.poster}
                            textTracks={this.state.textTrack}
                            selectedTextTrack={this.state.textSelectedTrack}
                            resizeMode="cover"
                            onLoad={this.handleLoad}
                            onBuffer={this.handleBuffer}
                            onProgress={this.handleProgress}
                            onEnd={this.handleEnd}
                            onError={this.handleError}
                            useTextureView={false}
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
                    <View>


                        <View style={[styles.progressTime]}>
                            <Text style={styles.current}>
                                {secondsToTime(Math.floor(this.state.progress * this.state.duration))}
                            </Text>


                            <TouchableWithoutFeedback onPress={this.handleProgressPress}>
                                <Slider
                                    step={0}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={this.state.progress}
                                    minimumTrackTintColor={"#ffffff"}
                                    maximumTrackTintColor={"rgba(255, 255, 255, 0.54)"}
                                    thumbTintColor={"red"}
                                    onSlidingComplete={(val) => this.setState({moveProgress: !this.state.moveProgress})}
                                    onValueChange={(val) => this.setState({stopProgress: true, progress: val})}
                                    style={{width: "65%", height: 20, transform: [{scaleX: 1.3}, {scaleY: 1.3}]}}
                                />
                            </TouchableWithoutFeedback>


                            <Text style={styles.duration}>
                                {secondsToTime(Math.floor(this.state.duration))}
                            </Text>

                        </View>



                        <View style={[styles.leftControl]}>

                            <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                                <Icon name={!this.state.paused ? "pause" : "play"}
                                      style={{fontSize: 30, padding: 10, color: '#FFF'}}/>
                            </TouchableWithoutFeedback>

                            { ! this.state.disableNextPlayer &&

                            <TouchableWithoutFeedback onPress={this.handlePlayNext}>
                                <Icon name={"controller-next"}
                                      type={"Entypo"}
                                      style={{fontSize: 30, padding: 10, marginLeft: 20, color: '#FFF'}}/>
                            </TouchableWithoutFeedback>

                            }

                            { this.state.disableNextPlayer &&

                            <Icon name={"controller-next"}
                                  type={"Entypo"}
                                  style={{fontSize: 30, padding: 10, marginLeft: 20, color: '#969696'}}/>
                            }

                        </View>


                        <View style={[styles.rightControl]}>

                            {this.state.currentVideoType == "mp4" &&

                            <TouchableWithoutFeedback
                                onPress={() => this.setModalResolutionVisible(true)}>

                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    paddingHorizontal: 15
                                }}>
                                    <Icon name={"settings"}
                                          type={"Feather"}
                                          style={{fontSize: 18, color: '#FFF'}}/>
                                    <Text style={{fontSize: 15, marginLeft: 5, color: '#FFF'}}>{lang.resolution}</Text>

                                </View>

                            </TouchableWithoutFeedback>

                            }


                            {this.state.textTracksLength > 0 &&

                            <TouchableWithoutFeedback
                                onPress={() => this.setModalVisible(true)}>

                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    paddingHorizontal: 15
                                }}>
                                    <Icon name={"subtitles"}
                                          type={"MaterialIcons"}
                                          style={{fontSize: 20, color: '#FFF'}}/>
                                    <Text style={{fontSize: 15, marginLeft: 5, color: '#FFF'}}>{lang.subtitle}</Text>

                                </View>
                            </TouchableWithoutFeedback>

                            }

                        </View>


                        <LinearGradient
                            colors={['transparent', 'rgba(16, 16, 16, 0.30)', '#101010']}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: "200%",
                                height: 60,
                            }}/>
                    </View>
                    }

                </View>
                {buffering &&
                <View style={styles.videoCover}>
                    <ActivityIndicator color={"#F44336"} size={60}/>
                    <Text style={{color: "#FFF"}}>{lang.Loading}</Text>
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
    progressTime: {
        position: "absolute",
        height: 48,
        left: 0,
        bottom: 40,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 10,
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
        zIndex: 3
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
        zIndex: 3
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
