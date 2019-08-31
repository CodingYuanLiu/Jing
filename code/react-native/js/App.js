/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from "react";
import { createAppContainer } from 'react-navigation';

import {MainNav, SwitchNav} from './navigator/AppNav';
import {Provider} from 'react-redux';
import store from "./store/index"
import LocalApi from "./api/LocalApi";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skipLogin: 0,
        }
    }

    componentDidMount() {
        this.judgeSkipLogin();
    }
    componentWillUnmount() {}

    render() {
        const SwitchApp = createAppContainer(SwitchNav);
        const MainApp = createAppContainer(MainNav);
        const {skipLogin} = this.state;

        let App;
        switch (skipLogin) {
            case 0:
                App = null;
                break;
            case 1:
                App = <MainApp/>;
                break;
            case -1:
                App = <SwitchApp/>;
                break;
            default:
                App = null;
        }
        return (
            <Provider store={store}>
                {App}
            </Provider>
        )
    };

    judgeSkipLogin = () => {
        LocalApi.getSkipLogin()
            .then(res => {
                console.log(res);
                if (res) {
                    this.setState({
                        skipLogin: 1,
                    })
                } else {
                    this.setState({
                        skipLogin: -1,
                    });
                    LocalApi.saveSkipLogin(true)
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                console.log(err);
            })
    };
}

