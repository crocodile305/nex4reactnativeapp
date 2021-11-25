import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {isPhone, isTablet} from "react-native-device-detection";
import {Card} from "react-native-elements";
import lang from "./Languages";

const state = {
    casts: ['1','2','3','4','5','6','7','8','9','10']
};

const width = Dimensions.get('window').width;


export const ShowMSLoader = () => {
       return ( <View>
            <View style={styles.backdropContainer}>
            </View>

            <View style={{backgroundColor: '#1c1c1c', width: 200, height: 20, margin: 10}}></View>
            <View style={{backgroundColor: '#1c1c1c', width: 150, height: 10, margin: 10, marginTop: 0}}></View>

            <View style={styles.control}></View>
            <View style={{backgroundColor: '#1c1c1c', width: '100%', height: 10, margin: 10, marginTop: 0}}></View>
            <View style={{backgroundColor: '#1c1c1c', width: '100%', height: 10, margin: 10, marginTop: 0}}></View>
            <View style={{backgroundColor: '#1c1c1c', width: '100%', height: 10, margin: 10, marginTop: 0}}></View>
            <View style={{backgroundColor: '#1c1c1c', width: '100%', height: 10, margin: 10, marginTop: 0}}></View>
            <View style={{backgroundColor: '#1c1c1c', width: '50%', height: 10, margin: 10, marginTop: 0}}></View>

               <FlatList
                   horizontal
                   data={state.casts}
                   keyExtractor={item => item}
                   renderItem={({item}) =>
                       <View
                           style={{backgroundColor: '#1c1c1c', margin: 3}}
                       >
                           <Card
                               containerStyle={{
                                   padding: 0,
                                   width: 60,
                                   borderRadius: 50,
                                   backgroundColor: '#1c1c1c',
                                   borderColor: '#4c4c4c'
                               }}>
                               <View
                                   style={{backgroundColor: '#1c1c1c', width: 60, height: 60, borderRadius: 50}}
                               ></View>
                           </Card>

                           <View style={{
                               marginTop: 5,
                               flex:1,
                               alignItems:'center',
                               marginBottom: 15}}>
                               <View style={{
                                   backgroundColor: '#303030',
                                   width: 50,
                                   height: 6}}>

                               </View>
                           </View>
                       </View>
                   }
               />
        </View>
        );


};

export const HomeLoader = () => {
    return ( <View>
                <View style={styles.backdropContainerTop}>
            </View>



            <View style={{backgroundColor: '#111B46', width: 130, height: 25, margin: 10}}></View>

            <FlatList
                horizontal
                data={state.casts}
                keyExtractor={item => item}
                renderItem={({item}) =>

                    <View style={styles.tvPoster}>
                        <View style={styles.tvPoster}></View>
                        <View style={styles.tvTitle}></View>
                    </View>
                }
            />



            <View style={{backgroundColor: '#1c1c1c', width: 130, height: 25, margin: 10}}></View>

            <FlatList
                horizontal
                data={state.casts}
                keyExtractor={item => item}
                renderItem={({item}) =>

                    <View style={styles.tvPoster}>
                        <View style={styles.tvPoster}></View>
                        <View style={styles.tvTitle}></View>
                    </View>
                }
            />

        </View>
    );


};


export const OtherLoader = () => {
    return ( <View>

            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>

                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
                <View style={styles.poster}></View>
            </View>

        </View>
    );
};

