import React from "react"
import { View, Text, ViewPropTypes } from 'react-native';
import { PropTypes } from "prop-types";




export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    rederTag = (item) => {
        
    }

    render() {
        return(
            <View>
            </View>
        )
    }
}

ActItem.prototype = {
    title: PropTypes.string.isRequired,
    departTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    bodyText: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    dest: PropTypes.string.isRequired,
    tag: PropTypes.arrayOf(PropTypes.string),
}
