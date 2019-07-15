/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { createAppContainer } from 'react-navigation';

import AppNav from './navigator/AppNav';

const App = createAppContainer(AppNav)

export default App

