import React from "react";
import {PropTypes} from 'prop-types';
import {Text, View, ViewPropTypes, StyleSheet} from 'react-native';

export default class DataSegment extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    static propTypes= {
        data: PropTypes.number,
        label: PropTypes.string,
        style: ViewPropTypes.style,
        labelStyle: ViewPropTypes.style,
        dataStyle: ViewPropTypes.style,
    }
    render() {
        const data = this.props.data ? this.props.data : 0
        const label = this.props.label ? this.props.label : "错误"
        return (
            <View style={[styles.dataSegment, this.props.style]}>
                <Text style={[styles.dataStyle, this.props.dataStyle]}>{data}</Text>
                <View style={[styles.labelStyle, this.props.labelStyle]}>
                    <Text>{label}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dataSegment: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    dataStyle: {
        fontWeight: "600",
        fontSize: 24,
        flex: 1,
        backgroundColor: "purple",
    },
    labelStyle: {
        fontSize: 16,
        flex: 1,
        backgroundColor: "white",
        alignSelf: "center",
        justifyContent: "center",
    },
})
