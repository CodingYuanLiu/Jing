import React from "react"
import { View, Text, ViewPropTypes, FlatList } from 'react-native';
import { PropTypes } from "prop-types";
import {TaxiSpec} from "./SpecInfo";

export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    rederTag = (item) => {

    }

    genActSpec = (type) => {
        let ActSpec;
        if (type === "taxi") {
            let departTime = this.props.taxiMeta.departTime;
            let endTime = this.props.taxiMeta.endTime;
            let source = this.props.taxiMeta.source;
            let dest = this.props.taxiMeta.dest;
            ActSpec =
                <TaxiSpec
                    departTime={departTime}
                    endTime={endTime}
                    dest={dest}
                    src={source}
                />
        } else if (type === "shop") {
            ActSpec = <Text>这是网购</Text>
        } else if (type === "takeout") {
            ActSpec = <Text>这是外卖</Text>
        }
        return ActSpec
    }
    render() {
        let tags = this.props.tags;
        let type = this.props.type;
        let title = this.props.title;
        let bodyText = this.props.bodyText;
        let ActSpec = this.genActSpec(type);
        return(
            <View style={styles.container}>
                <View style={styles.userBar}>

                </View>
                <View style={styles.title}>
                    <Text>{title}</Text>
                </View>
                <View style={styles.tagContainer}>
                    <FlatList
                    />
                </View>
                {ActSpec}
                <View style={styles.body}>

                </View>
                <View style={styles.picture}>

                </View>

                <View style={styles.comment}>

                </View>
            </View>
        )
    }
}

const TaxiSpecShape = {
    departTime: PropTypes.string,
    endTime: PropTypes.string,
    source: PropTypes.string,
    dest: PropTypes.string,
}
const OnlineShopSpecShape = {
}
const TakeoutSpecShape = {
}

ActItem.propTypes = {
    title: PropTypes.string.isRequired,
    taxiMeta: PropTypes.shape(TaxiSpecShape),
    shopMeta: PropTypes.shape(OnlineShopSpecShape),
    takeoutMeta: PropTypes.shape(TakeoutSpecShape),
    bodyText: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string.isRequired,

}

ActItem.defaultProps = {
    title: "测试",
    type: "taxi",
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 180,
    },
    tagContainer:{

    },
})
