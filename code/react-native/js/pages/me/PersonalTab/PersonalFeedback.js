import React from "react"
import { View, Text, StyleSheet, FlatList, TouchableNativeFeedback } from 'react-native';
import {connect} from "react-redux";
import {onGetCurrentUserFeedback} from "../../../actions/currentUserFeedback";
import UserAvatar from "../../../common/components/UserAvatar";
import {Image, Rating} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";
import {toggleNestScroll} from "../../../actions/personalHome";


class PersonalFeedback extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false,
        };
    }

    render() {
        let {personalHome} = this.props;
        let data = personalHome.feedbackList;
        if (!data) {
            data = [];
        }
        return(
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={(item, i) => i.toString()}
                    style={{flex: 1,}}
                    scrollEnabled={personalHome.nestScrollEnabled}
                    onScroll={this._onScroll}
                />
            </View>
        )
    };
    renderItem = ({item}) => {
        let leftAvatar = this.renderItemLeftAvatar(item);
        let title = this.renderItemTitle(item);
        let subtitle = this.renderItemSubtitle(item);
        let imageList = this.renderImages(item);
        let footer = this.renderFooter(item);
        return (
            <TouchableNativeFeedback
                onPress={() => {this.toFeedbackDetail(item)}}
                style={{flex: 1,}}
            >
                <View style={styles.itemContainer}>
                    {leftAvatar}
                    <View style={styles.itemRightContainer}>
                        {title}
                        {subtitle}
                        {imageList}
                        {footer}
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    };
    renderItemLeftAvatar = (item) => {
        return (
            <View style={styles.itemLeftAvatarContainer}>
                <UserAvatar
                    id={item.user.id}
                    source={{uri: item.user.avatar}}
                    size={28}
                    containerStyle={{padding: 0, margin: 0}}
                />
            </View>
        )
    };
    renderItemTitle = (item) => {
        let title = (
            <Text
                style={styles.itemTitle}
            >{item.user.nickname}</Text>
        );
        let ratingCount = (item.communication.data
            + item.honesty.data + item.punctuality.data) / 3;

        let averageRating  = (
            <Rating
                ratingCount={5}
                startingValue={ratingCount}
                readonly={true}
                imageSize={20}
            />
        );
        return (
            <View style={styles.itemTitleContainer}>
                {title}
                {averageRating}
            </View>
        )
    };
    renderItemSubtitle = (item) => {
        return (
            <View style={styles.itemSubtitleContainer}>
                <Text
                    style={styles.itemSubtitleText}
                >
                    {
                        item.honesty.desc
                        + item.communication.desc
                        + item.punctuality.desc
                    }
                </Text>
            </View>
        )
    };
    renderImages = (item) => {
        return (
            <View style={styles.itemImageListContainer}>
                {
                    item.images.map((img, i) => {
                        return (
                            <Image
                                source={{uri: img}}
                                style={styles.itemImage}
                                containerStyle={styles.itemImageContainer}
                                resizeMode={"cover"}
                            />
                        )
                    })
                }
            </View>
        )
    };
    renderFooter = (item) => {
        return (
            <Text style={styles.itemFooterText}>
                {item.createTime}
            </Text>
        )
    };
    toFeedbackDetail = (item) => {
        NavigationUtil.toPage({feedback: item}, "FeedbackDetail");
    };
    _onScroll = ({nativeEvent}) => {
        let {contentOffset} = nativeEvent;
        if(contentOffset.y <= 0) {
            this.props.toggleNestScroll(false);
        } else {
            this.props.toggleNestScroll(true);
        }
    };
}

const mapStateToProps = state => ({
    personalHome: state.personalHome,
});
const mapDispatchToProps = dispatch => ({
    toggleNestScroll: (flag) => dispatch(toggleNestScroll(flag)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonalFeedback)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        backgroundColor: "#eee",
    },
    itemContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 5,
        elevation: 1,
        backgroundColor: "#fff",
        paddingTop: 10,
    },
    itemLeftAvatarContainer: {
        height: "100%",
        justifyContent: "flex-start",
    },
    itemRightContainer: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        marginLeft: 10,
    },
    itemTitle: {
        fontWeight: "bold",
        color: "#3a3a3a",
    },
    itemTitleContainer: {
        height: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemSubtitleContainer: {
        flexDirection: "row",
    },
    itemSubtitleText: {
        color: "#5a5a5a",
        fontSize: 16,
    },
    itemImageListContainer: {
        marginBottom: 8,
        marginTop: 8,
        flexDirection: "row",
    },
    itemImageContainer: {
        width: 75,
        height: 75,
        borderRadius: 3,
    },
    itemImage: {
        width: 72,
        height: 72,
        borderRadius: 3,
    },
    itemFooterText: {
        fontSize: 12,
        color: "#bfbfbf",
        marginBottom: 10,
    },
});
