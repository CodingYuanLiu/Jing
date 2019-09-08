import React from "react"
import {View, StyleSheet, TextInput, TouchableHighlight, ScrollView, StatusBar, TouchableWithoutFeedback, Text, FlatList, Keyboard, RefreshControl} from 'react-native';
import PublishHeader from "./components/PublishHeader";
import NavigationUtil from "../../navigator/NavUtil";
import { connect } from "react-redux";
import {Button, Icon, Image, ListItem, SearchBar} from "react-native-elements";
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
import {PUBLISH_ACTION, WINDOW} from "../../common/constant/Constant";
import {CaretDownIcon, CaretUpIcon, CloseIcon, PlusIcon, SearchIcon} from "../../common/components/Icons";
import ZhihuApi from "../../api/ZhihuApi";
import currentUser from "../../reducers/currentUser";


let tagId = 1;
class PublishPage extends React.PureComponent{
    constructor(props) {
        super(props);
        this.type = this.props.navigation.getParam("type");
        this.action = this.props.navigation.getParam("action");
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
            isFooterModalVisible: false,
            tagInput: "",
            tagCandidates: [],
            remoteAddTags: [],
            footerModalHeight: WINDOW.height / 5 * 4,
            loadingTagCandidates: false,
            isLoading: false,
        };
    }
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                this.setState({footerModalHeight: this.state.footerModalHeight - e.endCoordinates.height});
            }
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                this.setState({footerModalHeight: WINDOW.height / 5 * 4})
            }
        );
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    render() {
        this.type = this.props.navigation.getParam("type");
        let propsAct = this.getActByType(this.props.publishAct, this.type);
        let {title, description, images, endTime, tags, maxMember} = propsAct;
        let header = this.renderHeader();
        let detailInput = this.renderDetailInput(title, description);
        let imagePicker = this.renderImagePicker();
        let commonMenubar = this.renderCommonMenu(endTime);
        let specMenubar = this.renderSpecMenubar();
        let endTimePicker = this.renderEndTimePicker();
        let specTimePicker = this.renderSpecTimePicker();
        let saveModal = this.renderSaveModal();
        let imageViewer = this.renderImageViewer(images);

        let footer = this.renderFooter(tags, maxMember);
        let footerTagInputModal = this.renderFooterTagInputModal(tags);
        return(
            <View style={{flex: 1,}}>
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
                        {footer}
                    </ScrollView>
                    {saveModal}
                    {imageViewer}
                </View>
                {footerTagInputModal}
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
                onPublish={this.action === PUBLISH_ACTION.PUBLISH ? this.publish : this.modify}
                buttonTitle={this.action === PUBLISH_ACTION.PUBLISH ? "发布" : "修改" }
                buttonProps={{
                    loading: this.state.isLoading,
                    type: "solid",
                }}
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

    renderFooter = (tags, maxMember) => {
        return (
            <View style={styles.footerContainer}>
                <View
                    style={styles.footerButtonLine}
                >
                    <Button
                        type={"clear"}
                        icon={
                            <PlusIcon
                                size={18}
                                color={"#0084ff"}
                                iconStyle={{fontWeight: "bold"}}
                            />
                        }
                        title={`标签(${tags.length} / 5)`}
                        titleStyle={styles.footerButtonTitle}
                        containerStyle={{padding: 0, margin: 0,}}
                        buttonStyle={{padding: 0, margin: 0}}
                        onPress={() => {this.setState({isFooterModalVisible: true})}}
                    />
                    <View
                        style={styles.maxMemberPicker}
                    >
                        <Text
                            style={{color: "#0084ff", fontSize: 14, marginRight: 5}}
                        >成员上限</Text>
                        <TextInput
                            style={
                                styles.maxMemberPickerInput
                            }
                            value={`${maxMember}`}
                            keyboardType={"numeric"}
                            onChange={({nativeEvent}) => {
                                let {text} = nativeEvent;
                                if (/^\d+$|^$/.test(text)) {
                                    this.saveByType({maxMember: Number(text)}, this.type);
                                }
                            }}
                        />
                        <CaretUpIcon
                            color={"#0084ff"}
                            onPress={() => {
                                let maxMemberCopy = maxMember;
                                maxMemberCopy++;
                                this.saveByType({maxMember: maxMemberCopy}, this.type);
                            }}
                            style={{marginLeft: 10, marginRight:10}}
                        />
                        <CaretDownIcon
                            color={"#0084ff"}
                            onPress={() => {
                                let maxMemberCopy = maxMember;
                                maxMemberCopy--;
                                this.saveByType({maxMember: maxMemberCopy}, this.type);
                            }}
                            style={{marginRight:10}}
                        />
                    </View>
                </View>
                <View
                    style={{flex: 1, flexDirection: "row", flexWrap: "wrap", marginTop: 10,
                    marginBottom: 20}}
                >
                    {
                        tags.map((item, i) => {
                            return <View
                                key={i.toString()}
                            >{this.renderTag(item, i)}</View>
                        })
                    }
                </View>
            </View>
        );
    };
    renderTag = (item) => {
        let deleteIcon = item.canDelete ?
            <CloseIcon
                color={"#0084ff"}
                size={12}
                onPress={() => {this.deleteTag(item)}}
            />: null;
        return  (
            <View
                style={styles.tagContainer}
            >
                <Text
                    style={styles.tagTitle}
                >
                    {item.title}
                </Text>
                {
                    deleteIcon
                }
            </View>
        )
    };
    renderFooterTagInputModal = (tags) => {
        let rightButton=
        <Button
            type={"clear"}
            title={"完成"}
            titleStyle={{fontWeight: "bold", fontSize: 18,}}
            onPress={this.hideFooterModal}
            containerStyle={styles.footerModalRightButtonContainer}
        />;
        let header =
            <View
                style = {styles.footerModalHeaderContainer}
            >
            <Text
                style={styles.footerModalHeaderTitle}
            >
                添加标签
            </Text>
            {rightButton}
        </View>;
        let tagInputPrompt =
            tags.length === 0 ? "至少添加一个标签" :
                tags.length === 5 ? "已达到标签添加上限" :
                `还可以添加(${tags.length} / 5)个标签`;
        let data = this.state.tagCandidates;
        return (
            <Modal
                isVisible={this.state.isFooterModalVisible}
                style={{margin: 0, position: "absolute", bottom: 0, height: WINDOW.height, width: WINDOW.width}}
                useNativeDriver={true}
                onBackdropPress={this.hideFooterModal}
                propagateSwipe={true}
                avoidKeyboard={false}
            >
                <View style={[styles.footerModalContainer, {height: this.state.footerModalHeight}]}>
                    {header}
                    <SearchBar
                        searchIcon={
                            <SearchIcon
                                color={"#afafaf"}
                            />
                        }
                        containerStyle={{backgroundColor: "transparent", borderTopWidth: 0, borderBottomWidth: 0}}
                        inputContainerStyle={styles.footerModalSearchBar}
                        lightTheme={true}
                        placeholder={"搜索标签"}
                        value={this.state.tagInput}
                        onChangeText={this.handleChangeTagInput}

                    />
                    <Text
                        style={styles.tagInputPromptTitle}
                    >{tagInputPrompt}</Text>
                    <View
                        style={{
                            paddingRight: 15,
                            paddingLeft: 15,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginBottom: 20,
                        }}
                    >
                        {
                            tags.map((item) => {
                                return <View
                                    key={item.id}
                                >
                                    {this.renderTag(item)}
                                </View>;
                            })
                        }
                    </View>
                    <FlatList
                        data={data}
                        renderItem={this.renderTagCandidate}
                        keyExtractor={(item,i) => {
                            return Array.isArray(item) ? item[2] : i.toString()
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.loadingTagCandidates}
                                onRefresh={this.getTagCandidates}
                                title={"加载中..."}
                                titleColor={"#0084ff"}
                                colors={["#0084ff"]}
                                tintColor={"#0084ff"}
                            />
                        }
                    />
                </View>
            </Modal>
        )
    };
    renderTagCandidate = ({item}) => {
        return  (
            <ListItem
                leftAvatar={
                    <Image
                        source={{uri: item[3]}}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 3,
                        }}
                    />
                }
                title={item[1]}
                titleStyle={{fontWeight: "bold", fontSize: 18}}
                rightElement={
                    <Button
                        title={"添加"}
                        titleStyle={{fontSize: 14}}
                        buttonStyle={{
                            backgroundColor: "#0084ff",
                            width: 64,
                            padding: 0,
                            paddingTop: 6,
                            paddingBottom: 6,
                        }}
                        onPress={() => {this.addTag({
                            title: item[1],
                            image: item[3],
                            id: item[2],
                            canDelete: true,
                        })}}
                    />
                }
            />
        )
    };
    modify = () => {
        // ...
        this.setState({isLoading: true});
        let publishAct = this.getActByType(this.props.publishAct, this.type);
        let data = Model.buildActivity(publishAct);
        let {currentUser} = this.props;
        Api.modifyAct(data, currentUser.jwt)
            .then(act => {
                this.setState({isLoading: false});
                NavigationUtil.toPage({id: publishAct.id}, "ActDetail");
            })
            .catch(err => {
                console.log(err);
            })
    };
    publish = () => {
        this.setState({isLoading: true});
        let publishAct = this.getActByType(this.props.publishAct, this.type);
        let data =
            Model.buildActivity(publishAct);
        let {currentUser} = this.props;
        Api.publishAct(data, this.props.currentUser.jwt)
            .then (act => {
                Api.addTag({
                    tags: this.state.remoteAddTags.map(item => item.title)
                }, currentUser.jwt)
                    .then(data => {
                        console.log(data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.setState({isLoading: false});
                        NavigationUtil.toPage({id: act.id}, "ActDetail");
                    })
            })
            .catch(err => {
                console.log(err);
            })
    };
    handleTitleTextChange = text => {
        this.setState({title: text});
        this.saveByType({title: text}, this.type);
        this.autoGetTag(text, this.state.description);
    };
    handleTitleTextBlur = () => {
        let title = this.state.title;
        this.saveByType({title: title}, this.type);
    };
    handleBodyTextChange = text => {
        this.setState({description: text});
        this.saveByType({description: text}, this.type);
        this.autoGetTag(this.state.title, text);
    };
    handleBodyTextBlur = () => {
        let text = this.state.description;
        this.saveByType({description: text}, this.type);
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
    handleChangeTagInput = (text) => {
        this.setState({tagInput: text});
        this.getTagCandidates(text);
    };
    showImagePicker = () => {
        ImagePicker.showImagePicker(options, res => {
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
    hideFooterModal = () => {
        this.setState({
            isFooterModalVisible: false,
            tagCandidates: [],
        });
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
    getActByType = (publishAct, type) => {
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
        let item = this.getActByType(this.props.publishAct, this.type);

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
    };
    autoGetTag = (title, description) => {
        let {currentUser} = this.props;
        Api.getTag(
            {
                title: title,
                description: description
            },
                currentUser.jwt,
            )
            .then(data => {
                let list = [];
                for (let item of data.tags) {
                    list.push({
                        title: item,
                        canDelete: false,
                        id: (tagId++).toString(),
                    })
                }
                this.setState({tags: list});
                this.saveByType({
                    tags: list,
                }, this.type);
            })
            .catch(err => {
                console.log(err);
            })
    };
    getTagCandidates = (text) => {
        this.setState({
            loadingTagCandidates: true,
        });
        let keyword = text ? text : this.state.tagInput;
        ZhihuApi.getInputTips(keyword)
            .then(data => {
                console.log(data);
                let list = data[0].filter(item => {
                    return Array.isArray(item) && item.length >= 7;
                });
                this.setState({
                    tagCandidates: list,
                });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({
                    loadingTagCandidates: false,
                })
            })
    };
    addTag = (tag) => {
        if (this.state.tags.length >= 5) {
            return ;
        }
        console.log(tag);
        let tags = [
            ...this.state.tags,
            tag,
        ];
        let list = [];
        for(let item of this.state.tagCandidates) {
            if (tag.id !== item[2]) {
                list.push(item);
            }
        }
        this.setState({
            tags: tags,
            tagCandidates: list,
            remoteAddTags: [...this.state.remoteAddTags, tag],
        });
        this.saveByType({
            tags: tags,
        }, this.type);

    };
    deleteTag = (item) => {
        if (!item.canDelete) return;
        console.log(item);
        let list = [], candidates = [];
        let {state} = this;
        for (let tag of state.tags) {
            if (tag.id !== item.id) {
                list.push(tag);
            }
        }
        for (let tag of state.remoteAddTags) {
            if (tag.id !== item.id) {
                candidates.push(tag);
            }
        }

        this.setState( {
                tags: list,
                tagCandidates: [["topic", item.title, item.id, item.image], ...state.tagCandidates],
                remoteAddTag: candidates,
        });
        this.saveByType({
            tags: list,
        }, this.type);
    };
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

    footerContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
    },
    footerButtonLine: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
    },
    footerButtonTitle: {
        fontSize: 14,
    },
    maxMemberPicker: {
        flexDirection: "row",
        alignItems: "center",
    },
    maxMemberPickerInput: {
        fontSize: 14,
        color: "#0084ff",
        backgroundColor: "#eee",
        borderRadius: 50,
        textAlign: "center",
        height: 32,
        lineHeight: 32,
        padding: 0,
        minWidth: 36,
    },
    tagContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ebfafa",
        borderRadius: 100,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        margin: 3,

    },
    tagTitle: {
        color: "#0084ff",
        fontSize: 14,
        marginRight: 2,
    },
    footerModalContainer: {
        position: "absolute",
        width: WINDOW.width,
        bottom: 0,
        backgroundColor: "#fff",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    footerModalHeaderContainer: {
        backgroundColor: "transparent",
        height: 40,
        marginBottom: 20,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    footerModalHeaderTitle: {
        fontWeight: "bold",
        fontSize: 18,
    },
    footerModalRightButtonContainer: {
        position: "absolute",
        right: 15,
    },
    footerModalSearchBar: {
        borderRadius: 8,
        backgroundColor: "#eee",
        marginLeft: 6,
        marginRight: 6,
        height: 36,
        alignItems: "center",
    },
    tagInputPromptTitle: {
        fontSize: 14,
        color: "#bfbfbf",
        marginLeft: 15,
        marginBottom: 20,
    },
});
