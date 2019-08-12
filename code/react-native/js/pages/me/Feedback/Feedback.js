import React from "react";
import {View, StyleSheet, FlatList, Text} from "react-native";
import {Divider, Image, ListItem, Button} from "react-native-elements";
import UserAvatar from "../../../common/components/UserAvatar";
import {ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon} from "../../../common/components/Icons";
import HeaderBar from "../../../common/components/HeaderBar";
import Api from "../../../api/Api";
import NavigationUtil from "../../../navigator/NavUtil";
import Util from "../../../common/util";
import {HAVE_FEEDBACK, NO_FEEDBACK} from "../../../common/constant/Constant";

export default class Feedback extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            headerTitle: "",
            ellipsis: false,
            user: {},
        }
    };

    componentDidMount() {
        let act = this.props.navigation.getParam("act");
        this.setState({act: act});
        if (act.description.length > 15 || act.images.length > 0) this.setState({ellipsis: true});
        this.loadParticipants();
    }

    render() {
        let act = this.props.navigation.getParam("act");
        let header = this.renderHeader();
        let actInfo = this.renderActInfo(act);
        let participants = this.renderParticipants();
        return (
            <View style={styles.container}>
                {header}
                {actInfo}
                {participants}
            </View>
        )
    };
    renderHeader() {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#7a7a7a"}
                size={24}
                style={styles.headerLeftIcon}
                onPress={this.goBack}
            />
        );
        return (
            <HeaderBar
                leftButton={leftIcon}
                title={"选择评价"}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleContainer}
                style={styles.headerContainer}
            />
        )
    };
    renderActInfo = () => {
        let act = this.props.navigation.getParam("act");
        let title = (
            <Text style={[styles.actTitle]}>{act.title}</Text>
        );
        let body = this.state.ellipsis ? this.renderEllipsisDescription(act) : this.renderFullDescription(act);
        return (
            <View style={styles.actContainer}>
                {title}
                {body}
            </View>
        )

    };
    renderEllipsisDescription = (act) => {
        let showMoreButton = (
            <Button
                type={"clear"}
                title={"展开更多"}
                titleStyle={styles.showMoreActInfoButtonTitle}
                icon = {<ChevronDownIcon color={"#7a7a7a"} size={16} style={{margin: 0, padding: 0}}/>}
                iconRight={true}
                onPress={this.showMore}
            />
        );
        return (
            <View style={styles.actEllipsisDescriptionContainer}>
                <Text
                    ellipsizeMode={"tail"}
                    style={[styles.actDescription, {flex: 1,}]}
                    numberOfLines={1}
                >
                    {act.description}
                </Text>
                {showMoreButton}
            </View>
        );
    };
    renderFullDescription = (act) => {
        let showLessButton = (
            <Button
                type={"clear"}
                title={"收起"}
                titleStyle={styles.showMoreActInfoButtonTitle}
                icon = {<ChevronUpIcon color={"#7a7a7a"} size={16} style={{margin: 0, padding: 0}}/>}
                iconRight={true}
                onPress={this.showLess}
                buttonStyle={styles.showLessButton}
                containerStyle={styles.showLessButtonContainer}
            />
        );
        return (
            <View style={styles.actFullDescriptionContainer}>
                <Text
                    style={styles.actDescription}
                >
                    {act.description}
                </Text>
                <View style={styles.fullDescriptionImageListContainer}>
                    {act.images.map((item, i) => {
                        return (
                            <Image
                                source={{uri: item}}
                                key={i.toString()}
                                style={styles.fullDescriptionImage}
                                containerStyle={styles.fullDescriptionImageContainer}
                                resizeMode={"cover"}
                            />
                        )
                    })}
                </View>
                {showLessButton}
            </View>
        )
    };
    renderParticipants = () => {
        let data = this.state.participants;
        let title = (
            <Text
                style={styles.FlatListTitle}
            >参与者</Text>
        );
        return (
            <View style={styles.FlatListContainer}>
                {title}
                <FlatList
                    data={data}
                    keyExtractor={item => item.user_id.toString()}
                    renderItem={this.renderItem}
                />
            </View>
        )
    };
    renderItem = ({item}) => {
        let leftAvatar = (
            <UserAvatar
                source={{uri: item.user_avatar}}
                id={item.user_id}
                containerStyle={styles.itemLeftAvatarContainer}
            />
        );
        let rightElement = this.renderItemRightButton(item);
        return (
            <ListItem
                leftAvatar={leftAvatar}
                title={item.user_nickname}
                titleStyle={styles.itemTitle}
                subtitle={item.user_signature}
                subtitleStyle={styles.itemSubtitle}
                rightElement={rightElement}
                containerStyle={styles.itemContainer}
            />
        )
    };
    renderItemRightButton = (item) => {
        let status = item.status;
        let title, onPress;
        if (item.status === HAVE_FEEDBACK) {
            title = "查看评价";
            onPress = this.toUserFeedback;
        } else if (item.status === NO_FEEDBACK) {
            title = "评价";
            onPress = this.toFeedbackPage;
        } else {
            title = "评价";
            onPress = this.toFeedbackPage;
        }
        return (
            <Button
                type={"clear"}
                title={title}
                titleStyle={styles.itemRightButtonTitle}
                buttonStyle={styles.itemRightButton}
                containerStyle={styles.itemRightButtonContainer}
                onPress={() => {onPress(item)}}
            />
        );
    };
    showMore = () => {
        this.setState({ellipsis: false});
    };
    showLess = () => {
        this.setState({ellipsis: true});
    };
    toFeedbackPage = (user) => {
        let act = this.props.navigation.getParam("act");
        NavigationUtil.toPage({props: {
                user: user,
                act: act,
            }}, "FeedbackPage");
    };
    loadParticipants = () => {
        let { id } = this.props.navigation.getParam("act");
        Api.getActParticipants(id)
            .then(data => {
                console.log(data);
                this.setState({participants: data});
            })
            .catch(err => {
                console.log(err);
            })
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    }
}

