import React from "react";
import {View, StyleSheet} from "react-native";
import {ListItem} from "react-native-elements";
import UserAvatar from "../../../common/components/UserAvatar";

export default class Feedback extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            headerTitle: "",
        }
    };

    render() {
        let header = this.renderHeader();

        return (
            <View style={styles.container}>

            </View>
        )
    };
    renderHeader() {

    };
    renderItem({item}) {
        let leftAvatar = (
            <UserAvatar
                source={{uri: item.applicant_avatar}}
                id={item.applicant_id}
            />
        );
        return (
            <ListItem
                leftAvatar={leftAvatar}
                rightElement={rightElement}
            />
        )
    };
    renderBody() {

    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // style for header

    // style for list item
    itemContainer: {

    },
});
