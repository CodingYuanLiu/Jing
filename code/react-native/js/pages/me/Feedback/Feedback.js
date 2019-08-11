import React from "react";
import {View, StyleSheet, FlatList, Text} from "react-native";
import {Divider, Image, ListItem, Button} from "react-native-elements";
import UserAvatar from "../../../common/components/UserAvatar";
import {ArrowLeftIcon, ChevronDownIcon} from "../../../common/components/Icons";
import HeaderBar from "../../../common/components/HeaderBar";
import Api from "../../../api/Api";
import NavigationUtil from "../../../navigator/NavUtil";
import FeedbackModal from "./FeedbackModal";

export default class Feedback extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            headerTitle: "",
            ellipsis: false,
            isFeedbackModalVisible: false,
            user: {},
        }
    };

    componentDidMount() {
        let act = this.props.navigation.getParam("act");
        console.log(act);
        this.setState({act: act});
        if (act.description.length > 15 || act.images.length > 0) this.setState({ellipsis: true});
        this.loadParticipants();
    }

    render() {
        let act = this.props.navigation.getParam("act");
        let header = this.renderHeader();
        let actInfo = this.renderActInfo(act);
        let participants = this.renderParticipants();
        let feedbackModal = this.renderFeedbackModal();
        return (
            <View style={styles.container}>
                {header}
                {actInfo}
                {participants}
                {feedbackModal}
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
        let showMoreButton = (
            <Button
                type={"clear"}
                title={"展开更多"}
                titleStyle={styles.showMoreActInfoButtonTitle}
                icon = {<ChevronDownIcon color={"#7a7a7a"} size={16} style={{margin: 0, padding: 0}}/>}
                iconRight={true}
            />
        );
        let title = (
            <Text style={[styles.actTitle]}>{act.title}</Text>
        );

        let description =
            this.state.ellipsis ?
            (
            <Text
                ellipsizeMode={"tail"}
                style={styles.actDescription}
                numberOfLines={1}
            >
                {act.description}
            </Text>
        ) :
                (
                    <Text
                        style={styles.actDescription}
                    >
                        {act.description}
                    </Text>
                );
        if (!this.state.ellipsis) {
            return (
                <View style={styles.actContainer}>
                    {title}
                    {description}
                    {
                        act.images.map((item, i) => {
                            return (
                                <Image
                                    source={{uri: item}}
                                    key={i.toString()}
                                />
                            )
                        })
                    }
                </View>
            )
        } else {
            return (
                <View style={styles.actContainer}>
                    {title}
                    <View style={styles.actDescriptionContainer}>
                        {description}
                        {showMoreButton}
                    </View>
                </View>
            )
        }
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
    renderItem({item}) {
        let leftAvatar = (
            <UserAvatar
                source={{uri: item.user_avatar}}
                id={item.user_id}
                containerStyle={styles.itemLeftAvatarContainer}
            />
        );
        let rightElement = (
            <Button
                title={"评价"}
                buttonStyle={styles.itemRightButton}
                containerStyle={styles.itemRightButtonContainer}
                onPress={() => {this.showFeedbackModal(item)}}
            />
        );
        return (
            <ListItem
                leftAvatar={leftAvatar}
                title={item.user_nickname}
                titleStyle={styles.itemTitle}
                subtitle={item.user_signature}
                subtitleStyle={styles.itemSubtitle}
                rightElement={rightElement}
            />
        )
    };
    renderFeedbackModal = () => {
        let user = this.state.user;
        let act = this.state.act;
        return (
            <FeedbackModal
                isVisible={this.state.isFeedbackModalVisible}
                user={user}
                act={act}
                onClose={this.hideFeedbackModal}
            />
        )
    };
    showFeedbackModal = (item) => {
        this.setState({
            isFeedbackModalVisible: true,
            user: item
        });
    };
    hideFeedbackModal = () => {
        this.setState({isFeedbackModalVisible: false});
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
    actDescriptionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    actDescription: {
        fontSize: 16,
        color: "#5a5a5a",
        flex: 1,
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
    itemLeftAvatarContainer: {
        backgroundColor: "blue",
        margin: 0,
        padding: 0,
    },
    itemRightButtonContainer: {
        backgroundColor: "red",
    },
    itemRightButton: {
        backgroundColor: "#ffe635",
        padding: 0,
        margin: 0,
    },
    itemTitle: {
        fontWeight: "bold",
        color: "#3a3a3a",
        backgroundColor: "green",
    },
    itemSubtitle: {
        color: "#7a7a7a",
        backgroundColor: "yellow",
    },
});
