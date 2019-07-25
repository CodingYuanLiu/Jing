import React from "react"
import { View, Text, StatusBar, TextInput, StyleSheet, Dimensions } from 'react-native';
import PublishHeader from "../components/PublishHeader";
import {setPublishActSpec, setPublishTaxiDest, setPublishTaxiOrigin} from "../../../actions/activity";
import {connect} from "react-redux";
import {Icon, Input} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";



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
        if (this.props.dest && this.props.dest !== "") {
            this.setState({
                dest: this.props.dest,
            })
        }
        if (this.props.origin && this.props.origin !== "") {
            this.setState({
                origin: this.props.origin,
            })
        }
    }

    renderHeader = () => {
        return (
            <PublishHeader
                style={styles.headerContainer}
                onClose={() => {NavigationUtil.back(this.props)}}
                onNext={this.toNextPage}
                buttonTitle={"确定"}
            />
            );
    };

    renderLocationInput = () => {
        let leftInput =
            <Input
                containerStyle={styles.locationInputContainer}
                inputStyle={styles.locationInput}
                value={this.state.origin}
                onChangeText={this.handleInputOrigin}
                autoFocus={true}
            />;
        let rightInput =
            <Input
                containerStyle={styles.locationInputContainer}
                inputStyle={styles.locationInput}
                value={this.state.dest}
                onChangeText={this.handleInputDest}
            />;
        let middleIcon =
            <Icon
                type={"material-community"}
                name={"car-side"}
                size={32}
                color={"#0084ff"}
            />;
        return (
            <View style={styles.headerInputContainer}>
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

    handleInputOrigin = value => {
        this.setState({origin: value});
        this.props.setPublishTaxiOrigin(value);
    };

    handleInputDest = dest => {
        this.setState({dest: dest});
        this.props.setPublishTaxiDest(dest);
    };
    toNextPage = () => {
        if (this.state.origin === "" ||
            this.state.dest === "") {
            alert("有空没有填哦～");
            return;
        }
        NavigationUtil.back(this.props);
    };
}

const mapStateToProps = state => ({
    origin: state.publishAct.origin,
    dest: state.publishAct.dest,
});
const mapDispatchToProps = dispatch => ({
    setPublishTaxiOrigin: origin => dispatch(setPublishTaxiOrigin(origin)),
    setPublishTaxiDest: dest => dispatch(setPublishTaxiDest(dest)),
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
    headerInputContainer: {
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
    locationInputContainer: {
        flex: 1,
        borderWidth: 0,
    },
    locationInput: {
        fontSize: 16,
        color: "#5e5e5e",
        backgroundColor: "yellow",
        paddingLeft: 12,
        paddingBottom: 8,
    }
});
