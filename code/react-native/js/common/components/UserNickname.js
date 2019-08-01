import React from "react";
import {Text} from "react-native";
import NavigationUtil from "../../navigator/NavUtil";
import {PropTypes} from "prop-types";

export default class UserNickname extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let {title, id} = this.props;
        return (
            <Text
                {...this.props}
                onPress={() => {this.toPersonalHome(id)}}
            >{title}</Text>
        )
    };

    toPersonalHome = (id) => {
        NavigationUtil.toPage( {id: id}, "PersonalHome")
    }
}

UserNickname.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.number,
};
