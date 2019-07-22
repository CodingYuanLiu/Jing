import React from "react";
import { ViewPropTypes } from "react-native";
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
                title={"下一步"}
                type={"clear"}
                color={Theme.TEXT_BUTTON_ENABLED}
                onPress={this.props.onNext}
            />;
        let style= this.props.style;
        return (
            <HeaderBar
                style={[{backgroundColor: Theme.BACKGROUND_GREY, marginTop: 20}, style]}
                leftButton={closeIcon}
                rightButton={rightBtn}
                rightBtnStyle={{marginRight: 12}}
                leftBtnStyle={{marginLeft: 16}}
            />
        )
    }
}

PublishHeader.propTypes = {
    style: ViewPropTypes.style,
    onClose: PropTypes.func,
    onNext: PropTypes.func,
};
