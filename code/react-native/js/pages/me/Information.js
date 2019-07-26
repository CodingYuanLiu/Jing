import React from "react"
import { View, Text, StyleSheet } from 'react-native';


export default class PersonalHome extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let header = this.renderHeader();
        let avatar = this.renderAvatar();
        let basicInformation = this.renderBasicInformation();
        return(
            <View style={styles.container}>

            </View>
        )
    }

    renderBasicInformation = () => {
        return undefined;
    };
    renderHeader = () => {

    };
    renderAvatar = () => {

    };
}

const styles = StyleSheet.create({
    container: {

    },

});
