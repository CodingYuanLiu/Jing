import React from "react"
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {connect} from "react-redux";
import {toggleNestScroll} from "../../../actions/personalHome";
import Util from "../../../common/util";

class PersonalManage extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let {personalHome} = this.props;
        let data = personalHome.actList;
        if (!data) {
            data = [];
        }
        return(
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={(item, i) => i.toString()}
                    style={{flex: 1,}}
                    scrollEnabled={personalHome.nestScrollEnabled}
                    onScroll={this._onScroll}
                />
            </View>
        )
    };
    renderItem = ({item}) => {
        let title = this.renderTitle(item);
        let description = this.renderDescription(item);
        let footer = this.renderFooter(item);
        return (
            <View style={styles.itemContainer}>
                {title}
                {description}
                {footer}
            </View>
        )
    };
    renderTitle = (item) => {
        return(
            <Text style={styles.itemTitle}>
                {item.title}
            </Text>
        )
    };
    renderDescription = (item) => {
        return (
            <View style={styles.itemBody}>
                <Text style={styles.itemBodyText}>
                    {item.description}
                </Text>
            </View>
        )
    };
    renderFooter = (item) => {
        return (
            <View style={styles.itemFooter}>
                <Text style={styles.itemFooterText}>
                    {`${item.comments.length} 条评论`}
                </Text >
                <Text style={styles.itemFooterText}>
                    {Util.dateTimeToDisplayString(item.createTime)}
                </Text>
            </View>
        )
    };

    _onScroll = ({nativeEvent}) => {
        let {contentOffset} = nativeEvent;
        if(contentOffset.y <= 0) {
            this.props.toggleNestScroll(false);
        } else {
            this.props.toggleNestScroll(true);
        }
    }
}
const mapStateToProps = state => ({
    personalHome: state.personalHome,
});
const mapDispatchToProps = dispatch => ({
    toggleNestScroll: (flag) => dispatch(toggleNestScroll(flag)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonalManage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    itemContainer: {
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    itemTitle: {
        fontWeight: "bold",
        color: "#2a2a2a",
        fontSize: 16,
    },
    itemBody: {
        marginTop: 5,
        marginBottom: 10,
    },
    itemBodyText: {
        fontSize: 16,
        color: "#8a8a8a",
    },
    itemFooter: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemFooterText: {
        fontSize: 12,
        color: "#bfbfbf",
    },
});
