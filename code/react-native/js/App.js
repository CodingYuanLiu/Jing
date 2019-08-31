/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from "react";
import { createAppContainer } from 'react-navigation';

import AppNav from './navigator/AppNav';
import {Provider} from 'react-redux';
import store from "./store/index"
import {hasSkipLogin} from "./actions/setting";

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log(store);
        console.log(this.props);
        store.dispatch(hasSkipLogin());
        //store.dispatch()
    }
    componentWillUnmount() {}

    render() {
        const App = createAppContainer(AppNav);
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

