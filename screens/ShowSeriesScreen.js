import React from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight,
    Linking, Modal, Share
} from 'react-native';
import {Card, Divider} from "react-native-elements";
import Config from '../config/config'
import LinearGradient from 'react-native-linear-gradient';
import {
    Icon,
    Button,
    Item,
    List,
    ListItem,
    Left,
    Right,
    Header,
    Input,
    Body
} from 'native-base';
import deviceStorage from "../config/deviceStorage";
import axios from "axios";
import {isPhone, isTablet} from "react-native-device-detection";
import {ShowMSLoader} from '../config/Loader'
import lang from '../config/Languages'


class ShowSeriesScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            series: {},
            casts: [],
            seasons: {},
            seasonActive: [],
            collectionData: [],
            newCollectionName: '',
            modalListVisible: false,
            modalYoutubeVisible: false,
            refresh: false,
            jwt: ""
        };
        this.seasonNumber = 1;
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
        this.renderEpisode = this.renderEpisode.bind(this);

        setTimeout(() => {
            this.GetSeriesRequest()
        }, 250)

    }

    GetSeriesRequest() {

        if (this.state.jwt) {

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.state.jwt
            };


            axios.get(Config.api_link + '/api/v1/get/series/' + this.props.navigation.state.params.id, {headers: headers})
                .then(response => {
                    this.setState({
                        isLoading: false,
                        series: response.data.data.series,
                        casts: response.data.data.casts,
                        seasons: response.data.data.season
                    });

                    // Get Collection
                    this.GetCollectionRequest()

                }, err => {
                    console.log(err.response)
                });


        } else {

            axios.get(Config.api_link + '/api/v1/ghost/get/series/' + this.props.navigation.state.params.id)
                .then(response => {
                    this.setState({
                        isLoading: false,
                        series: response.data.data.series,
                        casts: response.data.data.casts,
                        seasons: response.data.data.season
                    });


                    // Get Collection

                }, err => {
                    console.log(err.data)
                });

        }

    }


    GetCollectionRequest() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.get(Config.api_link + '/api/v1/get/collection', {
            headers: headers
        })
            .then(res => {
                this.setState({
                    collectionData: res.data.data,
                });
            }, err => {
                console.log(err.data)
            });
    }

    convertMinsToHrsMins(minutes) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        h = h < 10 ? +h : h;
        m = m < 10 ? +m : m;
        return h + 'h ' + m + 'm';
    }


    renderEpisode({item}) {
        return (
            <View style={styles.episodeView}>

                <TouchableHighlight style={{width: '50%', height: 120, backgroundColor: '#252d3e'}}
                                    onPress={() => this.goToPlayerScreen(item.series_id, item.id)}>

                    <View style={styles.episodeBackdrop}>

                        <Image
                            style={styles.episodeBackdropImage}
                            source={item.cloud == 'local' ? {uri: Config.api_link + '/storage/backdrops/600_' + item.backdrop} : {uri: Config.cloudfront_backdrop + item.backdrop}}
                        />

                        <View style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10000,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <TouchableOpacity onPress={() => this.goToPlayerScreen(item.series_id, item.id)}>

                                <Image
                                    style={styles.episodePlayIcon}
                                    source={require('../assets/play.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={{width: '50%', height: 120}}
                                    onPress={() => this.goToPlayerScreen(item.series_id, item.id)}>

                    <View style={{width: '100%', height: 120, margin: 5, marginLeft: 10, marginTop: 0}}>
                        <Text style={{
                            color: "#FFF",
                            fontWeight: "bold",
                            fontSize: 17
                        }}>{item.episode_number + '. ' + item.name}</Text>
                        <Text style={{color: '#b1b1b1', fontSize: 11}}>{item.overview}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    updateSeasonOnClick = (season) => {
        this.seasonNumber = season;
        this.setState({
            refresh: !this.state.refresh
        })
    };

    goToPlayerScreen(series_id, episode_id) {
        if (!this.state.jwt) {
            this.props.navigation.navigate('ShowLogin');
        } else {
            this.props.navigation.navigate('SeriesPlayerScreen', {
                series_id: series_id,
                episode_id: episode_id,
                jwt: this.state.jwt
            });
        }
    }
    goToCastScreen(id) {
        if (!this.state.jwt) {
            this.props.navigation.navigate('ShowLogin');
        } else {
            this.props.navigation.navigate('ShowActor', {id: id, jwt: this.state.jwt});
        }
    }

    OpenListModal() {
        if (!this.state.jwt) {
            this.props.navigation.navigate('ShowLogin');
        } else {
            this.setState({modalListVisible: true});
        }
    }

    AddToAlreadyList(id) {
        this.state.series.is_favorite = 1;
        this.setState({
            modalListVisible: false
        });
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };
        const data = {
            already_collection: id,
            id: this.state.series.id,
            new_collection: null,
            type: "series"
        };

        axios.post(Config.api_link + '/api/v1/create/item/collection', data, {
            headers: headers
        })
            .then(res => {
                console.log('done')
            }, err => {
                console.log(err.response)
            });


    }

    AddToNewList() {
        this.state.series.is_favorite = 1;
        this.setState({
            modalListVisible: false
        });

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        const data = {
            already_collection: null,
            id: this.state.series.id,
            new_collection: this.state.newCollectionName,
            type: "series"
        };

        axios.post(Config.api_link + '/api/v1/create/item/collection', data, {
            headers: headers
        })
            .then(res => {

                this.state.collectionData.push(res.data.data);

                this.setState({
                    refersh: !this.state.refersh
                });

                console.log('done')
            }, err => {
                console.log(err.response)
            });


    }

    RemoveFromList() {
        this.state.series.is_favorite = 0;

        this.setState({
            refersh: !this.state.refersh
        });

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.post(Config.api_link + '/api/v1/delete/item/collection', {
            id: this.state.series.id,
            type: 'series'
        }, {headers: headers}).then((response) => {
            if (response.status === 200) {
                // success
                console.log(response.data)
            }
        }, (error) => {
            //err
            console.log(error.response)

        });
    }


    AddRate() {
        if (this.state.series.is_like) {
            this.state.series.is_like = 0;
        } else {
            this.state.series.is_like = 1;
        }

        this.setState({
            refersh: !this.state.refersh
        });

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.post(Config.api_link + '/api/v1/create/like', {
            id: this.state.series.id,
            type: 'series'
        }, {headers: headers}).then((response) => {
            if (response.status === 200) {
                console.log(response.data)
            }
        }, (error) => {
            //err
            console.log(error.response)

        });
    }


    handleClick = () => {
        Linking.canOpenURL(this.state.series.trailer).then(supported => {
            if (supported) {
                Linking.openURL(this.state.series.trailer);
            } else {
                console.log("Don't know how to open URI: " + this.state.series.trailer);
            }
        });
    };


    OnShareandle = () => {
        Share.share({
            title: this.state.series.name,
            message: this.state.series.overview + ' : ' + Config.api_link + '/app/series/show/' + this.state.series.id
        }, {
            // Android only:
            dialogTitle: 'Share ' + this.state.series.name,
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        })
    };


    render() {
        let seasonList = null;
        let episodeList = null;

        if (this.state.seasons !== null) {
            this.state.seasonActive = this.state.seasons[this.seasonNumber];
            seasonList = Object.keys(this.state.seasons).map(key =>
                <View key={key}>
                    <TouchableOpacity onPress={() => this.updateSeasonOnClick(key)}>
                        <Card
                            containerStyle={{
                                position: 'relative',
                                padding: 0,
                                margin: 5,
                                width: 50,
                                height: 50,
                                borderRadius: 50,
                                backgroundColor: '#1c1c1c',
                                borderColor: '#000'
                            }}>

                            <Text style={{
                                fontSize: 23,
                                fontWeight: 'bold',
                                color: '#FFF',
                                position: 'relative',
                                left: 17,
                                top: 7,
                                zIndex: 100
                            }}>{key}</Text>

                        </Card>
                    </TouchableOpacity>
                </View>
            );

            episodeList = <FlatList
                extraData={this.state.refresh}
                data={this.state.seasonActive}
                keyExtractor={item => item.name}
                renderItem={this.renderEpisode}
            />
        }


        if (this.state.isLoading) {
            return (
                <View>
                    <ShowMSLoader></ShowMSLoader>
                </View>
            )
        }

        return (
            <ScrollView>


                {/* My List Modal*/}

                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalListVisible}
                        onRequestClose={() => this.setState({modalListVisible: false})}
                        >
                    <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.95)'
                        }}>


                            <Header style={{backgroundColor: '#1B1B1B', height: 60}}>
                                <Left>
                                    <Button transparent onPress={() => this.setState({modalListVisible: false})}>
                                        <Icon type={"AntDesign"} name={"close"} style={{fontSize: 25, color: '#FFFFFF'}}/>
                                    </Button>
                                </Left>
                                <Body style=
                                          {{flex: 2}}>

                                <Item style={styles.modalItemInput}>
                                    <Input style={styles.modalInput}
                                           placeholder={lang.add_new_collection}
                                           placeholderTextColor={'#fff'}
                                           onChangeText={(text) => this.setState({newCollectionName: text})}
                                           autoFocus={true}/>
                                    {this.state.isLoading &&
                                    <View style={{position: "relative", top: 5}}>
                                        <ActivityIndicator color={"#F44336"} size={15}/>
                                    </View>
                                    }

                                </Item>

                                </Body>
                                <Right>
                                    <Button hasText transparent onPress={() => this.AddToNewList()}>
                                        <Text style={{color: '#FFF'}}>{lang.create}</Text>
                                    </Button>
                                </Right>
                            </Header>


                            <List dataArray={this.state.collectionData} renderRow={(item) =>
                                <ListItem onPress={() => this.AddToAlreadyList(item.id)}>
                                    <Left>
                                        <Text style={{color: '#FFF'}}>{item.name}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name="arrow-forward"/>
                                    </Right>
                                </ListItem>
                            }/>

                        </View>
                    </Modal>
                </View>



                {/* Backdrop Image */}
                <View styles={styles.backdropContainer}>
                    <Image
                        style={styles.backdropImage}
                        source={this.state.series.cloud == 'local' ? {uri: Config.api_link + '/storage/backdrops/original_' + this.state.series.backdrop} : {uri: Config.cloudfront_backdrop + this.state.series.backdrop}}
                    />


                    {this.state.seasons !== null &&
                    <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 100
                    }}>
                        <TouchableOpacity onPress={() => this.goToPlayerScreen(this.state.series.id, undefined)}>
                            <Image
                                style={{width: 60, height: 60}}
                                source={require('../assets/play.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    }

                    {this.state.seasons === null &&
                    <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 100
                    }}>
                      <Text style={{fontSize: 40, fontWeight: 'bold', color: '#FFF', letterSpacing: 1.4}}>SOON</Text>
                    </View>

                    }


                    <View style={styles.backButton}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" style={styles.backButtonIcon}/>
                        </Button>
                    </View>

                    <LinearGradient
                        colors={['transparent', 'rgba(16, 16, 16, 0.10)', '#101010']}
                        style={styles.backdropOverlay}/>
                </View>



                <View style={{position: 'relative', top: -20, zIndex: 5}}>

                {/* Name -Year - Rating Box */}

                    <View>
                        <Text style={styles.nameOfMovie}>{this.state.series.name}</Text>
                    </View>

                    <View style={styles.infoNGYR}>

                        <View  style={styles.infoNGYR}>
                            <View><Icon type="FontAwesome" name="star" style={styles.rateStarIcon}/></View>
                            <View><Text style={styles.rateNumber}> {this.state.series.rate}</Text></View>
                        </View>

                        <View>
                            <Text style={styles.ageNumber}>{this.state.series.age}</Text>
                        </View>
                        <View>
                            <Text style={styles.infoNGYRText}>{lang.year}: {this.state.series.year}</Text>
                        </View>

                    </View>

                {/* Contorl */}

                <View style={styles.control}>

                    {this.state.series.is_favorite === 0 &&

                    <View style={styles.controlIconMyList}>
                        <TouchableOpacity onPress={() => this.OpenListModal()}>
                            <Icon name={"pluscircleo"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.my_list}</Text>
                    </View>
                    }

                    {this.state.series.is_favorite === 1 &&

                    <View style={styles.controlIconMyList}>
                        <TouchableOpacity onPress={() => this.RemoveFromList()}>
                            <Icon name={"checkcircle"} type={"AntDesign"}  style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.my_list}</Text>
                    </View>
                    }

                    { ! this.state.jwt &&
                    <View style={styles.controlIconMyList}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ShowLogin')}>
                            <Icon name={"pluscircleo"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.my_list}</Text>
                    </View>
                    }



                    {this.state.series.is_like === 0 &&
                    <View style={styles.controlIconRate}>
                        <TouchableOpacity onPress={() => this.AddRate()}>
                            <Icon name={"like2"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>{lang.like}</Text>
                    </View>
                    }


                    {this.state.series.is_like === 1 &&
                    <View style={styles.controlIconRate}>
                        <TouchableOpacity onPress={() => this.AddRate()}>
                            <Icon name={"like2"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.like}</Text>
                    </View>
                    }


                    { ! this.state.jwt &&

                    <View style={styles.controlIconRate}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ShowLogin')}>
                            <Icon name={"like1"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>{lang.like}</Text>
                    </View>

                    }


                    <View style={styles.controlIconShare}>
                        <TouchableOpacity onPress={() => this.OnShareandle()}>
                            <Icon name={"share-alternative"} type={"Entypo"}
                                  style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>{lang.share}</Text>
                    </View>


                </View>


                {/* Summary */}

                <View style={styles.overview}>
                    <Text style={{color: '#b1b1b1', fontSize: 11}}>{this.state.series.overview}</Text>
                    <Text style={{color: '#FFF', fontSize: 11, marginTop: 15}}>{lang.genres}:
                        <Text style={{color: '#b1b1b1', fontSize: 11}}> {this.state.series.genre}</Text>
                    </Text>
                </View>

                {/* Casts */}

                <View>

                    <FlatList
                        horizontal
                        data={this.state.casts}
                        keyExtractor={item => item.name}
                        renderItem={({item, index}) =>
                            <TouchableOpacity
                                onPress={() => this.goToCastScreen(item.id)}
                                style={{backgroundColor: '#1c1c1c', margin: 3}}>
                                <Card containerStyle={{
                                    padding: 0,
                                    width: 60,
                                    borderRadius: 50,
                                    backgroundColor: '#1c1c1c',
                                    borderColor: '#000'
                                }}>
                                    <Image
                                        style={{width: 60, height: 60, borderRadius: 50}}
                                        source={this.state.series.cloud == 'local' ? {uri: Config.api_link + item.image} : {uri: Config.cloudfront_casts + item.image}}
                                    />
                                </Card>
                                <Text style={{
                                    fontSize: 10,
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


                <Divider style={{backgroundColor: '#1c1c1c', position: 'relative', top: 10}}/>

                {/* Similar */}
                <View style={{flex: 1, flexDirection: 'row', position: 'relative', top: 10, left: 0}}>
                    {seasonList}
                </View>


                <View>
                    {episodeList}
                </View>


                </View>
            </ScrollView>
        );
    }
}



let styles;
if (isPhone) {
    styles = StyleSheet.create({
        backdropContainer: {
            flex: 1,
            alignItems: 'stretch'
        },
        backdropImage: {
            width: '100%',
            height: 250
        },
        backdropOverlay: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 400,
            zIndex: 1
        },
        infoNGYR: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: 10,
            marginLeft: 5,
            marginTop: 0
        },
        nameOfMovie: {
            fontFamily: 'MuktaMalar-Bold',
            fontWeight: 'bold',
            fontSize: 20,
            margin: 10,
            color: '#FFFFFF'
        },
        rateNumber: {
            fontWeight: 'bold',
            fontSize: 11,
            color: '#FFF'
        },
        rateStarIcon: {
            fontSize: 15,
            color: '#FF9800'
        },
        ageNumber: {
            color: '#FFF',
            fontSize: 11,
            marginLeft: 20
        },

        infoNGYRText: {
            fontSize: 12,
            color: '#FFF',
            marginLeft: 20
        },
        control: {
            height: 75,
            zIndex: 100,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 0,
            padding: 15,
            backgroundColor: '#1c1c1c'
        },
        controlIconMyList: {
            position: 'absolute',
            top: 10,
            left: '10%',
        },
        controlIconRate: {
            position: 'absolute',
            top: 10,
            left: '35%',
        },
        controlIconShare: {
            position: 'absolute',
            top: 10,
            left: '60%',
        },

        iconText: {
            color: '#dadada',
            textAlign: 'center',
            marginLeft: 0,
            marginTop: 3,
            fontSize: 10
        },
        overview: {
            margin: 10
        },
        episodeView: {
            flex: 1,
            flexDirection: 'row',
            margin: 10,
            marginTop: 20,
            height: 120
        },
        episodeBackdrop:{
            width: '100%',
            height: 120,
            backgroundColor: '#1c1c1c'
        },
        episodeBackdropImage:{
            width: '100%',
            height: 120,
        },
        episodePlayIcon: {
            width: 35,
            height: 35
        },
        modalItemInput: {
            width: "100%",
            padding: 10,
            height: 30,
            borderColor: 'transparent',
        },
        modalInput: {
            color: '#FFFFFF',
            fontSize: 13,
            height: 55,
            width: "100%",
            borderBottomColor: "#FFF",
        },
        backButton: {
            position: 'absolute',
            top: 15,
            left: -15,
            zIndex: 1000,
            padding: 20
        },
        backButtonIcon: {
            fontSize: 25, color: '#FFFFFF'
        }
    });
}

