import React from "react";
import {View, StyleSheet, Text, TouchableWithoutFeedback} from "react-native";
import {Button} from "react-native-elements";
import Theme from "../../../common/constant/Theme";
import {DotIcon} from "../../../common/components/Icons";

class PublishItem extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let {title, description, createTime, status} = this.props;
        let titleComponent = this.renderTitle(title);
        let descriptionComponent = this.renderDesc(description);
        let footerComponent = this.renderFooter(createTime, status);
        return (
            <View style={styles.container}>
                {titleComponent}
                {descriptionComponent}
                {footerComponent}
            </View>
        )
    };
    renderTitle = (title) => {
        return (
            <Text
            style={styles.boldText}
            >{title}</Text>
        )
    };

    renderDesc = (description) =>{
        return (
            <View style={styles.descContainer}>
                <Text
                    style={styles.description}
                >{description}</Text>
            </View>
        )
    };

    renderFooter = (createTime, status) => {
        let createTimeText = (
            <Text
                style={styles.lightText}
            >{createTime}</Text>
        );
        let rightStatus = this.renderStatus(status);
        return (
            <View style={styles.footerContainer}>
                {createTimeText}
                {rightStatus}
            </View>
        )
    };

    renderStatus = (status) => {
        let title, style;
        let iconColor;
        switch (status) {
            case 0:
                title = "等待中";
                iconColor = Theme.SUCCESS;
                break;
            case 1:
                title = "人数满";
                iconColor = Theme.PRIMARY_BLUE;
                break;
            case 2:
                title = "已过期";
                iconColor = Theme.WARNING;
                break;
            case -1:
                title = "已被封禁";
                iconColor = Theme.ERROR;
                break;
            default:
                console.log("invalid")
        }
        let icon = (
            <DotIcon
                  color={iconColor}
                  size={16}
            />
        );
        return (
            <Button
                type={"clear"}
                title={title}
                icon={icon}
                titleStyle={style}
                TouchableComponent={TouchableWithoutFeedback}
            />
        );
    };
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 2,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#3a3a3a",
    },
    lightText: {
        color: "#afafaf",
        fontSize: 16,
        marginLeft: 10,
    },
    descContainer: {

    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "flex-between",
    },
});
