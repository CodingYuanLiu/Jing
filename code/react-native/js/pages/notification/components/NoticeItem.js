import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";
import UserAvatar from "../../../common/components/UserAvatar";
import {Button} from "react-native-elements";
import UserNickname from "../../../common/components/UserNickname";
import NavigationUtil from "../../../navigator/NavUtil";

export default class NoticeItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let {applicant, act, isAccepting, isRejecting, onAccept, onReject} = this.props;
        let avatar = this.renderAvatar(applicant.id, applicant.avatar);
        let title = this.renderTitle(applicant.id, applicant.nickname, act.type);
        let message = this.renderMessage(act.id, act.title);
        let footer = this.renderFooter(isRejecting, isAccepting, onReject, onAccept);
        return (
            <View style={styles.container}>
                {avatar}
                <View style={styles.rightContainer}>
                    {title}
                    {message}
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
    renderTitle = (userId, nickname, type) => {
        let action = this.generateAction(type);
        return (
            <View style={styles.titleContainer}>
                <UserNickname
                    style={styles.boldText}
                    title={nickname}
                    id={userId}
                />
                <Text style={[styles.lightText, {paddingLeft: 10}]}>{action}</Text>
            </View>
        )
    };
    renderMessage = (actId, actTitle) => {
        return (
            <View style={styles.messageContainer}>
                <Text
                    style={[styles.lightText,]}
                >请让我加入</Text>
                <Text
                    onPress={() => {
                        this.toActDetail(actId)
                    }}
                    style={styles.lightText}
                    ellipsizeMode={"tail"}
                    numberOfLines={1}
                    style={[styles.boldText, {paddingLeft: 10}]}
                >{actTitle}</Text>
            </View>
        )
    };
    renderFooter = (isRejecting, isAccepting, onReject, onAccept) => {
        let acceptButton = (
            <Button
                type={"clear"}
                title={"拒绝"}
                titleStyle={styles.rejectButtonTitle}
                buttonStyle={styles.rejectButton}
                loading={isRejecting}
                onPress={onReject}
            />
        );
        let rejectButton = (
            <Button
                type={"clear"}
                title={"接受"}
                titleStyle={styles.acceptButtonTitle}
                buttonStyle={styles.acceptButton}
                loading={isAccepting}
                onPress={onAccept}
                containerStyle={styles.acceptButtonContainer}
            />
        );

        return (
            <View style={styles.footerContainer}>
                {acceptButton}
                {rejectButton}
            </View>
        )
    };
    generateAction = (type) => {
        switch (type) {
            case "taxi":
                return "希望一起拼车";
            case "takeout" :
                return "希望一起点外卖";
            case "order" :
                return "希望一起拼单";
            case "other":
                return "希望一起进行活动";
            default:
                return "希望和你在一起";
        }
    };
    toActDetail = (actId) => {
        NavigationUtil.toPage({id: actId}, "ActDetail");
    };
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
    onAccept: PropTypes.func,
    onReject: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 18,
        paddingRight: 8,
        flexDirection: "row",
        paddingBottom: 10,
        justifyContent: "center",
        marginTop: 10,
    },
    rightContainer: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderColor: "#efefef",
        marginLeft: 16,
    },
    titleContainer: {
        flexDirection: "row",
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
    messageContainer: {
        flexDirection: "row",
        marginLeft: 5,
        marginTop: 8,
    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 10,
    },
    acceptButton: {
        height: 25,
        width: 55,
    },
    acceptButtonContainer: {
        marginRight: 10,
    },
    acceptButtonTitle: {
        color: "#0084ff",
    },
    rejectButton: {
        height: 25,
        width: 55,
    },
    rejectButtonTitle: {
        color: "#ff4c29",
    },
});
