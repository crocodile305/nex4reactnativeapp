import React from 'react'
import {
    ActivityIndicator, Dimensions,
    FlatList,
    Image,
    // ListView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert
} from "react-native";
import ListView from "deprecated-react-native-listview";
import {
    Container,
    Content,
    ScrollableTab,
    Tabs,
    Tab,
    Header,
    Left,
    Right,
    Button,
    Icon,
    Body,
    Toast
} from "native-base";
import axios from "axios";
import Config from "../../config/config";
import deviceStorage from "../../config/deviceStorage";
import lang from '../../config/Languages'
import {isPhone, isTablet} from "react-native-device-detection";
import {OtherLoader} from "../../config/Loader";

const width = Dimensions.get('window').width;

class MyListScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            isLoadingData: false,
            data: [],
            dataSource: {},
            collectionActive: 0,
            collectionDataStatus: false,
            removeCollectionLoading: false,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            jwt: '',
            sortActive: 0
        };
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT();
        this.renderList = this.renderList.bind(this);

        setTimeout(() => {
            this.UpdateRequest(this);
        }, 250)
    }

    UpdateRequest() {

        this.setState({
            isLoading: true
        });
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.get(Config.api_link + '/api/v1/get/collection', {
            headers: headers
        })
            .then(response => {
                console.log(response.data)
                if (response.data.data.length > 0) {
                    this.setState({
                        data: response.data.data,
                        collectionActive: response.data.data[0].id
                    });


                    // get first collection
                    axios.get(Config.api_link + '/api/v1/get/collection/' + response.data.data[0].id, {
                        headers: headers
                    })
                        .then(response => {
                            if (response.data.data.data !== null) {
                                this.setState({
                                    dataSource: this.state.ds.cloneWithRows(response.data.data.data),
                                    collectionDataStatus: true,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    collectionDataStatus: false,
                                    isLoading: false
                                });
                            }
                        }, err => {
                            console.log(err.data)
                        });
                }else{
                    this.setState({
                        collectionDataStatus: false,
                        isLoading: false
                    });
                }
            }, err => {
                console.log(err.data)
            });
    };


    UpdateCollection(id) {

        if (this.state.collectionActive === id) {
            return
        }


        this.setState({
            isLoadingData: true,
            collectionActive: id
        });


        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.get(Config.api_link + '/api/v1/get/collection/' + id, {
            headers: headers
        })
            .then(response => {
                if (response.data.data.data !== null) {
                    this.setState({
                        dataSource: this.state.ds.cloneWithRows(response.data.data.data),
                        collectionDataStatus: true,
                        isLoadingData: false
                    });
                } else {
                    this.setState({
                        collectionDataStatus: false,
                        isLoadingData: false
                    });
                }
            }, err => {
                console.log(err.data)
            });

    }

    RemoveAlertButton() {
        Alert.alert(
            'Confirm',
            'Do you want to remove this collection',
            [
                {text: 'NO', style: 'cancel'},
                {text: 'YES', onPress: () => this.RemoveCollection()},
            ]
        );
    }


    RemoveCollection() {

        this.setState({
            removeCollectionLoading: true
        });

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.state.jwt
        };

        axios.post(Config.api_link + '/api/v1/delete/collection', {id: this.state.collectionActive}, {headers: headers}).then((response) => {
            if (response.status === 200) {
                this.state.data.map((item, key) => {
                    if (item.id === this.state.collectionActive) {
                        this.UpdateRequest();
                        this.setState({
                            removeCollectionLoading: false
                        })
                    }
                })
            }
        }, (error) => {
            // error
        });
    }

    renderList({item}) {

        return (
            <TouchableOpacity onPress={() => this.UpdateCollection(item.id)}>
                <Text
                    style={this.state.collectionActive === item.id ? styles.filterButtonActive : styles.filterButtonInactive}>{item.name}</Text>
            </TouchableOpacity>
        )

    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator color={"#F44336"} size={60}/>
                </View>
            );
        } else {
            if (this.state.data.length > 0) {

                return (
                    <Container style={styles.parent}>
                        <Header style={styles.header}>
                            <Left>
                                <Button transparent onPress={() => this.props.navigation.goBack()}>
                                    <Icon type="AntDesign" name="arrowleft" style={{fontSize: 25, color: '#FFFFFF'}}/>
                                </Button>
                            </Left>
                            <Body style={{flex: 2}}>
                            <Text style={styles.headerText}>{lang.my_list}</Text>
                            </Body>

                            {this.state.removeCollectionLoading &&
                            <Right style={{position: 'absolute', right: 30}}>
                                <ActivityIndicator color={"#F44336"} size={18}/>
                            </Right>
                            }
                            {!this.state.removeCollectionLoading &&

                            <Right style={{position: 'absolute', right: 30}}>
                                <Button transparent onPress={() => this.RemoveAlertButton()}>
                                    <Icon type={'MaterialCommunityIcons'} name={'delete'}
                                          style={{fontSize: 25, color: '#FFFFFF'}}/>
                                </Button>
                            </Right>
                            }
                            {this.state.isLoadingData &&
                            <Right style={{position: 'absolute', right: 0}}>
                                <ActivityIndicator color={"#F44336"} size={18}/>
                            </Right>
                            }
                        </Header>


                        <Content style={styles.parent}>

                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={this.state.data}
                                keyExtractor={item => item.id}
                                extraData={this.state.collectionActive}
                                renderItem={this.renderList}/>


                            <View>
                                {this.state.collectionDataStatus && !this.state.isLoadingData &&
                                <ScrollView>
                                    <ListView
                                        initialListSize={100}
                                        contentContainerStyle={styles.listView}
                                        dataSource={this.state.dataSource}
                                        renderRow={(item) => {
                                            let List = null;
                                            if (item.type === 'movie') {
                                                List = <View style={styles.posterCard}>

                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate('ShowMovie', {id: item.id})}>
                                                        <Image
                                                            resizeMode="contain"
                                                            style={styles.posterImage}
                                                            source={item.cloud == 'local' ? {uri: Config.api_link + '/storage/posters/600_' + item.poster} : {uri: Config.cloudfront_poster + item.poster}}/>
                                                    </TouchableOpacity>

                                                </View>;
                                            } else {
                                                List = <View style={styles.posterCard}>
                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate('ShowSeries', {id: item.id})}>
                                                        <Image
                                                            resizeMode="contain"
                                                            style={styles.posterImage}
                                                            source={item.cloud == 'local' ? {uri: Config.api_link + '/storage/posters/600_' + item.poster} : {uri: Config.cloudfront_poster + item.poster}}/>
                                                    </TouchableOpacity>
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

                                }

                                {!this.state.collectionDataStatus &&
                                <Content style={styles.parent}>
                                    <Text
                                        style={{fontSize: 22, color: "#FFF", fontWeight: "bold", textAlign: 'center'}}>{lang.notItemsInCollection}</Text>
                                </Content>
                                }


                                {this.state.isLoadingData &&
                                <View>
                                    <OtherLoader></OtherLoader>
                                </View>
                                }


                            </View>


                        </Content>


                    </Container>
                )
            } else {

                return (

                    <View style={{
                        position: "absolute",
                        top: 90,
                        width: '100%',
                        zIndex: 10}}>
                        <Text style={{fontSize: 26, color: "#bdbdbd", fontWeight: "bold", textAlign: 'center'}}>{lang.noList}</Text>

                    </View>

                )
            }
        }
    }

}


let styles;

if (isPhone) {
    styles = StyleSheet.create({
        header: {
            backgroundColor: '#1B1B1B',
            height: 55,
            zIndex: 2
        },
        headerText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 18,
        },
        parent: {
            backgroundColor: '#101010'
        },
        parentButton: {
            position: 'relative',
            marginTop: 20,
            left: '10%'
        },
        titleText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 11
        },
        listView: {
            flexDirection: 'row',
            flexWrap: 'wrap',
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
        filterButtonActive: {
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 15,
            backgroundColor: '#4b4b4b',
            margin: 6,
            padding: 10
        },
        filterButtonInactive: {
            color: '#636c72',
            fontWeight: 'bold',
            fontSize: 15,
            backgroundColor: '#1c1c1c',
            margin: 6,
            padding: 10
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

        header: {
            backgroundColor: '#1B1B1B',
            height: 55,
            zIndex: 2
        },
        headerText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 18,
        },
        parent: {
            backgroundColor: '#101010'
        },
        parentButton: {
            position: 'relative',
            marginTop: 20,
            left: '10%'
        },
        titleText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 11
        },

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
        filterButtonActive: {
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 20,
            backgroundColor: '#1c1c1c',
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


export default MyListScreen;
