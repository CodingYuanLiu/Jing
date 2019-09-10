import React from "react"
import { View, Text, StatusBar, TextInput, StyleSheet, TouchableNativeFeedback, PermissionsAndroid, TouchableWithoutFeedback} from 'react-native';
import {connect} from "react-redux";
import {Button, Icon, Input} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";
import Activity from "../../../actions/activity";
import {MapView} from "react-native-amap3d";
import HeaderBar from "../../../common/components/HeaderBar";
import {CarIcon, CloseIcon} from "../../../common/components/Icons";
import OriginDestModal from "./OriginDestModal";
import { init, Geolocation} from "react-native-amap-geolocation/lib/js";
import {WINDOW} from "../../../common/constant/Constant";
import AMapApi from "../../../api/AMapApi";

class PublishActOriginDest extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            origin: {},
            dest: {},
            currentLocation: {
                latitude: 39.91095,
                longitude: 116.37296,
            },
            marker: null,
            isFooterVisible: false,
            isPolylineVisible: false,
            isOriginDestModalVisible: 0,
            polyline: [],
            directions: {},
            coordinates: [],
        };
    }
    componentDidMount() {
        this.loadData();
        StatusBar.setHidden(true, "fade");
    }
    componentWillUnmount() {
        StatusBar.setHidden(false, "fade");
    }

    render() {
        let header = this.renderHeader();
        let polylineHeader = this.renderPolylineHeader();
        let mapView = this.renderMapView();
        let inputModal = this.renderInputModal();
        let footer = this.renderFooter();
        let polylineFooter = this.renderPolylineFooter();
        return(
            <View style={styles.container}>
                {polylineHeader}
                {mapView}
                {header}
                {inputModal}
                {footer}
                {polylineFooter}
            </View>
        )
    };
    renderHeader = () => {
        if (this.state.isPolylineVisible) return null;
        let leftIcon = (
            <CloseIcon
                color={"#0084FF"}
                size={24}
                onPress={this.goBack}
            />
        );
        let rightButton = (
            <Button
                title={"确定"}
                titleStyle={{fontWeight: "bold"}}
                type={"clear"}
                color={"#0084FF"}
                buttonStyle={styles.headerRightButton}
                onPress={this.toNextPage}
            />
        );
        let {dest } = this.state;
        let headerTitle = (
            <Text
                style={styles.headerTitle}
                numOfLines={2}
                ellipsizeMode={"tail"}
                onPress={() => {this.showOriginDestModal(2)}}
            >{dest.title === "" ? "您要去哪里?" : dest.title}</Text>
            );
        return (
            <HeaderBar
                leftButton={leftIcon}
                leftBtnStyle={{marginRight: 6,}}
                titleView={headerTitle}
                titleLayoutStyle={{flexDirection: "row", alignItems: "flex-start", justifyContent: "center"}}
                rightButton={rightButton}
                rightBtnStyle={{ marginLeft: 6,}}
                style={styles.headerContainer}
            />
            );
    };

    renderPolylineHeader = () => {
        if (!this.state.isPolylineVisible) return null;
        return (
            <View
                style={styles.polylineHeaderContainer}
            >
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
                        onPress={() => {this.setState({isOriginDestModalVisible: 1})}}
                    >{this.state.origin.title}</Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={{fontSize: 18}}
                        onPress={() => {this.setState({isOriginDestModalVisible: 2})}}
                    >{this.state.dest.title}</Text>
                </View>
                <Button
                    type={"clear"}
                    title={"确定"}
                    onPress={this.toNextPage}
                    containerStyle={{marginLeft: 15}}
                />
            </View>
        );
    };
    renderInputModal = () => {
        return (
            <OriginDestModal
                closeModal={this.hideOriginDestModal}
                isOrigin={this.state.isOriginDestModalVisible === 1}
                isVisible={this.state.isOriginDestModalVisible !== 0}
                confirmDest={this.handleInputDest}
                confirmOrigin={this.handleInputOrigin}
            />
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
        let mapPolyline = this.state.isPolylineVisible ?
            <MapView.Polyline
                width={10}
                colors={["#0084ff"]}
                coordinates={coordinates}
            /> : null;

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
                        location: {
                            latitude: nativeEvent.latitude,
                            longitude: nativeEvent.longitude,
                        }
                    })
                }}
                coordinate={marker ? marker : this.state.location}
            >
                {mapPolyline}
                {mapMarker}
            </MapView>
        );
    };

    renderFooter = () => {
        if (!this.state.isFooterVisible) return null;
        if (this.state.isPolylineVisible) return null;
        let {marker} = this.state;

        let goThereButton = (
            <TouchableNativeFeedback
                onPress={this.goThere}
            >
                <View
                    style={styles.goThereButtonContainer}
                >
                    <CarIcon
                        color={"#fff"}
                        size={30}
                    />
                    <Text
                        style={{fontSize: 12, color: "#fff"}}
                    >
                        到这去
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
        return (
            <View
                style={styles.footerContainer}
            >
                {goThereButton}
                <Text
                    style={styles.footerTitle}
                >
                    {marker.title}
                </Text>
                <Text
                    style={styles.footerSubtitle}
                >
                    {marker.address}
                </Text>
            </View>
        )
    };
    renderPolylineFooter = () => {
        if (!this.state.isPolylineVisible) return null;
        return (
            <View
                style={styles.polylineFooter}
            >
                <Text
                    style={{color: "#0084ff"}}
                >距离<Text
                    style={{color:"#444"}}
                >{`: ${this.state.directions.distance}`}</Text></Text>
                <Text
                    style={{color: "#0084ff"}}
                >耗时<Text
                    style={{color:"#444"}}
                >{`: ${this.state.directions.duration}`}</Text></Text>
                <Text
                    style={{color: "#0084ff"}}
                >预估车费<Text
                    style={{color:"#444"}}
                >{`: ${this.state.directions.cost}元`}</Text></Text>
            </View>
        )
    };
    showOriginDestModal = (value) => {
        this.setState({isOriginDestModalVisible: value})
    };
    hideOriginDestModal = () => {
        this.setState({isOriginDestModalVisible: 0})
    };
    handleInputOrigin = propOrigin => {
        let origin = {...propOrigin};
        let location = origin.location.split(",");
        origin.latitude = Number(location[1]);
        origin.longitude = Number(location[0]);
        this.props.saveTaxiAct({origin: origin});

        this.setState(state => {
            return {
                ...state,
                origin: origin,
                marker: origin
            }
        });
        this.getDirections(origin, this.state.dest)
            .then(res => {
                console.log(res);
                this.setState({
                    coordinates: res.coordinates,
                    directions: res.directions,
                })
            });
    };
    handleInputDest = propDest => {
        let dest = {...propDest};
        let location = dest.location.split(",");
        dest.latitude = Number(location[1]);
        dest.longitude = Number(location[0]);
        this.props.saveTaxiAct({dest: dest});
        let {state} = this;

        this.setState({
            dest,
            marker: dest,
        });

        if (state.isPolylineVisible) {
            this.getDirections(state.origin, dest)
                .then(res => {
                    this.setState({
                        directions: res.directions,
                        coordinates: res.coordinates,
                    })
                })
        } else {
            this.setState({
                isFooterVisible: true,
            })
        }
    };
    goThere = () => {
        let {state} = this;
        let dest = {...state.marker};
        this.setState({
            isFooterVisible: false,
            dest,
            isPolylineVisible: true,
        });
        this.getDirections(state.origin, dest)
            .then(res => {
                console.log(res);
                this.setState({
                    coordinates: res.coordinates,
                    directions: res.directions,
                })
            });
    };

    getDirections = async (origin, dest) => {
        try {
            let res = await AMapApi.getRoutes(origin, dest);
            console.log(res);
            let coordinates = [];
            let directions = {};
            coordinates.push(this.getCoordinate(res.route.origin));
            coordinates.push(this.getCoordinate(res.route.destination));
            if (Array.isArray(res.route.paths) && res.route.paths.length > 0) {
                directions = res.route.paths[0];
                console.log(directions);
            }
            if (Array.isArray(directions.steps) && directions.steps.length > 0) {
                for(let item of directions.steps) {
                    coordinates.push(...this.getCoordinateList(item.polyline))
                }
                console.log(directions.steps);
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
        console.log(res);
        return res;
    };
    loadData = () => {
        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ])
            .then(() => {
                let { publishAct } = this.props;
                let { origin, dest } = publishAct;
                if (origin === undefined || origin.title === undefined ||
                    origin.latitude === undefined || origin.longitude === undefined
                ) {
                    this.getGeolocation()
                        .catch(err => {
                            console.log(err);
                        });
                }
                if (dest === undefined || dest.title === undefined ||
                    dest.latitude === undefined || origin.longitude === undefined
                ) {
                    dest = {
                        title: "",
                    }
                }
                this.setState({
                    origin: origin,
                    dest: dest,
                })
            })
            .catch(err => {
                console.log(err);
            });
    };

    toNextPage = () => {
        if (this.state.origin.title === "" ||
            this.state.dest.title === "") {
            alert("有空没有填哦～");
            return;
        }
        NavigationUtil.back(this.props);
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    };
    getGeolocation = async () => {
        await init({
            android: "617d2c2e23b1d390b3ab75e14975ec32",
        });
        Geolocation.getCurrentPosition(res => {
            let origin = {
                latitude: res.coords.latitude,
                longitude: res.coords.longitude,
                ...res.location,
                title: "我的位置",
            };
            this.setState({origin});
            this.props.saveTaxiAct({origin});
        });
    };
}

