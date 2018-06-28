
執筆時(2018.6.28)vuepressのバージョンは0.10.2
## 導入
とりあえず何も考えずに
```bash
npm init
yarn add -D vuepress
```

vuepressの環境はここではapp以下に置くことにしましょう。
また、index.htmlに値するmdファイルをとりあえず置きます。
```bash
mkdir app
echo '# Hello VuePress' > app/index.md
```

package.jsonにコマンド書きます。

```package.json
"scripts": {
    "dev": "vuepress dev app",
    "build": "vuepress build app"
},
```

ここまで準備ができたら
```bash
yarn dev
```
でlocalhost:8080にアプリが立ち上がります。

これはデフォルトのテーマになっていてこのままだと
デフォルトテーマがなにしてるかもわからないのでカスタムできるように
プロジェクトにコピーします。

```bash
vuepress eject app
```

app/.vuepress以下にthemeというフォルダができました。
vuepressでは開発環境を.vuepress以下に、サイトのディレクトリ構成というか
サイトマップというのかをそれ以外で構築するようになっています。

```bash
mkdir app/en
echo '# Hello VuePress EN' > app/en/index.md
yarn dev
```

(※執筆時"export 'pathToComponentName' was not found in '@app/util'"というwarningが出てしまったが後々いらなくなるので無視します。)
とすればlocalhost:8080とlocalhost:8080/en/にindex.htmlが作られた状態になります。

ひとまずここまでで準備完了です。
次からデフォルトテーマを”webページ”を作りやすいように改造していきまーす。

ちなみに現状のフォルダ構成は以下になります。

```
app
├── .vuepress
│   └── theme
│       ├── AlgoliaSearchBox.vue
│       ├── etc...
├── en
│   └── index.md
└── index.md
```

## テンプレート改造

### いらないもの削っていく

ちょっとファイルが多いかな〜と思うのでどんどん削っていきましょう。

```bash
yarn dev
```

ここでは何も言及しなければtheme以下のファイルということにします。

まずはLayout.vueを
https://github.com/sakokazuki/vuepress-test/blob/0.0.1/app/.vuepress/theme/Layout.vue
この状態まで減らします。

```.vue
<Content :custom="false"/>
```
だけが元のファイルになかったもので、これはPage.vueに書いてあったものでmdの中身がContentになります。

そのあとにNotFount.vue以外を全部消しましょう。styles以下もフォルダは残して全部。

```
app/.vuepress/theme
├── Layout.vue
├── NotFound.vue
└── styles
```

これがミニマムな状態かと思います。
Layout.vueに残ったスクリプトは$ssrContextらへん(後述)と
metaタグの設定まわりです。updatemetatagらへんの長くなってるスクリプトは
サイト作成時にいらないなと思ったら消して個別に書き直すのもいいですが今回はそのままにしておきます。

### はじめてのビルド

そろそろ一回ビルドしてみてどんなファイルができあがるか確認したいですね。
その前にビルドの出力先を変えたいので、configを追加しておきます。

```bash
touch app/.vuepress/config.js
```

このconfigファイルがVuePressでは超重要な要素の1つになります。
リファレンスはこちら
https://vuepress.vuejs.org/config/#basic-config

とりあえず以下のように書きました。
baseはベースディレクトリ。暇な方は変えてみればどうなるかはわかるでしょう。
portで開発時のポート変えることができます。
ビルド先を好みに合わせて'build'にしました。確かdefaultはdestです。

```config.js
module.exports = {
    base: '/',
    title: 'はじめてのVuePress',
    description: 'VuePressを使用したサイトです。',
    port: '8000',
    dest: 'build',
}
```

ここまで設定したらついにビルドしてみましょう！

```bash
yarn build
```

無事にルートディレクトリにbuildができたとおもいます！
時間のある方は一度適当なサーバーにあげてみましょう。

とりあえず現状はこちら
https://github.com/sakokazuki/vuepress-test/tree/0.0.2

## さらなる高みへ

これ以降は各自好きなようにカスタマイズしていけばいいと思いますがせっかくなので
自分なりにやったことを順を追って紹介していきます。

### template言語をpugにする

pugになれると<>こいういうの書きたくなくなりますよね。
個人的にreactよりvueを使いたい理由の1つでもあります。
templateをpugにしましょう。

```bash
yarn add -D pug
```

```Layout.vue
<template lang="pug">
  .theme-container
    Content(:custom="false")
</template>

~
```

記憶では、このあとwebpackでloader書かないといけなかったきがするのですがこれでできました。
なにか問題があればこちら参考になるとおもいます。
https://qiita.com/gollowars/items/845baa30ceb7cc035919#pug%E3%82%92%E4%BD%BF%E3%81%86



### マークダウンの中でVueComponentを使う

VuePressは本来マークアップをマークダウンに書いてドキュメントとかの静的サイトをつくる用途の
ようですが、僕が仕事でつくるようなwebサイトはそれではつくれそうにないので
マークダウンはサイトのディレクトリ構成を決めるだけにして、ルートのVueComponentを指定するだけ
ということにしました。

https://vuepress.vuejs.org/guide/using-vue.html#using-components
ドキュメントにも記載されている通り、.vuepress/components以下のコンポーネントは
マークダウンから参照できるようです。

```bash
mkdir app/.vuepress/components
touch app/.vuepress/components/Home.vue
```

とりあえずHome.vueは以下
(あとではる)

app/index.md, app/en/index.mdをどちらも以下のようにしましょう。
本当にこれだけ。これ以降もmdはこれ以外書かない方針にしました。
front matterでVueに変数渡せるんですがconfigでもできるので、なるべく一箇所にまとめたい意図があります。
```index.md
<home/>
```

ちょっとこの辺全体みないとややこしいのでgitで残しておきました。

https://github.com/sakokazuki/vuepress-test/tree/0.0.3






VuePressではwebpackConfigにあたるものをconfig.jsで拡張できるようになっていて
config.jsのchainWebpackで設定します。
https://vuepress.vuejs.org/config/#chainwebpack

chain-webpack(https://github.com/mozilla-neutrino/webpack-chain)という
webpackConfigを作成するライブラリが内部で使われており、
この形式で記述し内部でconfigを作っているようなのでその記法で書いていきます。

```config.js
module.exports = {
    ~
    chainWebpack: config => {
        config
            .module.rule('pug')
            .test(/\.pug$/)
            .use('pug-plain-loader')
                .loader('pug-plain-loader')
                .end()
    }
}
```

