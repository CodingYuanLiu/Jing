import React from "react";
import {View, ViewPropTypes, StyleSheet} from "react-native";
import {PropTypes} from "prop-types";

export default class ActStatus extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>

            </View>
        )
    }
}
ActStatus.propTypes = {
    showIcon: PropTypes.bool,
    showStatistics: PropTypes.bool,
    containerStyle: ViewPropTypes.style,
    item: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {

    },

});
