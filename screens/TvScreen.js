import React from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
    StyleSheet,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import Config from '../config/config';
import Carousel from 'react-native-snap-carousel';
import deviceStorage from "../config/deviceStorage";
import {TvLoader} from '../config/Loader';

const width = Dimensions.get('window').width;

class TvScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, dataSource: [], jwt: ''};
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        return fetch(Config.api_link + '/api/v1/ghost/get/tv', {
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
                    dataSource: responseJson.data,
                }, function () {
                    //
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    goPlayTVScreen(id) {
        if (!this.state.jwt) {
            this.props.navigation.navigate('ShowLogin');
        } else {
            this.props.navigation.navigate('TvPlayerScreen', {id: id, jwt: this.state.jwt});
        }
    }

    _renderItem({item}) {

        return (
            <View>
                    <TouchableHighlight onPress={() => this.goPlayTVScreen(item.id)}>
                        <Image
                            style={{width: 120, height: 120, borderRadius: 7, backgroundColor: "#1c1c1c"}}
                            source={{uri: Config.api_link + '/storage/posters/' + item.image}}/>
                    </TouchableHighlight>
                <Text style={styles.titleText}>{item.name}</Text>
            </View>

        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <TvLoader></TvLoader>
                </View>
            );
        }

        return (

            <ScrollView>
                <View>
                    {
                        this.state.dataSource.channels.map((item, index) =>
                            this.state.dataSource.channels[index].list.length > 0 ?
                                <View key={index} style={styles.carousel} style={{padding: 10}}>
                                    <Text style={styles.genreText}>{item.genre}</Text>
                                    < Carousel
                                        ref={(c) => {
                                            this._carousel = c;
                                        }}
                                        data={this.state.dataSource.channels[index].list}
                                        renderItem={this._renderItem}
                                        sliderWidth={width}
                                        itemWidth={120}
                                        inactiveSlideOpacity={0.7}
                                        inactiveSlideShift={1}
                                        enableSnap={false}
                                        activeSlideAlignment={'start'}
                                        firstItem={0}
                                        layout={'default'}
                                    />
                                </View>
                                : null
                        )
                    }
                </View>

            </ScrollView>

        );
    }
}


const styles = StyleSheet.create({
    titleText: {
        fontFamily: 'MuktaMalar-Bold',
        color: '#fff',
        fontWeight: 'bold',
        margin: 5
    },
    genreText: {
        fontFamily: 'MuktaMalar-Bold',
        position: 'relative',
        left: 5,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    carousel: {
        marginBottom: 20
    }

});


export default TvScreen;
