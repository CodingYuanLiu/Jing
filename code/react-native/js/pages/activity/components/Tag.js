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
    color: "#fff",
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#6fb1ff",
        marginLeft: 2,
        borderWidth: 2,
        borderColor: "#62b2ff",
        borderRadius: 4,
    },
    text: {
        padding: 2,
        color: "#fff",
        fontSize: 12,
        maxWidth: 100,
    },
})
