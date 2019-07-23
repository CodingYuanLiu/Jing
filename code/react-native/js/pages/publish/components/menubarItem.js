import React from "react";
import { ViewPropTypes } from "react-native";
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


    render() {
        let leftIcon =
            <Icon
                type={"material"}
                name={"location-on"}
                size={24}
                color={"#bfbfbf"}
            />;
        return (
            <ListItem
            chevron
            rightTitle={"公开"}
            title={"谁可以看"}
            leftIcon={leftIcon}
            />
        )
    }
}

PublishHeader.propTypes = {
    style: ViewPropTypes.style,
    leftIcon: PropTypes.element,
    title: PropTypes.string,
    rightTitle: PropTypes.string,
    color: PropTypes.string,
    activeColor: PropTypes.string,
    active: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
};

PublishHeader.defaultProps = {
    buttonTitle: "",
    color: "#3a3a3a",
    activeColor: "#0084ff",
    active: false,
};
