import React from "react"
import {View, StyleSheet, TextInput, TouchableHighlight, ScrollView, StatusBar, TouchableWithoutFeedback} from 'react-native';
import PublishHeader from "./components/PublishHeader";
import NavigationUtil from "../../navigator/NavUtil";
import { connect } from "react-redux";
import {Button, Icon, Image} from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import Util from "../../common/util";
import Api from "../../api/Api";
import MenubarItem from "./components/menubarItem";
import DateTimePicker from "react-native-modal-datetime-picker";
import Activity from "../../actions/activity";
import LocalApi from "../../api/LocalApi";
import Model from "../../api/Model";
import {ConfirmModal} from "../../common/components/CustomModal";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modal";
import {WINDOW} from "../../common/constant/Constant";
import {CloseIcon, PlusIcon} from "../../common/components/Icons";

class PublishPage extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            type: "taxi",
            description: "",
            title: "",
            tags: [],
            images: [],
            endTimePickerVisible: false,
            specTimePickerVisible: false,
            saveModalVisible: false,
            saved: false,
            published: false,
            isImageViewerVisible: false,
            index: 0,
        }
    }

    componentDidMount(){

    }
    render() {
        this.type = this.props.navigation.getParam("type");
        if (!this.type) this.type = "taxi";
        let propsAct = this.buildAct(this.props.publishAct, this.type);
        let {title, description, images, endTime} = propsAct;
        let header = this.renderHeader();
        let detailInput = this.renderDetailInput(title, description);
        let imagePicker = this.renderImagePicker();
        let commonMenubar = this.renderCommonMenu(endTime);
        let specMenubar = this.renderSpecMenubar();
        let endTimePicker = this.renderEndTimePicker();
        let specTimePicker = this.renderSpecTimePicker();
        let saveModal = this.renderSaveModal();
        let imageViewer = this.renderImageViewer(images);

        let footer = this.renderFooter();
        return(
            <View style={styles.container}>
                {header}
                <ScrollView style={styles.mainContainer}>
                    {detailInput}
                    <View style={styles.imageListContainer}>
                        {
                            images.map((img, i) => {
                                return (
                                   <TouchableWithoutFeedback
                                        onPress={() => {this.setState({
                                            isImageViewerVisible: true,
                                            index: i,
                                        })}}
                                        key={i.toString()}
                                   >
                                       <View style={styles.imageContainer}>
                                           <Image
                                               style={styles.image}
                                               source={{uri: `data:${img.type};base64,${img.data}`}}
                                               resizeMode={"cover"}
                                           />
                                           <View style={styles.deleteImageIconContainer}>
                                               <CloseIcon
                                                   color={"#bfbfbf"}
                                                   onPress={() => {this.deleteImage(i)}}
                                                   iconStyle={styles.deleteImageIcon}
                                                   size={18}
                                               />
                                           </View>
                                       </View>
                                   </TouchableWithoutFeedback>
                                )
                            })
                        }
                        {imagePicker}
                    </View>
                    {commonMenubar}
                    {specMenubar}
                    {endTimePicker}
                    {specTimePicker}
                </ScrollView>
                {saveModal}
                {imageViewer}
                {footer}
            </View>
        )
    }
    renderHeader = () => {
        let title = (
                <Button
                title={"草稿箱"}
                type={"clear"}
                onPress={this.toPublishDraft}
                />
        );
        return (
            <PublishHeader
                style={styles.headerContainer}
                onClose={this.goBack}
                onPublish={this.publish}
                buttonTitle={"发布"}
                buttonType={"solid"}
                titleView={title}
                titleLayoutStyle={styles.headerTitle}
            />
        );
    };
    renderDetailInput = (title, description) => {
        return (
            <View>
                <TextInput
                    value={title}
                    onChangeText={this.handleTitleTextChange}
                    onBlur={this.handleTitleTextBlur}
                    autoFocus
                    placeholder={"输入标题让大家看到你..."}
                    placeholderTextColor={"#bfbfbf"}
                    style={styles.textInputTitle}
                />
                <TextInput
                    value={description}
                    onChangeText={this.handleBodyTextChange}
                    onBlur={this.handleBodyTextBlur}
                    placeholder={"想对大家说点什么..."}
                    placeholderTextColor={"#bfbfbf"}
                    returnKeyType={"done"}
                    textBreakStrategy={"highQuality"}
                    style={styles.textInputBody}
                    multiline={true}
                />
            </View>
        )
    };
    renderImagePicker = () => {
        let imagePicker =
            <TouchableHighlight
                onPress={this.showImagePicker}
            >
                <View style={styles.imagePickerContainer}>
                    <PlusIcon
                        color={"#bfbfbf"}
                        size={48}
                        containerStyle={styles.imagePickerIconContainer}
                    />
                </View>
            </TouchableHighlight>;
        return imagePicker;
    };
    renderImageViewer = (images) => {
        let imageViewList = [];
        let i = 0;
        for (let item of images) {
            imageViewList.push({
                url: `data:${item.type};base64,${item.data}`,
                width: WINDOW.width,
                height: WINDOW.height / 3,
                props: {
                    key: i.toString(),
                },
            });
            i++;
        }
        return (
            <Modal
                isVisible={this.state.isImageViewerVisible}
                style={{margin: 0}}
                useNativeDriver={true}
            >
                <ImageViewer
                    imageUrls={imageViewList}
                    index={this.state.index}
                    onSwipeDown={() => {this.setState({isImageViewerVisible: false})}}
                    enableSwipeDown={true}
                />
            </Modal>
        )
    };
    renderCommonMenu = (endTime) => {
        return (
            <MenubarItem
                onPress={this.handleClickEndTime}
                iconName={"endTime"}
                title={"加入截止时间"}
                rightTitle={endTime ? endTime : ""}
                active={Boolean(endTime && endTime !== "")}
            />
        );
    };
    renderSpecMenubar = () => {
        let type = this.type;
        let props = this.props.publishAct;
        let propsAct;
        switch(type) {
            case "taxi" : {
                propsAct = props.taxiAct;
                return (
                    <View>
                        <MenubarItem
                            onPress={this.showSpecTimePicker}
                            iconName={"depart"}
                            title={"出发时间"}
                            rightTitle={propsAct.departTime ? propsAct.departTime : ""}
                            active={Boolean(propsAct.departTime && propsAct.departTime !== "")}
                        />
                        <MenubarItem
                            onPress={this.handleClickOriginDest}
                            iconName={"originDest"}
                            title={propsAct.origin && propsAct.dest && propsAct.origin.title !== "" && propsAct.dest.title !== "" ?
                                propsAct.origin.title + "——>" + propsAct.dest.title : "出发、到达"}
                            active={Boolean(propsAct.origin && propsAct.dest && propsAct.origin.title !== "" && propsAct.dest.title !== "")}
                        />
                    </View>
                )
            }
            case "takeout": {
                propsAct = props.takeoutAct;
                return (
                    <View>
                        <MenubarItem
                            onPress={this.handleClickTakeoutStore}
                            iconName={"store"}
                            title={"外卖店铺"}
                            rightTitle={propsAct.store ? propsAct.store : ""}
                            active={Boolean(propsAct.store && propsAct.store !== "")}
                        />
                        <MenubarItem
                            onPress={this.showSpecTimePicker}
                            iconName={"takeoutTime"}
                            title={"下单时间"}
                            rightTitle={propsAct.orderTime ? propsAct.orderTime : ""}
                            active={Boolean(propsAct.orderTime && propsAct.orderTime !== "")}
                        />
                    </View>
                )
            }
            case "order": {
                propsAct = props.orderAct;
                return (
                    <View>
                        <MenubarItem
                            onPress={this.handleClickOrderStore}
                            iconName={"store"}
                            title={"下单店铺"}
                            rightTitle={propsAct.store ? propsAct.store : ""}
                            active={Boolean(propsAct.store && propsAct.store !== "")}
                        />
                    </View>
                )
            }
            case "other": {
                propsAct = props.otherAct;
                return (
                    <View>
                        <MenubarItem
                            onPress={this.showSpecTimePicker}
                            iconName={"activity"}
                            title={"活动时间"}
                            rightTitle={propsAct.activityTime ? propsAct.activityTime : ""}
                            active={Boolean(propsAct.activityTime && propsAct.activityTime !== "")}
                        />
                    </View>
                )
            }
        }
    };
    renderEndTimePicker = () => {
        return (
            <DateTimePicker
                isVisible={this.state.endTimePickerVisible}
                onConfirm={this.confirmEndTime}
                onCancel={this.cancelEndTime}
                mode={"datetime"}
                minimumDate={new Date()}
                is24Hour={true}
            />
        )
    };
    renderSpecTimePicker = () => {
        return (
            <DateTimePicker
                isVisible={this.state.specTimePickerVisible}
                onConfirm={this.confirmSpecTime}
                onCancel={this.cancelSpecTime}
                mode={"datetime"}
                minimumDate={new Date()}
                is24Hour={true}
            />
        )
    };
    renderSaveModal = () => {
        return (
            <ConfirmModal
                visible={this.state.saveModalVisible}
                title={"是否保存"}
                onCancel={this.handleCancelSave}
                onConfirm={this.handleConfirmSave}
            />
        )
    };

    renderFooter = () => {
        return null;
    };
    publish = () => {
        let publishAct = this.buildAct(this.props.publishAct, this.type);
        let data =
            Model.buildActivity(publishAct);

        Api.publishAct(this.props.currentUser.jwt, data)
            .then (act => {
                console.log(act);
                NavigationUtil.toPage({id: act.id}, "ActDetail");
            })
            .catch(err => {
                console.log(err);
            })
    };

    handleBodyTextChange = text => {
        this.setState({description: text});
        this.saveByType({description: text}, this.type);
    };
    handleBodyTextBlur = () => {
        let text = this.state.description;
        this.saveByType({description: text}, this.type);
    };
    handleTitleTextChange = text => {
        this.setState({title: text});
        this.saveByType({title: text}, this.type);
    };
    handleTitleTextBlur = () => {
        let title = this.state.title;
        this.saveByType({title: title}, this.type);
    };
    handleClickEndTime = () => {
        this.setState({
            endTimePickerVisible: true,
        })
    };
    confirmEndTime = (date) => {
        let dateString = Util.dateTimeToString(date);
        this.setState({endTime: dateString});
        this.saveByType({endTime: dateString}, this.type);
        this.setState({endTImePickerVisible: false});
    };
    cancelEndTime = () => {
        this.setState({
            endTimePickerVisible: false,
        })
    };
    handleClickOriginDest = () => {
        let origin = this.props.publishAct.taxiAct.origin;
        let dest = this.props.publishAct.taxiAct.dest;
        NavigationUtil.toPage({origin: origin, dest: dest}, "PublishActOriginDest")
    };
    handleClickTakeoutStore = () => {
        let store = this.props.publishAct.takeoutAct.store;
        NavigationUtil.toPage({type: "takeout", store: store}, "PublishActStore");
    };
    handleClickOrderStore = () => {
        let store = this.props.publishAct.orderAct.store;
        NavigationUtil.toPage({type: "order", store: store}, "PublishActStore");
    };
    // spec time picker handle
    showSpecTimePicker = () => {
        this.setState({
            specTimePickerVisible: true,
        })
    };
    confirmSpecTime = (date) => {
        let dateString = Util.dateTimeToString(date);
        switch(this.type) {
            case "takeout" : {
                this.setState({orderTime: dateString});
                this.props.saveTakeoutAct({orderTime: dateString});
                break;
            }
            case "taxi" : {
                this.setState({departTime: dateString});
                this.props.saveTaxiAct({departTime: dateString});
                break;
            }
            case "other" : {
                this.setState({activityTime: dateString});
                this.props.saveOtherAct({activityTime: dateString});
                break;
            }
        }
        this.cancelSpecTime();
    };
    cancelSpecTime = () => {
        this.setState({
            specTimePickerVisible: false,
        })
    };
    showImagePicker = () => {
        ImagePicker.showImagePicker(options, res => {
            console.log("response : ", res);

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
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
    saveByType = (data, type) => {
        switch(type) {
            case "taxi":
                this.props.saveTaxiAct(data);
                break;
            case "order":
                this.props.saveOrderAct(data);
                break;
            case "takeout":
                this.props.saveTakeoutAct(data);
                break;
            case "other":
                this.props.saveOtherAct(data);
                break;
            default:
                console.log(type);
        }
    };
    goBack = () => {
        let saved = this.state.saved;
        if (!saved) {
            this.setState({saveModalVisible: true});
        } else {
            NavigationUtil.back(this.props);
        }
    };
    toPublishDraft = () => {
        NavigationUtil.toPage(null, "PublishDraft");
    };
    buildAct = (publishAct, type) => {
        switch(type) {
            case "taxi":
                return publishAct.taxiAct;
            case "takeout":
                return publishAct.takeoutAct;
            case "order":
                return publishAct.orderAct;
            case "other":
                return publishAct.otherAct;
            default:
                console.log("invalid publish act type");
                return publishAct.taxiAct;
        }
    };
    handleConfirmSave = () => {
        this.setState({saveModalVisible: false});
        let item = this.buildAct(this.props.publishAct, this.type);
        LocalApi.savePublishDraft(item)
            .then(() => {
                NavigationUtil.toPage(null, "Home");
            })
            .catch(err => {
                console.log(err);
            })
    };
    handleCancelSave = () => {
        this.setState({saveModalVisible: false});
        NavigationUtil.toPage(null, "Home");
    };
    deleteImage = (i) => {
        this.setState(state => {
            let count = 0, list = [];
            for (let item of state.images) {
                if (count !== i) {
                    list.push(item);
                }
                count++;
            }
            this.saveByType({
                images: list,
            }, this.type);
            return {
                ...state,
                images: list,
            }
        })
    }
}

const options = {
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

const mapStateToProps = state => ({
    publishAct: state.publishAct,
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    saveTaxiAct: (data) => dispatch(Activity.saveTaxiAct(data)),
    saveTakeoutAct: (data) => dispatch(Activity.saveTakeoutAct(data)),
    saveOrderAct: (data) => dispatch(Activity.saveOrderAct(data)),
    saveOtherAct: (data) => dispatch(Activity.saveOtherAct(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PublishPage)

const imageContainerLen = WINDOW.width * 0.293;
const imageLen = WINDOW.width * 0.270;
const distance = imageContainerLen - imageLen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    headerContainer: {
        marginTop: 0,
    },
    headerTitle: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginRight: 14,
        flex: 1,
    },
    mainContainer: {
        backgroundColor: "#fff",
    },
    textInputTitle: {
        fontWeight: "bold",
        fontSize: 20,
        paddingLeft: "6%",
        paddingRight: "6%",
    },
    textInputBody: {
        paddingLeft: "6%",
        paddingRight: "6%",
        height: 100,
        fontSize: 18,
        color: "#3a3a3a",
    },
    imagePickerContainer: {
        width: imageContainerLen,
        height: imageContainerLen,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    imagePickerIconContainer: {
        width: imageLen,
        height: imageLen,
        backgroundColor: "#eeeeee",
        justifyContent: "center",
        alignItems: "center",
    },

    imageListContainer: {
        flexDirection: "row",
        paddingLeft: "6%",
        paddingRight:  "6%",
        flexWrap: "wrap",
        paddingBottom: imageContainerLen,
    },
    imageContainer: {
        width: imageContainerLen,
        height: imageContainerLen,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    image: {
        width: imageLen,
        height: imageLen,
    },
    deleteImageIcon: {
        margin: 0,
    },
    deleteImageIconContainer: {
        position: "absolute",
        borderRadius: 100,
        top: distance - 12,
        right: distance - 12,
        backgroundColor: "rgba(221,221,221,0.8)",
    },
    menuContainer: {
        marginRight: "2%",
        marginLeft: "2%",
    },
});
