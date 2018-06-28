
執筆時(2018.6.28)vuepressのバージョンは0.10.2
## 導入
とりあえず何も考えずに
```
npm init
yarn add -D vuepress
```

vuepressの環境はここではapp以下に置くことにする。
また、index.htmlに値するmdファイルをとりあえず置く。
```
mkdir app
echo '# Hello VuePress' > app/index.md
```

package.jsonにコマンド書く

```package.json
"scripts": {
    "dev": "vuepress dev app",
    "build": "vuepress build app"
},
```

ここまで準備ができたら
```
yarn dev
```
でlocalhost:8080にアプリが立ち上がる。

これはデフォルトのテーマになっていてこのままだと
デフォルトテーマがなにしてるかもわからないのでカスタムできるように
プロジェクトにコピーする

```
vuepress eject app
```

app/.vuepress以下にthemeというフォルダができる。
vuepressでは開発環境を.vuepress以下に、サイトのディレクトリ構成というか
サイトマップというのかをそれ以外で構築する。

```
mkdir app/en
echo '# Hello VuePress EN' > app/en/index.md
yarn dev
```

(※執筆時"export 'pathToComponentName' was not found in '@app/util'"というwarningが出てしまったが後々いらなくなるので無視する)
とすればlocalhost:8080とlocalhost:8080/en/にindex.htmlが作られた状態になる。

ひとまずここまでで準備完了ということにしておく。
次からデフォルトテーマを”webページ”を作りやすいように改造していく。

ちなみに現状のフォルダ構成は以下

app
├── .vuepress
│   └── theme
│       ├── AlgoliaSearchBox.vue
│       ├── etc...
├── en
│   └── index.md
└── index.md

## テンプレート改造

### いらないもの削っていく

ちょっとファイルが多いかな〜と思うのでどんどん削っていく

```
yarn dev
```