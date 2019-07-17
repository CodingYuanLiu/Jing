import React from "react"
import { View, Text, ViewPropTypes } from 'react-native';
import { PropTypes } from "prop-types";


export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
            </View>
        )
    }
}

ActItem.prototype = {
    title: PropTypes.string,
    
}
