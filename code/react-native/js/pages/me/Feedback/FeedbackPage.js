import React from "react";
import {View, FlatList, RefreshControl, Text, StyleSheet, Image, TouchableWithoutFeedback} from "react-native";
import Api from "../../../api/Api";
import {Rating, Button} from "react-native-elements";
import HeaderBar from "../../../common/components/HeaderBar";
import {ArrowLeftIcon, CommentIcon} from "../../../common/components/Icons";
import NavigationUtil from "../../../navigator/NavUtil";
import UserAvatar from "../../../common/components/UserAvatar";
import UserNickname from "../../../common/components/UserNickname";
import Util from "../../../common/util";
import {WINDOW} from "../../../common/constant/Constant";
import {connect} from "react-redux";
import ToolTip from "../../../common/components/ToolTip";

const FILTER_TYPE = {
    ALL: 0,
    GOOD: 1,
    NORMAL: 2,
    BAD: 3,
    IMAGE: 4,
};
class FeedbackPage extends React.Component{
    constructor(props) {
        super(props);
        let user = this.props.navigation.getParam("user");
        let act = this.props.navigation.getParam("act");
        this.receiver = user;
        this.act = act;
        this.isSelf = user.id === this.props.currentUser.id;
        this.state = {
            feedbackList: [],
            goodList: [],
            badList: [],
            normalList: [],
            imageList: [],
            filter: FILTER_TYPE.ALL,
            feedbackButtonVisible: false,
            isTooltipVisible: false,
        };
    };

    componentDidMount() {
        this.loadData();
    }

