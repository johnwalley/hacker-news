jest.mock('Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(() => new Promise((resolve, reject) => {
      resolve(null)
    })),
  }
});


fetch = jest.fn((url, options) => new Promise((resolve, reject) => {
  resolve({ status: 201, json: () => (response) })
}));

require('es6-promise').polyfill();