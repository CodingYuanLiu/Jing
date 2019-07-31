import React from "react"
import {View, Text, StyleSheet, FlatList, RefreshControl, ScrollView} from 'react-native';
import {ListItem, SearchBar} from "react-native-elements";
import {ArrowLeftIcon, LeftUpArrowIcon, SearchIcon} from "../../../common/components/Icons";
import Api from "../../../api/Api";
import {connect} from "react-redux";
import NavigationUtil from "../../../navigator/NavUtil";
import Activity from "../../../actions/activity";

class PublishTakeoutSpec extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            prompts: [],
            isLoading: false,
            err: null,
            search: "",

        }
    }
    renderHeader = () => {
        let returnIcon = (
            <ArrowLeftIcon
                color={"#bfbfbf"}
                size={30}
                onPress={() => {NavigationUtil.back(this.props)}}
            />
        );
        return (
            <View style={styles.headerContainer}>
                {returnIcon}
                <SearchBar
                    placeholder={"输入店铺名称"}
                    onChangeText={this.onSearch}
                    value={this.state.search}
                    onClear={this.onClear}
                    searchIcon={null}
                    lightTheme
                    autoFocus
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputStyle}
                />
            </View>
        )
    };
    renderPrompt = ({item}) => {
        return (
            <ListItem
                title={item.name}
                titleProps={{numberOfLines:1, ellipsizeMode: "tail" }}
                titleStyle={styles.promptText}
                rightIcon={
                    <LeftUpArrowIcon
                        color={"#bfbfbf"}
                        size={24}
                        style={ styles.promptIcon }
                    />
                }
                leftIcon={
                    <SearchIcon
                        color={"#bfbfbf"}
                        size={24}
                        style={ styles.promptIcon }
                    />
                }
                contentContainerStyle={styles.promptContentContainer}
                containerStyle={styles.promptContainer}
                onPress={() => {this._onPressItem(item)}}
            />
        )
    };
    render() {
        let header = this.renderHeader();
        let { prompts, isLoading }= this.state;
        if (!prompts) {
            prompts = [];
        }
        return(
            <View style={styles.container}>
                    {header}
                <FlatList
                    keyboardShouldPersistTaps={"handled"}
                    data={prompts}
                    renderItem={this.renderPrompt}
                    keyExtractor={(item) => (item.id)}
                    refreshControl={
                        <RefreshControl
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            refreshing={isLoading}
                            tintColor={"#0084ff"}
                        />
                    }
                    style={styles.promptListContainer}
                />
            </View>
        )
    };

    onSearch = (text) => {
        this.setState({
            search: text,
        });
        console.log(text);
        if (text !== "") {
            this.setState({isLoading: true});
            Api.searchTakeoutStore(text)
                .then(data => {
                    console.log(data);
                    this.setState({prompts: data})
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.setState({isLoading: false});
                })
        } else {
            this.setState({prompts: []})
        }

    };
    _onPressItem = (item) => {
        console.log(item.name);
        this.props.saveTakeoutAct({store: item.name});
        NavigationUtil.back(this.props);
    }
}

const mapDispatchToProps = dispatch => ({
    saveTakeoutAct: (data) => dispatch(Activity.saveTakeoutAct(data)),
});
export default connect(null, null)(PublishTakeoutSpec);

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        paddingLeft: "4%",
        paddingRight: "3%",
        backgroundColor: "#eee",
        alignItems: "center",
        borderRadius: 5,
    },
    searchContainer: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: 28,
    },
    inputContainer: {
        height: 28,
        backgroundColor: "#eee",
        borderWidth: 0,
        marginBottom: 2,
    },
    inputStyle: {
        fontSize: 15,
        color: "#bfbfbf",
    },
   promptContainer: {
       paddingTop: 0,
       paddingBottom: 0,
       marginLeft: "3%",
       marginRight: "3%",
       borderBottomColor: "#cfcfcf",
       borderBottomWidth: 0.5,
   },
    promptContentContainer: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    promptText: {
        fontSize: 16,
    },
    promptIcon: {
       margin: 0,
    },
    promptListContainer: {
        marginTop: 10,
    },
});


