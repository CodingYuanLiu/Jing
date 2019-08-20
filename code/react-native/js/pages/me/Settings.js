import React from 'react';
import {View, StyleSheet, ScrollView, Text, TouchableWithoutFeedback} from "react-native";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import Dao from "../../api/Dao";
import {Button, ListItem} from "react-native-elements";

export default class Settings extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            waterMarkActive: true,
            saveDataActive: false,
            findByPhoneActive: false,
        };
    }

    render() {
        let header = this.renderHeader();
        let basicSettings = this.renderBasicSettings();
        let accountSettings = this.renderAccountSettings();
        let noticeSettings = this.renderNoticeSettings();
        let logoutButton = this.renderLogout();
        let footer = this.renderFooter();
        return (
            <View style={styles.container}>
                {header}
                <ScrollView>
                    {basicSettings}
                    {noticeSettings}
                    {accountSettings}
                    {logoutButton}
                    {footer}
                </ScrollView>
            </View>
        )
    };
    renderHeader = () => {
        let backIcon = (
            <ArrowLeftIcon
                onPress={this.back}
                color={"#fff"}
            />
        );
        return(
            <HeaderBar
            leftButton={backIcon}
            title={"设置"}
            titleLayoutStyle={styles.headerTitle}
            style={styles.headerContainer}
            />
        )
    };
    renderTitle = (title) => {
        return <Text style={styles.settingContainerTitle}>{title}</Text>
    };
    renderBasicSettings = () => {
        let title = this.renderTitle("基本设置");
        return (
            <View>
                {title}
                <ListItem
                    title={"水印图片"}
                    titleStyle={styles.settingTitle}
                    subtitle={"在上传的图片中欧你添加水印"}
                    subtitleStyle={styles.settingSubtitle}
                    switch={{value: this.state.waterMarkActive, onValueChange: this.handleWaterMarkSettingChange, thumbColor: "#0084ff"}}
                    containerStyle={styles.settingItemContainer}
                />
                <ListItem
                    title={"省流量模式"}
                    titleStyle={styles.settingTitle}
                    subtitle={"仅在Wi-Fi环境下才会自动加载图片"}
                    subtitleStyle={styles.settingSubtitle}
                    switch={{value: this.state.WIFISetting, onValueChange: this.handleWIFISettingChange, thumbColor: "#0084ff"}}
                    containerStyle={styles.settingItemContainer}
                />
                <ListItem
                    title={"可通过手机号找到我"}
                    titleStyle={styles.settingTitle}
                    subtitle={"可以通过手机好找到我"}
                    subtitleStyle={styles.settingSubtitle}
                    switch={{value: this.state.canFindByPhone, onValueChange: this.handleCanFindByPhoneSetting, thumbColor: "#0084ff"}}
                    containerStyle={styles.settingItemContainer}
                />
                <ListItem
                    title={"清除缓存"}
                    titleStyle={styles.settingTitle}
                    subtitle={"包括图片、音频缓存(共xxxMB)"}
                    subtitleStyle={styles.settingSubtitle}
                    containerStyle={styles.settingItemContainer}
                />
            </View>
        )
    };
    renderNoticeSettings = () => {
        let title = this.renderTitle("通知设置");
        return (
            <View>
                {title}
                <ListItem
                    title={"全局消息设置"}
                    titleStyle={styles.settingTitle}
                    containerStyle={styles.settingItemContainer}
                />
                <ListItem
                    title={"全局推送通知设置"}
                    titleStyle={styles.settingTitle}
                    containerStyle={styles.settingItemContainer}
                />
            </View>
        )
    };
    renderAccountSettings = () => {
        let title = this.renderTitle("帐号设置");
        return (
            <View>
                {title}
                <ListItem
                    title={"帐号与安全"}
                    titleStyle={styles.settingTitle}
                    subtitle={"管理帐号安全、修改帐号密码等"}
                    subtitleStyle={styles.settingSubtitle}
                    containerStyle={styles.settingItemContainer}
                />
            </View>
        )
    };
    renderLogout = () => {
        return (
            <Button
            title={"退出帐号"}
            type={"clear"}
            color={"#ff3835"}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
            TouchableComponent={TouchableWithoutFeedback}
            />
        )
    };
    renderFooter = () => {
        return (
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                    © 2019 https://jing855.cn
                </Text>
                <Text style={styles.footerText}>
                    All rights reserved.
                </Text>
            </View>
        )
    };
    back = () => {
        NavigationUtil.back(this.props);
    };
    logout = () => {
        Dao.remove("@user")
            .catch(err => {});
        Dao.remove("@jwt")
            .catch(err => {})
    };
    handleWaterMarkSettingChange = () => {
        this.setState(state => {
            state.waterMarkActive = !state.waterMarkActive;
            this.props.toggleWaterMarkSetting();
            return state;
        });
    };
    handleWIFISettingChange = () => {
        this.setState(state => {
            state.saveDataAvtive = !state.saveDataActive;
            this.props.toggleSaveDataSetting();
            return state;
        })
    };
    handleCanFindByPhoneSetting = () => {
        this.setState(state => {
            state.findByPhoneAvtive = !state.findByPhoneActive;
            this.props.toggleFindByPhoneSetting();
            return state;
        })
    };
}
const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
    toggleWaterMarkSetting: () => dispatch(toggleWater)
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        elevation: 10,
    },
    headerTitle: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginLeft: 20,
    },
    settingItemContainer: {
        borderBottomWidth: 0.5,
        borderColor: "#efefef",
        paddingBottom: 20,
    },
    settingContainerTitle: {
        color: "#0084ff",
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 24,
        marginLeft: 20,
        marginTop: 20,
    },
    settingTitle: {
        color: "#3a3a3a",
        fontSize: 16,
    },
    settingSubtitle: {
        color: "#3a3a3a",
        fontSize: 12,
    },
    buttonContainer: {
        height: 60,
        borderBottomWidth: 0.5,
        borderColor: "#efefef",
        justifyContent: "center",
    },
    buttonTitle: {
        color: "#ff3526",
    },
    footerContainer: {
        alignItems: "center",
        marginTop: 35,
        marginBottom: 50,
    },
    footerText:{
        color: "#bfbfbf",
    },
});