if (isTablet) {

    styles = StyleSheet.create({
        backdropContainer: {
            flex: 1,
            alignItems: 'stretch'
        },
        backdropImage: {
            width: '100%',
            height: 500
        },
        backdropOverlay: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 400,
            zIndex: 1
        },
        infoNGYR: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: 10,
            marginLeft: 5,
            marginTop: 0
        },
        nameOfMovie: {
            fontFamily: 'MuktaMalar-Bold',
            fontWeight: 'bold',
            fontSize: 35,
            margin: 10,
            color: '#FFFFFF'
        },
        rateNumber: {
            fontWeight: 'bold',
            fontSize: 17,
            color: '#FFF'
        },
        rateStarIcon: {
            fontSize: 25,
            color: '#FF9800'
        },
        ageNumber: {
            color: '#FFF',
            fontSize: 17,
            fontWeight: 'bold',
            marginLeft: 10
        },
        infoNGYRText: {
            fontSize: 17,
            fontWeight: 'bold',
            color: '#FFF',
            marginLeft: 15
        },
        control: {
            height: 75,
            zIndex: 100,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 0,
            padding: 15,
            backgroundColor: '#1c1c1c'
        },
        controlIconMyList: {
            position: 'absolute',
            top: 10,
            left: '10%',
        },
        controlIconRate: {
            position: 'absolute',
            top: 10,
            left: '35%',
        },
        controlIconShare: {
            position: 'absolute',
            top: 10,
            left: '60%',
        },
        iconText: {
            color: '#dadada',
            textAlign: 'center',
            marginLeft: 0,
            marginTop: 3,
            fontSize: 10
        },
        overview: {
            margin: 10
        },
        episodeView: {
            flex: 1,
            flexDirection: 'row',
            margin: 10,
            marginTop: 20,
            height: 220
        },
        episodeBackdrop:{
            width: '100%',
            height: 220,
            backgroundColor: '#1c1c1c'
        },

        episodeBackdropImage:{
            width: '100%',
            height: 220,
        },
        episodePlayIcon: {
             width: 60,
             height: 60
        },
        modalItemInput: {
            width: "100%",
            padding: 10,
            height: 30,
            borderColor: 'transparent',
        },
        modalInput: {
            color: '#FFFFFF',
            fontSize: 13,
            height: 55,
            width: "100%",
            borderBottomColor: "#FFF",
        },

        backButton: {
            position: 'absolute',
            top: 15,
            left: -15,
            zIndex: 1000,
            padding: 20
        },
        backButtonIcon : {
            fontSize: 35,
            color: '#FFFFFF'
        }

    });
}


export default ShowSeriesScreen;
