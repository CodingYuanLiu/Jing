import React from "react"
import { View, Text, StatusBar, TextInput, StyleSheet, Dimensions } from 'react-native';
import PublishHeader from "../components/PublishHeader";
import {setPublishActSpec} from "../../../actions/activity";
import {connect} from "react-redux";
import {Icon, Input} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";

const {height, width} = Dimensions.get('window');

class PublishTaxiSpec extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            departTime: "",
            origin: "",
            dest: "",
            isDateTimePickerVisible: false,

        }
    }

    componentDidMount() {
        if (this.props.spec && this.props.spec.departTime &&
            this.props.spec.departTime !== "") {
            this.setState({
                departTime: this.props.spec.departTime,
                origin: this.props.spec.origin,
                dest: this.props.spec.dest,
            })
        }
    }

    renderHeader = () => {
        return (
            <PublishHeader
                style={styles.headerContainer}
                onClose={() => {NavigationUtil.back(this.props)}}
                onNext={this.toNextPage}
            />
            );
    };

    renderLocationInput = () => {
        let leftInput =
            <TextInput
                style={styles.locationInput}
            />;
        let rightInput =
            <TextInput
                style={styles.locationInput}
            />;
        let middleIcon =
            <Icon
                type={"material-community"}
                name={"car-side"}
                size={20}
                color={"#bfbfbf"}
            />;
        return (
            <View style={styles.locationInputContainer}>
                {leftInput}
                {middleIcon}
                {rightInput}
            </View>
        );
    };

    renderInputPromt = () => {

    };

    renderMapView = () => {
        return null;
    };

    render() {
        let header = this.renderHeader();
        let mapView = this.renderMapView();
        let locationInput = this.renderLocationInput();
        return(
            <View style={styles.container}>
                {header}
                {mapView}
                {locationInput}
            </View>
        )
    };

    toNextPage = () => {
        this.props.setPublishActSpec();
        NavigationUtil.toPage({actType: "taxi"}, "PublishDetail")
    };
}

const mapStateToProps = state => ({
    spec: state.activity.publishAct.spec,
});
const mapDispatchToProps = dispatch => ({
    setPublishActSpec: spec => dispatch(setPublishActSpec(spec))
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishTaxiSpec);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        backgroundColor: "rgba(255,255,255,0)",
        marginTop: 0,
    },
    locationInputContainer: {
        backgroundColor: "#fff",
        height: 48,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    datePickerContainer: {
        borderRadius: 4,
        backgroundColor: "#eee",
        marginTop: 0,
    },
    locationInput: {
        flex: 1,
        fontSize: 16,
        color: "#5e5e5e",
        backgroundColor: "yellow",
    },
});
