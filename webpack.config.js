import Hwp from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV || 'development',
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
