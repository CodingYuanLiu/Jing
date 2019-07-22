import {Text, View, ViewPropTypes, StyleSheet } from "react-native";
import {Icon} from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import React from "react";
import { PropTypes } from "prop-types";


export default class CustomDatePicker extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let leftIcon =
            <Icon
                type={"font-awesome"}
                name={"calendar-check-o"}
                size={32}
                color={"#bbbbbb"}
            />;
        let displayTextComponent =
            <Text
                onPress={this.props.onShow}
                style={[styles.datePickerText, this.props.displayTextStyle]}
            >
                {this.props.displayText}
            </Text>;
        return (
            <View style={[styles.datePickerContainer, this.props.containerStyle]}>
                {leftIcon}
                {displayTextComponent}
                <DateTimePicker
                    isVisible={this.props.visible}
                    onConfirm={this.props.onConfirm}
                    onCancel={this.props.onCancel}
                    mode={"datetime"}
                    minimumDate={new Date()}
                    is24Hour={true}
                />
            </View>
        )
    }
}

CustomDatePicker.propTypes = {
    containerStyle: ViewPropTypes.style,
    visible: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    displayTextStyle: ViewPropTypes.style,
    displayText: PropTypes.string.isRequired,
};

CustomDatePicker.defaultProps = {
    visible: false,
};

const styles = StyleSheet.create({
    datePickerText: {
        color: "#bbbbbb",
        fontSize: 24,
        marginLeft: 12,
    },
    datePickerContainer: {
        flexDirection: "row",
        paddingLeft: "6%",
        marginTop: 48,
        paddingRight: "6%",
    },
});

