import React from "react"
import { View, Text, FlatList, StyleSheet } from 'react-native';
import NavigationUtil from "../../navigator/NavUtil";


export default class RecentScan extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            recentList: [],
            isLoading: false,
        }
    }

    render() {
        let recentList = this.state.recentList;
        let header = this.renderHeader();
        return(
            <View style={styles.container}>
                {header}
                <FlatList
                    data={recentList}
                    renderItem={this.renderItem}
                />
            </View>
        )
    };
    renderHeader = () => {

    };
    renderItem = ({item}) => {

    };
    toActDetail = (id) => {
        NavigationUtil.toPage({actId: id}, "ActDetail");
    }
}

const styles = StyleSheet.create({
    container: {

    },
    itemContainer: {

    },

});
