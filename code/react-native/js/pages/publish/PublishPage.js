import React from "react"
import { View, StyleSheet, TextInput, TouchableHighlight, ScrollView} from 'react-native';
import PublishHeader from "./components/PublishHeader";
import NavigationUtil from "../../navigator/NavUtil";
import {setPublishActDetail} from "../../actions/activity";
import { connect } from "react-redux";
import {Icon, Image} from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import Util from "../../common/util";
import Api from "../../api/Api";
import MenubarItem from "./components/menubarItem";

class PublishPage extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            bodyText: "",
            images: [],
        }
    }

    componentDidMount(){
        if (this.props.images && this.props.images.length > 0) {
            this.setState({images: this.props.images});
        }
        if (this.props.description && this.props.description !== "") {
            this.setState({bodyText: this.props.description});
        }
    }

    renderHeader = () => {
        return (
            <PublishHeader
                style={styles.headerContainer}
                onClose={() => {NavigationUtil.back(this.props)}}
                onPublish={this.publish}
                buttonTitle={"发布"}
            />
        );
    };
    renderDetailInput = () => {
        return (
            <View style={{backgroundColor: "green"}}>
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
                    value={this.state.bodyText}
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
        return (
            <MenubarItem
            />
        );
    };
    renderSpecMenubar = () => {}
    render() {
        let header = this.renderHeader();
        let detailInput = this.renderDetailInput();
        let imagePicker = this.renderImagePicker();
        let commonMenubar = this.renderCommonMenu();
        let specMenubar = this.renderSpecMenubar();
        let imageList = this.state.images;

        return(
            <View style={styles.container}>
                {header}
                <ScrollView style={styles.mainContainer}>
                    {detailInput}
                    <View style={styles.imageListContainer}>
                        {
                            imageList.map((imgUri, i) => {
                                return (
                                    <Image
                                        key={i}
                                        containerStyle={styles.imageContainer}
                                        style={styles.image}
                                        source={{uri: imgUri}}
                                        resizeMode={"cover"}
                                    />
                                )
                            })
                        }
                        {imagePicker}
                    </View>
                    <View style={styles.menuContainer}>
                        {commonMenubar}
                        {specMenubar}
                    </View>
                </ScrollView>
            </View>
        )
    }

    publish = () => {
        let publishAct = this.props.publishAct;

        let images = [...publishAct.images];
        images.map((img, i) => {
            images[i] = img.substring(img.indexOf(","));
        });
        let data = {
            type: publishAct.type,
            end_time: publishAct.endTime,
            create_time: Util.dateTimeToString(new Date()),
            title: publishAct.title,
            description: publishAct.description,
            tag: publishAct.tags,
            images: images,
        };
        if (data.type === "taxi") {

            data.depart_time = publishAct.departTime;
            data.origin = publishAct.origin;
            data.destination = publishAct.dest;
        } else if (data.type === "order") {

            data.store = publishAct.string;
        } else if (data.type === "takeout") {

            data.order_time = publishAct.orderTime;
            data.store = publishAct.store;
        } else {
            // type === 'other'
            data.activity_time = publishAct.activityTime;
        }
        console.log(data);
        Api.publishAct(this.props.jwt, data)
            .then (res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    };

    handleBodyTextChange = text => {
        this.setState({bodyText: text});
        if (Number(text.length) % 10 === 0 ) {
            this.props.setPublishActDetail(this.props.images, text);
        }
    };
    handleBodyTextBlur = () => {
        let text = this.state.bodyText;
        this.props.setPublishActDetail(this.props.images, text);
        console.log(text);
    };
    handleTitleTextChange = text => {
        this.setState({title: text});
    };
    handleTitleTextBlur = text => {
        // ...
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
                let imgUri =  `data:${type};base64,` + res.data;
                let images = this.state.images;
                this.setState({
                    images: [imgUri, ...images],
                });
                this.props.setPublishActDetail(this.state.images, this.props.description);
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
    quality: 0.3,
};

const mapStateToProps = state => ({
    description: state.publishAct.description,
    images: state.publishAct.images,
    publishAct: state.publishAct,
    jwt: state.user.jwt,
});
const mapDispatchToProps = dispatch => ({
    setPublishActDetail: (images, description) => dispatch(setPublishActDetail(images, description)),
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
        minHeight: "100%",
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
        height: 140,
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

    },
});
