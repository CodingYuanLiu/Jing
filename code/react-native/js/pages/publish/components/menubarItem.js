import React from "react";
import { ViewPropTypes, StyleSheet } from "react-native";
import { PropTypes } from "prop-types";
import {Button, Icon, ListItem} from "react-native-elements";


export default class MenubarItem extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    renderRightIcon = () => {
        return (
            <Button
            title={this.props.rightTitle}

            />
        )
    };

    renderLeftIcon = (name, color) => {
        switch (name) {
            // gps location icon
            case "location" : {
                return (
                    <Icon
                        type={"material"}
                        name={"location-on"}
                        size={24}
                        color={color}
                    />
                )
            }
            case "endTime":{
                return  (
                    <Icon
                        type={"material"}
                        name={"timer"}
                        size={24}
                        color={color}
                    />
                )
            }
            // taxi icon
            case "depart": {
                return (
                    <Icon
                        type={"material-community"}
                        name={"taxi"}
                        size={24}
                        color={color}
                    />
                )
            }
            case "originDest": {
                return (
                    <Icon
                        type={"font-awesome"}
                        name={"location-arrow"}
                        size={24}
                        color={color}
                    />
                )
            }
            // activity time icon
            case "activity": {
                return (
                    <Icon
                        type={"feather"}
                        name={"activity"}
                        size={24}
                        color={color}
                    />
                )
            }
            // takeout store / online shopping store
            case "store": {
                return (
                    <Icon
                        type={"material"}
                        name={"store"}
                        size={24}
                        color={color}
                    />

                )
            }
            // takeout time
            case "takeoutTime": {
                return (
                    <Icon
                        type={"material"}
                        name={"free-breakfast"}
                        size={24}
                        color={color}
                    />
                )
            }
        }
    };

    render() {
        let leftIcon = this.renderLeftIcon(this.props.iconName, this.props.active ?
            this.props.activeColor : "#bfbfbf");
        return (
            <ListItem
                leftIcon={leftIcon}
                title={this.props.title}
                titleStyle={[styles.title, this.props.active ? {color: this.props.activeColor} : null]}
                titleProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
                chevron
                rightTitle={this.props.rightTitle}
                rightStyle={[styles.rightTitle, this.props.active ? {color: this.props.activeColor} : null]}
                rightTitleProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
                containerStyle={[
                    styles.menuContainer,
                    this.props.style,
                ]}
                rightContentContainerStyle={styles.rightContainer}
                onPress={this.props.onPress}
            />
        )
    }
}

MenubarItem.propTypes = {
    style: ViewPropTypes.style,
    iconName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rightTitle: PropTypes.string,
    activeColor: PropTypes.string,
    active: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
};

MenubarItem.defaultProps = {
    rightTitle: "",
    activeColor: "#0084ff",
    active: false,
};

const styles = StyleSheet.create({
    title: {
        color: "#bfbfbf",
    },
    menuContainer: {
        borderTopColor: "#eee",
        borderTopWidth: 0.5,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: "3%",
        paddingRight: "3%",
    },
    rightTitle: {
        color: "#eee",
    },
    rightContainer: {
        flex: 3,
    }
});
