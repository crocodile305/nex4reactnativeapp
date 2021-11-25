import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    // ListView,
    StyleSheet,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import Config from '../config/config';
import ListView from "deprecated-react-native-listview";
import {Divider} from 'react-native-elements';
//import * as Progress from "react-native-progress";
import ProgressBar from "react-native-progress/Bar";
import {isPhone, isTablet} from "react-native-device-detection";

const width = Dimensions.get('window').width;

class CastScreen extends React.Component {

    constructor() {
        super();
        this.state = { isLoading: true, ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })};
    }

    componentDidMount() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.props.navigation.state.params.jwt
        };

        return fetch(Config.api_link + '/api/v1/get/cast/' + this.props.navigation.state.params.id, {
            method: 'GET',
            headers: headers
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    actor: responseJson.data.cast,
                    dataSource: this.state.ds.cloneWithRows(responseJson.data.filmography)
                }, function () {
                    console.log(this.state.dataSource);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }


    render() {

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }

        return (
            <ScrollView>

                <View style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 120, height: 120, borderRadius: 100}}
                        source={this.state.actor.cloud == 'local' ? {uri: Config.api_link + this.state.actor.image} : {uri: Config.cloudfront_casts + this.state.actor.image}}/>
                    <Text style={{
                        color: '#FFF',
                        fontFamily: 'MuktaMalar-Bold',
                        fontWeight: 'bold',
                        fontSize: 20,
                    }}>{this.state.actor.name}</Text>
                </View>

                <Divider style={{backgroundColor: '#1c1c1c', margin: 40, marginTop: 0}}/>

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
                                <ProgressBar progress={(((item.current_time / item.duration_time) * 100) / 100).toFixed(2)}
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
                                <ProgressBar progress={(((item.current_time / item.duration_time) * 100) / 100).toFixed(2)}
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
        );
    }
}

let styles;

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
        }

    });
}



export default CastScreen;
