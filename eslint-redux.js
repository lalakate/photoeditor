module.exports = {
  rules: {
    // Предпочитайте использование createSlice
    'redux-toolkit/prefer-create-slice': 'error',
    
    // Избегайте мутаций вне createSlice
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // для Redux Toolkit
          'acc', // для reduce
          'accumulator', // для reduce
          'e', // для событий
          'ctx', // для контекста
          'req', // для Express
          'request', // для Express
          'res', // для Express
          'response', // для Express
          '$scope' // для Angular
        ]
      }
    ]
  }
};