jest.mock('Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
  }
});


require('isomorphic-fetch');
require('es6-promise').polyfill();

require('react-native-mock/mock');

global.fetch = require('jest-fetch-mock');
