import React from "react"
import { View, Text, StatusBar, StyleSheet, Dimensions } from 'react-native';
import PublishHeader from "../components/PublishHeader";
import NavigationUtil from "../../../navigator/NavUtil";

const {height, width} = Dimensions.get('window');

export default class PublishTaxiSpec extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

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

        return (
            <View style={styles.locationInputContainer}>

            </View>
        );
    };

    renderDepartDatePicker = () => {
        return ;
    };

    renderInputPromt = () => {

    };

    renderMapView = () => {
        return null;
    };

    render() {
        let header = this.renderHeader();
        let mapView = this.renderMapView();
        return(
            <View style={styles.container}>
                {header}
                {mapView}
            </View>
        )
    };

    toNextPage = () => {
        NavigationUtil.toPage(null, "PublishDetail")
    }
}

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
    },
});
