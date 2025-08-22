module.exports = {
  rules: {
    'redux-toolkit/prefer-create-slice': 'error',

    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', 
          'acc', 
          'accumulator', 
          'e',
          'ctx', 
          'req',
          'request', 
          'res', 
          'response', 
          '$scope',
        ],
      },
    ],
  },
};
