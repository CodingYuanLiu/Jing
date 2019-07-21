import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from "react-native-elements";
import { PropTypes } from "prop-types";
export default class NoXXX extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let icon = this.props.icon;
        let labelText = this.props.labelText;
        let textSize = this.props.textSize;
        return(

            <View style={styles.container}>
                {icon}
                <Text style={[styles.labelText, {fontSize: textSize}]}>
                    {labelText}
                </Text>
            </View>
        )
    }
}
NoXXX.propTypes = {
    labelText: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    textSize: PropTypes.number,
};

NoXXX.defaultProps = {
    textSize: 32
};

const styles=StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    labelText: {
        color: "#efefef",
        marginTop: 10,
        fontSize: 32,
    },
})
