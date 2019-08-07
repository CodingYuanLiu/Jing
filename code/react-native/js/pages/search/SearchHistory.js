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

    render() {
        let title = this.renderTitle();
        return (
            <View style={styles.container}>
                {title}
                <FlatList
                    data={this.state.history}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
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
                onPress={() => {this.deleteItem(item.id)}}
            />
        );
        return (
            <TouchableWithoutFeedback
                onPress={() => { this.setSearchText(item) }}
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
                this.setState({history: list})
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
    setSearchText = (item) => {
        let {onPress} = this.props;
        onPress(item.title);
    };

}
SearchHistory.propTypes = {
    onPress: PropTypes.func,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#2a2a2a",
        flex: 1,
        marginLeft: 20,
    },
    titleButtonText: {
        fontSize: 10,
        color: "#7a7a7a",
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemTitle: {
        fontSize: 14,
        color: "#3a3a3a",
        flex: 1,
    },

});
