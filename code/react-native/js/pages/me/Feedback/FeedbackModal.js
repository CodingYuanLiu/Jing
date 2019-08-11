import React from "react";
import {StyleSheet, View, ScrollView} from "react-native";
import Modal from "react-native-modal";
import {PropTypes} from "prop-types";
import {ListItem, Button} from "react-native-elements";
import UserAvatar from "../../../common/components/UserAvatar";
import FeedbackItem from "./FeedbackItem";
import ImagePicker from "react-native-image-picker";
import {ArrowLeftIcon, ImageIcon} from "../../../common/components/Icons";
import HeaderBar from "../../../common/components/HeaderBar";


export default class FeedbackModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            communicationDesc: "",
            honestyDesc: "",
            punctualityDesc: "",
            communicationData: 5,
            honestyData: 5,
            punctualityData: 5,
        };

    };

    componentDidMount() {
        let {user, act} = this.props;
        this.loadData(user, act);
    }

    render() {
        let header = this.renderHeader();
        let receiver = this.renderUser();
        let feedback = this.renderFeedback();
        let footer = this.renderFooter();
        return (
            <Modal
                isVisible={this.props.isVisible}
                style={styles.modalContainer}
                backdropColor={"#fff"}
                backdropOpacity={0.7}
                propageteSwipe={true}
            >
                {header}
                <ScrollView style={styles.container}>
                    {receiver}
                    {feedback}
                    <View>
                    </View>
                    {footer}
                </ScrollView>
            </Modal>
        )
    };
    renderHeader = () => {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#7a7a7a"}
                size={20}
                onPress={this.props.onClose}
            />
        );
        return (
            <HeaderBar
                leftButton={leftIcon}
            />
        )
    };
    renderUser = () => {
        let user = this.props.user;
        let avatar = (
            <UserAvatar
                id={user.user_id}
                source={user.user_avatar}
                style={{margin: 0, padding: 0}}
            />
        );
        return (
            <ListItem
                leftAvatar={avatar}
                title={user.user_nickname}
                titleStyle={styles.userTitle}
                subtitle={user.user_signature}
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
                    onChangeText={this.onChangeCommunicationDesc}
                />
                <FeedbackItem
                    label={"准时"}
                    onRating={this.onRatingPunctuality}
                    onChangeText={this.onChangePunctualityDesc}
                />
                <FeedbackItem
                    label={"诚信"}
                    onRating={this.onRatingHonesty}
                    onChangeText={this.onChangeHonestyDesc}
                />
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
            <Button
                title={"添加图片"}
                icon={imageIcon}
                type={"clear"}
                onPress={this.showImagePicker}
            />
        )
    };
    showImagePicker = () => {
        ImagePicker.showImagePicker(options, res => {
            if (res.didCancel) {
                //...
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else {
                let type = res.type;
                let img =  res.data;
                let images = this.state.images;
                let newImages = [{type: type, data: img}, ...images];
                this.setState({
                    images: newImages,
                });
                this.saveByType({
                    images: newImages,
                }, this.type);
            }
        })
    };
    onRatingCommunication = (e) => {
        console.log(e);
    };
    onRatingHonesty = (e) => {
        console.log(e);
    };
    onRatingPunctuality = (e) => {
        console.log(e);
    };
    onChangeCommunicationDesc = (e) => {
        console.log(e);
    };
    onChangeHonestyDesc = (e) => {
        console.log(e);
    };
    onChangePunctualityDesc = (e)  => {
        console.log(e);
    };
    loadData = (actId, userId) => {

    };
}
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
FeedbackModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    user: PropTypes.object,
    act: PropTypes.object,
    onClose: PropTypes.func,
};

const styles = StyleSheet.create({
    modalContainer: {
        // ...
        flex: 1,
    },
    container: {
        flex: 1,
    },
    userContainer: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        borderRadius: 3,
        backgroundColor: "red",
    },
    userTitle: {
        fontWeight: "bold",
        fontSize: 18,
    },
    userSubtitle: {
        fontWeight: "700",
        color: "#9a9a9a",
    },

    feedbackContainer: {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 3,
        backgroundColor: "#fff",
    },


});
