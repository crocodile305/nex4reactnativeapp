import React from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    // ListView,
    FlatList
} from 'react-native';
import ListView from "deprecated-react-native-listview";
import {Header, Left, Body, Button, Icon, Item, Input} from 'native-base';
import Config from "../config/config";
import axios from "axios";
import {Card} from "react-native-elements";
import deviceStorage from "../config/deviceStorage";
import {isPhone, isTablet} from "react-native-device-detection";
import {SearchLoader} from '../config/Loader'
import lang from '../config/Languages'

const width = Dimensions.get('window').width;

export default class SearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            casts: {},
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            modalVisible: false,
            emptyItem: true,
            jwt: ''
        };

        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();

    }


    search = (query) => {
        this.setState({isLoading: true});
        axios.post(Config.api_link + '/api/v1/ghost/get/search', {query: query})
            .then(response => {
                if (response.data.data.data !== null) {
                    this.setState({
                        emptyItem: false,
                        isLoading: false,
                        casts: response.data.data.cast,
                        dataSource: this.state.ds.cloneWithRows(response.data.data.data),
                    });
                } else {
                    this.setState({
                        emptyItem: true,
                        isLoading: false,
                    })
                }

            }, err => {
                this.setState({
                    emptyItem: true,
                    isLoading: false,
                })
            });

    };
    goToCastScreen(id) {
        if(!this.state.jwt) {
            this.props.navigation.navigate('ShowLogin');
        } else {
            this.props.navigation.navigate('ShowActor', {id: id, jwt: this.state.jwt});
        }
    }

    render() {

        return (
            <View>
                <Header style={{backgroundColor: '#1c1c1c', height: 55}}>
                    <Left style={{flex: 0}}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" style={{fontSize: 25, color: '#FFFFFF'}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 1}}>

                    <Item style={styles.searchInput}>
                        <Input style={styles.input}
                               placeholder={lang.search_for}
                               placeholderTextColor={'#a7a7a7'}
                               onChangeText={(text) => this.search(text)}
                               autoFocus={true}/>
                        {this.state.isLoading &&
                        <View style={{ position: "relative", top: 5}}>
                            <ActivityIndicator color={"#F44336"} size={15}/>
                        </View>
                        }

                    </Item>
                    </Body>
                </Header>

                {! this.state.isLoading && this.state.emptyItem &&
                <View style={{
                    position: "absolute",
                    left: 20,
                    top: 150,
                    zIndex: 10}}>
                    <Text style={{fontSize: 22, color: "#FFF", fontWeight: "bold"}}>{lang.find_what}</Text>
                    <Text style={{fontSize: 12, color: "#F7F7F7"}}>{lang.search_for}</Text>
                </View>
                }

                {this.state.isLoading &&

                <SearchLoader></SearchLoader>

                }


                { !this.state.emptyItem &&
                <ScrollView>

                <View>
                    <View style={{margin: 8}}>
                        <Text style={{color: "#FFF", fontSize: 24}}>{lang.actors}</Text>
                    </View>
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
                                            width: 90,
                                            borderRadius: 90,
                                            backgroundColor: '#1c1c1c',
                                            borderColor: '#000'
                                        }}>
                                        <Image
                                            style={{width: 90, height: 90, borderRadius: 50}}
                                            source={item.cloud == 'local' ? {uri: Config.api_link + item.image} : {uri: Config.cloudfront_casts + item.image}}
                                        />
                                    </Card>
                                    <Text style={{
                                        fontSize: 10,
                                        color: '#FFFFFF',
                                        textAlign: 'center',
                                        marginTop: 5,
                                        marginBottom: 15
                                    }}>{item.name}</Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                     <View style={{margin: 8}}>
                            <Text style={{color: "#FFF", fontSize: 24}}>{lang.shows_and_movie}</Text>
                        </View>
                        <ListView
                            initialListSize={20}
                            contentContainerStyle={styles.listView}
                            dataSource={this.state.dataSource}
                            renderRow={(item) => {
                                let List = null;
                                if (item.type === 'movie') {
                                    List = <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#1c1c1c', marginTop: 10}}>

                                        <View style={styles.posterCard}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('ShowMovie', {id: item.id})}>
                                                <Image
                                                    style={styles.posterImage}
                                                    source={item.cloud == 'local' ? {uri: Config.api_link + '/storage/posters/600_' + item.poster} : {uri: Config.cloudfront_poster + item.poster}}/>
                                            </TouchableOpacity>
                                         </View>

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ShowMovie', {id: item.id})}>
                                            <View style={styles.itemDetails}>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                                <Text  style={[styles.itemType, {backgroundColor: '#f5576c'} ]}>{lang.movie}</Text>
                                                <Text style={styles.itemOverview} numberOfLines={3}>{item.overview}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                } else {
                                    List = <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#1c1c1c', marginTop: 10}}>

                                        <View style={styles.posterCard}>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('ShowSeries', {id: item.id})}>
                                            <Image
                                                style={styles.posterImage}
                                                source={item.cloud == 'local' ? {uri: Config.api_link + '/storage/posters/600_' + item.poster} : {uri: Config.cloudfront_poster + item.poster}}/>
                                        </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ShowSeries', {id: item.id})}>
                                            <View style={styles.itemDetails}>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                                <Text style={[styles.itemType, {backgroundColor: '#66a6ff'} ]}>{lang.show}</Text>
                                                <Text style={styles.itemOverview} numberOfLines={3}>{item.overview}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }

                                return (
                                    <View>
                                        {List}
                                    </View>
                                );
                            }
                            }
                        />

                </View>

                </ScrollView>
                }


            </View>
        );
    }
}


