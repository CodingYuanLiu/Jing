import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { ListItem, Button } from "react-native-elements";
import UserAvatar from "../../../common/components/UserAvatar";
import FeedbackItem from "./FeedbackItem";
import ImagePicker from "react-native-image-picker";
import { ArrowLeftIcon, ImageIcon } from "../../../common/components/Icons";
import HeaderBar from "../../../common/components/HeaderBar";
import NavigationUtil from "../../../navigator/NavUtil";
import Util from "../../../common/util";
import { Image } from "react-native-elements";
import Api from "../../../api/Api";
import { connect } from "react-redux";
import Model from "../../../api/Model";


class PublishFeedbackPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            communicationDesc: "",
            honestyDesc: "",
            punctualityDesc: "",
            communicationData: 5,
            honestyData: 5,
            punctualityData: 5,
            feedbackImages: [],
            isLoading: false,
        };
        let user = this.props.navigation.getParam("user");
        let act = this.props.navigation.getParam("act");
        this.receiver = user;
        this.act = act;
    };

    render() {
        let header = this.renderHeader();
        let receiver = this.renderUser();
        let feedback = this.renderFeedback();
        let imageList = this.renderImageList();
        let footer = this.renderFooter();
        return (
            <View style={styles.container}>
                {header}
                <ScrollView style={styles.mainContainer}>
                    {receiver}
                    {feedback}
                    {imageList}
                </ScrollView>
                {footer}
            </View>
        )
    };
    renderHeader = () => {
        let {receiver} = this;
        let leftIcon = (
            <ArrowLeftIcon
                color={"#7a7a7a"}
                size={24}
                onPress={this.goBack}
            />
        );
        let rightButton = (
            <Button
                type={"clear"}
                title={"确定"}
                buttonStyle={styles.headerRightButton}
                containerStyle={styles.headerRightButtonContainer}
                onPress={this.publishFeedback}
                loading={this.state.isLoading}
            />
        );
        return (
            <HeaderBar
                leftButton={leftIcon}
                title={`评价 ${receiver.nickname}`}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleContainer}
                style={styles.headerContainer}
                rightButton={rightButton}
            />
        );
    };
    renderUser = () => {
        let {receiver} = this;
        let avatar = (
            <UserAvatar
                id={receiver.id}
                source={{uri: receiver.avatar}}
            />
        );
        return (
            <ListItem
                leftAvatar={avatar}
                title={receiver.nickname}
                titleStyle={styles.userTitle}
                subtitle={receiver.signature}
                subtitleStyle={styles.userSubtitle}
                containerStyle={styles.userContainer}
            />
        )
    };
    renderFeedback = () => {
        return (
            <View style={styles.feedbackContainer}>
                <FeedbackItem
                    label={"联系状态"}
                    onRating={this.onRatingCommunication}
                    text={this.state.communicationDesc}
                    onChangeText={this.onChangeCommunicationDesc}
                />
                <FeedbackItem
                    label={"准时"}
                    onRating={this.onRatingPunctuality}
                    text={this.state.punctualityDesc}
                    onChangeText={this.onChangePunctualityDesc}
                />
                <FeedbackItem
                    label={"诚信"}
                    onRating={this.onRatingHonesty}
                    text={this.state.honestyDesc}
                    onChangeText={this.onChangeHonestyDesc}
                />
            </View>
        )
    };
    renderImageList = () => {
        return (
            <View style={styles.feedbackImageListContainer}>
                {
                    this.state.feedbackImages.map((item, i) => {
                        return (
                            <Image
                                source={{uri: `data:${item.type};base64,${item.data}`}}
                                key={i.toString()}
                                resizeMode={"cover"}
                                containerStyle={styles.feedbackImageContainer}
                                style={styles.feedbackImage}
                            />
                        )
                    })
                }
            </View>
        )
    };
    renderFooter = () => {
        let imageIcon = (
            <ImageIcon
                size={20}
                color={"#8a8a8a"}
            />
        );
        return (
            <View style={styles.footerContainer}>
                <Button
                    title={"添加图片"}
                    titleStyle={styles.footerButtonTitle}
                    icon={imageIcon}
                    type={"clear"}
                    onPress={this.showImagePicker}
                    buttonStyle={styles.footerButton}
                    containerStyle={styles.footerButtonContainer}
                />
                <View style={{flex: 1,}}/>
            </View>
        )
    };
    showImagePicker = () => {
        ImagePicker.showImagePicker(imageOptions, res => {
            if (res.didCancel) {
                // ...
            } else if (res.error) {
                // ...
            } else {
                let type = res.type;
                let img =  res.data;
                let images = this.state.feedbackImages;
                let newImages = [{type: type, data: img}, ...images];
                this.setState({
                    feedbackImages: newImages,
                });
            }
        })
    };
    onRatingCommunication = (rating) => {
        this.setState({communicationData: rating})
    };
    onRatingHonesty = (rating) => {
        this.setState({honestyData: rating})
    };
    onRatingPunctuality = (rating) => {
        this.setState({punctualityData: rating})
    };
    onChangeCommunicationDesc = (text) => {
        this.setState({communicationDesc: text})
    };
    onChangeHonestyDesc = (text) => {
        this.setState({honestyDesc: text});
    };
    onChangePunctualityDesc = (text)  => {
        this.setState({punctualityDesc: text});
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    };
    publishFeedback = () => {
        this.setState({isLoading: true});
        let data = this.buildFeedback();
        let {currentUser} = this.props;
        Api.publishFeedback(Model.buildFeedbackItem(data), currentUser.jwt)
            .then(res => {
                let {id} = res;
                NavigationUtil.toPage({id}, "ActDetail");
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({isLoading: false});
            })
    };
    buildFeedback = () => {
        let state = this.state;
        return {
            actId: this.act.id,
            receiverId: this.user.id,
            ...state,
        }
    }
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

export default connect(mapStateToProps, null)(PublishFeedbackPage);

const imageOptions = {
    title: "选择",
    cancelButtonTitle: "取消",
    takePhotoButtonTitle: "拍摄",
    chooseFromLibraryButtonTitle: "从相册选择",
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.4,
};

const imageContainerLen = Util.getVerticalWindowDimension().width * 0.293;
const imageLen = Util.getVerticalWindowDimension().width * 0.270;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    headerContainer: {
        backgroundColor: "#fff",
        elevation: 3,
    },
    headerTitleContainer: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    headerTitle: {
        fontWeight: "800",
        fontSize: 20,
        color: "#3a3a3a",
    },
    headerRightButton: {
        padding: 0,
        margin: 0,
    },
    headerRightButtonContainer: {
        marginRight: 15,
    },

    userContainer: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    userTitle: {
        fontWeight: "bold",
        fontSize: 18,
    },
    userSubtitle: {
        fontWeight: "700",
        color: "#9a9a9a",
    },

    mainContainer: {
        flex: 1,
    },
    feedbackContainer: {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        borderRadius: 5,
        backgroundColor: "#fff",
        flex: 1,
    },

    feedbackImageListContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: imageContainerLen,
        backgroundColor: "#fff",
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    feedbackImageContainer: {
        width: imageContainerLen,
        height: imageContainerLen,
        justifyContent: "center",
        alignItems: "center",
    },
    feedbackImage: {
        width: imageLen,
        height: imageLen,
        borderRadius: 3,
    },

    footerContainer: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: "#fff",
        marginTop: 10,
    },
    footerButtonContainer: {
        //...
        flex: 1,
    },
    footerButton: {
        padding: 0,
        margin: 0,
        height: 40
    },
    footerButtonTitle: {
        color: "#8a8a8a",
    },

});
