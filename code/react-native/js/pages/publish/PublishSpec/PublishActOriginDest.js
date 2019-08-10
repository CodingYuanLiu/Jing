import React from "react"
import { View, Text, StatusBar, TextInput, StyleSheet, Dimensions } from 'react-native';
import {connect} from "react-redux";
import {Button, Icon, Input} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";
import Activity from "../../../actions/activity";
import {MapView} from "react-native-amap3d";
import HeaderBar from "../../../common/components/HeaderBar";
import {CarIcon, CloseIcon} from "../../../common/components/Icons";
import Theme from "../../../common/constant/Theme";
import OriginDestModal from "./OriginDestModal";

class PublishActOriginDest extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            origin: {
                title: "",
            },
            dest: {
                title: "",
            },
            isOriginDestModalVisible: 0,
            coordinates: [],
        };
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        let header = this.renderHeader();
        let mapView = this.renderMapView();
        let inputModal = this.renderInputModal();
        return(
            <View style={styles.container}>
                {mapView}
                {header}
                {inputModal}
            </View>
        )
    };
    renderHeader = () => {
        let leftIcon = (
            <CloseIcon
                color={"#0084FF"}
                size={24}
                onPress={this.goBack}
                style={styles.headerLeftIcon}
            />
        );
        let rightButton = (
            <Button
                title={"确定"}
                titleStyle={{fontWeight: "bold"}}
                type={"clear"}
                color={"#0084FF"}
                containerStyle={styles.headerRightButtonContainer}
                buttonStyle={styles.headerRightButton}
                onPress={this.toNextPage}
            />
        );
        let headerTitle = this.renderHeaderTitle();
        return (
            <HeaderBar
                leftButton={leftIcon}
                titleView={headerTitle}
                rightButton={rightButton}
                style={styles.headerContainer}
            />
            );
    };

    renderHeaderTitle = () => {
        let leftView =(
            <View style={styles.headerTitleView}>
                <Text
                    style={styles.headerTitleText}
                    onPress={() => {this.showOriginDestModal(1)}}
                >{this.state.origin.title}</Text>
            </View>
        );
        let rightView =(
            <View style={styles.headerTitleView}>
                <Text
                    style={styles.headerTitleText}
                    onPress={() => {this.showOriginDestModal(2)}}
                >{this.state.dest.title}</Text>
            </View>
        );
        let middleIcon =
            <CarIcon
                size={32}
                color={"#0084ff"}
                style={styles.headerTitleIcon}
            />;
        return (
            <View style={styles.headerTitleContainer}>
                {leftView}
                {middleIcon}
                {rightView}
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
        let {coordinates} = this.state;
        return (
            <MapView
                style={styles.mapViewContainer}
                locationEnabled={true}
                showsCompass={true}
                showsLocationButton={true}
                showsScale={true}
                onPress={({nativeEvent}) => {console.log(nativeEvent)}}
            >
                <MapView.Polyline
                    gradient
                    width={5}
                    colors={['#f44336', '#2196f3', '#4caf50']}
                    onPress={this._onPress}
                    coordinates={coordinates}
                />
            </MapView>
        );
    };

    showOriginDestModal = (value) => {
        this.setState({isOriginDestModalVisible: value})
    };
    hideOriginDestModal = () => {
        this.setState({isOriginDestModalVisible: 0})
    };
    handleInputOrigin = origin => {
        this.setState({origin: origin});
        this.props.saveTaxiAct({origin: origin});
    };
    handleInputDest = dest => {
        this.setState({dest: dest});
        this.props.saveTaxiAct({dest: dest});
    };
    loadData = () => {
        let { publishAct } = this.props;
        let { origin, dest } = publishAct;
        if (origin === undefined || origin.title === undefined) {
            origin = {
                title: "我的位置",
            }
        }
        if (dest === undefined || dest.title === undefined) {
            dest = {
                title: "虹桥火车站",
            }
        }
        this.setState({
            origin: origin,
            dest: dest,
        })
    };
    toNextPage = () => {
        if (this.state.origin === "" ||
            this.state.dest === "") {
            alert("有空没有填哦～");
            return;
        }
        NavigationUtil.back(this.props);
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    }
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
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        width: "100%",
    },
    headerLeftIcon: {
        marginLeft: 16,
    },
    headerRightButtonContainer: {
        marginRight: 16,
    },
    headerRightButton: {
        padding: 0,
        margin: 0,
    },
    headerTitleContainer: {
        backgroundColor: "transparent",
        marginLeft: 10,
        marginRight: 20,
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    headerTitleView: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "#0084ff",
        borderBottomWidth: 1,
    },
    headerTitleText: {
        fontSize: 15,
        color: Theme.TEXT_BLACK,
        fontWeight: "800",
        alignSelf: "center",
    },
    headerTitleIcon: {
        marginLeft: 15,
        marginRight: 15,
    },


    mapViewContainer: {
        flex: 1,
    },
});
