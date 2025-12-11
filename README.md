# split-sentences

LaTeX 文書の句点（。！？）で改行を挿入するツール。
Git diff を見やすくするため、1文1行にします。

## 使い方

```bash
# カレントディレクトリの sotsuron.tex を処理（上書き）
npx github:smkwlab/split-sentences

# 別のファイルを指定
npx github:smkwlab/split-sentences main.tex

# 出力ファイルを別に指定
npx github:smkwlab/split-sentences input.tex output.tex
```

## 機能

- 「。」「！」「？」の後に改行を挿入
- `verbatim`、`lstlisting`、`minted` 環境は保護（コード例が壊れない）
- 閉じ括弧（）」）の直前は改行しない
- コメント行（%）の直前は改行しない

## 変換例

**変換前:**
```latex
本研究では、機械学習を用いた手法を提案する。提案手法は従来手法と比較して高い精度を達成した。
```

**変換後:**
```latex
本研究では、機械学習を用いた手法を提案する。
提案手法は従来手法と比較して高い精度を達成した。
```

## なぜ1文1行にするのか

Git で差分を見る際、1行に複数の文があると変更箇所が分かりにくくなります。
1文1行にすることで、どの文が変更されたかが明確になり、レビューが容易になります。

## License

MIT
