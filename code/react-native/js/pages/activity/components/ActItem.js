import React from "react"
import { View, Text, ViewPropTypes, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { ListItem, Icon, Image } from "react-native-elements";
import { PropTypes } from "prop-types";
import {TaxiSpec, TakeoutSpec, OrderSpec, NormalActSpec} from "./SpecInfo";
import Default from "../../../common/constant/Constant";
import Tag from "../../../common/components/Tag";
import NavigationUtil from "../../../navigator/NavUtil";

export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            miniActionVisible: false,
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
        let miniActionBar = this.renderMiniActionBar();
        let participantMeta = this.props.metadata.participants.toString();
        let commentMeta = this.props.metadata.comments.toString();

        return(
            <View styles={styles.wrapper}>
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
                                <Text style={styles.metadata}>{`${participantMeta} 参与`}</Text>
                                <Text style={styles.metadata}>{`${commentMeta} 评论`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                {miniActionBar}
            </View>
        )
    };
    renderTag = (tag, i) => (
        <Tag
            title={tag}
            key={i}
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
        let nickname = sponsor.nickname;
        let avatar = sponsor.avatar;
        // blank here, spare for future use
        return (
            <ListItem
                leftAvatar={{
                    source: {uri: avatar},
                    size: 24
                }}
                title={nickname}
                containerStyle={styles.userInfoContainer}
                titleStyle={styles.userInfoTitle}
                titleProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
                onPress={() => {this.toPersonalHome(sponsor.id)}}
            />
        )
    };
    renderMiniActionBar = () => {
        let rightIcon=
            <Icon
                type={"antdesign"}
                name={"ellipsis1"}
                containerStyle={styles.miniActionIcon}
                color={"#bfbfbf"}
                onPress={this.showMiniAction}
            />;
        return(
            <View style={styles.miniActionContainer}>
                {rightIcon}
            </View>
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
    showMiniAction = () => {
        this.setState({miniActionVisible: true})
    };
    toDetail = () => {
        this.props.onPress(this.props.id)
    };
    toPersonalHome = (id) => {
        NavigationUtil.toPage({id: id}, "PersonalHome");
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
    user: PropTypes.shape(sponsorShape),
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
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: "relative",
    },
    container: {
        flex: 1,
        height: 240,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#fff",
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
        right: 20,
        top: 15,
        justifyContent: "center",
    },
    miniActionIcon: {
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