const imageContainerLen = Util.getVerticalWindowDimension().width * 0.293;
const imageLen = Util.getVerticalWindowDimension().width * 0.270;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        backgroundColor: "#fff",
        elevation: 3,
    },
    headerLeftIcon: {
        marginLeft: 15,
        marginRight: 15,
    },
    headerTitle: {
        fontWeight: "800",
        fontSize: 20,
        color: "#3a3a3a",
    },
    headerTitleContainer: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },

    // style for act
    actContainer: {
        backgroundColor: "#eee",
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 10,
    },
    showMoreActInfoButtonTitle: {
        color: "#7a7a7a",
        fontSize: 16,
    },
    actTitle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#3a3a3a",
        marginTop: 8,
    },
    actEllipsisDescriptionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    actFullDescriptionContainer: {
        marginTop: 8,
    },
    fullDescriptionImageListContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    fullDescriptionImageContainer: {
        width: imageContainerLen,
        height: imageContainerLen,
        justifyContent: "center",
        alignItems: "center",
    },
    fullDescriptionImage: {
        width: imageLen,
        height: imageLen,
        borderRadius: 3,
    },
    showLessButtonContainer: {
        alignItems: "flex-end",
    },
    showLessButton: {
        padding: 0,
        margin: 0,
    },
    actDescription: {
        fontSize: 16,
        color: "#5a5a5a",
    },

    // style for list item
    FlatListContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        elevation: 3,
    },
    FlatListTitle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#3a3a3a",
    },
    itemContainer: {
        borderBottomWidth: 0.5,
        borderColor: "#eee",
    },
    itemLeftAvatarContainer: {
        margin: 0,
        padding: 0,
    },
    itemRightButtonContainer:{
        borderColor: "#ffe635",
        borderRadius: 4,
        borderWidth: 1,
    },
    itemRightButton: {
        padding: 0,
        marginTop: 6,
        marginBottom: 6,
        marginLeft: 12,
        marginRight: 12,
    },
    itemRightButtonTitle: {
        color: "#ffe635"
    },
    itemTitle: {
        fontWeight: "bold",
        color: "#3a3a3a",
    },
    itemSubtitle: {
        color: "#7a7a7a",
    },
});
