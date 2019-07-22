import React from "react"
import { View, Text, StatusBar, StyleSheet, Dimensions } from 'react-native';
import PublishHeader from "../components/PublishHeader";
import NavigationUtil from "../../../navigator/NavUtil";
import CustomDatePicker from "../components/CustomDatePicker";
import Util from "../../../common/util";
import {setPublishActSpec} from "../../../actions/activity";
import {connect} from "react-redux";
import {Icon} from "react-native-elements";

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
            <Input/>;
        let rightInput =
            <Input/>;
        let middleIcon =
            <Icon/>;
        return (
            <View style={styles.locationInputContainer}>
                {leftInput}
                {middleIcon}
                {rightInput}
            </View>
        );
    };

    renderDepartDatePicker = () => {
        let datePickerDisplayText = "请选择出发时间";
        if (this.state.pickedDateTime || this.state.departTime !== ""){
            datePickerDisplayText = this.state.departTime;
        }

        return (
            <CustomDatePicker
                containerStyle={styles.datePickerContainer}
                onCancel={this.hideDateTimePicker}
                onShow={this.showDateTimePicker}
                onConfirm={this.handleDatePicked}
                displayText={datePickerDisplayText}
                visible={this.state.isDateTimePickerVisible}
            />);
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
        let datePicker = this.renderDepartDatePicker();
        return(
            <View style={styles.container}>
                {header}
                {mapView}
                {locationInput}
                {datePicker}
            </View>
        )
    };

    handleDatePicked = date => {
        this.setState({pickedDateTime: date});
        this.setState({
            departTime: Util.dateTimeToString(this.state.pickedDateTime)
        });
        this.hideDateTimePicker();
    };
    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };
    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true});
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
    },
});
