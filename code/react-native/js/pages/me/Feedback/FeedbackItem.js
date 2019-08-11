import React from "react";
import {View, Text, TextInput, StyleSheet, ViewPropTypes} from "react-native";
import {Rating} from "react-native-elements";
import {PropTypes} from "prop-types";

export default class FeedbackItem extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let {label, onRating, onChangeText, text} = this.props;
        let labelComponent = this.renderLabel(label);
        let ratingComponent = this.renderRating(onRating);
        let descriptionComponent = this.renderDescription(text, onChangeText);
        return (
            <View
                style={styles.container}
            >
                <View style={styles.topContainer}>
                    {labelComponent}
                    {ratingComponent}
                </View>
                {descriptionComponent}
            </View>
        )
    };

    renderLabel = (title) => {
        return (
            <Text style={styles.labelTitle}>{title}</Text>
        )
    };
    renderRating = ( onRating ) => {
        return (
            <Rating
                style={{backgroundColor: "red"}}
                onFinishRating={onRating}
            />
        )
    };
    renderDescription = (text, onChangeText) => {
        return (
            <View style={styles.descriptionContainer}>
                <TextInput
                    placeholder={"添加详细描述"}
                    style={styles.description}
                    value={text}
                    onChangeText={onChangeText}
                />
            </View>
        )

    };
}

FeedbackItem.propTypes = {
    label: PropTypes.string,
    onRating: PropTypes.func,
    text: PropTypes.string,
    onChangeText: PropTypes.func,
    style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 8,
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    labelTitle: {
        fontSize: 12,
        color: "#3a3a3a",
    },
    descriptionContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        color: "#5a5a5a",
    },
});
