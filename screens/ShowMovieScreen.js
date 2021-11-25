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
    Linking,
    Modal,
    Share
} from 'react-native';
import {Card, Divider} from 'react-native-elements';
import Config from '../config/config';
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
    Input, Body, Title
} from 'native-base';
import deviceStorage from '../config/deviceStorage';
import axios from "axios";
import {isPhone, isTablet} from "react-native-device-detection";
import {ShowMSLoader} from '../config/Loader'
import lang from '../config/Languages'




class ShowMovieScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            movie: {},
            casts: [],
            similar: [],
            collectionData: [],
            newCollectionName: '',
            modalListVisible: false,
            modalYoutubeVisible: false,
            refersh: false,
            jwt: ''
        };
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();

        setTimeout(() => {
            this.GetMovieRequest()
        }, 250)
    }

    GetMovieRequest() {

        if (this.state.jwt) {

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.state.jwt
            };


            axios.get(Config.api_link + '/api/v1/get/movie/' + this.props.navigation.state.params.id, {headers: headers})
                .then(response => {
                    console.log(response.data.data.movie)

                    this.setState({
                        isLoading: false,
                        movie: response.data.data.movie,
                        casts: response.data.data.casts,
                        similar: response.data.data.similar
                    });

                    // Get Collection
                    this.GetCollectionRequest()

                }, err => {
                    console.log(err.response)
                });


        } else {

            axios.get(Config.api_link + '/api/v1/ghost/get/movie/' + this.props.navigation.state.params.id)
                .then(response => {
                    this.setState({
                        isLoading: false,
                        movie: response.data.data.movie,
                        casts: response.data.data.casts,
                        similar: response.data.data.similar
                    });

                    console.log(response.data.data.movie)

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
        return h + 'h ' + m + 'min';
    }

    goToCastScreen(id) {
        if (!this.state.jwt) {
            this.props.navigation.navigate('ShowLogin');
        } else {
            this.props.navigation.navigate('ShowActor', {id: id, jwt: this.state.jwt});
        }
    }

    goToPlayerScreen(id) {
        if (!this.state.jwt) {
            this.props.navigation.navigate('ShowLogin');
        } else {
            this.props.navigation.navigate('ShowMSPlayer', {id: id, jwt: this.state.jwt});
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
        this.state.movie.is_favorite = 1;
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
            id: this.state.movie.id,
            new_collection: null,
            type: "movie"
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
        this.state.movie.is_favorite = 1;
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
            id: this.state.movie.id,
            new_collection: this.state.newCollectionName,
            type: "movie"
        };

        axios.post(Config.api_link + '/api/v1/create/item/collection', data, {
            headers: headers
        })
            .then(res => {
                // Toast.show({
                //     text: 'Successful ' + this.state.movie.name + ' add to your list',
                //     buttonText: 'Okay'
                // });

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
        this.state.movie.is_favorite = 0;

        this.setState({
            refersh: !this.state.refersh
        });

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.post(Config.api_link + '/api/v1/delete/item/collection', {
            id: this.state.movie.id,
            type: 'movie'
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
        if (this.state.movie.is_like) {
            this.state.movie.is_like = 0;
        } else {
            this.state.movie.is_like = 1;
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
            id: this.state.movie.id,
            type: 'movie'
        }, {headers: headers}).then((response) => {
            if (response.status === 200) {
                console.log(response.data)
            }
        }, (error) => {
            //err
            console.log(error.response)

        });
    }


    OnYoutubeHandle = () => {
        Linking.canOpenURL(this.state.movie.trailer).then(supported => {
            if (supported) {
                Linking.openURL(this.state.movie.trailer);
            } else {
                console.log("Don't know how to open URI: " + this.state.movie.trailer);
            }
        });
    };


    OnShareandle = () => {
        Share.share({
            title: this.state.movie.name,
            message: this.state.movie.overview + ' : ' + Config.api_link + '/app/series/show/' + this.state.movie.id
        }, {
            // Android only:
            dialogTitle: 'Share ' + this.state.movie.name,
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        })
    };


    render() {
        let similarList = null;
        if (this.state.similar !== null) {
            similarList =
                <View style={{position: 'relative', top: 25}}>
                    <Divider style={{backgroundColor: '#2d2d2d', position: 'relative', top: -10}}/>
                    <Text style={{fontWeight: 'bold', color: '#FFF', fontSize: 19, marginLeft: 5}}>{lang.recommendation}</Text>
                    <FlatList
                        horizontal
                        data={this.state.similar}
                        keyExtractor={item => item.id}
                        renderItem={({item}) =>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.push('ShowMovie', {id: item.id})}>
                                <Card
                                    containerStyle={{
                                        padding: 0,
                                        margin: 5,
                                        width: 100,
                                        backgroundColor: 'transparent',
                                        borderColor: 'transparent'
                                    }}>
                                    <Image
                                        onPress={() => this.props.navigation.navigate('ShowActor', {id: item.id})}
                                        style={{width: 100, height: 160, borderRadius: 7}}
                                        source={item.cloud === 'local' ? {uri: Config.api_link + '/storage/posters/600_' + item.poster} : {uri: Config.cloudfront_poster + item.poster}}/>
                                </Card>
                            </TouchableOpacity>
                        }
                    />
                </View>;
        }

        if (this.state.isLoading) {
            return (
              <View>
                  <ShowMSLoader></ShowMSLoader>
              </View>
            );
        }
        //  return null;
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
                                <ListItem onPress={() => this.AddToAlreadyList(item.id)}
                                          style={{borderColor: '#2b2b2b'}}>
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
                        source={this.state.movie.cloud === 'local' ? {uri: Config.api_link + '/storage/backdrops/original_' + this.state.movie.backdrop} : {uri: Config.cloudfront_backdrop + this.state.movie.backdrop}}
                    />

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
                        <TouchableOpacity onPress={() => this.goToPlayerScreen(this.state.movie.id)}>
                            <Image
                                style={{width: 60, height: 60}}
                                source={require('../assets/play.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.backButton}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" style={styles.backButtonIcon}/>
                        </Button>
                    </View>


                    <LinearGradient
                        colors={['transparent', 'rgba(16, 16, 16, 0.10)', '#101010']}
                        style={styles.backdropOverlay}/>

                </View>

                {/* Name -Year - Rating Box */}

                <View style={{position: 'relative', top: -20, zIndex: 5}}>

                <View>
                    <Text style={styles.nameOfMovie}>{this.state.movie.name}</Text>
                </View>

                <View style={styles.infoNGYR}>

                    <View style={styles.infoNGYR}>
                            <View><Icon type="FontAwesome" name="star" style={styles.rateStarIcon}/></View>
                            <View><Text style={styles.rateNumber}> {this.state.movie.rate}</Text></View>
                        </View>

                        <View>
                            <Text style={styles.ageNumber}>{this.state.movie.age}</Text>
                        </View>
                        <View>
                            <Text style={styles.infoNGYRText}>{lang.year}: {this.state.movie.year}</Text>
                        </View>
                        <View>
                            <Text style={styles.infoNGYRText}>{this.convertMinsToHrsMins(this.state.movie.runtime)}</Text>
                        </View>

                </View>

                {/* Contorl */}

                <View style={styles.control}>

                    <View style={styles.controlIconTrailer}>
                        <TouchableOpacity onPress={() => this.OnYoutubeHandle()}>
                            <Icon name={"social-youtube"} type={"SimpleLineIcons"}
                                  style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.trailer}</Text>
                    </View>

                    {this.state.movie.is_favorite === 0 &&

                    <View style={styles.controlIconMyList}>
                        <TouchableOpacity onPress={() => this.OpenListModal()}>
                            <Icon name={"pluscircleo"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.my_list}</Text>
                    </View>
                    }

                    {!this.state.jwt &&
                    <View style={styles.controlIconMyList}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ShowLogin')}>
                            <Icon name={"pluscircleo"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.my_list}</Text>
                    </View>
                    }


                    {this.state.movie.is_favorite === 1 &&

                    <View style={styles.controlIconMyList}>
                        <TouchableOpacity onPress={() => this.RemoveFromList()}>
                            <Icon name={"checkcircle"} type={"AntDesign"}  style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>

                        <Text style={styles.iconText}>{lang.my_list}</Text>
                    </View>
                    }


                    {this.state.movie.is_like === 0 &&
                    <View style={styles.controlIconRate}>
                        <TouchableOpacity onPress={() => this.AddRate()}>
                            <Icon name={"like2"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>{lang.like}</Text>
                    </View>
                    }


                    {!this.state.jwt &&

                    <View style={styles.controlIconRate}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ShowLogin')}>
                            <Icon name={"like2"} type={"AntDesign"} style={{fontSize: 35, color: '#FFF'}}></Icon>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>{lang.like}</Text>
                    </View>

                    }

                    {this.state.movie.is_like === 1 &&
                    <View style={styles.controlIconRate}>
                        <TouchableOpacity onPress={() => this.AddRate()}>
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
                    <Text style={{color: '#b1b1b1', fontSize: 11}}>{this.state.movie.overview}</Text>
                    <Text style={{color: '#FFF', fontSize: 11, marginTop: 15}}>{lang.genres}:
                        <Text style={{color: '#b1b1b1', fontSize: 11}}> {this.state.movie.genre}</Text>
                    </Text>
                </View>

                {/* Casts */}

                <View>

                    <FlatList
                        horizontal
                        data={this.state.casts}
                        keyExtractor={item => item.name}
                        renderItem={({item}) =>
                            <TouchableOpacity
                                onPress={() => this.goToCastScreen(item.id)}
                                style={{backgroundColor: '#1c1c1c', margin: 3}}>
                                <Card
                                    containerStyle={{
                                        padding: 0,
                                        width: 60,
                                        borderRadius: 50,
                                        backgroundColor: '#1c1c1c',
                                        borderColor: '#000'
                                    }}>
                                    <Image
                                        style={{width: 60, height: 60, borderRadius: 50}}
                                        source={this.state.movie.cloud == 'local' ? {uri: Config.api_link + item.image} : {uri: Config.cloudfront_casts + item.image}}
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


                {/* Similar */}

                {similarList}

                </View>


            </ScrollView>



        );

    }
}


let styles;
let postertItemWidth;

if (isPhone) {
    styles = StyleSheet.create({
        backdropContainer: {
            flex: 1,
            alignItems: 'stretch'
        },
        backdropImage: {
            width: '100%',
            height: 300,
            backgroundColor: '#1c1c1c'
        },
        backdropOverlay: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 300,
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
            marginLeft: 10
        },

        infoNGYRText: {
            fontSize: 12,
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
        controlIconTrailer: {
            position: 'absolute',
            left: '10%',
            top: 10,
            borderColor: 'red',
            borderRadius: 50
        },
        controlIconMyList: {
            position: 'absolute',
            top: 10,
            left: '35%',
        },
        controlIconRate: {
            position: 'absolute',
            top: 10,
            left: '60%',
        },
        controlIconShare: {
            position: 'absolute',
            top: 10,
            left: '85%',
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
            marginLeft: 20
        },
        infoNGYRText: {
            fontSize: 17,
            fontWeight: 'bold',
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
        controlIconTrailer: {
            position: 'absolute',
            left: '10%',
            top: 10,
            borderColor: 'red',
            borderRadius: 50
        },
        controlIconMyList: {
            position: 'absolute',
            top: 10,
            left: '35%',
        },
        controlIconRate: {
            position: 'absolute',
            top: 10,
            left: '60%',
        },
        controlIconShare: {
            position: 'absolute',
            top: 10,
            left: '85%',
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


export default ShowMovieScreen;
