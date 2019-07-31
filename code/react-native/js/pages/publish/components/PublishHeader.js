import React from "react";
import { ViewPropTypes, StyleSheet } from "react-native";
import {CloseIcon} from "../../../common/components/Icons";
import Theme from "../../../common/constant/Theme";
import {Button} from "react-native-elements";
import HeaderBar from "../../../common/components/HeaderBar";
import { PropTypes } from "prop-types";

export default class PublishHeader extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let closeIcon =
            <CloseIcon
                color={Theme.BUTTON_GREY}
                size={24}
                onPress={this.props.onClose}
            />;
        let rightBtn =
            <Button
                title={this.props.buttonTitle}
                type={this.props.buttonType}
                color={Theme.TEXT_BUTTON_ENABLED}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.button}
                disable={this.props.disabled}
                onPress={this.props.onNext ? this.props.onNext : this.props.onPublish}
            />;
        let style= this.props.style;
        return (
            <HeaderBar
                style={[{backgroundColor: "#fff", marginTop: 20}, style]}
                leftButton={closeIcon}
                rightButton={rightBtn}
                rightBtnStyle={{marginRight: 12}}
                leftBtnStyle={{marginLeft: 16}}
                titleView={this.props.titleView}
                titleLayoutStyle={this.props.titleLayoutStyle}
            />
        )
    }
}

PublishHeader.propTypes = {
    style: ViewPropTypes.style,
    onClose: PropTypes.func,
    onNext: PropTypes.func,
    onPublish: PropTypes.func,
    buttonTitle: PropTypes.string,
    buttonType: PropTypes.string,
    disabled: PropTypes.bool,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
};

PublishHeader.defaultProps = {
    buttonTitle: "下一步",
    buttonType: "clear",
    disabled: false,
};

const styles = StyleSheet.create({
    buttonContainer: {

    },
    button: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
});
