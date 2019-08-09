import React from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl, ScrollView } from 'react-native';
import {Button, ListItem, SearchBar} from "react-native-elements";
import {ArrowLeftIcon, SearchIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import SearchHistory from "./SearchHistory";
import Util from "../../common/util";
import Api from "../../api/Api";
import SearchItem from "./SearchItem";
import LocalApi from "../../api/LocalApi";


export default class SearchScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false,
            searchText: "",
        }
    }

    render() {
        let searchBar = this.renderSearchBar();
        let searchHistory = this.renderSearchHistory();
        return(
            <View style={styles.container}>
                {searchBar}
                <ScrollView style={{marginTop: 16}}>
                    {
                        this.state.items.map((item ,i) => {
                            return (
                                <SearchItem
                                    onPress={this.onPressSearchItem}
                                    item={item}
                                    key={item.id.toString()}
                                />
                            )
                        })
                    }
                    { searchHistory }
                </ScrollView>
            </View>
        )
    };
    renderSearchBar = () => {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#bfbfbf"}
                size={30}
                onPress={() => {NavigationUtil.back(this.props)}}
            />
        );
        return (
            <View style={styles.headerContainer}>
                {leftIcon}
                <SearchBar
                    placeholder={"搜索即应"}
                    onChangeText={this.onSearchTextChange}
                    onSubmitEditing={this.searchAct}
                    returnKeyType={"search"}
                    searchIcon={null}
                    value={this.state.searchText}
                    lightTheme
                    autoFocus
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputStyle}
                />
            </View>
        );
    };
    renderSearchHistory = () => {
        return (
            <SearchHistory
                onPressItem={this.handlePressSearchHistoryItem}
            />
        );
    };

    searchAct = () => {
        let keywords = this.state.searchText;
        this.loadData(keywords)
            .then((data) => {
                this.setState({items: data})
            })
            .catch(err => {
                console.log(err);
            })
    };
    onSearchTextChange = (text) => {
        this.setState({searchText: text});
    };
    loadData = async (title) => {
        let data = await Api.searchAct(title);
        await LocalApi.saveSearchHistory(title);
        return data;
    };
    handlePressSearchHistoryItem = (title) => {
        this.setState({searchText: title});
        this.loadData(title)
            .then(data => {
                this.setState({items: data})
            })
            .catch(err => {
                console.log(err);
            })
    };
    onPressSearchItem = (item) => {
        NavigationUtil.toPage({id: item.id}, "ActDetail");
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        height: 30,
    },
    searchContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: 28,
        backgroundColor: "transparent",
    },
    inputContainer: {
        height: 28,
        backgroundColor: "transparent",
        borderWidth: 0,
        marginBottom: 2,
    },
    inputStyle: {
        fontSize: 15,
        color: "#4a4a4a",
    },
});

