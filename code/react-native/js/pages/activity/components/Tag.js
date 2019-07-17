import React from "react"
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";



class Tag extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const title = this.props.title ? this.props.title : "标签";
        const color = this.props.color ? this.props.color : "#0084ff";
        return (
            <View style={[styles.container, this.props.style]}>
                <Text style={[styles.text, {color: color}]}></Text>
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
    color: "#0084ff",
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        padding: 4,
        color: "#0084ff",
    },
})
