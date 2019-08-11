import React from "react";
import {View, StyleSheet, Text, ScrollView} from "react-native";
import {Avatar, Button, ListItem, Tooltip} from "react-native-elements";
import {EllipsisIcon} from "../../../common/components/Icons";
import Theme from "../../../common/constant/Theme";
import {PropTypes} from "prop-types";
import UserAvatar from "../../../common/components/UserAvatar";
import UserNickname from "../../../common/components/UserNickname";
import {ACT_EXPIRED, ACT_FORBIDDEN, ACT_FULL, ACT_RUNNING} from "../../../common/constant/Constant";
import NavigationUtil from "../../../navigator/NavUtil";

export default class JoinItem extends React.Component{
    constructor(props) {
        super(props);
    }


    render() {
        let {title, sponsor, description, createTime, endTime, status} = this.props.act;
        let applicants = this.props.applicants;
        let titleComponent = this.renderTitle(title);
        let sponsorComponent = this.renderSponsor(sponsor, createTime);
        let descriptionComponent = this.renderDesc(description);
        let applicantComponent = this.renderApplicants(status, applicants);
        let timeLineComponent = this.renderTimeLine(createTime, endTime);
        return (
            <View style={styles.container}>
                {titleComponent}
                {sponsorComponent}
                {descriptionComponent}
                {applicantComponent}
                {timeLineComponent}
            </View>
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
        let rightIconPopover = this.renderRightIconPopover();
        return (
            <Tooltip
                popover={rightIconPopover}
                width={120}
                height={30}
                backgroundColor={"#eee"}
                withOverlay={false}
                withPointer={false}
                containerStyle={styles.popoverContainer}
            >
                <EllipsisIcon
                    color={"#aaa"}
                    size={20}
                />
            </Tooltip>
        );
    };
    renderRightIconPopover = () => {
        let {act} = this.props;
        let {status} = act;
        return (
            <View style={{width: "100%",}}>
                {
                    status === ACT_RUNNING ?
                        <Button
                            type={"clear"}
                            title={"退出"}
                            titleStyle={styles.popoverButtonTitle}
                            buttonStyle={styles.popoverButton}
                            containerStyle={{padding: 0, margin: 0,}}
                            onPress={() => {alert(`id: ${act.title}`)}}
                        /> : null
                }
                {
                    status === ACT_EXPIRED ?
                    <Button
                        type={"clear"}
                        title={"评价"}
                        titleStyle={styles.popoverButtonTitle}
                        buttonStyle={styles.popoverButton}
                        containerStyle={{padding: 0, margin: 0,}}
                        onPress={() => {this.toFeedback(act)}}
                    /> : null
                }
            </View>
        )
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
    renderTimeLine = (createTime, endTime) => {
        return (
            <View style={styles.footerContainer}>

            </View>
        );
    };

    onQuit = () => {
        //...
    };
    toFeedback = (act) => {
        NavigationUtil.toPage({act: act}, "Feedback")
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
