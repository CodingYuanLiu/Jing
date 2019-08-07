import React from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {Button, ListItem, SearchBar} from "react-native-elements";
import {ArrowLeftIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import SearchHistory from "./SearchHistory";
import Util from "../../common/util";
import Api from "../../api/Api";


export default class SearchScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false,
            search: "",
        }
    }

    render() {
        let searchBar = this.renderSearchBar();
        let searchHistory = this.renderSearchHistory();
        return(
            <View style={styles.container}>
                {searchBar}
                <FlatList
                    data={this.state.items}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.loadData}
                        />
                    }
                />
                {searchHistory}
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
                    onChangeText={this.onSearchChange}
                    value={this.state.search}
                    searchIcon={null}
                    lightTheme
                    autoFocus
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputStyle}
                />
            </View>
        );
    };
    renderItem = ({item}) => {
        let title = (
            <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
        );
        let subtitle = (
            <View style={styles.itemSubtitleContainer}>
                <Text style={styles.itemSubtitle}>{item.description}</Text>
            </View>
        );
        let rightElement = (
              <Button
                type={"clear"}
                title={Util.actStatusToText(item.status)}
              />
        );
        return (
            <View style={styles.itemContainer}>
                {title}
                <View style={styles.bodyContainer}>
                    {subtitle}
                    {null}
                </View>
            </View>
        )
    };
    renderSearchHistory = () => {
        return (
            <SearchHistory
                onPress={this.handlePressSearchHistoryItem}
            />
        );
    };
    onSearchChange = (text) => {
        this.setState({search: text});

    };
    loadData = (title) => {
        Api.searchAct(title)
            .then (data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    };

    handlePressSearchHistoryItem = (title) => {
        this.onSearchChange(title);
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
        marginLeft: 8,
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