const mapStateToProps = state => ({
    publishAct: state.publishAct,
});
const mapDispatchToProps = dispatch => ({
    saveTaxiAct: (data) => dispatch(Activity.saveTaxiAct(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PublishActOriginDest);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    headerContainer: {
        backgroundColor: "#fff",
        position: "absolute",
        top: 16,
        left: 15,
        width: WINDOW.width - 30,
        borderRadius: 3,
    },
    headerRightButton: {
        padding: 0,
        margin: 0,
    },
    headerTitle: {
        flex: 1,
        fontSize: 16,
        color: "#555",
        backgroundColor: "red",
    },

    polylineHeaderContainer: {
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
        top: 16,
    },


    mapViewContainer: {
        flex: 1,
    },

    footerContainer: {
        position: "absolute",
        bottom: 0,
        width: WINDOW.width,
        backgroundColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 18,
        paddingBottom: 18,
    },
    footerTitle: {
        fontSize: 18,
        color: "#444",
    },
    footerSubtitle: {
        fontSize: 13,
        color: "#444",
    },
    goThereButtonContainer: {
        borderRadius: 200,
        padding: 10,
        backgroundColor: "#0084ff",
        position: "absolute",
        right: 25,
        top: -36,
        width: 80,
        height: 80,
        elevation: 3,
        alignItems: "center",
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
