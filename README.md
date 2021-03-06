## VuePressとは

こちらの記事にうまくまとまっていました。
https://qiita.com/dojineko/items/aae7e6d13479e08d49fd

個人的な理解としてはNuxt.jsよりもサイト作成に特化した静的サイトジェネレーター
という感じです。

Nuxt.jsもさわってみたんですがgenerateされるファイル群の見た目？や使い勝手など
VuePressは静的サイトにより特化している印象でした。

執筆時(2018.6.28)VuePressのバージョンは0.10.2
です。

## 序文

ここ数年、gulpはもう辛いからwebpackオンリーでとかParcelのほうが速いとか
話題になってましたが結局どれ使おうが最終的に書くのはHTML(pug) + css(stylus/sass) + js(jquery)

そもそもその構成が辛いよなぁとおもいながら幸せになれる環境を求めていました。

そんな中、2018年4月某日。VuePressの登場です。
可能性を感じたのでひと通り仕事で使ってみたのでご紹介させていただければと思います。

VuePressの良いところはVueアプリケーションをつくる感覚で制作をして
最後にビルドすれば静的なサイトになるという点がほぼ全てです。
Viewをコンポーネント志向でつくることができて、サイトの状態管理はVuexが使えます。

デメリットといえばVue.jsの学習コストや本記事で説明していくようなVuePressへの慣れだと思います。

記事を読みながらコピペすれば動かせるを目標にかなり丁寧に書いたつもりです。
その分、すごく長い記事になってしまいましたがある程度のところまで読めば
VuePressの可能性にかけたくなる気持ちが理解して頂けるような気がしています。

最終的なリポジトリは以下になります。
https://github.com/sakokazuki/vuepress-test

## 導入
とりあえず何も考えずに

```bash
mkdir vuepress-test
cd vuepress-test
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
metaタグの設定まわりです。updatemetatag周辺もいらなければ消せばいいですが
もう少し理解が進んだらにしておきましょう。とりあえず残しておきます。

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

インラインでjs。

```
['script', { type: 'text/javascript' }, `
    console.log("head inner script");
`]
```

divタグを入れる。

```
['div', {}, '<!--<div>hoge</div>-->']
```

### 言語別に<head>の中身を変える

VuePressのconfigにはlocalesというものがあって、
今回の例でいうとen/以下とdefault(ja)でlang,title,descriptionを
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

よりシンプルになりました。

### 独自の改造を盛り込む

個人的にconfigと並ぶくらいに重要だと思っているのがここで説明する機能です。
ドキュメントには以下のように簡潔にしか書いてありませんが。
https://vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements

うまく説明ができないのですが.vuepress/enhanceAppp.js内でVueアプリケーションレベルで
いろいろ設定できるようになっているという感じでしょうか。
とりあえずenhanceApp.jsにいろいろ書けばなんとかなるというケースが非常に多かったです。


```bash
touch app/.vuepress/enhanceApp.js
```

例えば以下のように書けばvue-routerのミドルウェアとかを書く事もできますし、

```enhanceApp.js

