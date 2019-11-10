import React from "react";
import {View, StyleSheet, Text, ScrollView, TouchableNativeFeedback} from "react-native";
import { Button, ListItem } from "react-native-elements";
import Theme from "../../../common/constant/Theme";
import {PropTypes} from "prop-types";
import UserAvatar from "../../../common/components/UserAvatar";
import UserNickname from "../../../common/components/UserNickname";
import {ACT_EXPIRED, ACT_FORBIDDEN, ACT_FULL, ACT_RUNNING} from "../../../common/constant/Constant";
import NavigationUtil from "../../../navigator/NavUtil";
import ToolTip from "../../../common/components/ToolTip";
import Api from "../../../api/Api";

export default class JoinItem extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isTooltipVisible: false,
        }
    }


    render() {
        let {title, sponsor, description, createTime, endTime, status} = this.props.act;
        let applicants = this.props.applicants;
        let titleComponent = this.renderTitle(title);
        let sponsorComponent = this.renderSponsor(sponsor, createTime);
        let descriptionComponent = this.renderDesc(description);
        let applicantComponent = this.renderApplicants(status, applicants);
        return (
            <TouchableNativeFeedback
                onPress={() => this.toActDetail(this.props.act)}
            >
                <View style={styles.container}>
                    {titleComponent}
                    {sponsorComponent}
                    {descriptionComponent}
                    {applicantComponent}
                </View>
            </TouchableNativeFeedback>
        );
    };
    renderTitle = (title) => {
        let toolTip = this.renderTooltip();
        return (
            <View style={styles.titleContainer}>
                <Text style={[styles.boldText, {flex: 1,}]}>
                    {title}
                </Text>
                {toolTip}
            </View>
        )
    };
    renderTooltip = () => {
        let {act} = this.props;
        let feedbackButton =
                <Button
                    title={"评价"}
                    type={"clear"}
                    onPress={() => {this.toFeedback(act)}}
                />;
        let quitButton = act.status === ACT_RUNNING ?
            (
                <Button
                    title={"退出"}
                    type={"clear"}
                    onPress={() => {this.quitAct(act)}}
                />
            ) : null;
        return (
            <ToolTip
                isVisible={this.state.isTooltipVisible}
                onPress={() => {this.setState({isTooltipVisible: true})}}
                onBackdropPress={() => {this.setState({isTooltipVisible: false})}}
            >
                {feedbackButton}
                {quitButton}
            </ToolTip>
        );
    };
    renderSponsor = (sponsor, createTime) => {
        let avatar = (
            <UserAvatar
                id={sponsor.id}
                size={16}
                source={{uri: sponsor.avatar}}
                avatarStyle={{marginLeft: 0, paddingLeft: 0}}
                containerStyle={{marginLeft: 0, paddingLeft: 0}}
            />
        );
        let titleComponent=(
            <UserNickname
                title={sponsor.nickname}
                style={styles.sponsorTitle}
                id={sponsor.id}
            />
        );
        return (
            <ListItem
                leftAvatar={avatar}
                title={titleComponent}
                containerStyle={{padding:0, margin:0}}
            />
        )
    };
    renderDesc = (description) => {
        return (
            <View style={styles.descContainer}>
                <Text
                    ellipsizeMode={"tail"}
                    numberOfLines={2}
                    style={styles.description}
                >{description}</Text>
            </View>
        )
    };
    renderApplicants = (status, applicants) => {
        let leftText = this.renderApplicantLeftText(status);
        return (
            <View style={styles.applicantContainer}>
                {leftText}
                <ScrollView
                    horizontal
                >
                    {
                        applicants.map((item, i) => {
                            return (
                                <UserAvatar
                                    source={{uri: item.appicant_avatar}}
                                    id={item.applicant_id}
                                    size={16}
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    };
    renderApplicantLeftText = (status) => {
        let leftText, leftTextColor;
        switch(status) {
            case ACT_RUNNING:
                leftText = "正在报名";
                leftTextColor = Theme.SUCCESS;
                break;
            case ACT_FULL:
                leftText = "人数已满";
                leftTextColor = Theme.PRIMARY_BLUE;
                break;
            case ACT_EXPIRED:
                leftText = "活动结束";
                leftTextColor = Theme.WARNING;
                break;
            case ACT_FORBIDDEN:
                leftText = "违规封禁";
                leftTextColor = Theme.ERROR;
                break;
            default:
                console.log("invalid")
        }
        return (
            <Text
                style={[styles.applicantLeftText, {color: leftTextColor}]}
            >
                {leftText}
            </Text>
        )
    };
    toActDetail = (act) => {
        NavigationUtil.toPage({id: act.id}, "Feedback");
    };
    quitAct = (act) => {
        let {currentUser} = this.props;
        Api.quitAct(currentUser.id, act.id, currentUser.jwt)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    };
    toFeedback = (act) => {
        this.setState({isTooltipVisible: false});
        NavigationUtil.toPage({act: act}, "Feedback");
    }
}

JoinItem.propTypes = {
    act: PropTypes.object,
    applicants: PropTypes.array,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
        paddingLeft: 18,
        paddingRight: 18,
        backgroundColor: "#fff",
        elevation: 2,
    },
    titleContainer: {
        marginTop: 10,
        marginBottom: 4,
        alignItems: "center",
        flexDirection: "row",
    },
    popoverContainer: {
        elevation: 4,
        backgroundColor: "#f7f7f7",
        borderRadius: 2,
        position: "absolute",
    },
    popoverButtonTitle: {
        fontSize: 20,
        color: "#8a8a8a",
    },
    popoverButton: {
        padding: 0,
        margin: 0,
        backgroundColor: "red",
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#2a2a2a",
    },
    description: {
        color: "#5a5a5a",
        fontSize: 14,
    },
    sponsorTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#8a8a8a",
    },
    applicantContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    applicantLeftText: {
        fontSize: 12,
    },
    footerContainer: {
        marginBottom: 8,
    },
});
