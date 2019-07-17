import React from "react"
import { View, Text, ViewPropTypes } from 'react-native';
import { PropTypes } from "prop-types";
import styles from "react-native-webview/lib/WebView.styles";


export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.tagContainer}>

                </View>
                <View style={styles.userBar}>

                </View>
                <View style={styles.title}>

                </View>
                <View style={styles.picture}>

                </View>
                <View style={styles.body}>

                </View>
                <View style={styles.meta}>

                </View>
            </View>
        )
    }
}

ActItem.prototype = {
    title: PropTypes.string,

}
