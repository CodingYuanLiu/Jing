import React from "react"
import { View, StyleSheet, TextInput, TouchableHighlight, ScrollView} from 'react-native';
import PublishHeader from "./components/PublishHeader";
import NavigationUtil from "../../navigator/NavUtil";
import { connect } from "react-redux";
import {Icon, Image} from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import Util from "../../common/util";
import Api from "../../api/Api";
import MenubarItem from "./components/menubarItem";
import DateTimePicker from "react-native-modal-datetime-picker";
import Activity from "../../actions/activity";

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
            saved: false,
            published: false,
        }
    }

    componentDidMount(){
        this.type = this.props.navigation.getParam("type");
        console.log(this.props.navigation.state);
        this.init(this.type);
        console.log(this.state);
        console.log(this.props);
    }

    render() {
        let header = this.renderHeader();
        let detailInput = this.renderDetailInput();
        let imagePicker = this.renderImagePicker();
        let commonMenubar = this.renderCommonMenu();
        let specMenubar = this.renderSpecMenubar();
        let endTimePicker = this.renderEndTimePicker();
        let specTimePicker = this.renderSpecTimePicker();
        let imageList = this.state.images;
        return(
            <View style={styles.container}>
                {header}
                <ScrollView style={styles.mainContainer}>
                    {detailInput}
                    <View style={styles.imageListContainer}>
                        {
                            imageList.map((img, i) => {
                                return (
                                    <Image
                                        key={i}
                                        containerStyle={styles.imageContainer}
                                        style={styles.image}
                                        source={{uri: `data:${img.type};base64,${img.data}`}}
                                        resizeMode={"cover"}
                                    />
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
            </View>
        )
    }
    renderHeader = () => {
        return (
            <PublishHeader
                style={styles.headerContainer}
                onClose={this.goBack}
                onPublish={this.publish}
                buttonTitle={"发布"}
                buttonType={"solid"}
            />
        );
    };
    renderDetailInput = () => {
        return (
            <View>
                <TextInput
                    value={this.state.title}
                    onChangeText={this.handleTitleTextChange}
                    onBlur={this.handleTitleTextBlur}
                    autoFocus
                    placeholder={"输入标题让大家看到你..."}
                    placeholderTextColor={"#bfbfbf"}
                    style={styles.textInputTitle}
                />
                <TextInput
                    value={this.state.description}
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
                    <Icon
                        type={"material-community"}
                        name={"plus"}
                        color={"#bfbfbf"}
                        size={48}
                        containerStyle={styles.imagePickerIconContainer}
                    />
                </View>
            </TouchableHighlight>;
        return imagePicker;
    };

    renderCommonMenu = () => {
        let endTime = this.state.endTime;
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
        let type = this.state.type;
        let act = this.state;
        switch(type) {
            case "taxi" : {
                return (
                    <View>
                        <MenubarItem
                            onPress={this.showSpecTimePicker}
                            iconName={"depart"}
                            title={"出发时间"}
                            rightTitle={act.departTime ? act.departTime : ""}
                            active={Boolean(act.departTime && act.departTime !== "")}
                        />
                        <MenubarItem
                            onPress={this.handleClickOriginDest}
                            iconName={"originDest"}
                            title={act.origin && act.dest && act.origin !== "" && act.dest !== "" ?
                                act.origin + "——>" + act.dest : "出发、到达"}
                            active={Boolean(act.origin && act.dest && act.origin !== "" && act.dest !== "")}
                        />
                    </View>
                )
            }
            case "takeout": {
                return (
                    <View>
                        <MenubarItem
                            onPress={this.handleClickTakeoutStore}
                            iconName={"store"}
                            title={"外卖店铺"}
                            rightTitle={act.store ? act.store : ""}
                            active={Boolean(act.store && act.store !== "")}
                        />
                        <MenubarItem
                            onPress={this.showSpecTimePicker}
                            iconName={"takeoutTime"}
                            title={"下单时间"}
                            rightTitle={act.orderTime ? act.orderTime : ""}
                            active={Boolean(act.orderTime && act.orderTime !== "")}
                        />
                    </View>
                )
            }
            case "order": {
                return (
                    <View>
                        <MenubarItem
                            onPress={this.handleClickOrderStore}
                            iconName={"store"}
                            title={"下单店铺"}
                            rightTitle={act.store ? act.store : ""}
                            active={Boolean(act.store && act.store !== "")}
                        />
                    </View>
                )
            }
            case "other": {
                return (
                    <View>
                        <MenubarItem
                            onPress={this.showSpecTimePicker}
                            iconName={"activity"}
                            title={"活动时间"}
                            rightTitle={act.activityTime ? act.activityTime : ""}
                            active={Boolean(act.activityTime && act.activityTime !== "")}
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
    publish = () => {
        let publishAct = this.props.publishAct;

        let images = new Array();
        for (let img of publishAct.images) {
            images.push(img.data);
        }
        let data = {
            type: publishAct.type,
            end_time: publishAct.endTime,
            create_time: Util.dateTimeToString(new Date()),
            title: publishAct.title,
            description: publishAct.description,
            tag: publishAct.tags,
            images: images,
            max_member: 5,
        };
        if (data.type === "taxi") {

            data.depart_time = publishAct.departTime;
            data.origin = {
                title: publishAct.origin,
            };
            data.destination = {
                title: publishAct.dest,
            };
        } else if (data.type === "order") {
            data.store = publishAct.store;
        } else if (data.type === "takeout") {

            data.order_time = publishAct.orderTime;
            data.store = publishAct.store;
        } else {
            // type === 'other'
            data.activity_time = publishAct.activityTime;
        }
        console.log(data);

        Api.publishAct(this.props.user.jwt, data)
            .then (res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    };

    handleBodyTextChange = text => {
        this.setState({description: text});
        if (Number(text.length) % 10 === 0 ) {
            this.saveByType({description: text}, this.type);
        }
    };
    handleBodyTextBlur = () => {
        let text = this.state.description;
        this.saveByType({description: text}, this.type);
    };
    handleTitleTextChange = text => {
        this.setState({title: text});
    };
    handleTitleTextBlur = () => {
        // ...
        this.saveByType({title: this.state.title}, this.type);
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
    };
    cancelEndTime = () => {
        this.setState({
            endTimePickerVisible: false,
        })
    };
    handleClickOriginDest = () => {
        NavigationUtil.toPage(null, "PublishTaxiSpec")
    };
    handleClickTakeoutStore = () => {
        NavigationUtil.toPage(null, "PublishTakeoutSpec");
    };
    handleClickOrderStore = () => {
        NavigationUtil.toPage(null, "PublishOrderSpec");
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
                this.setState({
                    images: [{type: type, data: img}, ...images],
                });
                this.saveByType({
                    images: images
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
                console.warn("type is invalid");
        }
    };
    goBack = () => {
        let saved = this.state.saved;
        if (!saved) {
            //
            NavigationUtil.back(this.props);
        } else {
            NavigationUtil.back(this.props);
        }
    };
    init = (type) => {
        let act;
        if (type === "taxi")
            act = this.props.publishAct.taxiAct;
        else if (type === "order")
            act = this.props.publishAct.orderAct;
        else if (type === "takeout")
            act = this.props.publishAct.takeoutAct;
        else if (type === "other") {
            act = this.props.publishAct.otherAct;
        } else {
            console.warn("type is invalid, ", type);
        }
        this.setState({
            type: this.type,
            title: act.title,
            description: act.description,
            images: act.images,
            tags: act.tags,
            endTime: act.endTime,
        });
        switch (this.type) {
            case "taxi":
                this.setState({
                    departTime: act.departTime,
                    origin: act.origin,
                    dest: act.dest,
                });
                break;
            case "takeout" :
                this.setState({
                    store: act.store,
                    orderTime: act.orderTime,
                });
                break;
            case "order" :
                this.setState({
                    store: act.store,
                });
                break;
            case "other":
                this.setState({
                    activityTime: act.activityTime,
                });
                break;
        }
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

const imageContainerLen = Util.getVerticalWindowDimension().width * 0.293;
const imageLen = Util.getVerticalWindowDimension().width * 0.270;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    headerContainer: {
        marginTop: 0,
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
        minHeight: imageContainerLen * 2,
    },
    imageContainer: {
        width: imageContainerLen,
        height: imageContainerLen,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: imageLen,
        height: imageLen,
    },
    menuContainer: {
        marginRight: "2%",
        marginLeft: "2%",
    },

});
