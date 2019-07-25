import React from "react";
import {Text, View, ViewPropTypes, StyleSheet} from "react-native";
import { PropTypes } from "prop-types";
import FontAwesome from "react-native-vector-icons/FontAwesome";

class TaxiSpec extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let origin = this.props.origin;
        let dest = this.props.dest;
        let departTime = this.props.departTime;
        let endTime = this.props.endTime;

        return (
            <View style={[styles.container]}>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>截止时间</Text>
                    <Text style={styles.time}>{endTime}</Text>
                </View>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>出发时间</Text>
                    <Text style={styles.time}>{departTime}</Text>
                </View>
                <View style={styles.departContainer}>
                    <Text style={[styles.departLeftText]} numberOfLines={1} ellipsizeMode={"middle"}>{origin.title}</Text>
                    <View style={styles.arrowContainer}>
                        <FontAwesome
                            name={"long-arrow-right"}
                            size={24}
                            color={"#bfbfbf"}
                        />
                    </View>
                    <Text style={[styles.departRightText]} numberOfLines={1} ellipsizeMode={"middle"}>{dest.title}</Text>
                </View>
            </View>
        )
    }
}

TaxiSpec.propTypes = {
    departTime: PropTypes.string,
    endTime: PropTypes.string.isRequired,
    dest: PropTypes.object.isRequired,
    origin: PropTypes.object.isRequired,
};


class  TakeoutSpec extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    getTimeRange = time => {
        let hour = new Date(time).getHours();
        if (hour <= 14 && hour >= 10) {
            return "吃午饭啦";
        } else if (hour <= 20 && hour >= 16)
            return "是晚餐哟";
        else if (hour <= 24 && hour >= 21)
            return "有夜宵哎";

    };

    render() {
        let endTime = this.props.endTime;
        let orderTime = this.props.orderTime;
        let store = this.props.store;
        return (
            <View style={[styles.container]}>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>截止时间</Text>
                    <Text style={styles.time}>{endTime}</Text>
                </View>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>下单时间</Text>
                    <Text style={styles.time}>{orderTime}</Text>
                    <Text style={styles.text}>{this.getTimeRange(orderTime)}</Text>
                </View>
                <View style={styles.storeContainer}>
                    <Text style={styles.text}>外卖店铺</Text>
                    <Text style={styles.text}>{store}</Text>
                </View>
            </View>
        )
    }
}

TakeoutSpec.propTypes = {
    endTime : PropTypes.string.isRequired,
    store: PropTypes.string.isRequired,
    orderTime: PropTypes.string.isRequired,
};

class OnlineShopSpec extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        let endTime = this.props.endTime;
        let store = this.props.store;
        return (
            <View style={[styles.container]}>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>截止时间</Text>
                    <Text style={styles.time}>{endTime}</Text>
                </View>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>网购店铺</Text>
                    <Text style={styles.time}>{store}</Text>
                </View>
            </View>
        )
    }
}
OnlineShopSpec.propTypes = {
    endTime: PropTypes.string.isRequired,
    store: PropTypes.string.isRequired,
};

class NormalActSpec extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        let endTime = this.props.endTime;
        let activityTime = this.props.activityTime;
        return (
            <View style={[styles.container]}>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>截止时间</Text>
                    <Text style={styles.time}>{endTime}</Text>
                </View>
                <View style={styles.specContainer}>
                    <Text style={styles.text}>活动时间</Text>
                    <Text style={styles.time}>{activityTime}</Text>
                </View>
            </View>
        )
    }
}

NormalActSpec.propTypes = {
    endTime: PropTypes.string.isRequired,
    activityTime: PropTypes.string.isRequired,
};

export {
    TaxiSpec,
    OnlineShopSpec,
    TakeoutSpec,
    NormalActSpec,
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        flex: 1,
    },
    specContainer: {
        flexDirection: "row",
    },
    text: {
        minWidth: 28,
        color: "#bfbfbf"
    },
    time: {
        color: "#7a7a7a",
        marginLeft: 16,
    },
    departContainer: {
        width: "100%",
        height: 28,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    arrowContainer: {
        width: 40,
    },
    departLeftText: {
        color: "#bfbfbf",
        width: 80,
    },
    departRightText: {
        color: "#bfbfbf",
        width: 80,
    },
    storeContainer: {
        width: "100%",
        height: 28,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
});
