# Tarot Reading

大アルカナを使った、ブラウザ向けのタロット占いアプリです。外部ライブラリなしのHTML、CSS、JavaScriptで動作します。

## 起動方法

`index.html`をブラウザで開きます。ローカルHTTPサーバーを利用する場合は、プロジェクトのルートで次のように起動できます。

```powershell
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。

## データの編集

- カード情報：`js/data.js` の `cards`
- スプレッド情報：`js/data.js` の `spreads`
- カード裏面：`img/card-back.svg`（このプロジェクトで作成）

起動時に `img` ディレクトリ内のカード表面22枚と裏面画像を事前に読み込みます。画像名とカードの対応は `js/data.js` で管理し、読み込めない画像がある場合は画面と開発者コンソールに通知します。ブラウザからディレクトリの内容を直接列挙することはできないため、新しい画像を追加するときは同ファイルのカード定義にもパスを追加してください。

カードの意味は、各カードの `meanings.upright` と `meanings.reversed` を差し替えて追加します。

占い開始時には登録されている大アルカナ22枚をすべて裏向きで表示してシャッフルし、山札から選択したスプレッドに必要な枚数だけを取り出します。

```js
meanings: {
  upright: "正位置の意味文",
  reversed: "逆位置の意味文"
}
```

小アルカナも同じカード構造で `cards` に追加できます。

## 画像の出典と利用条件

アプリ画面の「画像の出典・利用条件」から `credits.html` を開けます。表示しているカード表面78枚と裏面1枚の情報は `image_sources.json` に保存されています。小アルカナ56枚の取得時メタデータは `minor_arcana_images/minor_arcana_sources.json` にあります。

画像を入れ替えた場合は出典データを更新し、`python build_credits.py` で一覧ページを再生成してください。大アルカナの画像はWikipediaから取得された縮小版で、取得時のファイル版までは記録されていません。

## GitHub Pages

公開先リポジトリは `git@github.com:freedom-deap/tarrot-app.git`、公開URLは `https://freedom-deap.github.io/tarrot-app/` を想定しています。GitHub のリポジトリ設定で **Settings → Pages → Build and deployment → Source: GitHub Actions** を選んでください。`main` へのプッシュで `.github/workflows/pages.yml` が公開用ファイルを配置します。

`python prepare_pages.py` で公開対象を `_site/` にローカル生成できます。公開対象は `index.html`、`credits.html`、`styles.css`、`js/`、`img/`、出典JSONのみです。取得元JPEGの複製、ダウンロード用スクリプト、メモは公開物に含めません。
