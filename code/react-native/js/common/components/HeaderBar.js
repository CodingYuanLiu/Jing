import { PropTypes } from "prop-types";
import React from "react";
import { ViewPropTypes, View, Text, StatusBar, StyleSheet, Platform, } from "react-native";


const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;


export default class NavigationBar extends React.Component{

    getButtonElement(btn, style) {
        return (<View style={[styles.navBarBtn, style]}>
            {btn ? btn : null}
        </View>)
    }

    render() {
        let titleView = this.props.titleView ?
            this.props.titleView :
            <Text
                ellipsizeMode={"tail"}
                numberOfLines={1}
                style={[styles.title, this.props.titleStyle]}
            >{this.props.title}</Text> ;
        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton, this.props.leftBtnStyle)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton, this.props.rightBtnStyle)}
            </View>;

        return (
            <View style={[styles.container, this.props.style]}>
                {content}
            </View>
        )
    }
}


// properties for component
NavigationBar.propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
    leftBtnStyle: ViewPropTypes.style,
    rightBtnStyle: ViewPropTypes.style,
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0084ff",
    },
    navBarBtn: {
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        marginRight: 15,
        backgroundColor: "red",
    },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: Platform.OS === "ios" ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 20,
        color: "#fff",
    },
});

