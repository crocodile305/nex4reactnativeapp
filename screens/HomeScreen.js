import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  AsyncStorage,
} from "react-native";
import Config from "../config/config";
import Carousel, { Pagination } from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
//import * as Progress from "react-native-progress";
import ProgressBar from "react-native-progress/Bar";
import { isPhone, isTablet } from "react-native-device-detection";
import deviceStorage from "../config/deviceStorage";
import axios from "axios";
import { HomeLoader } from "../config/Loader";
import lang from "../config/Languages";

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = { isLoading: true, activeSlide: 0, jwt: "" };
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();
    this._renderItem = this._renderItem.bind(this);
    this._renderTopItem = this._renderTopItem.bind(this);
    this._renderRecentlyItem = this._renderRecentlyItem.bind(this);

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
        .get(Config.api_link + "/api/v1/get/home", { headers: headers })
        .then(
          (response) => {
            console.log(response.data);
            this.setState({
              isLoading: false,
              dataSource: response.data.data,
            });
          },
          (err) => {
            console.log(err.response);
          }
        );
    } else {
      axios.get(Config.api_link + "/api/v1/ghost/get/discover").then(
        (response) => {
          this.setState({
            isLoading: false,
            dataSource: response.data.data,
          });
        },
        (err) => {
          console.log(err.response);
        }
      );
    }
  }

  _renderItem({ item }) {
    let List = null;
    if (item.category_type === "movie") {
      const progressTime = parseInt(
        (((item.current_time / item.duration_time) * 100) / 100).toFixed(2)
      );
      List = (
        <View>
          <View style={styles.posterCardStyle}>
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate("ShowMovie", { id: item.id })
              }
            >
              <Image
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
            </TouchableHighlight>
          </View>

          {this.state.jwt && item.current_time !== null && (
            <ProgressBar
              progress={progressTime}
              width={100}
              height={2}
              color={"#F2C94C"}
              borderColor={"transparent"}
              borderRadius={0}
            />
          )}
        </View>
      );
    } else {
      const progressTime = parseInt(
        (((item.current_time / item.duration_time) * 100) / 100).toFixed(2)
      );
      List = (
        <View>
          <View style={styles.posterCardStyle}>
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate("ShowSeries", { id: item.id })
              }
            >
              <Image
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
            </TouchableHighlight>
            {this.state.jwt && item.current_time !== null && (
              <ProgressBar
                progress={progressTime}
                width={100}
                height={2}
                color={"#F2C94C"}
                borderColor={"transparent"}
                borderRadius={0}
              />
            )}
          </View>
        </View>
      );
    }

    return <View>{List}</View>;
  }

  _renderRecentlyItem({ item }) {
    let List = null;
    if (item.type === "movie") {
      const progressTime = parseInt(
        (((item.current_time / item.duration_time) * 100) / 100).toFixed(2)
      );
      List = (
        <View style={styles.backdropRecentlyCard}>
          <TouchableHighlight
            onPress={() =>
              this.props.navigation.navigate("ShowMSPlayer", {
                id: item.id,
                jwt: this.state.jwt,
              })
            }
          >
            <Image
              style={styles.backdropRecentlyImage}
              source={
                item.cloud === "local"
                  ? {
                      uri:
                        Config.api_link +
                        "/storage/backdrops/600_" +
                        item.backdrop,
                    }
                  : { uri: Config.cloudfront_backdrop + item.backdrop }
              }
            />
          </TouchableHighlight>

          {this.state.jwt && item.current_time !== null && (
            <ProgressBar
              progress={progressTime}
              width={100}
              height={2}
              color={"#F2C94C"}
              borderColor={"transparent"}
              borderRadius={0}
            />
          )}
        </View>
      );
    } else {
      const progressTime = parseInt(
        (((item.current_time / item.duration_time) * 100) / 100).toFixed(2)
      );
      List = (
        <View style={styles.backdropRecentlyCard}>
          <TouchableHighlight
            onPress={() =>
              this.props.navigation.navigate("SeriesPlayerScreen", {
                series_id: item.id,
                jwt: this.state.jwt,
              })
            }
          >
            <Image
              style={styles.backdropRecentlyImage}
              source={
                item.cloud === "local"
                  ? {
                      uri:
                        Config.api_link +
                        "/storage/backdrops/600_" +
                        item.backdrop,
                    }
                  : { uri: Config.cloudfront_backdrop + item.backdrop }
              }
            />
          </TouchableHighlight>

          {this.state.jwt && item.current_time !== null && (
            <ProgressBar
              progress={progressTime}
              width={100}
              height={2}
              color={"#F2C94C"}
              borderColor={"transparent"}
              borderRadius={0}
            />
          )}
        </View>
      );
    }

    return <View>{List}</View>;
  }

  _renderTopItem({ item }) {
    let topList = null;

    if (item.type === "movie") {
      topList = (
        <TouchableHighlight
          onPress={() =>
            this.props.navigation.navigate("ShowMovie", { id: item.id })
          }
        >
          <View style={{ width: "100%", height: 500 }}>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={
                item.cloud === "local"
                  ? {
                      uri:
                        Config.api_link +
                        "/storage/backdrops/original_" +
                        item.backdrop,
                    }
                  : { uri: Config.cloudfront_backdrop + item.backdrop }
              }
            />
            <LinearGradient
              colors={["transparent", "rgba(16, 16, 16, 0.10)", "#101010"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "100%",
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topTextTitle}>{item.name.toUpperCase()}</Text>
              <Text style={styles.topTextGenre}>{item.genre}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      topList = (
        <TouchableHighlight
          onPress={() =>
            this.props.navigation.navigate("ShowSeries", { id: item.id })
          }
        >
          <View style={{ width: "100%", height: 500 }}>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={
                item.cloud == "local"
                  ? {
                      uri:
                        Config.api_link +
                        "/storage/backdrops/original_" +
                        item.backdrop,
                    }
                  : { uri: Config.cloudfront_backdrop + item.backdrop }
              }
            />
            <LinearGradient
              colors={["transparent", "rgba(16, 16, 16, 0.10)", "#101010"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "100%",
              }}
            />

            <View style={styles.topTextView}>
              <Text style={styles.topTextTitle}>{item.name.toUpperCase()}</Text>
              <Text style={styles.topTextGenre}>{item.genre}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    }

    return <View>{topList}</View>;
  }

  get pagination() {
    let entries = this.state.dataSource.top;
    if (entries === null) {
      entries = 0;
    }
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={this.state.activeSlide}
        containerStyle={styles.pagination}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.5}
      />
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{backgroundColor:"#111B46"}}>
          <HomeLoader></HomeLoader>
        </View>
      );
    } else {
      const width = Dimensions.get("window").width;
      let ListRecently;
      if (this.state.jwt && this.state.dataSource.recenlty !== null) {
        this.state.dataSource.recenlty.map(
          (item, index) =>
            (ListRecently = (
              <View key={index} style={{ padding: 10 ,backgroundColor:"#111B46"}}>
                <Text style={styles.genreText}>{lang.recently_watch}</Text>
                <Carousel
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={this.state.dataSource.recenlty}
                  renderItem={this._renderRecentlyItem}
                  sliderWidth={width}
                  itemWidth={backdropRecentlyWidth}
                  inactiveSlideOpacity={1}
                  inactiveSlideShift={1}
                  enableSnap={false}
                  activeSlideAlignment={"start"}
                  firstItem={0}
                  layout={"default"}
                />
              </View>
            ))
        );
      } else {
        ListRecently = null;
      }

      return (
        <ScrollView style={{backgroundColor:"#111B46"}}>
          <View style = {{backgroundColor:"#111B46"}}>
            <Carousel
              data={this.state.dataSource.top}
              renderItem={this._renderTopItem}
              sliderWidth={width}
              itemWidth={width}
              inactiveSlideOpacity={0.4}
              inactiveSlideShift={1}
              firstItem={0}
              autoplay={true}
              onSnapToItem={(index) => this.setState({ activeSlide: index })}
              layout={"default"}
            />
            {this.pagination}
          </View>

          <View>
            <Text style={{ color: "#FFF", fontSize: 40 }}>{lang.home}</Text>
          </View>

          {ListRecently}

          <View style={{backgroundColor:"#111B46"}}>
            {this.state.dataSource.data.map((item, index) =>
              this.state.dataSource.data[index].list.length > 0 ? (
                <View key={index} style={{ padding: 10 }}>
                  <Text style={styles.genreText}>
                    {item.genre.toUpperCase()}
                  </Text>
                  <Carousel
                    ref={(c) => {
                      this._carousel = c;
                    }}
                    data={this.state.dataSource.data[index].list}
                    renderItem={this._renderItem}
                    sliderWidth={width}
                    itemWidth={postertItemWidth}
                    inactiveSlideOpacity={1}
                    inactiveSlideShift={1}
                    enableSnap={false}
                    activeSlideAlignment={"start"}
                    firstItem={0}
                    layout={"default"}
                  />
                </View>
              ) : null
            )}
          </View>
        </ScrollView>
      );
    }
  }
}

