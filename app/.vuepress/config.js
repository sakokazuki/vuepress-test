const webpack = require('webpack')
const path = require('path')

module.exports = {
  base: '/',
  title: 'はじめてのVuePress',
  description: 'VuePressを使用したサイトです。',
  port: '8000',
  dest: 'build',
  head: [
      ['meta', {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}],
      ['meta', {name: 'keywords', content: 'hoge,fuga,piyo'}],
  ],
  locales: {
    '/': {
      lang: 'ja',
      title: 'はじめてのVuePress',
      description: 'description jp',
    },
    '/en/': {
      lang: 'en',
      title: 'hello VuePress',
      description: 'this site generated from VuePress.',
    }
  },
  chainWebpack: config => {
    config.plugin('loader-option')
      .use(webpack.LoaderOptionsPlugin, [
        {
          options: {
            stylus: {
              import: [path.resolve(__dirname, './global.styl')]
            }
          }
        }
      ])
  }
}