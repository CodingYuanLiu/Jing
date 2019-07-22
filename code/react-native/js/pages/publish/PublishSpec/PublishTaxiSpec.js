import React from "react"
import { View, Text, StatusBar, StyleSheet } from 'react-native';


export default class PublishTaxiSpec extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {

    }

    renderHeader = () => {
        return null;
    };

    renderLocationInput = () => {
        return null;
    };

    renderDepartDatePicker = () => {
        return null;
    };

    renderInputPromt = () => {

    };

    render() {
        return(
            <View style={styles.container}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "red",
    },
});
