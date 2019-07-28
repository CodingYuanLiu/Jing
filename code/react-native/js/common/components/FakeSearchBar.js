import { PropTypes } from "prop-types";
import React from "react";
import { ViewPropTypes, View, Text, TouchableNativeFeedback, StyleSheet, Platform } from "react-native";
import Theme from "../constant/Theme";
import Default from "../constant/Constant";

export default class NavigationBar extends React.Component{
    constructor(props) {
        super(props)
    }

    _onPress = () => {
        if (this.props.press) {
            this.props.press()
        }
    };


    render() {
        let leftIcon = this.props.leftIcon ?
            this.props.leftIcon : null;
        let titleView = this.props.titleView ?
            this.props.titleView :
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>
        return (
                <TouchableNativeFeedback onPress={this._onPress}>
                    <View style={[styles.container, this.props.style]}>
                        <View style={[this.props.iconContainerStyle, styles.iconContainerStyle]}>
                            {leftIcon}
                        </View>
                        <View style={[this.props.titleContainerStyle, styles.titleContainerStyle]}>
                            {titleView}
                        </View>
                    </View>
                </TouchableNativeFeedback>
        )
    }
}


// properties for component
NavigationBar.propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    leftIcon: PropTypes.element,
    iconContainerStyle: ViewPropTypes.style,
    titleContainerStyle: ViewPropTypes.style,
    press: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: Theme.DEEP_BLUE,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        height: Default.SEARCHBAR_HEIGHT,
    },
    iconContainerStyle: {
        alignItems: "center",
        marginLeft: 16,
    },
    titleContainerStyle: {
        flex: 1,
        marginLeft: 24,
    },
    title: {
        fontSize: 16,
        color: "#7ecaff",
    }
});
