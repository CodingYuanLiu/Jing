import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import PublishHeader from "../components/PublishHeader";
import NavigationUtil from "../../../navigator/NavUtil";
import {ListItem, SearchBar} from "react-native-elements";
import {LeftUpArrowIcon, SearchIcon} from "../../../common/components/Icons";

export default class PublishTakeoutSpec extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            prompts: [],
            isLoading: false,
            err: null,
            search: "",

        }
    }
    componentDidMount(){

    }
    renderHeader = () => {
        return (
            <PublishHeader
                style={styles.headerContainer}
                onClose={() => {NavigationUtil.back(this.props)}}
            />
        );
    };
    renderInput = () => {
        return (
            <SearchBar
            placeholder={"输入店铺名称"}
            onChangeText={this.onSearch}
            value={this.state.search}
            onClear={this.onClear}
            showLoading={this.state.isLoading}
            />
        )
    };
    renderPrompt = (title) => {
        return (
            <ListItem
                title={title}
                rightIcon={
                    <LeftUpArrowIcon
                        color={"#bfbfbf"}
                        size={24}
                    />
                }
                leftIcon={
                    <SearchIcon
                        color={"#bfbfbf"}
                        size={24}
                    />
                }
                contentContainerStyle={styles.promptContainer}
                key={i}
            />
        )
    };
    render() {
        let header = this.renderHeader();
        let input = this.renderInput();
        let {prompts, isLoading}= this.state;
        return(
            <View style={styles.container}>
                {header}
                {input}
                {
                    prompts.map((item, i) => {
                        this.renderPrompt(item, i.toString())
                    })
                }
            </View>
        )
    };

    onSearch = (text) => {

    }
}

const styles = StyleSheet.create({
   promptContainer: {
       paddingTop: 8,
       paddingBottom: 8,
       marginLeft: 12,
       marginRight: 12
   },
});


