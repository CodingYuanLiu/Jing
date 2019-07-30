import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import HeaderBar from "../../common/components/HeaderBar";
import {CameraIcon, CloseIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import {Avatar, Button, ListItem} from "react-native-elements";


export default class PersonalHome extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            modified: false,
            saved: false,
            avatar: "",
            nickname: "",

        }
    }
    render() {
        let header = this.renderHeader();
        let avatar = this.renderAvatar();
        let basicInformation = this.renderBasicInformation();
        return(
            <View style={styles.container}>
                {header}
                {avatar}
                {basicInformation}
            </View>
        )
    }
    renderHeader = () => {
        return (
            <HeaderBar
                leftButton={
                    <CloseIcon
                    color={"#fff"}
                    style={styles.headerIcon}
                    onPress={() => {NavigationUtil.back(this.props)}}
                    />
                }
                title={"编辑个人资料"}
                titleLayoutStyle={styles.headerTitle}
                rightButton={
                    <Button
                    title={"保存"}
                    titleStyle={styles.headerButtonTitle}
                    type={"clear"}
                    onPress={() => {alert("保存成功")}}
                    />
                }
                rightBtnStyle={styles.headerRightButton}
                style={{elevation: 10,}}
            />
        )
    };
    renderAvatar = () => {
        let avatarIcon = (
            <CameraIcon
            color={"#fff"}
            style={styles.avatarIcon}
            />
        );
        return (
            <View style={styles.avatarIconContainer}>
                <Avatar
                    rounded
                    source={{uri: "http://image.jing855.cn/FkQnfaDywDEDJa_nCwmcQ4cKqdlH"}}
                    size={80}
                    onPress={() => {alert("更换头像")}}
                />
                {avatarIcon}
            </View>
        )
    };
    renderInformationTitle = (title) => {
        return (
            <View style={styles.infoTitleContainer}>
                <Text style={styles.infoTitle}>{title}</Text>
            </View>
        )
    };
    renderBasicInformation = () => {
        let title = this.renderInformationTitle("基本资料");
        return (
            <View style={styles.basicInformationContainer}>
                {title}
                
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerButtonTitle: {
        fontSize: 14,
        color: "#fff",
    },
    headerTitle: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    headerIcon: {
        marginLeft: 20,
    },
    avatarIconContainer: {
        marginTop: 20,
        position: "relative",
        justifyContent: "center",
        marginLeft: 20,
    },
    avatarIcon: {
        position: "absolute",
        left: 28,   //28 for 40 (radius of avatar) - 12 (radius of icon),
        top: 28,
    },
    infoTitleContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    infoTitle: {
        fontWeight: "bold",
        fontSize: 20,
    },
    headerRightButton: {
        marginRight: 20,
    },
    basicInformationContainer: {
        marginLeft: 20,
    },
    input: {
        borderBottomWidth: 0.5,
        borderColor: "#cfcfcf",
    },
});
