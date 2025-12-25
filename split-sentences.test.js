#!/usr/bin/env node

/**
 * split-sentences.js のテスト
 * 実行: node split-sentences.test.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const SCRIPT = path.join(__dirname, 'split-sentences.js');

// テスト用一時ディレクトリ
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'split-sentences-test-'));

let passed = 0;
let failed = 0;

function test(name, input, expected) {
  const inputFile = path.join(tmpDir, 'input.tex');
  const outputFile = path.join(tmpDir, 'output.tex');

  fs.writeFileSync(inputFile, input);
  execSync(`node ${SCRIPT} ${inputFile} ${outputFile}`, { stdio: 'pipe' });
  const actual = fs.readFileSync(outputFile, 'utf-8');

  if (actual === expected) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}`);
    console.log(`  期待: ${JSON.stringify(expected)}`);
    console.log(`  実際: ${JSON.stringify(actual)}`);
    failed++;
  }
}

console.log('=== split-sentences テスト ===\n');

// 基本機能
test(
  '句点で改行を挿入',
  'これは文です。次の文です。',
  'これは文です。\n次の文です。\n'
);

test(
  '感嘆符で改行を挿入',
  'すごい！本当だ！',
  'すごい！\n本当だ！\n'
);

test(
  '疑問符で改行を挿入',
  'なぜ？どうして？',
  'なぜ？\nどうして？\n'
);

// 既に1文1行の場合
test(
  '既に1文1行の場合は変更なし',
  'これは文です。\n次の文です。\n',
  'これは文です。\n次の文です。\n'
);

// 閉じ括弧の処理
test(
  '閉じ括弧の前では改行しない（）',
  'これは文です（本当です。）次の文。',
  'これは文です（本当です。）次の文。\n'
);

test(
  '閉じ括弧の前では改行しない」',
  '「これは文です。」次の文。',
  '「これは文です。」次の文。\n'
);

// trailing spaces の処理
test(
  '句点後のスペース2つを削除して改行',
  'これは文です。  次の文です。',
  'これは文です。\n次の文です。\n'
);

test(
  '句点後のスペース1つを削除して改行',
  'これは文です。 次の文です。',
  'これは文です。\n次の文です。\n'
);

test(
  '句点後のタブを削除して改行',
  'これは文です。\t次の文です。',
  'これは文です。\n次の文です。\n'
);

test(
  '句点後のスペースとタブ混在を削除して改行',
  'これは文です。 \t 次の文です。',
  'これは文です。\n次の文です。\n'
);

test(
  '行末の trailing spaces を削除',
  'これは文です。  \n次の文です。\n',
  'これは文です。\n次の文です。\n'
);

test(
  '行末の trailing tabs を削除',
  'これは文です。\t\t\n次の文です。\n',
  'これは文です。\n次の文です。\n'
);

test(
  '句点なし行の trailing spaces も削除',
  'これは文です\t \n次の文です。\n',
  'これは文です\n次の文です。\n'
);

// Windows 改行の処理
test(
  'Windows改行（CRLF）を保持',
  'これは文です。\r\n次の文です。\r\n',
  'これは文です。\r\n次の文です。\r\n'
);

test(
  'Windows改行で余計な改行を入れない',
  'これは文です。次の文です。\r\n',
  'これは文です。\n次の文です。\r\n'
);

// コメントの保護
test(
  'コメント内の句点は処理しない',
  'これは文です。% コメント。次の行。\n次の文です。',
  'これは文です。% コメント。次の行。\n次の文です。\n'
);

// verbatim 環境の保護
test(
  'verbatim環境内は処理しない',
  'これは文です。\n\\begin{verbatim}\nコード。例。\n\\end{verbatim}\n次の文です。',
  'これは文です。\n\\begin{verbatim}\nコード。例。\n\\end{verbatim}\n次の文です。\n'
);

// 段落の保持
test(
  '空行（段落区切り）を保持',
  'これは文です。\n\n次の段落です。\n',
  'これは文です。\n\n次の段落です。\n'
);

// クリーンアップ
fs.rmSync(tmpDir, { recursive: true });

console.log(`\n=== 結果: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
