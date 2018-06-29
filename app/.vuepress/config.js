const webpack = require('webpack')
const path = require('path')

module.exports = {
  base: '/__test/vuepress-test/',
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
      description: 'VuePressを使用したサイトです。',
      head: [
        ['meta', {property: "og:type", content: "website"}],
        ['meta', {property: "og:title", content: "はじめてのVuePress"}],
        ['meta', {property: "og:description", content: "VuePressを使用したサイトです。"}],
        ['meta', {property: "og:site_name", content: "はじめてのVuePress"}],
        ['meta', {property: "og:url", content: "http://localhost:8000"}],
        ['meta', {property: "og:image", content: "http://localhost:8000/og.png"}],
        ['meta', {property: "og:locale", content: "ja_JP"}],
        ['meta', {name: "twitter:card", content: "summary_large_image"}],
      ]
    },
    '/en/': {
      lang: 'en',
      title: 'hello VuePress',
      description: 'this site generated from VuePress.',
      head: [
        ['meta', {property: "og:type", content: "website"}],
        ['meta', {property: "og:title", content: "hello VuePress"}],
        ['meta', {property: "og:description", content: "this site generated from VuePress."}],
        ['meta', {property: "og:site_name", content: "hello VuePress"}],
        ['meta', {property: "og:url", content: "http://localhost:8000/en/"}],
        ['meta', {property: "og:image", content: "http://localhost:8000/og.png"}],
        ['meta', {property: "og:locale", content: "en_US"}],
        ['meta', {name: "twitter:card", content: "summary_large_image"}],
      ]
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