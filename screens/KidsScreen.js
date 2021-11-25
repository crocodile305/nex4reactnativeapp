import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import ListView from "deprecated-react-native-listview";
import Config from '../config/config';
import {isPhone, isTablet} from "react-native-device-detection";
// import * as Progress from "react-native-progress";
import ProgressBar from "react-native-progress/Bar";
import {OtherLoader} from "../config/Loader";
import lang from '../config/Languages'

const width = Dimensions.get('window').width;

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true, ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }), modalVisible: false, emptyMovies: false, sortActive: 'all' };
    }

    componentDidMount() {
        fetch(Config.api_link + '/api/v1/ghost/get/kids', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: this.state.ds.cloneWithRows(responseJson.data.kids),
                }, function () {

                });
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <OtherLoader></OtherLoader>
                </View>
            );
        }


        if (this.state.emptyMovies) {
            return (
                <View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <Image
                            style={{ width: 100, height: 100 }}
                            source={require('../assets/search.png')}
                        />
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: '#FFF', marginTop: 20}}>{lang.noItems}</Text>
                    </View>
                </View>
            );
        }

        return (
            <View style={{ flex: 1 }}>

                <ScrollView>
                    <ListView
                        initialListSize={100}
                        contentContainerStyle={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={(item) => {
                            let List = null;
                            if(item.type === 'movie') {
                                List = <View style={styles.posterCard}>

                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('ShowMovie', {id: item.id})}>
                                        <Image
                                            resizeMode="contain"
                                            style={styles.posterImage}
                                            source={item.cloud == 'local' ? {uri: Config.api_link + '/storage/posters/600_' + item.poster} : {uri: Config.cloudfront_poster + item.poster}}/>
                                    </TouchableOpacity>


                                    {this.state.jwt && item.current_time !== null &&
                                    <ProgressBar progress={parseInt((((item.current_time / item.duration_time) * 100) / 100).toFixed(2))}
                                                  width={100}
                                                  height={2}
                                                  color={'#F2C94C'}
                                                  borderColor={'transparent'}
                                                  borderRadius={0}/>
                                    }
                                </View>;
                            }else{
                                List = <View style={styles.posterCard}>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('ShowSeries', {id: item.id})}>
                                        <Image
                                            resizeMode="contain"
                                            style={styles.posterImage}
                                            source={item.cloud == 'local' ? {uri: Config.api_link + '/storage/posters/600_' + item.poster} : {uri: Config.cloudfront_poster + item.poster}}/>
                                    </TouchableOpacity>


                                    {this.state.jwt && item.current_time !== null &&
                                    <ProgressBar progress={parseInt((((item.current_time / item.duration_time) * 100) / 100).toFixed(2))}
                                                  width={100}
                                                  height={2}
                                                  color={'#F2C94C'}
                                                  borderColor={'transparent'}
                                                  borderRadius={0}/>
                                    }

                                </View>;
                            }

                            return (
                                <View>
                                    {List}
                                </View>
                            );
                        }
                        }
                    />

                </ScrollView>


            </View>

        );
    }
}


let styles;
let postertItemWidth;

if (isPhone) {
    styles = StyleSheet.create({

        listView: {
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        posterCard: {
            width: (width / 3) - 15,
            marginLeft: 10,
            marginTop: 15
        },
        posterImage: {
            width: (width / 3) - 15,
            height: 150,
            zIndex: 1
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
        listView: {
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        posterCard: {
            width: (width / 4) - 15,
            marginLeft: 12,
            marginTop: 15
        },
        posterImage: {
            width: (width / 4) - 15,
            height: 320,
            zIndex: 1
        },
        filterView: {
            position: 'absolute',
            bottom: 20,
            right: 10,
            marginTop: 5,
            zIndex: 1
        },
        filterButton: {
            backgroundColor: 'red',
            width: 40,
            height: 40,
            borderRadius: 50,
        },
        filterButtonActive: {
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 20,
            borderBottomColor: '#03a9f4',
            borderBottomWidth: 0.7,
            margin: 6,
        },
        filterButtonInactive: {
            color: '#636c72',
            fontWeight: 'bold',
            fontSize: 20,
            margin: 6,
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

export default HomeScreen;
