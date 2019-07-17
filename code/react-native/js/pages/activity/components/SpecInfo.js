import React from "react";
import {Text, View, ViewPropTypes, StyleSheet} from "react-native";
import { PropTypes } from "prop-types";
import { Icon } from "react-native-elements";

class TaxiSpecEntry extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let leftText=this.props.leftText;
        let rightText = this.props.rightText;

        let type = this.props.type ? this.props.type : "rocket";
        let dividerMargin = this.props.dividerMargin ?
            this.props.dividerMargin : 8
            / 2;
        return (
            <View style={[entryStyles.container, this.props.style]}>
                <View style={[entryStyles.textContainer, {justifyContent: "flex-end"}]}>
                    <Text style={entryStyles.text}>{leftText}</Text>
                </View>
                <Icon
                    type={"material-community"}
                    name={type}
                    size={15}
                    color={"#50a1ff"}
                    containerStyle={[{margin: dividerMargin}]}

                />
                <View style={[entryStyles.textContainer, {justifyContent: "flex-start"}]}>
                    <Text style={entryStyles.text}>{rightText}</Text>
                </View>
            </View>
        )
    }
}
TaxiSpecEntry.propTypes = {
    leftText: PropTypes.string.isRequired,
    rightText: PropTypes.string.isRequired,
    divider: PropTypes.element,
    dividerMargin: PropTypes.number,
    type: PropTypes.string,
}
const entryStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        height: 24,
        margin: 5,
    },
    textContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        color: "#8d8d8d"
    },
})

class TaxiSpec extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let src = this.props.src;
        let dest = this.props.dest;
        let departTime = this.props.departTime;
        let endTime = this.props.endTime;

        return (
            <View style={[styles.container, this.props.style]}>
                <TaxiSpecEntry leftText={departTime} rightText={endTime}
                    type={"timer"} dividerMargin={10}
                />
                <TaxiSpecEntry leftText={src} rightText={dest}
                    type={"taxi"} dividerMargin={10}
                />
            </View>
        )
    }
}

TaxiSpec.propTypes = {
    departTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    dest: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
}


class  TakeoutSpec extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        const title = this.props.title ? this.props.title : "标签";
        const color = this.props.color ? this.props.color : "#0084ff";
        return (
            <View style={[styles.container, this.props.style]}>
                <Text style={[styles.text, {color: color}]}>{title}</Text>
            </View>
        )
    }
}

class OnlineShopSpec extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        const title = this.props.title ? this.props.title : "标签";
        const color = this.props.color ? this.props.color : "#0084ff";
        return (
            <View style={[styles.container, this.props.style]}>
                <Text style={[styles.text, {color: color}]}>{title}</Text>
            </View>
        )
    }
}

export {
    TaxiSpec,
    OnlineShopSpec,
    TakeoutSpec,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 60,
    },
})