export const SearchLoader = () => {
    return ( <View>
        <View style={{margin: 8}}>
            <Text style={{color: "#FFF", fontSize: 24}}>{lang.actors}</Text>
        </View>
        <View>

            <FlatList
                horizontal
                data={state.casts}
                keyExtractor={item => item}
                renderItem={({item}) =>
                    <View
                        style={{backgroundColor: '#1c1c1c', margin: 3}}
                    >
                        <Card
                            containerStyle={{
                                padding: 0,
                                width: 90,
                                borderRadius: 90,
                                backgroundColor: '#1c1c1c',
                                borderColor: '#000'
                            }}>
                            <View
                                style={{backgroundColor: '#1c1c1c', width: 90, height: 90, borderRadius: 50}}
                            ></View>
                        </Card>

                        <View style={{
                            marginTop: 5,
                            flex:1,
                            alignItems:'center',
                            marginBottom: 15}}>
                            <View style={{
                                backgroundColor: '#303030',
                                width: 50,
                                height: 6}}>

                            </View>
                        </View>
                    </View>
                }
            />
        </View>

            <View style={{margin: 8}}>
                <Text style={{color: "#FFF", fontSize: 24}}>{lang.shows_and_movie}</Text>
            </View>

            <View style={styles.itemCardContainerSearch}>
                <View style={styles.itemCardViewSearch}></View>
            </View>
            <View style={styles.itemCardContainerSearch}>
                <View style={styles.itemCardViewSearch}></View>
            </View>
            <View style={styles.itemCardContainerSearch}>
                <View style={styles.itemCardViewSearch}></View>
            </View>
            <View style={styles.itemCardContainerSearch}>
                <View style={styles.itemCardViewSearch}></View>
            </View>
        </View>

    )
}



export const TvLoader = () => {
    return ( <View>


            <View style={{backgroundColor: '#1c1c1c', width: 130, height: 25, margin: 10}}></View>

                <FlatList
                    horizontal
                    data={state.casts}
                    keyExtractor={item => item}
                    renderItem={({item}) =>

                        <View style={styles.tvPoster}>
                            <View style={styles.tvPoster}></View>
                            <View style={styles.tvTitle}></View>
                        </View>
                    }
                />



            <View style={{backgroundColor: '#1c1c1c', width: 130, height: 25, margin: 10}}></View>

                <FlatList
                    horizontal
                    data={state.casts}
                    keyExtractor={item => item}
                    renderItem={({item}) =>

                        <View style={styles.tvPoster}>
                            <View style={styles.tvPoster}></View>
                            <View style={styles.tvTitle}></View>
                        </View>
                    }
                />


            <View style={{backgroundColor: '#1c1c1c', width: 130, height: 25, margin: 10}}></View>

            <FlatList
                horizontal
                data={state.casts}
                keyExtractor={item => item}
                renderItem={({item}) =>

                    <View style={styles.tvPoster}>
                        <View style={styles.tvPoster}></View>
                        <View style={styles.tvTitle}></View>
                    </View>
                }
            />

            <View style={{backgroundColor: '#1c1c1c', width: 130, height: 25, margin: 10}}></View>

            <FlatList
                horizontal
                data={state.casts}
                keyExtractor={item => item}
                renderItem={({item}) =>

                    <View style={styles.tvPoster}>
                        <View style={styles.tvPoster}></View>
                        <View style={styles.tvTitle}></View>
                    </View>
                }
            />

        </View>
    );


};



let styles;
if (isPhone) {
    styles = StyleSheet.create({
        backdropContainer: {
            width: '100%',
            height: 250,
            backgroundColor: '#1c1c1c'
        },
        backdropContainerTop: {
            width: '100%',
            height: 500,
            backgroundColor: '#111B46'
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
        poster: {
            backgroundColor: '#1c1c1c',
            width: (width / 3) - 15,
            height: 135,
            marginLeft: 10,
            marginTop: 15
        },
        tvPoster: {
            width: 120,
            height: 120,
            marginTop: 10,
            marginLeft: 5,
            backgroundColor: '#1c1c1c',
        },
        tvTitle:{
            backgroundColor: '#1c1c1c',
            width: '50%',
            height: 10,
            margin: 10,
            marginTop: 3
        },
        itemCardContainerSearch: {
            flex:1,
            marginBottom: 30,
            margin: 10
        },
        itemCardViewSearch: {
            backgroundColor: '#1c1c1c',
            marginTop: 10,
            width: '100%',
            height: 135
        }
    });
}


if (isTablet) {
    styles = StyleSheet.create({
        backdropContainer: {
            width: '100%',
            height: 500,
            backgroundColor: '#1c1c1c'
        },
        backdropContainerTop: {
            width: '100%',
            height: 500,
            backgroundColor: '#1c1c1c'
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
        poster: {
            backgroundColor: '#1c1c1c',
            width: (width / 4) - 15,
            height: 320,
            marginLeft: 12,
            marginTop: 15
        },
        itemCardViewSearch: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#1c1c1c',
            marginTop: 10,
            width: '100%',
            height: 320
        }
    });
}


