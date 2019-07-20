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

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

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

