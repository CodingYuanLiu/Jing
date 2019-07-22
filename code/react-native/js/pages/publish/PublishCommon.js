import React from "react"
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Input, Button, Icon} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import CustomDatePicker from "./components/CustomDatePicker";
import { connect } from "react-redux";
import {setPublishActCommon} from "../../actions/activity";
import Util from "../../common/util";
import PublishHeader from "./components/PublishHeader";

class PublishCommon extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            title: "",
            type: "",
            endTime: "",
            isDateTimePickerVisible: false,
            pickedDateTime: null,
        }
    }

    componentDidMount() {
        this.setState({type: this.props.navigation.getParam("actType")})

        if (this.props.type && this.props.type !== "") {
            this.setState({type: this.props.type});
        }
        if (this.props.title && this.props.title !== "") {
            this.setState({title: this.props.title})
        }
        if (this.props.endTime && this.props.endTime !== "") {
            this.setState({endTime: this.props.endTime})
        }
    }

    renderHeader = () => {
        return (
            <PublishHeader
                onClose={() => {NavigationUtil.toPage(null, "Home")}}
                onNext={this.toNextPage}
            />
            );
    };

    renderTitleInput = () => {
        return (
            <View style={styles.titleContainer}>
                <Input
                    placeholder={"输入标题"}
                    autoFocus
                    inputStyle={styles.title}
                    value={this.state.title}
                    onChangeText={text => {this.setState({title: text})}}
                />
            </View>
        )
    };

    renderDateTimePicker = () => {
        let datePickerDisplayText = "请选择报名截止时间";
        if (this.state.pickedDateTime || this.state.endTime !== ""){
            datePickerDisplayText = this.state.endTime;
        }
        return (
            <CustomDatePicker
                onCancel={this.hideDateTimePicker}
                onConfirm={this.handleDatePicked}
                onShow={this.showDateTimePicker}
                visible={this.state.isDateTimePickerVisible}
                displayText={datePickerDisplayText}
            />
        )
    };
    render() {
        let header = this.renderHeader();
        let titleInput = this.renderTitleInput();
        let dateTimePicker = this.renderDateTimePicker();
        return(
            <View style={styles.container}>
                {header}
                <View style={styles.bodyContainer}>
                    {titleInput}
                    {dateTimePicker}
                </View>
            </View>
        )
    };
    handleDatePicked = date => {
        this.setState({pickedDateTime: date});
        this.setState({
            endTime: Util.dateTimeToString(this.state.pickedDateTime)
        });
        console.log(this.state);
        this.hideDateTimePicker();
    };
    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
        console.log(this.state)
    };
    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true});
        console.log(this.state)
    };
    toNextPage = () => {
        let type = this.state.type;
        let endTime = this.state.endTime;
        let title = this.state.title;

        if (title === "" ||
            endTime === "" ||
            type === "") {
            alert("还有一些没有填写哦～")
            return;
        }

        let nextPage;
        if (type === "taxi")
            nextPage = "PublishTaxiSpec";
        else if (type === "order")
            nextPage = "PublishOrderSpec";
        else if (type === "takeout")
            nextPage = "PublishTakeoutSpec";
        else
            nextPage = "PublishActivitySpec";
        this.props.setPublishActCommon(type,title, endTime);
        NavigationUtil.toPage(null, nextPage);
    }

}

// let the activity to be published managed by redux store
const mapDispatchToProps = dispatch => ({
    setPublishActCommon: (type, title, endTime) => dispatch(setPublishActCommon(type,title,endTime))
});
const mapStateToProps = state => ({
    type: state.activity.publishAct.type,
    title: state.activity.publishAct.title,
    endTime: state.activity.publishAct.endTime,
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishCommon)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eeeeee",
    },

    // style for activity title input
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    titleContainer: {
        marginTop: 32,
        paddingLeft: "6%",
        paddingRight: "6%",
    },

    // style for activity date picker
});
