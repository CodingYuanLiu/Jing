import React from "react";
import {View, Text} from "react-native"
import NavigationBar from "../../common/components/NavigationBar"

export default class DetailScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <View style={[{flex: 1}, styles.container]}>
                <NavigationBar

                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eeeeee",
    }
})
