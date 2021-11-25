import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  // ListView,
  FlatList,
} from "react-native";
import ListView from "deprecated-react-native-listview";
import { Card, Divider } from "react-native-elements";
import { isPhone, isTablet } from "react-native-device-detection";
import Config from "../config/config";
import deviceStorage from "../config/deviceStorage";
import axios from "axios";
// import * as Progress from "react-native-progress";
import ProgressBar from "react-native-progress/Bar";
import { OtherLoader } from "../config/Loader";
import lang from "../config/Languages";

const width = Dimensions.get("window").width;

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      modalVisible: false,
      emptyMovies: false,
      sortActive: "all",
      jwt: "",
    };
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();

    setTimeout(() => {
      this.GetRequest();
    }, 300);
  }

  GetRequest() {
    if (this.state.jwt) {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      };

      axios
        .get(Config.api_link + "/api/v1/get/movies", { headers: headers })
        .then(
          (response) => {
            this.setState({
              isLoading: false,
              dataSource: this.state.ds.cloneWithRows(
                response.data.data.movies
              ),
            });
          },
          (err) => {
            console.log(err.response);
          }
        );
    } else {
      axios.get(Config.api_link + "/api/v1/ghost/get/movies").then(
        (response) => {
          this.setState({
            isLoading: false,
            dataSource: this.state.ds.cloneWithRows(response.data.data.movies),
          });
        },
        (err) => {
          console.log(err.response);
        }
      );
    }
  }

  getMovieByGenre(genre) {
    this.setState({
      isLoading: true,
      sortActive: genre,
    });

    fetch(Config.api_link + "/api/v1/get/movies/sort", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
      body: JSON.stringify({
        trending: 1,
        genre: genre,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.movies === null) {
          this.setState({
            emptyMovies: true,
            isLoading: false,
          });
          return;
        }
        this.setState(
          {
            isLoading: false,
            emptyMovies: false,
            dataSource: this.state.ds.cloneWithRows(responseJson.data.movies),
          },
          function () {}
        );
      })
      .catch((error) => {
        console.log(error);
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
          {this.state.jwt && (
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={Config.genereList}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    onPress={() => this.getMovieByGenre(item.value)}
                  >
                    <Text
                      style={
                        this.state.sortActive == item.value
                          ? styles.filterButtonActive
                          : styles.filterButtonInactive
                      }
                    >
                      {item.translate}
                    </Text>
                  </TouchableHighlight>
                )}
              />
              <Divider style={{ backgroundColor: "#2d2d2d", margin: 10 }} />
            </View>
          )}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../assets/search.png")}
            />
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: "#FFF",
                marginTop: 20,
              }}
            >
              {" "}
              {lang.noItems}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {this.state.jwt && (
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={Config.genereList}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    onPress={() => this.getMovieByGenre(item.value)}
                  >
                    <Text
                      style={
                        this.state.sortActive == item.value
                          ? styles.filterButtonActive
                          : styles.filterButtonInactive
                      }
                    >
                      {item.translate}
                    </Text>
                  </TouchableHighlight>
                )}
              />
              <Divider style={{ backgroundColor: "#2d2d2d", margin: 10 }} />
            </View>
          )}

          <ListView
            initialListSize={100}
            contentContainerStyle={styles.listView}
            dataSource={this.state.dataSource}
            renderRow={(item) => (
              <View style={styles.posterCard}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ShowMovie", { id: item.id })
                  }
                >
                  <Image
                    resizeMode="contain"
                    style={styles.posterImage}
                    source={
                      item.cloud == "local"
                        ? {
                            uri:
                              Config.api_link +
                              "/storage/posters/600_" +
                              item.poster,
                          }
                        : { uri: Config.cloudfront_poster + item.poster }
                    }
                  />
                </TouchableOpacity>

                {this.state.jwt && item.current_time !== null && (
                  <ProgressBar
                    progress={parseInt(
                      (
                        ((item.current_time / item.duration_time) * 100) /
                        100
                      ).toFixed(2)
                    )}
                    width={100}
                    height={2}
                    color={"#F2C94C"}
                    borderColor={"transparent"}
                    borderRadius={0}
                  />
                )}
              </View>
            )}
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
      flexDirection: "row",
      flexWrap: "wrap",
    },
    posterCard: {
      width: width / 3 - 15,
      marginLeft: 10,
      marginTop: 15,
    },
    posterImage: {
      width: width / 3 - 15,
      height: 150,
      zIndex: 1,
    },
    filterView: {
      position: "absolute",
      bottom: 20,
      right: 10,
      zIndex: 1,
    },
    filterButton: {
      backgroundColor: "red",
      width: 40,
      height: 40,
      borderRadius: 50,
    },
    filterButtonActive: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 15,
      backgroundColor: "#4b4b4b",
      margin: 6,
      padding: 10,
    },
    filterButtonInactive: {
      color: "#636c72",
      fontWeight: "bold",
      fontSize: 15,
      backgroundColor: "#1c1c1c",
      margin: 6,
      padding: 10,
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
      zIndex: 10,
    },
  });
}

if (isTablet) {
  styles = StyleSheet.create({
    listView: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    posterCard: {
      width: width / 4 - 15,
      marginLeft: 12,
      marginTop: 15,
    },
    posterImage: {
      width: width / 4 - 15,
      height: 320,
      zIndex: 1,
    },
    filterView: {
      position: "absolute",
      bottom: 20,
      right: 10,
      marginTop: 5,
      zIndex: 1,
    },
    filterButton: {
      backgroundColor: "red",
      width: 40,
      height: 40,
      borderRadius: 50,
    },
    filterButtonActive: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 20,
      backgroundColor: "#4b4b4b",
      margin: 6,
      padding: 10,
    },
    filterButtonInactive: {
      color: "#636c72",
      fontWeight: "bold",
      fontSize: 20,
      backgroundColor: "#1c1c1c",
      margin: 6,
      padding: 10,
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
      zIndex: 10,
    },
  });
}

export default HomeScreen;