let styles;
let postertItemWidth;
let backdropRecentlyWidth;
if (isTablet) {
  // Carousel
  postertItemWidth = 220;
  backdropRecentlyWidth = 350;

  styles = StyleSheet.create({
    genreText: {
      position: "relative",
      color: "#fff",
      fontSize: 24,
      marginBottom: 10,
      letterSpacing: 2,
      fontWeight: "bold",
    },
    backdropRecentlyCard: {
      width: 350,
      height: 200,
      backgroundColor: "#1B1B1B",
    },
    backdropRecentlyImage: {
      width: "100%",
      height: 200,
    },
    posterCardStyle: {
      width: 220,
      height: 350,
      backgroundColor: "#1B1B1B",
    },
    posterImage: {
      width: "100%",
      height: 350,
    },
    topTextTitle: {
      color: "#FFFFFF",
      fontWeight: "bold",
      letterSpacing: 4,
      fontSize: 28,
      textAlign: "center",
    },
    topTextGenre: {
      color: "#c8c8c5",
      fontSize: 18,
    },
    topTextView: {
      position: "absolute",
      top: "65%",
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    pagination: {
      backgroundColor: "transparent",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -30,
      justifyContent: "center",
      alignItems: "center",
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

if (isPhone) {
  // Carousel
  postertItemWidth = 100;
  backdropRecentlyWidth = 200;

  styles = StyleSheet.create({
    genreText: {
      position: "relative",
      color: "#fff",
      fontSize: 16,
      marginBottom: 10,
      letterSpacing: 2,
      fontWeight: "bold",
    },
    backdropRecentlyCard: {
      width: 200,
      height: 100,
      backgroundColor: "#1B1B1B",
    },
    backdropRecentlyImage: {
      width: "100%",
      height: 100,
    },
    posterCardStyle: {
      width: 100,
      height: 145,
      backgroundColor: "#1B1B1B",
    },
    posterImage: {
      width: "100%",
      height: 145,
    },
    topTextTitle: {
      color: "#FFFFFF",
      fontWeight: "bold",
      letterSpacing: 4,
      fontSize: 22,
      textAlign: "center",
    },
    topTextGenre: {
      color: "#c8c8c5",
      fontSize: 13,
    },
    topTextView: {
      position: "absolute",
      top: "65%",
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    pagination: {
      backgroundColor: "transparent",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -30,
      justifyContent: "center",
      alignItems: "center",
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
