import React from "react";
import {Text, View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import Util from "../../common/util";
import {PropTypes} from "prop-types";


export default class SearchItem extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let itemComponent = this.renderItem(this.props.item);
        return itemComponent;
    };
    renderItem = (item) => {
        let title = (
            <View style={styles.titleContainer}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                >{item.title}</Text>
            </View>
        );
        let subtitle = (
            <View style={styles.subtitleContainer}>
                <Text
                    style={styles.subtitle}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                >{item.description}</Text>
            </View>
        );
        let status = (
            <View style={styles.rightContainer}>
                <Text
                >{Util.actStatusToText(item.status)}</Text>
            </View>
        );
        return (
            <TouchableWithoutFeedback
                onPress={() => {this.props.onPress(item)}}
            >
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        {title}
                        {subtitle}
                    </View>
                    {status}
                </View>
            </TouchableWithoutFeedback>
        )
    };
}

SearchItem.propTypes = {
    onPress: PropTypes.func,
    item: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        marginRight: 16,
        paddingBottom: 7,
        marginBottom: 7,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
        flexDirection: "row",
    },
    leftContainer: {
        flex: 1,
    },
    titleContainer: {
        marginTop: 4,
    },
    title: {
        fontSize: 16,
        color: "#3a3a3a",
        fontWeight: "bold",
    },
    subtitleContainer: {
        marginTop: 6,
    },
    subtitle: {
        fontSize: 14,
        color: "#8a8a8a",
    },

    rightContainer: {
        width: 60,
        justifyContent: "center",
        alignItems: "center",
    },
});
