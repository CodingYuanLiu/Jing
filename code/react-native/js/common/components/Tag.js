import React from "react"
import { View, Text, ViewPropTypes, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { PropTypes } from "prop-types";



export default class Tag extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            title, color, backgroundColor,
            activeBackgroundColor, activeColor, active,
            onPress, titleSize
        }= this.props;
        return (
            <TouchableNativeFeedback
                onPress={onPress}
            >
                <View style={[styles.container, this.props.style,
                    active ? {backgroundColor: activeBackgroundColor}
                    : {backgroundColor: backgroundColor}]}>
                    <Text
                        style={[styles.text, {color: color}, active ?
                            {color: activeColor} : null,
                            titleSize ? {fontSize: titleSize}:null
                        ]}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                    >{title}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

Tag.propTypes = {
    title: PropTypes.string.isRequired,
    titleSize: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    style: ViewPropTypes.style,
    active: PropTypes.bool,
    activeColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    onPress: PropTypes.func,
};

Tag.defaultProps = {
    title: "标签",
    titleSize: 12,
    color: "#a4a4a4",
    backgroundColor: "#efefef",
    active: false,
    activeColor: "#35aaff",
    activeBackgroundColor: "#b1deff",
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#efefef",
        marginLeft: 6,
        borderRadius: 4,
        maxWidth: 100,
        minWidth: 20,
        marginTop: 6,
    },
    text: {
        color: "#a4a4a4",
        fontSize: 12,
        maxWidth: "100%",
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 8,
        paddingRight: 8,
    },
});