export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  async function beforeEach(to, from, next) {
    console.log("before");
    return next();
  }
  
  async function afterEach(to, from, next) {
    console.log("after");
    await router.app.$nextTick()
  }

  router.beforeEach(beforeEach)
  router.afterEach(afterEach)
}
```

vueのプラグインを使ったり、mixinとかもここに書くのがいいのかなと思います。

```enhanceApp.js
~
Vue.use(MyPlugin);
Vue.mixin({
    created: function () {
        console.log("created")
    }
})
```

### Vuexをつかう

執筆時現在VuePress v0.10.2では標準でvuex使えるようになっていません。
なので自力でいれます。

```bash
yarn add -D vuex
```

先程のenhanceApp.jsのrouterミドルウェアと組み合わせて簡単な言語の状態を持つsotreをつくってみました。
長いのでコードはリンク先をみてみてください。
https://github.com/sakokazuki/vuepress-test/blob/0.0.5/app/.vuepress/enhanceApp.js


せっかくなのでHome.vueで現在の言語を表示してみたりしましょう。

```
computed: {
    ...mapState(['currentLang']),
}
```
https://github.com/sakokazuki/vuepress-test/blob/0.0.5/app/.vuepress/components/Home.vue

1度設定してしまえばあとはVuePressということを意識せずにVuexを使った
そこそこ複雑なwebサイトをつくることができます。
トリッキーなwebサイト制作ではいろんな場面で状態を持つコードを書くことが多いので
かなり大活躍します。
例えばウインドウのサイズをstoreのstateに保持しておいてリサイズ時にstoreにcommit、コンポーネントの更新
というわりかしきれいな流れでレスポンシブに変化するサイトをつくることができます。

他にも、この記事(https://qiita.com/RikutoYamaguchi/items/2fb1c1dc8be196dfc883)
を参考にさせていただきモーダルウインドウをつくりましたが、旧来やっていた方法と比べると
無理のない形で実装ができて満足度が高かったです。

https://github.com/sakokazuki/vuepress-test/tree/0.0.5

### ページ毎にheadの内容を出し分ける。

英語ページはメタタグのogを変えたいとかそういうったこと、頻繁にありますよね。
というわけでconfigのlocale部分にheadを書きましょう

```config.js
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
```

前はこれでできた気がしたのですが現在のバージョンではこの書き方では反映されません。
自前で実装しましょう。
VuePressのソースコードのlib/build.jsのrenderPageらへんが参考になりました。
というより関数を移植するだけです。

Layout.vueのcreated()に書いてある$ssrContextらへんの記述でビルド時にタイトルとか
ディスクリプションを設定してますが$ssrContextのパラメーターにuserHeadTagsという
stringがあるのでそれにmetaを追加するのがよさそうです。

```
userHeadTags: '<meta http-equiv="X-UA-Compatible" content="IE=edge">\n  <meta name="keywords" content="hoge,fuga,piyo">',
```

こんなパラメーターを持ってるので
```
$ssrContext.userHeadTags += '<meta og:type content="website">'
```
とかしたいイメージです。

とりあえずLayout.vueに書いたので興味があればみてみてください。
Layout.uve

https://github.com/sakokazuki/vuepress-test/blob/0.0.6/app/.vuepress/theme/Layout.vue

全体
https://github.com/sakokazuki/vuepress-test/tree/0.0.6

### build後のファイルが<link rel="prefetch">されるのやめる

build後のファイルを眺めていると関連リソースが全て`<link rel="prefetch">`で書かれています。
レスポンシブなサイトになっていて、別にSPでPC用のリソースをprefetchする必要のない場合など、
無駄なDLが発生するので切っておきましょう

```config.js
~
shouldPrefetch: ()=>{ return false }
```

## VuePressの悪いところ

ここまで実装ができていればかなりのVuePressに慣れるのではないかと思います。
きっと自分の目的に合わせて拡張していくことができると思います。

最後にこの素晴らしい環境VuePressですが逆に面倒な部分もあるので
そこを軽く紹介してこの記事を閉めます。

意外と気になる部分が1つしかなかったので
思い出したら追記します。


### windowオブジェクトでビルド時にコケる

単純な理由で、SSR時はwindowは存在しないので例えば、enhanceApp.jsに
```
window.addEventListener("resize", ()=>{
    
});
```
とか書いてしまうとビルド時にエラーでます。

対策としては
```
if(typeof window === 'undefined'){

}
```
で囲むとか、コンポーネントのmounted()に書くとかは考えられます。
created()はビルド時に実行されます。

同様の理由でwindowを使用しているjsライブラリをimportしているとエラーがおこるので
使用するときにrequireするという回避策を取らないといけません。

```
mounted(){
    const test = require('test')
}
```

面倒ですが、慣れるまでは頻繁にビルドして実際にサーバーにあげてみるのがいいとおもいます。

##　総括

長かったですね。
ここまで読んでくださった方はVuePressに希望を感じたのではないでしょうか。
なにか間違いなどに気づいた際はコメントいただけると嬉しいです。
よろしくおねがいします。