let styles;

if (isPhone) {
    styles = StyleSheet.create({
        email: {
            width: 300,
        },
        searchInput: {
            width: "100%",
            padding: 10,
            height: 30,
            borderColor: 'transparent',
        },
        formAlign: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            color: '#FFFFFF',
            fontSize: 13,
            height: 55,
            borderBottomColor: "#FFF",
        },
        titleText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 11
        },
        listView: {
            flex:1,
            marginBottom: 30,
            margin: 10
        },
        posterCard: {
            backgroundColor: '#1B1B1B',
            width: 90,
            height: 130,
            margin: 3
        },
        posterImage: {
            width: '100%',
            height: 130,
            zIndex: 1
        },

        itemDetails: {
            width: '75%',
            height: 135,
            marginLeft: 10,
        },
        itemName: {
            color: '#FFF',
            fontSize: 20,
            fontWeight: 'bold'
        },
        itemOverview: {
            color: '#a3a3a3',
            fontSize: 12
        },
        itemType: {
            color: '#FFF',
            fontSize: 10,
            padding: 2,
            width: '20%',
            textAlign: 'center'
        },
        spinnerLoading: {
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 10
        }

    });
}


if (isTablet) {
    styles = StyleSheet.create({
        email: {
            width: 300,
        },
        searchInput: {
            width: "100%",
            padding: 10,
            height: 30,
            borderColor: 'transparent',
        },
        formAlign: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            color: '#FFFFFF',
            fontSize: 13,
            height: 55,
            borderBottomColor: "#FFF",
        },
        titleText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18
        },

        genreSmallText: {
            color: '#636c72',
            fontSize: 11,
        },

        listView: {
            flex:1,
            marginBottom: 30,
            margin: 10
        },
        posterCard: {
            width: '20%',
            height: 320,
            backgroundColor: '#1B1B1B',
            margin: 10,

        },
        posterImage: {
            width: '100%',
            height: 320,
            zIndex: 1
        },

        itemDetails: {
            width: '80%',
            height: 320,
            margin: 10,
        },
        itemName: {
            color: '#FFF',
            fontSize: 30,
            fontWeight: 'bold'
        },
        itemOverview: {
            color: '#a3a3a3',
            fontSize: 15
        },
        itemType: {
            color: '#FFF',
            fontSize: 13,
            padding: 2,
            width: '20%',
            textAlign: 'center'
        },
    });
}


