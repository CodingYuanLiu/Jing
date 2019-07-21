import React from "react"
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";



export default class Tag extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const title = this.props.title;
        const color = this.props.color;
        return (
            <View style={[styles.container, this.props.style]}>
                <Text
                    style={[styles.text, {color: color}]}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                >{title}</Text>
            </View>
        )
    }
}

Tag.propTypes = {
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: ViewPropTypes.style,
}

Tag.defaultProps = {
    title: "标签",
    color: "#a4a4a4",
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#efefef",
        marginLeft: 2,
        borderWidth: 2,
        borderColor: "#eeeeee",
        borderRadius: 4,
        maxWidth: 100,
    },
    text: {
        padding: 2,
        color: "#a4a4a4",
        fontSize: 12,
        maxWidth: "100%",
    },
})
