import React from "react";
import {View, Text} from "react-native";
import { WebView } from 'react-native-webview';
import {connect} from "react-redux";


class JaccountWebView extends React.Component{
    constructor(props) {
        super(props);
    }
    static webref;

    onNavStateChange = navState => {
        const url = navState.url;
        let code;
        let redirectUri="https://jing855.cn/";
        if (url.startsWith("https://jing855.cn/")) {
            code = url.substring(url.indexOf("?code=") + 6);
            console.log(code);
            let params = {
                code: code,
                redirectUri: redirectUri
            };
            this.props.navigation.navigate("JaccountLoading", params);
        }
    };


    render() {
        const clientId="KIr40g1K90EObtNARwda&";
        const clientSecret="16BA4A646213794CD6C72F32F219D37A4AE51345897AC889";
        const scope="basic";
        const responseType="code";
        const redirectUri="https://jing855.cn/";

        const jaccountUri =
            "https://jaccount.sjtu.edu.cn/oauth2/authorize?"+
            `client_id=${clientId}&client_secret=${clientSecret}&scope=${scope}`+
            `&response_type=${responseType}&redirect_uri=${redirectUri}`;

        return(
            <WebView
                ref={r => (this.webref = r)}
                source={{uri: jaccountUri}}
                startInLoadingState={true}
                renderError={err => (<View><Text>{err}</Text></View>)}
                onNavigationStateChange={navState => {this.onNavStateChange(navState)}}
                onMessage={event => {alert(event.nativeEvent.data)}}
                useWebKit={false}
                />
        )
    }
}
const mapStateToProps = state => ({
    setting: state.setting,
});

export default connect(mapStateToProps, null)(JaccountWebView);



