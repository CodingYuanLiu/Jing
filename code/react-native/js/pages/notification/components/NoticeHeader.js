import React from "react"
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";
import { Button, Icon } from 'react-native-elements';


export default class NoticeHeader extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {


        // If provide button, then function  has to be bind with that button,
        // else, use default button, and must provide a callback function
        const checkIcon =
            <Icon
                type={"material-community"}
                name={"playlist-check"}
                color={"#b3b3b3"}
            />
        const rightBtn =
            <Button
                iconRight
                icon={checkIcon}
                type={"clear"}
                title={"全部已读"}
                titleStyle={{color:"#b3b3b3"}}
                onPress={() => {this.props.onPress()}}
            />
        const rightButton = this.props.rightButton ? this.props.rightButton : rightBtn


        return(
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={styles.left}>
                    <Text style={styles.text}>{this.props.title}</Text>
                </View>
                <View style={styles.middle}></View>
                <View style={[styles.right, this.props.buttonContainerStyle ]}>
                    {rightButton}
                </View>
            </View>
        )
    }
}

NoticeHeader.propTypes={
    containerStyle: ViewPropTypes.style,
    title: PropTypes.string,
    rightButton: PropTypes.element,
    buttonContainerStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
}

NoticeHeader.defaultProps={
    title: "系统通知",
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    left: {
        marginLeft: 10,
    },
    middle: {
        flex: 1,
    },
    text:{
        fontSize: 16,
        color: "#b3b3b3",
    },
    right: {
        marginRight: 10,
    },
})

