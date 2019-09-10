import React from "react";
import {MapView} from "react-native-amap3d/lib/js";
import { StatusBar, StyleSheet, Text, View} from "react-native";
import {WINDOW} from "../../common/constant/Constant";
import NavigationUtil from "../../navigator/NavUtil";
import AMapApi from "../../api/AMapApi";
import {CloseIcon} from "../../common/components/Icons";
import Util from "../../common/util";

export default class TaxiOriginDestDetail extends React.Component{
    constructor(props) {
        super(props);
        this.origin = this.props.navigation.getParam("origin");
        this.dest = this.props.navigation.getParam("dest");
        this.state = {
            directions: {},
            coordinates: [],
            marker: null,
            currentPosition: {
                latitude: 39.9045,
                longitude: 101.1955,
            },
        }
    }

    componentDidMount() {
        this.loadData();
        StatusBar.setHidden(true, "fade");
    }
    componentWillUnmount() {
        StatusBar.setHidden(false, "fade");
    }

    render() {
        let polylineHeader = this.renderPolylineHeader();
        let mapView = this.renderMapView();
        let polylineFooter = this.renderPolylineFooter();
        return(
            <View style={styles.container}>
                {polylineHeader}
                {mapView}
                {polylineFooter}
            </View>
        )
    };

    renderMapView = () => {
        let {coordinates, marker} = this.state;

        let mapMarker = !marker ? null :
            <MapView.Marker
                title={this.state.marker.title}
                coordinate={{
                    latitude: this.state.marker.latitude,
                    longitude: this.state.marker.longitude,
                }}
            />;
        let mapPolyline =
            <MapView.Polyline
                width={10}
                colors={["#0084ff"]}
                coordinates={coordinates}
            />;

        return (
            <MapView
                style={styles.mapViewContainer}
                locationEnabled={true}
                showsScale={true}
                onPress={({nativeEvent}) => {
                    this.setState({
                        marker: {
                            ...this.state.marker,
                            latitude: nativeEvent.latitude,
                            longitude: nativeEvent.longitude,
                        }
                    })
                }}
                onLocation={({nativeEvent}) => {
                    this.setState({
                        currentPosition: {
                            latitude: nativeEvent.latitude,
                            longitude: nativeEvent.longitude,
                        }
                    })
                }}
                coordinate={!!marker ? marker : this.state.currentPosition}
            >
                {mapPolyline}
                {mapMarker}
            </MapView>
        );
    };

    renderPolylineFooter = () => {
        return (
            <View
                style={styles.polylineFooter}
            >
                <Text
                    style={{color: "#0084ff"}}
                >距离<Text
                    style={{color:"#444"}}
                >{`: ${Util.distanceToDisplayString(this.state.directions.distance)}`}</Text></Text>
                <Text
                    style={{color: "#0084ff"}}
                >耗时<Text
                    style={{color:"#444"}}
                >{`: ${Util.durationToDisplayString(this.state.directions.duration)}`}</Text></Text>
                <Text
                    style={{color: "#0084ff"}}
                >预估车费<Text
                    style={{color:"#444"}}
                >{`: ${this.state.directions.cost}元`}</Text></Text>
            </View>
        )
    };

    renderPolylineHeader = () => {
        return (
            <View
                style={styles.polylineHeaderContainer}
            >
                <CloseIcon
                    style={{marginRight: 12, }}
                    color={"#afafaf"}
                    onPress={() => {this.goBack()}}
                />
                <View
                    style={{justifyContent: "space-evenly", height: "100%", alignItems: "center"}}
                >
                    <View
                        style={{width: 8, height: 8, borderRadius: 32, borderColor: "green", borderWidth: 4}}
                    />
                    <View
                        style={{backgroundColor: "#afafaf", width: 3, height: 3, borderRadius: 20}}
                    />
                    <View
                        style={{backgroundColor: "#afafaf", width: 3, height: 3, borderRadius: 20}}
                    />
                    <View
                        style={{backgroundColor: "#afafaf", width: 3, height: 3, borderRadius: 20}}
                    />
                    <View
                        style={{backgroundColor: "#afafaf", width: 3, height: 3, borderRadius: 20}}
                    />
                    <View
                        style={{width: 8, height: 8, borderRadius: 32, borderColor: "orange", borderWidth: 4}}
                    />
                </View>
                <View
                    style={{flex: 1,　marginLeft: 15,}}
                >
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={{ borderBottomWidth: 0.5, borderColor: "#eee", fontSize: 18}}
                    >{this.origin.title}</Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={{fontSize: 18}}
                    >{this.dest.title}</Text>
                </View>
            </View>
        );
    };
    getDirections = async (origin, dest) => {
        try {
            let res = await AMapApi.getRoutes(origin, dest);
            let coordinates = [];
            let directions = {};
            coordinates.push(this.getCoordinate(res.route.origin));
            coordinates.push(this.getCoordinate(res.route.destination));
            if (Array.isArray(res.route.paths) && res.route.paths.length > 0) {
                directions = res.route.paths[0];
            }
            if (Array.isArray(directions.steps) && directions.steps.length > 0) {
                for(let item of directions.steps) {
                    coordinates.push(...this.getCoordinateList(item.polyline))
                }
            }
            return {
                directions: {
                    strategy: directions.strategy,
                    distance: directions.distance,
                    duration: directions.duration,
                    cost: res.route.taxi_cost,
                },
                coordinates,
            };
        } catch (err) {
            console.log(err);
        }
    };
    getCoordinate = (string) => {
        let list = string.split(",");
        return {
            latitude: Number(list[1]),
            longitude: Number(list[0]),
        }
    };
    getCoordinateList = (string) => {
        let list = string.split(";");
        let res = [];
        for (let item of list) {
            res.push(this.getCoordinate(item));
        }
        return res;
    };
    loadData = () => {
        this.getDirections(this.origin, this.dest)
            .then(res => {
                console.log(res);
                this.setState({
                    directions: res.directions,
                    coordinates: res.coordinates,
                })
            })
            .catch()
    };
    goBack = () => {
        console.log("goback");
        NavigationUtil.back(this.props);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    polylineHeaderContainer: {
        top: 16,
        position: "absolute",
        backgroundColor: "#fff",
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        height: 68,
        width: WINDOW.width,
        zIndex: 9,
    },

    mapViewContainer: {
        flex: 1,
    },

    polylineFooter: {
        position: "absolute",
        bottom: 0,
        width: WINDOW.width,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 18,
        paddingBottom: 18,
        backgroundColor: "#fff",
    },
});
