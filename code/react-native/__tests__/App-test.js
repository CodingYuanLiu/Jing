/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../js/App';
import "react-native/jest/setup"

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
