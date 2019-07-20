import React from "react"
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Input, Button, Icon} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";
import Theme from "../../../common/constant/Theme";
import HeaderBar from "../../../common/components/HeaderBar";
import {CloseIcon} from "../../../common/components/Icons";
import DateTimePicker from "react-native-modal-datetime-picker";


export default class TaxiTitle extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            title:"",
            isDateTimePickerVisible: false,
        }
    }

    handleDatePicked = date => {
        this.hideDateTimePicker()
        this.setState({date: date})
    }

    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false})
    }

    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true})
    }

    render() {
        let closeIcon =
            <CloseIcon
                color={Theme.BUTTON_GREY}
                size={24}
                onPress={() => {NavigationUtil.toPage(null, "Home")}}
            />
        let rightBtn =
            <Button
            title={"下一步"}
            type={"clear"}
            color={Theme.TEXT_BUTTON_ENABLED}
            onPress={() => {NavigationUtil.toPage(null, "ActDetail")}}
            />
        return(
            <View style={styles.container}>

                <HeaderBar
                    style={{backgroundColor: Theme.BACKGROUND_GREY, marginTop: 20}}
                    leftButton={closeIcon}
                    rightButton={rightBtn}
                    rightBtnStyle={{marginRight: 12}}
                    leftBtnStyle={{marginLeft: 16}}
                />

                <View style={styles.basicContainer}>
                    <Input
                        placeholder={"输入标题"}
                        autoFocus
                        inputStyle={styles.title}
                        value={this.state.title}
                        onChangeText={text => {this.setState({title: text})}}
                    />
                </View>
                <View>
                    <Icon
                        type={"fontisto"}
                        name={"date"}
                        onPress={() => this.showDateTimePicker()}
                    />
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eeeeee",
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    basicContainer: {

    }
})
