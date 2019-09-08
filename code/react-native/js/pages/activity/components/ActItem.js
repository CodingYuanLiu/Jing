import React from "react"
import { View, Text, ViewPropTypes, StyleSheet, TouchableNativeFeedback } from 'react-native';
import {ListItem, Icon, Image, Button} from "react-native-elements";
import { PropTypes } from "prop-types";
import {TaxiSpec, TakeoutSpec, OrderSpec, NormalActSpec} from "./SpecInfo";
import Tag from "../../../common/components/Tag";
import NavigationUtil from "../../../navigator/NavUtil";
import UserAvatar from "../../../common/components/UserAvatar";
import UserNickname from "../../../common/components/UserNickname";
import ToolTip from "../../../common/components/ToolTip";

export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            isTooltipVisible: false,
        }
    }
    render() {
        let sponsor = this.props.sponsor;
        let tags = this.props.tags;
        let type = this.props.type;
        let title = this.props.title;
        let description = this.props.description;
        let imageUri = this.props.image;
        let image = this.renderImage(imageUri);
        let actSpec = this.renderActSpec(type);
        let sponsorInfo = this.renderSponsorInfo(sponsor);
        let tooltip = this.renderTooltip();
        let maxMemberMeta = this.props.metadata.maxMember.toString();
        let commentMeta = this.props.metadata.comments.toString();
        let participantsMeta = this.props.metadata.participants.toString();

        return(
            <View
                styles={styles.wrapper}
            >
                <TouchableNativeFeedback
                    onPress={() => {this.toDetail()}}
                >
                    <View style={styles.container}>
                        <View style={styles.innerContainer}>
                            {sponsorInfo}
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                            <View style={styles.tagContainer}>
                                {
                                    tags ? tags.map((tag, i) => (
                                        this.renderTag(tag, i)
                                    )) : null
                                }
                            </View>
                            <View style={styles.bodyContainer}>
                                <View style={styles.bodyTextContainer}>
                                    {actSpec}
                                    <Text style={styles.bodyText} ellipsizeMode={"tail"} numberOfLines={2}>
                                        {description}
                                    </Text>
                                </View>
                                {image}
                            </View>
                            <View>
                            </View>
                            <View style={styles.metadataContainer}>
                                <Text style={styles.metadata}>{`${maxMemberMeta} 最大人数`}</Text>
                                <Text style={styles.metadata}>{`${participantsMeta} 参与`}</Text>
                                <Text style={styles.metadata}>{`${commentMeta} 评论`}</Text>
                            </View>
                        </View>
                        {tooltip}
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    };
    renderTag = (tag, i) => (
        <Tag
            title={tag}
            key={i.toString()}
        />
    );
    renderActSpec = (type) => {
        let ActSpec;
        let endTime = this.props.endTime;
        if (type === "taxi") {
            let departTime = this.props.taxiSpecInfo.departTime;
            let origin = this.props.taxiSpecInfo.origin;
            let dest = this.props.taxiSpecInfo.dest;
            ActSpec =
                <TaxiSpec
                    departTime={departTime}
                    endTime={endTime}
                    dest={dest}
                    origin={origin}
                />
        } else if (type === "order") {
            let store = this.props.orderSpecInfo.store;
            ActSpec =
                <OrderSpec
                    store={store}
                    endTime={endTime}
                />
        } else if (type === "takeout") {
            let store = this.props.takeoutSpecInfo.store;
            let orderTime = this.props.takeoutSpecInfo.orderTime;
            ActSpec =
                <TakeoutSpec
                    store={store}
                    endTime={endTime}
                    orderTime={orderTime}
                />
        } else {
            let activityTime = this.props.otherSpecInfo.activityTime;
            ActSpec =
                <NormalActSpec
                    endTime={endTime}
                    activityTime={activityTime}
                />
        }
        return ActSpec
    };

    renderSponsorInfo = sponsor => {
        let nickname = (
            <UserNickname
                title={sponsor.nickname}
                id={sponsor.id}
            />
        );
        let avatar = (
            <UserAvatar
                source={{uri: sponsor.avatar}}
                size={24}
                id={sponsor.id}
            />
        );


        return (
            <ListItem
                leftAvatar={avatar}
                title={nickname}
                containerStyle={styles.userInfoContainer}
                titleStyle={styles.userInfoTitle}
                titleProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
                onPress={() => {this.toPersonalHome(sponsor.id)}}
            />
        )
    };
    renderTooltip = () => {
        return(
            <ToolTip
                style={[styles.miniActionContainer]}
                isVisible={this.state.isTooltipVisible}
                onPress={() => {this.setState({isTooltipVisible: true})}}
                onBackdropPress={() => {this.setState({isTooltipVisible: false})}}
            >
                <Button
                    title={"举报"}
                    type={"clear"}
                    onPress={this.reportThis}
                />
                <Button
                    title={"删除"}
                    type={"clear"}
                    onPress={this.deleteAct}
                />
                <Button
                    title={"屏蔽此人"}
                    type={"clear"}
                    onPress={this.shieldThisPerson}
                />
            </ToolTip>
        );
    };
    renderImage = uri => {
        return uri ?
            <Image
                source={{uri: uri}}
                style={styles.bodyImage}
                containerStyle={styles.bodyImageContainer}
            /> : null
    };
    toDetail = () => {
        this.props.onPress(this.props.id)
    };
    toPersonalHome = (id) => {
        NavigationUtil.toPage({id: id}, "PersonalHome");
    };
    reportThis = () => {
        alert("暂时没有举报功能");
    };
    deleteAct = () => {
        let id = this.props;
        this.props.onDelete(id);
        this.setState({isTooltipVisible: false,})
    };
    shieldThisPerson = () => {
        alert("暂时没有屏蔽功能");
    };
}

