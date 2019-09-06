import React from "react"
import { View, Text, StatusBar, StyleSheet, TouchableNativeFeedback, Animated } from 'react-native';
import {connect} from "react-redux";


class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    };
    componentDidMount(){

    }
    render() {
        let header = this.renderHeader();
        return (
            <View>
                {header}
            </View>
        );
    }
    renderHeader = () => {
        return null;
    };
}
const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
export default connect(mapStateToProps, null)(DiscoverScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sendButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
    },
});
