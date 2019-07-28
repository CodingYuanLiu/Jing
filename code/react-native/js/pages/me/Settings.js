import React from 'react';
import {View} from "react-native";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import Dao from "../../api/dao/Dao";

export default class  extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let header = this.renderHeader();
        let basicSettings = this.renderBasicSettings();
        let accountSettings = this.renderAccountSettings();
        let noticeSettings = this.renderNoticeSettings();
        let logoutButton = this.renderLogout();
        let footer = this.renderFooter();
        return (
            <View>

            </View>
        )
    };
    renderHeader = () => {
        let backIcon = (
            <ArrowLeftIcon
                onPress={this.back}
            />
        );
        return(
            <HeaderBar
            leftButton={backIcon}
            title={"设置"}
            titleLayoutStyle={styles.headerTitle}
            />
        )
    };
    renderTitle = () => {

    };
    renderBasicSettings = () => {

    };
    renderNoticeSettings = () => {

    };
    renderAccountSettings = () => {

    };
    renderLogout = () => {

    };
    renderFooter = () => {

    };
    back = () => {
        NavigationUtil.back(this.props);
    };
    logout = () => {
        this.props.onLogout();
        Dao.remove("@user")
            .catch(err => {});
        Dao.remove("@jwt")
            .catch(err => {})
    };
}


const styles = StyleSheet.create({
    headerTitle: {
        left: 0,
    },
});
