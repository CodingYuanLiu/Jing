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
        labelContainer: ViewPropTypes.style,
        dataContainer: ViewPropTypes.style,
    }
    render() {
        const data = this.props.data ? this.props.data : 0
        const label = this.props.label ? this.props.label : "错误"
        return (
            <View style={[styles.dataSegment, this.props.style]}>
                <View style={[styles.dataContainer, this.props.dataContainer]}>
                    <Text style={styles.data}>{data}</Text>
                </View>
                <View style={[styles.labelContainer, this.props.labelContainer]}>
                    <Text style={styles.label}>{label}</Text>
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
    dataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    data: {
        fontWeight: "600",
        fontSize: 24,
    },
    labelContainer: {
        fontSize: 16,
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: 12,
    },
})
