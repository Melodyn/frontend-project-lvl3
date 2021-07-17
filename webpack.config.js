// const Hwp = require('html-webpack-plugin');
//
// module.exports = {
//   plugins: [
//     new Hwp({
//       title: 'RSS Aggregator',
//     }),
//   ],
// };

import Hwp from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV || 'development',
  watch: true,
  plugins: [
    new Hwp({
      template: 'src/index.html',
    }),
  ],
  output: {
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
