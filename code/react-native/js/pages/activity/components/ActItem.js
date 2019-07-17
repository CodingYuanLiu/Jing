import React from "react"
import { View, Text, ViewPropTypes, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { PropTypes } from "prop-types";
import {TaxiSpec} from "./SpecInfo";
import UserBar from "./UserBar";
import Default from "../../../constant/Default";
import Tag from "./Tag";

export default class ActItem extends React.PureComponent{
    constructor(props) {
        super(props);
        console.log(props)
    }


    renderTag = (tag, i) => (
        <Tag
            title={tag}
            key={i}
        />
        )

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
    toDetail = () => {
        this.props.onPress(this.props.id)
    }
    render() {
        let user = this.props.user;
        let tags = this.props.tags;
        let type = this.props.type;
        let title = this.props.title;
        let bodyText = this.props.bodyText;
        let ActSpec = this.genActSpec(type);
        return(
            <TouchableNativeFeedback
            onPress={() => {this.toDetail()}}
            >
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <View style={styles.userBar}>
                            <UserBar nickname={user.nickname} signature={user.signature}/>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <View style={styles.tagContainer}>
                            {
                                tags ? tags.map((tag, i) => (
                                    this.renderTag(tag, i)
                                )) : null
                            }
                        </View>
                        {ActSpec}
                        <View style={styles.body}>
                            <Text>
                                {bodyText}
                            </Text>
                        </View>
                        <View>
                        </View>
                        <View style={styles.metadata}>

                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
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
const UserShape = {
    nickname: PropTypes.string.isRequired,
    signature: PropTypes.string.isRequired,
    avatarUri: PropTypes.string.isRequired,
}
ActItem.propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.shape(UserShape),
    title: PropTypes.string.isRequired,
    taxiMeta: PropTypes.shape(TaxiSpecShape),
    shopMeta: PropTypes.shape(OnlineShopSpecShape),
    takeoutMeta: PropTypes.shape(TakeoutSpecShape),
    bodyText: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
}

ActItem.defaultProps = {
    title: "测试",
    type: "taxi",
    user: {
        avatarUri: Default.DEFAULT_AVATAR
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 180,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    innerContainer: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    tagContainer:{
        flex: 1,
        //backgroundColor: "blue",
        flexDirection: "row",
        alignItems: "center",
    },
    userBar: {
        flex: 1,
        marginTop: 4,
    },
    body: {
        color: "#505050",
    },
    titleContainer: {
        flex: 1,
        //backgroundColor: "red",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    metadata: {
        marginTop: 10,
        marginBottom: 10,
    }
})
