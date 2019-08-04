import React from "react";
import {View, StyleSheet, Text, TouchableWithoutFeedback} from "react-native";
import {Button} from "react-native-elements";
import Theme from "../../../common/constant/Theme";
import {DotIcon, FoodIcon, MultiUserIcon, ShoppingBagIcon, TaxiIcon} from "../../../common/components/Icons";
import {PropTypes} from "prop-types";
import NavigationUtil from "../../../navigator/NavUtil";


export default class ManageItem extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let {type, title, description, createTime, status} = this.props;
        let leftIcon = this.renderLeftIcon(type);
        let titleComponent = this.renderTitle(title);
        let descriptionComponent = this.renderDesc(description);
        let footerComponent = this.renderFooter(createTime, status);
        return (
            <TouchableWithoutFeedback
                onPress={this.toActDetail}
            >
                <View style={styles.container}>
                    {leftIcon}
                    <View style={styles.rightContainer}>
                        {titleComponent}
                        {descriptionComponent}
                        {footerComponent}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    };
    renderLeftIcon = (type) => {
        let leftIcon;
        switch(type) {
            case "taxi":
                leftIcon = (
                    <TaxiIcon
                        reverse
                        color={"#0072ff"}
                        size={18}
                        style={styles.leftContainer}
                    />
                );
                break;
            case "order":
                leftIcon = (
                    <ShoppingBagIcon
                        reverse
                        color={"#107aff"}
                        size={18}
                        style={styles.leftContainer}
                    />
                );
                break;
            case "takeout" :
                leftIcon = (
                    <FoodIcon
                        reverse
                        color={"#2378ff"}
                        size={18}
                        style={styles.leftContainer}
                    />
                );
                break;
            case "other":
                leftIcon = (
                    <MultiUserIcon
                        reverse
                        color={"#3f79ff"}
                        size={18}
                        style={styles.leftContainer}
                    />
                );
                break;
            default:
                leftIcon = null;
            // this should not happen
        }
        return leftIcon;
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
                    ellipsizeMode={"tail"}
                    numberOfLines={1}
                >{description}</Text>
            </View>
        )
    };

    renderFooter = (createTime, status) => {
        let createTimeText = (
            <Text
                style={[styles.lightText, styles.footerCreateTime]}
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
        let title, titleColor;
        let iconColor;
        switch (status) {
            case 0:
                title = "等待中";
                titleColor={color: Theme.SUCCESS};
                iconColor = Theme.SUCCESS;
                break;
            case 1:
                title = "人数满";
                titleColor={color: Theme.PRIMARY_BLUE};
                iconColor = Theme.PRIMARY_BLUE;
                break;
            case 2:
                title = "已过期";
                titleColor={color: Theme.WARNING};
                iconColor = Theme.WARNING;
                break;
            case -1:
                title = "已被封禁";
                titleColor={color: Theme.ERROR};
                iconColor = Theme.ERROR;
                break;
            default:
                console.log("invalid")
        }
        let icon = (
            <DotIcon
                  color={iconColor}
                  size={20}
            />
        );
        return (
            <Button
                type={"clear"}
                title={title}
                titleStyle={[styles.statusButtonTitle, titleColor]}
                icon={icon}
                TouchableComponent={TouchableWithoutFeedback}
                onPress={() => {alert("reason")}}
                buttonStyle={styles.statusButton}
            />
        );
    };

    toActDetail = () => {
        let {id} = this.props;
        NavigationUtil.toPage({id: id}, "ActDetail");
    }
}

ManageItem.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    createTime: PropTypes.string,
    status: PropTypes.number,
};


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        marginBottom: 2,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    leftContainer: {
        marginRight: 5,
        width: 60,
    },
    rightContainer: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderColor: "#efefef",
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#3a3a3a",
    },
    lightText: {
        color: "#afafaf",
        fontSize: 16,
    },
    descContainer: {
        paddingTop: 4,
        paddingBottom: 16,
        paddingRight: 20,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    footerCreateTime: {
        fontSize: 14,
    },
    statusButtonContainer: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    statusButton: {
        padding: 0,
        minWidth: 80,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    statusButtonTitle: {
        fontSize: 12,
    },
});
