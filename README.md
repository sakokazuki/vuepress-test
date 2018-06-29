
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
https://github.com/sakokazuki/vuepress-test/blob/0.0.3/app/.vuepress/components/Home.vue

app/index.md, app/en/index.mdをどちらも以下のようにしましょう。
本当にこれだけ。これ以降もmdはこれ以外書かない方針にしました。
front matterでVueに変数渡せるんですがconfigでもできるので、なるべく一箇所にまとめたい意図があります。
```index.md
<home/>
```

ちょっとこの辺全体みないとややこしいのでgitで残しておきました。

https://github.com/sakokazuki/vuepress-test/tree/0.0.3


### head内にmetaをいれたい
config.jsにheadというオプションを追加します。

```config.js
~
head: [
    ['meta', {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}],
    ['meta', {name: 'keywords', content: 'hoge,fuga,piyo'}],
]
```
配列を追加していき、要素も配列です。
[0] タグ名
[1] Objectでattributeを指定

です。


[2]に要素の中身を入れられるので変化型としてこういう事もできます

インラインでjs
```
['script', { type: 'text/javascript' }, `
    console.log("head inner script");
`]
```

divタグを入れる
```
['div', {}, '<!--<div>hoge</div>-->']
```

### 言語別に<head>の中身を変える

VuePressのconfigにはlocalesというものがあって、
今回の例でいうとen/以下とdefault(ja)でlant,title,descriptionを
変更することができます。

https://vuepress.vuejs.org/guide/i18n.html#site-level-i18n-config

それでは書いていきましょう。

```config.js
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
}
```

```bash
yarn dev
```
確認してみましょう。
chromeで⌘⌥uでソース見ても何も書いていません。
⌘⌥iでElementみるとちゃんと入っているようですがdescriptionが重複していたり
なんだかおかしいです。

ビルドして確認してみましょう。

```bash
yarn build
```

...うまくいってますね。
本番ビルドが良ければまぁ開発に影響はないのでいいかなと思います。

ちなみにこのlocalesですがVueComponent内で
this.$localeConfigで参照できます。

Home.vueのmounted()のなかに`console.log(tihs.$localeConfig)`するだとか
vue-devtoolを使用すれば確認できるでしょう。


### styleの扱いに関して工夫する

僕は基本的にVueComponentごとにstyleを書く方針にしています。
`<style scoped>`とすれば他のコンポーネントに影響はでないので便利ですよね。
ですが色とかstylusのmixinとか変数や関数をグローバルで定義したくなるので
やってみようと思います。

その前に、config.jsにはchainWabpackというoptionがあります。
https://vuepress.vuejs.org/config/#chainwebpack

これはデフォルトのwebpackConfigを上書き/追加できるオプションで
VuePressはwebpack-chain(https://github.com/mozilla-neutrino/webpack-chain)
というwebpackConfigジェネレーターを内部で使用しているのでwebpack-chainの
記法で書く必要があります。

ひとまず、適当に変数が定義してあるstylusファイルを作りましょう

```bash
echo '$red = #ff0000' >> app/.vuepress/global.styl
```

そしてconfigのchainWebpackをつかってプラグインを追加します。
あ、webpackプラグインを使うのでwebpackをrequireしましょう。pathもついでに。

```config.js
const webpack = require('webpack')
const path = require('path')

module.exports = {
    ~,
    chainWebpack: config => {
        config.plugin('loader-option')
        .use(webpack.LoaderOptionsPlugin, [
            {
                options: {
                    stylus: {
                        import: [path.resolve(__dirname, './styles/variables.styl')]
                    }
                }
            }
        ])
    }
}
~
```

これでどこでも$redという変数が使えるようになりました。
適当にHome.vueで
```Home.vue
<style lang="stylus" scoped>
p
  color: $red
</style>
```
とでもしておきましょう。

ここまでの状態が以下のtagでみることができます
https://github.com/sakokazuki/vuepress-test/tree/0.0.4

### reset.css的なのいれる

ちょっと重め？のトピックが続いてしまいました。。
休憩がてらにcss resetしましょう。
2018年にもなってこんなことしたくないのですが最近のresetcss事情はどうなんでしょうか。

よく知らないので愚直にapp/.vuepress/theme/styles以下にreset.stylとか追加してLayout.vueで指定しちゃいましょう。
中身は各自おまかせします。。

```bash
touch app/.vuepress/theme/styles/reset.styl
```

```Layout.vue
<style src="./styles/reset.styl" lang="stylus"></style>
```
