import React from "react";
import { View, ScrollView, TextInput, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import HeaderBar from "../../../common/components/HeaderBar";
import {ArrowLeftIcon} from "../../../common/components/Icons";
import {Button} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";
import Constant from "../../../common/constant/Constant";


const PLACEHOLDER = "输入楼栋　房间号,　例如 东19　104";
export default class DormitoryPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dormitory: "",
            promptData: [],
        }
    }

    componentDidMount() {
        this.handleDormitoryChange = this.props.navigation.getParam("handleDormitoryChange");
        this.setState({dormitory: this.props.navigation.getParam("dormitory")});
    }

    render() {
        if (!this.handleDormitoryChange) {
            this.handleDormitoryChange = () => {};
        }
        let header = this.renderHeader();

        let promptData = this.state.promptData;
        if (!promptData) {
            promptData = [];
        }

        let inputView = this.renderInputView();
        let promptDataView = this.renderPromptDataView(promptData);
        return (
            <View style={{flex: 1,}}>
                {header}
                <View style={styles.container}>

                    {inputView}
                    {promptDataView}
                </View>
            </View>
        )
    };
    renderHeader = () => {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#7a7a7a"}
                onPress={this.goBack}
            />
        );
        let rightButton = (
            <Button
                type={"clear"}
                onPress={this.saveAndGoBack}
                title={"确定"}
                touchableComponent={TouchableWithoutFeedback}
            />
        );
        return (
            <HeaderBar
                leftButton={leftIcon}
                rightButton={rightButton}
                title={"添加住宿信息"}
                titleStyle={styles.headerTitleText}
                titleLayoutStyle={styles.headerTitleContainer}
                style={styles.headerContainer}
            />
        )
    };
    renderPromptDataView = (promptData) => {
        if (promptData.length === 0) {
            return (
                <View style={styles.emptyPromptContainer}>
                    <Text
                        style={styles.emptyPromptPlaceholder}
                    >{PLACEHOLDER}</Text>
                </View>
            )
        }
        return (
            <ScrollView>
                {promptData.map((item, i) => {
                    return (
                        <View style={styles.promptItemContainer}>
                            <Text style={styles.promptItemText}>
                                {item}
                            </Text>
                        </View>
                    )
                })}
            </ScrollView>
        )
    };
    renderInputView = () => {
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputNormal}
                    value={this.state.dormitory}
                    onChangeText={this.setDormitoryText}
                />
            </View>
        )
    };
    saveAndGoBack = () => {
        let handleDormitoryChange = this.props.navigation.getParam("handleDormitoryChange")
        handleDormitoryChange(this.state.dormitory);
        NavigationUtil.back(this.props);
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    };
    setDormitoryText = (text) => {
        this.setState({dormitory: text});
        this.loadData(text);
    };
    loadData = (text) => {
        let data = Constant.DORMITORIES.filter(item => {
            return item.indexOf(text) !== -1;
        });
        this.setState({
            promptData: data,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingLeft:　12,
        paddingRight: 12,
    },
    // header style
    headerContainer: {
        elevation: 4,
        backgroundColor: "#fff",
    },
    headerTitleContainer: {
        alignItems: "flex-start",
        marginLeft: 20,
    },
    headerTitleText: {
        color: "#7a7a7a",
        fontSize: 20,
    },

    // input style
    inputContainer: {
        borderBottomWidth: 1.5,
        borderColor: "#0084ff",
    },
    inputNormal: {
        paddingLeft: 12,
        paddingBottom: 8,
    },
    inputBorder: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,
        borderWidth: 1,
        borderColor: "#0084ff",
    },

    emptyPromptContainer: {
        marginTop: 20,
    },
    emptyPromptPlaceholder: {
        fontSize: 16,
        color: "#7a7a7a",
    },
    // prompt data list style
    promptItemContainer: {
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        marginTop: 20,
    },
    promptItemText: {
        fontSize: 16,
        color: "#3a3a3a",
        paddingBottom: 10,
        paddingTop: 10,
    },
});
