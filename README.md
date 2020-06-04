# userscripts-bookmarklets

### 作ったユーザースクリプトやブックマークレットをシェア

[./distrubution](./distrubution)以下を利用

### [./distribution/bookmarklets](./distrubution/bookmarklets)

- ブラウザのブックマーク URL 欄に貼り付けるだけで済むソースコードを提供
  ![画像](./.readme/image/bookmarklet-input.png)

### [./distribution/userscripts](./distrubution/userscripts)

- Tampermonky プラグイン向けに提供
  ![画像](./.readme/image/tampermonkey-new-script.png)
  - 導入方法など
    https://rightcode.co.jp/blog/information-technology/tampermonkey-google-chrome-extended-function

### 設計思想

- 下記のとおり、`${app-file-name}`単位でマルチバンドルするトランスパイラ

  ```
  ■ source
  ├ ■ bookmarklets
  │ ├ ■ ${app-file-name}
  │ │ └ foo.js
  │ └ ${app-file-name}.js
  │
  └ ■ userscripts
    ├ ■ ${app-file-name}
    │ └ bar.js
    ├ ${app-file-name}.doc.js
    └ ${app-file-name}.js
  ```

  ↓

  ```
  ■ distribution
  ├ ■ bookmarklets
  │ └ ■ ${app-file-name}
  │   ├ ■ .readme
  │   ├ app.js
  │   └ README.md
  │
  └ ■ userscripts
    └ ■ ${app-file-name}
      ├ ■ .readme
      ├ app.js
      └ README.md
  ```

- `${app-file-name}.doc.js`は、Tampermonky プラグイン向けユーザースクリプトに必須の doc 記述
- 以下で登場する`${app-name}`は、分類ディレクトリ名を含めた下記いずれか
  - `bookmarklets/${app-file-name}`
  - `userscripts/${app-file-name}`
- 開発にあたっては、トランスパイルする`${app-name}`をコマンドで指定(複数可)し、ローカルファイル(`personal.yaml`)に永続化する
  - 目的は、バンドル対象及び`webpack-dev-server`に乗せるアプリケーションの絞り込み(マルチバンドルには常にパフォーマス懸念が付きまとう)
- `webpack-dev-server`は、`mockup/${app-name}.html`を参照して起動
- README 関連は、トランスパイル時に不存在の場合だけ新規作成

### コマンド

- `webpack`関連
  - `yarn dev`
    - `webpack`で`distribution/${app-name}`ディレクトリにファイルを直接出力しつつ、`webpack-dev-server` も実行
- `${app-name}`関連
  - `yarn app:add ${app-name}`
    - 新たに`${app-name}`を追記指定(スペース区切りで複数指定可)
  - `yarn app:set ${app-name}`
    - 新たに`${app-name}`を上書指定(スペース区切りで複数指定可)
  - `yarn app:has`
    - 現在トランスパイル対象として指定する事ができる名称(検索対象は`${app-name}.js`)をスペース区切りで列挙表示
  - `yarn app:new ({$app-file-name})`
    - 対話インターフェイスで`${app-name}`一式を生成(この入力では分類ディレクトリ名を必要とせず、`${app-file-name}`を用いる)
      - 分類ディレクトリ名は`bookmarklets`か`userscripts`か
      - `${app-file-name}`は何か(`app:new`コマンド実行時に引数として渡されていれば省略可)
      - `${app-name}`ディレクトリを作るか
      - `${app-name}`ディレクトリにサブモジュールを作るか
      - `mockup/${app-name}.html`を作る(`.tempula`ディレクトリ内のテンプレートを利用)か
      - `source/${app-name}.doc.js`を作る(`.tempula`ディレクトリ内のテンプレートを利用)か
      - `${app-name}`をもとに`app:set`または`app:add`コマンドを実行するか
  - `yarn app:now`
    - 現在指定されている`${app-name}`を表示
