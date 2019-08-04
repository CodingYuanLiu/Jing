import React from "react";
import {View, StyleSheet, Text, ScrollView} from "react-native";
import {Avatar, Button, ListItem, Tooltip} from "react-native-elements";
import {EllipsisIcon} from "../../../common/components/Icons";
import Theme from "../../../common/constant/Theme";
import {PropTypes} from "prop-types";
import UserAvatar from "../../../common/components/UserAvatar";
import UserNickname from "../../../common/components/UserNickname";

export default class JoinItem extends React.Component{
    constructor(props) {
        super(props);
    }


    render() {
        let {title, sponsor, description, applicants, createTime, endTime, status} = this.props;
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
        return (
            <View style={styles.titleContainer}>
                <Text
                    style={styles.boldText}
                >
                    {title}
                </Text>
            </View>
        )
    };
    renderSponsor = (sponsor, createTime) => {
        let rightIconPopover = this.renderRightIconPopover();
        let rightIcon = (
            <Tooltip
                popover={rightIconPopover}
                width={150}
                height={100}
                backgroundColor={"#eee"}
                withOverlay={false}
                containerStyle={styles.popoverContainer}
            >
                <EllipsisIcon
                    color={"#aaa"}
                    size={20}
                />
            </Tooltip>
        );
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
                rightElement={rightIcon}
                containerStyle={{padding:0, margin:0}}
            />
        )
    };
    renderRightIconPopover = () => {
        return (
            <View style={{flex: 1,}}>
                <Button
                    title={"退出"}
                    titleStyle={styles.popoverButtonTitle}
                    buttonStyle={styles.popoverButton}
                    onPress={() => {alert("你按到了popover")}}
                />
            </View>
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
            case 0:
                leftText = "正在报名";
                leftTextColor = Theme.SUCCESS;
                break;
            case 1:
                leftText = "人数已满";
                leftTextColor = Theme.PRIMARY_BLUE;
                break;
            case 2:
                leftText = "活动结束";
                leftTextColor = Theme.WARNING;
                break;
            case -1:
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
}

JoinItem.propTypes = {
    title: PropTypes.string,
    sponsor: PropTypes.object,
    description: PropTypes.string,
    applicants: PropTypes.array,
    createTime: PropTypes.string,
    endTime: PropTypes.string,
    status: PropTypes.number,
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
        justifyContent: "center",
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
    popoverContainer: {
        elevation: 4,
        backgroundColor: "#f7f7f7",
        borderRadius: 2,
    },
    popoverButtonTitle: {
        fontSize: 20,
        color: "#8a8a8a",
    },
    popoverButton: {
        backgroundColor: "transparent",
        width: "100%",
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
