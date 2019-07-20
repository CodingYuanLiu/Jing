import Modal from "react-native-modal";
import React from "react";
import { View, ViewPropTypes, Text } from "react-native";
import { PropTypes } from "prop-types";
import styles from "react-native-webview/lib/WebView.styles";
import Theme from "../../../common/constant/Theme";

class Confirm extends React.PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        let {title, content, cancelTitle, confirmTitle, visible} =
        this.props;

        return (
            <Modal
            isVisible={visible}
            >
                <View style={styles.confirmContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.content}>{content}</Text>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.textBtn}>{cancelTitle}</Text>
                            <Text style={styles.textBtn}>{confirmTitle}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

Confirm.PropTypes={
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    cancelTitle: PropTypes.string,
    confirmTitle: PropTypes.string,
    visible: PropTypes.bool,
}

Confirm.defaultProps = {
    title: "确认",
    cancelTitle: "取消",
    confirmTitle: "确认",
    visible: false,
}


const styles = StyleSheet.create({
    confirmContainer: {
        flex: 1,
        backgroundColor: Theme.WHITE,
    },
    innerContainer: {
        flex: 1,
        padding: 10,
    },
    title: {
        marginTop: 5,
        fontSize: 20,
        color: Theme.TITLE_BLACK,
        fontWeight: "600",
    },
    content: {
        flex: 1,
        marginTop: 10,
        fontSize: 16,
        color: Theme.TEXT_BLACK,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    textBtn: {
        color: "#0084ff",
        minWidth: 28,
        minHeight: 16,
    },
})


export {
    Confirm,
}


