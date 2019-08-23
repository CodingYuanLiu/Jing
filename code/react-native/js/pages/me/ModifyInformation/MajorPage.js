import React from "react";
import {View, StyleSheet, SectionList, Text, TouchableOpacity, TouchableWithoutFeedback, RefreshControl} from "react-native";
import {MAJORS, WINDOW} from "../../../common/constant/Constant";
import {ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon} from "../../../common/components/Icons";
import HeaderBar from "../../../common/components/HeaderBar";
import NavigationUtil from "../../../navigator/NavUtil";

export default class MajorPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        let {sections} = this.state;
        let header = this.renderHeader();
        return (
            <View style={styles.container}>
                {header}
                <SectionList
                    initialNumToRender={0}
                    keyExtractor={item => item.id}
                    sections={sections}
                    renderItem={() => {return null}}
                    stickySectionHeadersEnabled={true}
                    renderSectionHeader={this.renderSectionHeader}
                    renderSectionFooter={this.renderSectionFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => {this.loadData(this.state.type)}}
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            tintColor={"#0084ff"}
                        />
                    }
                    contentContainerStyle={styles.contentContainer}
                />
            </View>
        )
    };
    renderHeader = () => {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#bfbfbf"}
                onPress={this.goBack}
            />
        );
        return (
            <HeaderBar
                leftButton={leftIcon}
                title={"添加专业"}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleContainer}
                style={styles.headerContainer}
            />
        )
    };
    renderItem = (item) => {
        return (
            <TouchableOpacity

                onPress={() => {this._onPress(item)}}
            >
                <View style={styles.itemContainer}>
                    {
                        <Text style={styles.itemTitle}>
                            {item.title}
                        </Text>
                    }
                </View>
            </TouchableOpacity>
        )
    };
    renderSectionHeader = ({section: {isChildrenVisible, id, title, data}}) => {
        if (!isChildrenVisible) {
            return (
                <TouchableWithoutFeedback
                    style={{flex: 1,}}
                    onPress={() => {this._toggleSectionVisible(id, true)}}
                >
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.sectionHeaderTitle}>{title}</Text>
                        <ChevronDownIcon
                            size={20}
                            color={"#bfbfbf"}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        return (
            <View>
                <TouchableWithoutFeedback
                    style={{flex: 1,}}
                    onPress={() => {this._toggleSectionVisible(id, false)}}
                >
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.sectionHeaderTitle}>{title}</Text>
                        <ChevronUpIcon
                            size={20}
                            color={"#bfbfbf"}
                        />
                    </View>
                </TouchableWithoutFeedback>
               <View style={styles.itemListContainer}>
                   {
                       data.map((item, i ) => {
                           return this.renderItem(item)
                       })
                   }
               </View>
            </View>
        )
    };
    renderSectionFooter = ({section: {isChildrenVisible}}) => {
        return (
            <View
                style={[
                    styles.sectionFooterContainer,
                    isChildrenVisible ?
                        {
                            marginTop: 24,
                        }: null
                    ]}
            />
        )
    };
    loadData = () => {
        this.setState(state => {
             return {
                 ...state,
                 isLoading: true,
             }
        });
        let sections = MAJORS;
        for (let section of sections) {
            sections.isChildrenVisible = false;
        }
        this.setState({
            sections: sections,
            isLoading: false,
        });
    };
    _onPress = (item) => {
        let handleMajorChange = this.props.navigation.getParam("handleMajorChange");
        handleMajorChange(item.title);
        NavigationUtil.back(this.props);
    };
    _toggleSectionVisible = (id, flag) => {
        this.setState(state => {
            for (let section of state.sections) {
                if (section.id === id) {
                    section.isChildrenVisible = flag;
                    return {
                        ...state,
                    }
                }
            }
        })
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        marginLeft: 15,
        marginRight: 15,
    },
    headerContainer: {
        elevation: 3,
        backgroundColor: "#fff",
    },
    headerTitleContainer: {
        alignItems: "flex-start",
    },
    headerTitle: {
        fontSize: 22,
        color: "#7a7a7a",
    },
    sectionHeaderContainer: {
        width: WINDOW.width - 30,
        height: 64,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionHeaderTitle: {
        color: "#2a2a2a",
        fontWeight: "bold",
        fontSize: 16,
    },

    itemListContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    itemContainer: {
        backgroundColor: "#eee",
        borderRadius: 100,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
        margin: 3,
        justifyContent: "center",
        alignItems: "center",
    },
    itemTitle: {
        color: "#7a7a7a",
        fontSize: 14,
    },

    sectionFooterContainer: {
        backgroundColor: "#eee",
        height: 0.5,
        width: WINDOW.width - 30,
    },
});
