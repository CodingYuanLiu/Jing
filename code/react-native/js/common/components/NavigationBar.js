import { PropTypes } from "prop-types";
import React from "react";
import { ViewPropTypes, View, Text, StatusBar, StyleSheet, Platform } from "react-native";


// parameters for platform specified

const NAV_BAR_HEIGHT_IOS = 44;
// NAV_BAR_HEIGHT_ANDROID　usually is 50
const NAV_BAR_HEIGHT_ANDROID = 50;
// STATUS_BAR_HEIGHT usually is 20, in covers top of the screen, including time,
// battery, network information etc...
const STATUS_BAR_HEIGHT = 20;

const StatusBarShape = {
    barStyle: PropTypes.oneOf(["light-content", "default"]),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string,
}


export default class NavigationBar extends React.Component{

    getButtonElement(btn, style) {
        return (<View style={[styles.navBarBtn, style]}>
            {btn ? btn : null}
        </View>)
    }

    render() {
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar}/>
            </View> : null;
        let titleView = this.props.titleView ?
            this.props.titleView :
            <Text
                ellipsizeMode={"head"}
                numberOfLines={1} style={styles.title}
            >{this.props.title}</Text> ;
        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton, this.props.leftBtnStyle)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton, this.props.rightBtnStyle)}
            </View>

        return (
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        )
    }
}


// properties for component
NavigationBar.propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
    leftBtnStyle: ViewPropTypes.style,
    rightBtnStyle: ViewPropTypes.style,
}



// default properties for component
NavigationBar.defaultProps = {
    statusBar: {
        barStyle: "light-content",
        hidden: false,
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0084ff",
    },
    navBarBtn: {
        alignItems: "center"
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
    statusBar: {
        height: Platform.OS === "ios" ? STATUS_BAR_HEIGHT : 0,
    }
})

