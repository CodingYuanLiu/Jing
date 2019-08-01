import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";
import UserAvatar from "../../../common/components/UserAvatar";
import {Button} from "react-native-elements";
import styles from "react-native-webview/lib/WebView.styles";
import UserNickname from "../../../common/components/UserNickname";
import NavigationUtil from "../../../navigator/NavUtil";

export default class NoticeItem extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let {applicant, act} = this.props;
        let avatar = this.renderAvatar(applicant.id, applicant.avatar);
        let title = this.renderTitle(applicant.nickname, act.title);
        let footer = this.renderFooter();
        return(
            <View>
                {avatar}
                <View style={styles.rightContainer}>
                    {title}
                    {footer}
                </View>
            </View>
        )
    };

    renderAvatar = (id, avatar) => {
        return (
            <UserAvatar
                source={{uri: avatar}}
                id={id}
            />
        )
    };
    renderTitle = (userId, nickname, actId, actTitle) => {
        let action = "申请加入";
        return (
            <View style={styles.titleContainer}>
                <UserNickname
                    style={styles.boldText}
                    id={userId}
                >{nickname}</UserNickname>
                <Text style={styles.lightText}>{action}</Text>
                <Text
                    style={styles.boldText}
                    onPress={() => {NavigationUtil.toPage({id: actId}, "ActDetail")}}
                >{actTitle}</Text>
            </View>
        )
    };

    renderFooter = () => {
        let acceptButton = (
            <Button
                title={"拒绝"}
                type={"clear"}
                buttonStyle={styles.acceptButton}
                titleStyle={styles.acceptButtonTitle}
            />
        );
        let rejectButton = (
            <Button
                title={"接受"}
                buttonStyle={styles.rejectButton}
                titleStyle={styles.rejectButtonTitle}
            />
        );

        return (
            <View style={styles.footerContainer}>
                {acceptButton}
                {rejectButton}
            </View>
        )
    }
}
const applicantShape = {
    id: PropTypes.number,
    nickname: PropTypes.string,
    avatar: PropTypes.string,
};
const actShape = {
    id: PropTypes.number,
    title: PropTypes.string,
};
NoticeItem.propTypes = {
    applicant: PropTypes.shape(applicantShape),
    act: PropTypes.shape(actShape),
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 5,
        paddingRight: 8,
        flexDirection: "row",
    },
    rightContainer: {
        flex: 1,
    },
    titleContainer: {
    },
    boldText: {
        color: "#3a3a3a",
        fontWeight: "bold",
        fontSize: 14,
    },
    lightText: {
        color: "#bfbfbf",
        fontSize: 13,
    },
    footerContainer: {
        alignItems: "flex-end",
        flexDirection: "row",
    },
    acceptButton: {
        height: 20,
        width: 70,
        marginRight: 10,
    },
    acceptButtonTitle: {
        color: "#0084ff",
    },
    rejectButton: {
        height: 20,
        width: 70,
    },
    rejectButtonTitle: {
        color: "#ff4c29",
    },
});
