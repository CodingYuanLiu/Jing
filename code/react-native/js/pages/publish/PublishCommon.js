import React from "react"
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Input, Button, Icon} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import CustomDatePicker from "./components/CustomDatePicker";
import { connect } from "react-redux";
import {setPublishActCommon, setPublishActSpec} from "../../actions/activity";
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

            specDateTime: "",
            isSpecDatePickerVisible: false,
            specPickedDateTime: null,
        }
    }

    componentDidMount() {
        let type = this.props.navigation.getParam("actType");
        this.setState({type: type});


        // props redux state to component state
        if (this.props.type && this.props.type !== "") {
            this.setState({type: this.props.type});
        }
        if (this.props.title && this.props.title !== "") {
            this.setState({title: this.props.title})
        }
        if (this.props.endTime && this.props.endTime !== "") {
            this.setState({endTime: this.props.endTime})
        }
        console.log(this.props.spec);
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
    // for taxi activity
    renderDepartDatePicker = () => {
        let datePickerDisplayText = "请选择出发时间";
        if (this.state.specPickedDateTime || this.state.specDateTime !== ""){
            datePickerDisplayText = this.state.specDateTime;
        }
        return (
            <CustomDatePicker
                onCancel={this.hideSpecDateTimePicker}
                onShow={this.showSpecDateTimePicker}
                onConfirm={this.handleSpecDatePicked}
                displayText={datePickerDisplayText}
                visible={this.state.isSpecDatePickerVisible}
            />);
    };

    // for normal activity
    renderActivityTimePicker = () => {
        let datePickerDisplayText = "请选择活动开始时间";
        if (this.state.specPickedDateTime || this.state.specDateTime !== ""){
            datePickerDisplayText = this.state.specDateTime;
        }

        return (
            <CustomDatePicker
                onCancel={this.hideSpecDateTimePicker}
                onShow={this.showSpecDateTimePicker}
                onConfirm={this.handleSpecDatePicked}
                displayText={datePickerDisplayText}
                visible={this.state.isSpecDatePickerVisible}
            />);
    };

    // for takeout activity
    renderOrderTimePicker = () => {
        let datePickerDisplayText = "请选择下单时间";
        if (this.state.specPickedDateTime || this.state.specDateTime !== ""){
            datePickerDisplayText = this.state.specDateTime;
        }

        return (
            <CustomDatePicker
                onCancel={this.hideSpecDateTimePicker}
                onShow={this.showSpecDateTimePicker}
                onConfirm={this.handleSpecDatePicked}
                displayText={datePickerDisplayText}
                visible={this.state.isSpecDatePickerVisible}
            />);
    };

    render() {
        let header = this.renderHeader();
        let titleInput = this.renderTitleInput();
        let dateTimePicker = this.renderDateTimePicker();

        let componentByType;
        if (this.state.type === "taxi") {
            componentByType = this.renderDepartDatePicker();
        } else if (this.state.type === "takeout") {
            componentByType = this.renderOrderTimePicker();
        } else if (this.state.type === "activity") {
            componentByType = this.renderActivityTimePicker();
        } else {
            componentByType = null;
        }

        return(
            <View style={styles.container}>
                {header}
                <View style={styles.bodyContainer}>
                    {titleInput}
                    {dateTimePicker}
                    {componentByType}
                </View>
            </View>
        )
    };
    handleDatePicked = date => {
        this.setState({pickedDateTime: date});
        this.setState({
            endTime: Util.dateTimeToString(this.state.pickedDateTime)
        });
        this.hideDateTimePicker();
    };
    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };
    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true});
    };

    // for act spec field
    hideSpecDateTimePicker = () => {
        this.setState({isSpecDatePickerVisible: false});
    };
    showSpecDateTimePicker = () => {
        this.setState({isSpecDatePickerVisible: true});
    };
    handleSpecDatePicked = date => {
        this.setState({specPickedDateTime: date});
        let dateString = Util.dateTimeToString(this.state.specPickedDateTime);
        this.setState({
            specDateTime: dateString,
        });
        switch(this.state.type){
            case "taxi":
                this.props.setPublishActSpec({departTime: dateString});
                break;
            case "takeout" :
                this.props.setPublishActSpec({orderTime: dateString});
                break;
            case "activity" :
                this.setState({activityTime: dateString});
                break;
            default:
                break;
        }
        this.hideSpecDateTimePicker();
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
    setPublishActCommon: (type, title, endTime) => dispatch(setPublishActCommon(type,title,endTime)),
    setPublishActSpec: spec => dispatch(setPublishActSpec(spec)),
});
const mapStateToProps = state => ({
    type: state.activity.publishAct.type,
    title: state.activity.publishAct.title,
    endTime: state.activity.publishAct.endTime,
    spec: state.activity.publishAct.spec,
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
