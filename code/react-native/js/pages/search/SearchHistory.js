import React from "react";
import {View, Text, StyleSheet, FlatList, TouchableWithoutFeedback} from "react-native";
import {ClockIcon, CloseIcon} from "../../common/components/Icons";
import LocalApi from "../../api/LocalApi";
import {PropTypes} from "prop-types";
import {Button} from "react-native-elements";

export default class SearchHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            history: [],
        }
    }
    componentDidMount() {
        this.loadData();
    }

    render() {
        let title = this.renderTitle();
        return (
            <View style={styles.container}>
                {title}
                <FlatList
                    data={this.state.history}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                    keyboardShouldPersistTaps={"always"}
                />
            </View>
        )
    };
    renderTitle = () => {
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>搜索历史</Text>
                <Button
                    type={"clear"}
                    title={"清空"}
                    titleStyle={styles.titleButtonText}
                    buttonStyle={{padding: 0, margin: 0, marginRight: 18,}}
                    touchableComponent={TouchableWithoutFeedback}
                    onPress={this.onClear}
                />
            </View>
        )
    };
    renderItem = ({item}) => {
        let leftIcon = (
              <ClockIcon
                color={"#bfbfbf"}
                size={18}
              />
        );
        let title = (
            <Text style={styles.itemTitle}>{item.title}</Text>
        );
        let rightIcon = (
            <CloseIcon
                color={"#bfbfbf"}
                size={18}
                onPress={() => { this.deleteItem(item.id) }}
            />
        );
        return (
            <TouchableWithoutFeedback
                onPress={() => { this.onPressItem(item) }}
                style={{height: 24}}
            >
                <View style={styles.itemContainer}>
                    {leftIcon}
                    {title}
                    {rightIcon}
                </View>
            </TouchableWithoutFeedback>
        )
    };

    loadData = () => {
        LocalApi.getSearchHistory()
            .then(list => {
                this.setState({history: list});
                console.log(list);
            }).catch(err => {
                console.log(err);
        })
    };
    deleteItem = (id) => {
        LocalApi.removeSearchHistory(id)
            .then(() => {
                let list = [];
                for(let item of this.state.history) {
                    if (item.id !== id) {
                        list.push(item);
                    }
                }
                this.setState({history: list});
            })
            .catch(err => {})
    };
    onPressItem = (item) => {
        LocalApi.saveSearchHistory(item.title)
            .then(() => {
                this.props.onPressItem(item.title);

            })
            .catch(err => {
                console.log(err);
            })
    };
    onClear = () => {
          LocalApi.clearSearchHistory()
              .then(() => {
                  this.setState({history: []});
              })
              .catch(err => {
                  console.log(err);
              })
    };
}
SearchHistory.propTypes = {
    onPressItem: PropTypes.func,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#2a2a2a",
        flex: 1,
        marginLeft: 16,
    },
    titleButtonText: {
        fontSize: 13,
        color: "#7a7a7a",
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20,
        marginRight: 20,
        height: 40,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
    },
    itemTitle: {
        fontSize: 14,
        color: "#3a3a3a",
        flex: 1,
        marginLeft: 12,
    },

});
