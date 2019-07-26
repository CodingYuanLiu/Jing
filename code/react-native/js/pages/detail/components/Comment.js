import React from "react";
import {View, Text} from "react-native";
import {CaretRightIcon} from "../../../common/components/Icons";
import {Avatar} from "react-native-elements";

export default class Comment extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render() {

        let leftAvatar = this.renderAvatar();
        let footer = this.renderFooter();
        let title = this.renderTitle();
        let body = this.renderBody();

        return (
            <View style={styles.container}>
                {leftAvatar}
                <View style={styles.mainContainer}>
                    {title}
                    {body}
                    {footer}
                </View>
            </View>
        )
    }
    renderTitle = (from, to) => {
        let caretIcon =
            <CaretRightIcon
                color={"#838383"}
                size={14}
            />;
        let fromTitle=<Text style={styles.title}>{from}</Text>
        let toTitle = <Text style={styles.title}>{to}</Text>
        return (
            <View>
                {fromTitle}
                {to !== -1 ? caretIcon : null}
                {to !== -1 ? toTitle : null}
            </View>
        )
    };
    renderBody = (comment) => {
        return (
            <Text style={styles.bodyText}>{comment}</Text>
        )
    };
    renderAvatar = (user) => {
        return (
            <View>
                <Avatar
                    source={{uri: user.avatar}}
                />
            </View>
        )
    };
    renderFooter = (timestamp) => {
        return (
            <Text style={styles.footerText}>{`发布于${timestamp}`}</Text>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 8,
        paddingBottom: 8,
    },
    mainContainer: {
        flex: 1,
    },
    title: {
        fontWeight: "800",
        fontSize: 14,
        color: "#3a3a3a",
    },
    bodyText: {
        fontSize: 14,
        color: "#4a4a4a",
        fontWeight: "500",
    },
    footerText: {

    },
});
