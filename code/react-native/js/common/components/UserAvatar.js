import React from "react";
import {Avatar} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import {PropTypes} from "prop-types";

export default class UserAvatar extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let {id} = this.props;
        return (
            <Avatar
                {...this.props}
                rounded
                title={'A'}
                onPress={() => {this.toPersonalHome(id)}}
            />
            )
    }

    toPersonalHome = (id) => {
        NavigationUtil.toPage({id: id}, "PersonalHome");
    }
}

UserAvatar.propTypes = {
    id: PropTypes.number,
    source: PropTypes.object,
};