const TaxiSpecShape = {
    departTime: PropTypes.string,
    endTime: PropTypes.string,
    origin: PropTypes.object,
    dest: PropTypes.object,
};
const OrderSpecShape = {
    store: PropTypes.string,
    endTime: PropTypes.string,
};
const TakeoutSpecShape = {
    store: PropTypes.string,
    endTime: PropTypes.string,
    orderTime: PropTypes.string,
};
const sponsorShape = {
    nickname: PropTypes.string.isRequired,
    signature: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
};
const otherSpecShape = {
    endTime: PropTypes.string,
    activityTime: PropTypes.string,
};
ActItem.propTypes = {
    id: PropTypes.number.isRequired,
    sponsor: PropTypes.shape(sponsorShape),
    title: PropTypes.string.isRequired,
    taxiSpecInfo: PropTypes.shape(TaxiSpecShape),
    orderSpecInfo: PropTypes.shape(OrderSpecShape),
    takeoutSpecInfo: PropTypes.shape(TakeoutSpecShape),
    otherSpecInfo: PropTypes.shape(otherSpecShape),
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    metadata: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: "relative",
    },
    container: {
        flex: 1,
        minHeight: 200,
        marginTop: 6,
        marginBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#fff",
        elevation: 1,
        position: "relative",
    },
    innerContainer: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    userInfoContainer: {
        paddingLeft: 0,
        flex: 1,
        width: "100%",
    },
    userInfoTitle: {
        fontWeight: "bold",
        color: "#bababa",
        maxWidth: "50%",
        height: 28,
        position: "relative",
        top: 9,
    },
    miniActionContainer: {
        position: "absolute",
        right: 30,
        top: 10,
        justifyContent: "center",
    },
    titleContainer: {
        width: "100%",
        justifyContent: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    tagContainer:{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },
    bodyContainer: {
        flexDirection: "row",
        flex: 1,
        marginTop: 5,
    },
    bodyTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    bodyText: {
        color: "#505050",
        fontWeight: "100",
        fontSize: 16,
    },
    bodyImageContainer: {
        width: 90,
        height: 70,
        alignSelf: "center",
    },
    bodyImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 4,
    },
    metadataContainer: {
        marginTop: 10,
        marginBottom: 10,
        height: 24,
        flexDirection: "row",
    },
    metadata: {
      fontSize: 16,
      color: "#bfbfbf",
        marginLeft: 10,
    },
});
