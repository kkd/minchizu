const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
const webpackMerge = require('webpack-merge');
const envDir = './src/environments/';
const path = require('path');

const customDevConfig = {
  resolve: {
    alias: {
    '@app/environment': path.resolve(__dirname, envDir, "environment.ts"),
    '@app/version': path.resolve(__dirname, envDir, "version.ts")
    },
  }
};

const customProdConfig = {
  resolve: {
    alias: {
    '@app/environment': path.resolve(__dirname, envDir, "environment.prod.ts"),
    '@app/version': path.resolve(__dirname, envDir, "version.prod.ts")
    },
  }
};

module.exports = function(){
  
  var config = {
    dev: webpackMerge(useDefaultConfig.dev, customDevConfig),
    prod: webpackMerge(useDefaultConfig.prod, customProdConfig),
  };
  
  return config;
};
