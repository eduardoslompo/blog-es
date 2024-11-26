const webpack = require('webpack');
const dotenv = require('dotenv');

// Carrega as variáveis do arquivo `.env`
const env = dotenv.config().parsed;

// Converte as variáveis em um formato que o Webpack entenda
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`__${next}__`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  plugins: [
    new webpack.DefinePlugin(envKeys),
  ],
};
