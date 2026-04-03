const path = require('path');

module.exports = {
  plugins: {
    'posthtml-include': {
      root: path.join(__dirname, 'src'),
    },
  },
};
