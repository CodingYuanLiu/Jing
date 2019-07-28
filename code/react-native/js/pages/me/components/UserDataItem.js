import React from "react";
import {PropTypes} from 'prop-types';
import {Text, View, ViewPropTypes, StyleSheet, TouchableWithoutFeedback} from 'react-native';

export default class UserDataItem extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        const {data, label, onPress} = this.props;
        return (
            <TouchableWithoutFeedback
            onPress={onPress}
            >
                <View style={[styles.container, this.props.style]}>
                    <View style={[styles.dataContainer, this.props.dataContainer]}>
                        <Text style={styles.data}>{data}</Text>
                    </View>
                    <View style={[styles.labelContainer, this.props.labelContainer]}>
                        <Text style={styles.label}>{label}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

UserDataItem.propTypes = {
    data: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    style: ViewPropTypes.style,
    labelContainer: ViewPropTypes.style,
    dataContainer: ViewPropTypes.style,
};


const styles = StyleSheet.create({
    container: {
        height: 50,
        minWidth: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    dataContainer: {
        flex: 1,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    data: {
        fontWeight: "bold",
        fontSize: 24,
    },
    labelContainer: {
        fontSize: 16,
        flex: 1,
        alignSelf: "center",
    },
    label: {
        fontSize: 12,
    },
});
