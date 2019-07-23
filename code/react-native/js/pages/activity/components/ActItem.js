import React from "react"
import { View, Text, ViewPropTypes, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { ListItem, Icon, Image } from "react-native-elements";
import { PropTypes } from "prop-types";
import {TaxiSpec, TakeoutSpec, OnlineShopSpec, NormalActSpec} from "./SpecInfo";
import Default from "../../../common/constant/Default";
import Tag from "../../../common/components/Tag";

export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            miniActionVisible: false,
        }
    }
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
            let store = this.props.shopSpecInfo.store;
            ActSpec =
                <OnlineShopSpec
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
            let activityTime = this.props.normalSpecInfo.activityTime;
            ActSpec =
                <NormalActSpec
                    endTime={endTime}
                    activityTime={activityTime}
                />
        }
        return ActSpec
    };

    renderUserInfo = user => {
        let nickname = user.nickname;
        let avatarUri = user.avatarUri;
        // blank here, spare for future use
        return (
            <ListItem
                leftAvatar={{
                    source: {uri: avatarUri === "" ? Default.DEFAULT_AVATAR : avatarUri},
                    size: 24
                }}
                title={nickname}
                containerStyle={styles.userInfoContainer}
                titleStyle={styles.userInfoTitle}
                titleProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
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
    render() {
        let user = this.props.user;
        let tags = this.props.tags;
        let type = this.props.type;
        let title = this.props.title;
        let bodyText = this.props.bodyText;
        let imageUri = this.props.image;
        let image = this.renderImage(imageUri);
        let actSpec = this.renderActSpec(type);
        let userInfo = this.renderUserInfo(user);
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
                            {userInfo}
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
                                        {bodyText}
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
    }
}
const item =
    <Icon
    type={"material-community"}
    name={"taxi"}
    size={24}
    color={"#bfbfbf"}
/>;
const TaxiSpecShape = {
    departTime: PropTypes.string,
    endTime: PropTypes.string,
    source: PropTypes.string,
    dest: PropTypes.string,
};
const OnlineShopSpecShape = {
    store: PropTypes.string,
    endTime: PropTypes.string,
};
const TakeoutSpecShape = {
    store: PropTypes.string,
    endTime: PropTypes.string,
    orderTime: PropTypes.string,
};
const UserShape = {
    nickname: PropTypes.string.isRequired,
    signature: PropTypes.string.isRequired,
    avatarUri: PropTypes.string.isRequired,
};
const normalSpecShape = {
    endTime: PropTypes.string,
    activityTime: PropTypes.string,
};
ActItem.propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.shape(UserShape),
    title: PropTypes.string.isRequired,
    taxiSpecInfo: PropTypes.shape(TaxiSpecShape),
    shopSpecInfo: PropTypes.shape(OnlineShopSpecShape),
    takeoutSpecInfo: PropTypes.shape(TakeoutSpecShape),
    normalSpecInfo: PropTypes.shape(normalSpecShape),
    bodyText: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    metadata: PropTypes.object.isRequired,
};

ActItem.defaultProps = {
    title: "测试",
    type: "taxi",
    user: {
        avatarUri: Default.DEFAULT_AVATAR
    }
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: "relative",
    },
    container: {
        flex: 1,
        height: 240,
        marginTop: 10,
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