    render() {

        let header = this.renderHeader();
        let top = this.renderTop();
        let footer = this.renderFooter();
        return (
            <View
                style={styles.container}
            >
                {header}
                {top}

                    <FlatList
                        data={this.filterData()}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.user.id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={this.loadData}
                                title={"加载中..."}
                                titleColor={"#0084ff"}
                                colors={["#0084ff"]}
                                tintColor={"#0084ff"}
                            />
                        }
                    />
                {footer}
            </View>
        )
    };

    renderHeader = () => {
        let feedbackButton = (
            <Button
                type={"clear"}
                title={"评价"}
                titleStyle={{color: "#0084ff"}}
                onPress={this.toPublishFeedbackPage}
            />
        );
        return (
            <HeaderBar
                leftButton={
                    <ArrowLeftIcon
                        color={"#555"}
                        onPress={this.goBack}
                    />
                }
                title={`${this.receiver.nickname} 的评价`}
                titleStyle={{color: "#555", fontSize: 20}}
                titleLayoutStyle={{alignItems: "flex-start"}}
                style={styles.headerContainer}
                rightButton={this.state.feedbackButtonVisible ? feedbackButton : null}
            />
        )
    };

    renderTop = () => {
        let goodTitle = "好评", allTitle = `全部 ${this.state.feedbackList.length}`,
            normalTitle = "中评", badTitle = "差评",
            imageTitle = "有图";
        let {goodList, badList, normalList, imageList} = this.state;
        if (goodList.length > 0) {
            goodTitle += ` ${goodList.length}`;
        }
        if (badList.length > 0) {
            badTitle += ` ${badList.length}`;
        }
        if (imageList.length > 0) {
            imageTitle += ` ${imageTitle}`;
        }
        if (normalList.length > 0) {
            normalTitle += ` ${normalTitle}`;
        }
        return (
            <View
                style={styles.topContainer}
            >
                {
                    this.renderFilter(allTitle, FILTER_TYPE.ALL)}
                {
                    this.renderFilter(goodTitle, FILTER_TYPE.GOOD)}
                {
                    this.renderFilter(normalTitle, FILTER_TYPE.NORMAL)}
                {
                    this.renderFilter(badTitle, FILTER_TYPE.BAD)}
                {
                    this.renderFilter(imageTitle, FILTER_TYPE.IMAGE)
                }
            </View>
        )
    };

    renderFilter = (title, type) => {
        return (
            <Button
                title={title}
                titleStyle={{
                    color: this.state.filter === type ?
                        "#fff" : "#555",
                    fontSize: 12,
                }}
                buttonStyle={[
                    styles.filterButton,
                    {
                        backgroundColor: this.state.filter === type ?
                            "#0084ff" : "#e5e5e5",
                    }
                ]}
                containerStyle={styles.filterButtonContainer}
                onPress={() => {this.setState({filter: type})}}
                touchableComponent={TouchableWithoutFeedback}
            />
        )
    };

    renderItem = ({item}) => {
        let user = this.renderUser(item);
        let rating = this.renderRating(item);
        let body = this.renderItemBody(item);
        let footer = this.renderItemFooter(item);
        return (
            <TouchableWithoutFeedback
                onPress={() => {this.toFeedbackDetail(item)}}
            >
                <View style={styles.itemContainer}>
                    {user}
                    <View
                        style={{marginLeft: 15, marginRight:  15}}
                    >
                        {rating}
                        {body}
                        {footer}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    };
    renderUser = (item) => {
        let tooltip = (
            <ToolTip
                isVisible={this.state.isTooltipVisible}
                onPress={() => {this.setState({isTooltipVisible: true})}}
                onBackdropPress={() => {this.setState({isTooltipVisible: false})}}
                style={styles.itemUserToolTip}
            >
                <Button
                    type={"clear"}
                    title={"删除"}
                    onPress={() => {this.deleteFeedback(item)}}
                />
            </ToolTip>
        );
        return(
            <View
                style={styles.itemUserContainer}
            >
                <UserAvatar
                    source={{uri: item.user.avatar}}
                    size={36}

                />
                <UserNickname
                    title={item.user.nickname}
                    style={{color: "#444", fontSize: 14, marginLeft: 15}}
                    id={item.user.id}
                />
                {item.user.id === this.props.currentUser.id ?
                    tooltip : null
                }
            </View>
        )
    };
    renderRating = (item) => {
        let rating = this.getItemRating(item);

        return(
            <Rating
                style={styles.rating}
                showRating={false}
                startingValue={rating}
                imageSize={16}
                ratingCount={5}
                readOnly={true}
            />
        )
    };
    renderItemBody = (item) => {
        return (
            <View>
                <View>
                    <Text style={{fontSize: 15, color: "#8a8a8a"}}>联系状态:{"  "}
                        <Text
                            style={{color: "#444"}}
                        >
                            {item.communication.desc}
                        </Text>
                    </Text>
                </View>
                <View>
                    <Text style={{fontSize: 15, color: "#8a8a8a"}}>是否诚信:{"  "}
                        <Text style={{color: "#444"}}>
                            {item.honesty.desc}
                        </Text>
                    </Text>
                </View>

                <View>
                    <Text style={{fontSize: 15, color: "#8a8a8a"}}>是否准时:{"  "}
                        <Text style={{color: "#444"}}>
                            {item.punctuality.desc}
                        </Text>
                    </Text>

                </View>
                {
                    item.images.map((item,i) => {
                        return (
                            <Image
                                key={i.toString()}
                                source={{uri: item}}
                                style={styles.itemImage}
                            />
                        )
                    })
                }
            </View>
        )
    };
    renderItemFooter = (item) => {
        return (
            <View
                style={styles.itemFooterContainer}
            >
                <Text>{Util.dateTimeToDisplayString(new Date(item.createTime))}</Text>
               <View style={styles.metadataContainer}>
                   <CommentIcon
                    color={"#bfbfbf"}
                   />
                   <Text
                    style={{fontSize: 15, color: "#999", textAlign: "center"}}
                   >{item.comments.length}</Text>
               </View>
            </View>
        )
    };
    renderFooter = () => {
        return (
            <View
                style={styles.footerContainer}
            >
                <Button
                    type={"clear"}
                    title={"查看活动"}
                    titleStyle={{color: "#0084ff"}}
                    onPress={this.toActDetail}
                />
            </View>
        )
    };
    filterData = () => {
        switch (this.state.filter) {
            case FILTER_TYPE.ALL:
                return this.state.feedbackList;
            case FILTER_TYPE.GOOD:
                return this.state.goodList;
            case FILTER_TYPE.NORMAL:
                return this.state.normalList;
            case FILTER_TYPE.BAD:
                return this.state.badList;
            case FILTER_TYPE.IMAGE:
                return this.state.imageList;
            default:
                return [];
        }
    };
    loadData = () => {
        Api.getFeedback(this.receiver.id)
            .then(data => {
                let feedbackList = data.filter(item => item.act.id === this.act.id);
                let goodList = [], normalList = [], badList = [], imageList = [], itemRating, feedbackButtonVisible = true;
                if (feedbackList.length > 0) {
                    for (let item of feedbackList) {
                        if (this.isSelf || item.user.id === this.props.currentUser.id) {
                            feedbackButtonVisible = false;
                        }
                        itemRating = this.getItemRating(item);
                        if (itemRating > 4) {
                            goodList.push(item);
                        } else if (itemRating <= 4 && itemRating > 2) {
                            normalList.push(item);
                        } else if (itemRating <= 2) {
                            badList.push(item);
                        }
                        if (item.images.length > 0) {
                            imageList.push(item);
                        }
                    }
                } else {
                    feedbackButtonVisible = !this.isSelf;
                }
                this.setState({
                    feedbackList,
                    goodList,
                    normalList,
                    badList,
                    imageList,
                    feedbackButtonVisible,
                })
            })
            .catch(err => {
                console.log(err);
            })
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    };
    toPublishFeedbackPage = () => {
        NavigationUtil.toPage({act: this.act, user: this.receiver}, "PublishFeedbackPage")
    };
    toFeedbackDetail = (feedback) => {
        NavigationUtil.toPage({feedback}, "FeedbackDetail")
    };
    toActDetail = () => {
        NavigationUtil.toPage({id: this.act.id}, "ActDetail")
    };
    getItemRating = (item) => {
        return (item.communication.data + item.honesty.data + item.punctuality.data) / 3;
    };
    deleteFeedback = (item) => {
        // ...
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

export default connect(mapStateToProps, null)(FeedbackPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        position: "relative",
    },
    topContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: "#f3f3f3",
    },
    filterButtonContainer: {
        margin: 6,
    },
    filterButton: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 18,
        paddingRight: 18,
        borderRadius: 50,
        backgroundColor: "red",
    },
    headerContainer: {
        elevation: 2,
        backgroundColor: "#fff",
    },

    itemContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        marginTop: 5,
        marginBottom: 5,
        elevation: 2,
        backgroundColor: "#fff",
    },
    itemUserContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        position: "relative",
    },
    itemUserToolTip:{
        position: "absolute",
        right: 10,

    },
    rating: {
        backgroundColor: "red",
        alignSelf: "flex-start",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    itemImage: {
        // 30: 2* 15,
        // 24: 3 images, margin 4
        width: ( WINDOW.width - 30 - 30 - 24) / 3,
        height: (WINDOW.height - 30 - 30 - 24 ) / 3,
        margin: 4,
        borderRadius: 3,
    },

    itemFooterContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 10,
        marginTop: 10,
    },
    metadataContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    footerContainer: {
        position: "absolute",
        bottom: 0,
        height: 48,
        width: WINDOW.width,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
    }
});
