process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const { merge } = require('@rails/webpacker')
const webpackConfig = require('./base')
const developmentConfig = {
  devServer: {
    port: '3035',
    host: '0.0.0.0',
    compress: true,
    public: 'webpacker:3035' // name of the webpacker container from docker-compose-dev.yml works as host
  }
};

module.exports = merge(webpackConfig, developmentConfig)
