import React from "react";
import {View} from "react-native";
import Timeline from "react-native-timeline-listview";
import {connect} from "react-redux";


class ActTimeline extends React.Component{
    constructor(props) {
        super(props);
        let {currentUserJoin: joinActs, currentUserManage: manageActs} = this.props;

    }

    render() {
        return (
            <Timeline/>
        );
    }



}

const mapStateToProps = state => ({
    currentUserJoin: state.currentUserJoin,
    currentUserManage: state.currentUserManage,
});
export default connect(mapStateToProps, null)(ActTimeline);
