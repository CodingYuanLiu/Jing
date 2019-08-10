import React from "react";
import {View, StyleSheet, FlatList, TouchableNativeFeedback, Text, TextInput,RefreshControl} from "react-native";
import Modal from "react-native-modal";
import {ArrowLeftIcon, LeftUpArrowIcon, LocationIcon} from "../../../common/components/Icons";
import AMapApi from "../../../api/AMapApi";
import {PropTypes} from "prop-types";

export default class OriginDestModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            inputContent: "",
            data: [],
            isLoading: false,
        }
    }

    render() {
        let header = this.renderHeader();
        let inputTips = this.renderInputTips();
        return (
            <Modal
                isVisible={this.props.isVisible}
                backdropColor={"#eee"}
                backdropOpacity={0.7}
                style={styles.container}
                propagateSwipe={true}
                useNativeDriver={true}
            >
                <View style={styles.container}>
                    {header}
                    {inputTips}
                </View>
            </Modal>
        )
    };

    renderHeader = () => {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#5a5a5a"}
                size={24}
                onPress={this.props.closeModal}
                style={styles.headerInputIcon}
            />
        );
        let input = (
            <View style={styles.headerInputContainer}>
                <TextInput
                    placeholder={"输入地点"}
                    value={this.state.inputContent}
                    onChangeText={(text) => {this.onChangeInputContent(text); this.loadData(text)}}
                    onSubmitEditing={() => {this.loadData(this.state.inputContent)}}
                    returnKeyType={"search"}
                />
            </View>
        );
        return (
            <View style={styles.headerContainer}>
                {leftIcon}
                {input}
            </View>
        )
    };
    renderInputTips = () => {
        return (
            <View style={styles.inputTipsContainer}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                        />
                    }
                />
            </View>
        )
    };
    renderItem = ({item}) => {
        let leftIcon = (
            <LocationIcon
                size={20}
                color={"#9a9a9a"}
                style={styles.itemLeftIcon}
            />
        );
        let rightIcon = (
            <LeftUpArrowIcon
                size={20}
                color={"#9a9a9a"}
                style={styles.itemRightIcon}
            />
        );
        let body = this.renderItemBody(item);
        item.title = item.name;
        return (
            <TouchableNativeFeedback
                style={{flex: 1,}}
                onPress={() => {this.onPress(item)}}
            >
                <View style={styles.itemContainer}>
                    {leftIcon}
                    {body}
                    {rightIcon}
                </View>
            </TouchableNativeFeedback>
        )
    };
    renderItemBody = (item) => {
        let keyword = this.state.inputContent;
        let keywordIndex = item.name.indexOf(keyword);
        let keywordLength = keyword.length;
        let nameLeft = item.name.substring(0, keywordIndex);
        let nameRight = item.name.substring(keywordIndex + keywordLength);

        let address = item.address === "" ? item.district : `${item.district} - ${item.address}`;
        return (
            <View style={styles.itemBody}>
                <Text style={styles.itemBodyTitle}>{nameLeft}<Text style={{color: "#0084ff"}}>{keyword}</Text>{nameRight}</Text>
                <Text style={styles.itemBodyText}>{address}</Text>
            </View>
        )
    };
    onChangeInputContent = (text) => {
        this.setState({
            inputContent: text,
        });
    };
    loadData = (text) => {
        AMapApi.getInputTips(text, "上海")
            .then(data => {
                console.log(data);
                let tips = data.tips;
                if (Array.isArray(tips[0].id)) {
                    tips.splice(0, 1);
                }
                this.setState({data: tips})
            })
            .catch(err => {
                console.log(err);
            })
    };
    onPress = (item) => {
        let onPress = this.props.isOrigin ? this.props.confirmOrigin : this.props.confirmDest;
        onPress(item);
        this.props.closeModal();
        console.log(this.props.isVisible);
    }
}

OriginDestModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    confirmDest: PropTypes.func,
    confirmOrigin: PropTypes.func,
    isOrigin: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "transparent",
        padding: 0,
        margin: 0,
    },
    headerContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 2,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    headerInputContainer: {
        flex: 1,
    },
    headerInputIcon: {
        marginLeft: 15,
        marginRight: 15,
    },
    inputTipsContainer: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 2,
        backgroundColor: "#fff",
        elevation: 2,
    },
    itemContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        height: 63,
    },
    itemLeftIcon: {
        marginLeft: 7,
        marginRight: 7,
    },
    itemRightIcon: {
        marginLeft: 7,
        marginRight: 7,
    },
    itemBody: {
        flex: 1,
        borderColor: "#f1f1f1",
        borderBottomWidth: 0.5,
    },
    itemBodyTitle: {
        fontSize: 14,
        color: "#4a4a4a",
    },
    itemBodyText: {
        fontSize: 12,
        color: "#7a7a7a",
        marginBottom: 12,
        marginTop: 6,
    },
});
