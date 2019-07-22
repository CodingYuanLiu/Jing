import React from "react"
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Input, Button, Icon} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import Theme from "../../common/constant/Theme";
import HeaderBar from "../../common/components/HeaderBar";
import {CloseIcon} from "../../common/components/Icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from "react-redux";
import {setPublishActCommon} from "../../actions/activity";
import Util from "../../common/util";

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
        let closeIcon =
            <CloseIcon
                color={Theme.BUTTON_GREY}
                size={24}
                onPress={() => {NavigationUtil.toPage(null, "Home")}}
            />;
        let rightBtn =
            <Button
                title={"下一步"}
                type={"clear"}
                color={Theme.TEXT_BUTTON_ENABLED}
                onPress={this.toNextPage}
            />;
        return (
            <HeaderBar
                style={{backgroundColor: Theme.BACKGROUND_GREY, marginTop: 20}}
                leftButton={closeIcon}
                rightButton={rightBtn}
                rightBtnStyle={{marginRight: 12}}
                leftBtnStyle={{marginLeft: 16}}
            />
        )
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
        // transfer "2019-07-22T01:47:36.412Z" -> "2019-07-22 01:47:36"
        if (this.state.pickedDateTime || this.state.endTime !== "") {
            datePickerDisplayText = this.state.endTime;
        }

        return (
            <View style={styles.datePickerContainer}>
                <Icon
                    type={"font-awesome"}
                    name={"calendar-check-o"}
                    size={32}
                    color={"#bbbbbb"}
                />
                <Text
                    onPress={() => this.showDateTimePicker()}
                    style={styles.datePickerText}
                >
                    {datePickerDisplayText}
                </Text>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    mode={"datetime"}
                    minimumDate={new Date()}
                    is24Hour={true}
                    timePickerModeAndroid={"spinner"}
                />
            </View>
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
        this.hideDateTimePicker();
    };
    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false})
    };
    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true})
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
            nextPage = "TaxiSpec";
        else if (type === "order")
            nextPage = "OrderSpec";
        else if (type === "takeout")
            nextPage = "TakeoutSpec";
        else
            nextPage = "ActivitySpec";
        this.props.setPublishActCommon(type,title, endTime);
        NavigationUtil.toPage(null, "PublishTaxiSpec")
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
    datePickerContainer: {
        flexDirection: "row",
        paddingLeft: "6%",
        marginTop: 48,
        paddingRight: "6%",
    },
    datePickerText: {
        color: "#bbbbbb",
        fontSize: 24,
        marginLeft: 12,
    },
})
