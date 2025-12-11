#!/usr/bin/env node

/**
 * LaTeX 文書の句点（。！？）で改行を挿入するスクリプト
 * Git diff を見やすくするため、1文1行にする
 *
 * Usage:
 *   npx github:smkwlab/split-sentences
 *   npx github:smkwlab/split-sentences main.tex
 *   npx github:smkwlab/split-sentences input.tex output.tex
 */

const fs = require('fs');

const inputFile = process.argv[2] || 'sotsuron.tex';
const outputFile = process.argv[3] || inputFile;

if (process.argv[2] === '-h' || process.argv[2] === '--help') {
  console.log('Usage: npx github:smkwlab/split-sentences [input.tex] [output.tex]');
  console.log('');
  console.log('Options:');
  console.log('  input.tex   Input LaTeX file (default: sotsuron.tex)');
  console.log('  output.tex  Output file (default: overwrite input)');
  process.exit(0);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

let content = fs.readFileSync(inputFile, 'utf-8');

// 保護する領域を一時退避
const preserved = [];

// コメント部分を一時退避（% から行末まで、インラインコメントも含む）
// ただし \% はエスケープされたリテラルなので除外
const commentRegex = /(?<!\\)%.*$/gm;
content = content.replace(commentRegex, (match) => {
  preserved.push(match);
  return `__PRESERVED_${preserved.length - 1}__`;
});

// verbatim, lstlisting, minted 環境を一時退避（コード例が壊れないように）
const verbatimRegex = /\\begin\{(verbatim|lstlisting|minted)\}[\s\S]*?\\end\{\1\}/g;

content = content.replace(verbatimRegex, (match) => {
  preserved.push(match);
  return `__PRESERVED_${preserved.length - 1}__`;
});

// 「。」「！」「？」の後に改行がない場合、改行を挿入
// ただし、閉じ括弧（）」）の直前は除外
content = content.replace(/([。！？])(?![）」\n])/g, '$1\n');

// 退避した領域を復元（コメント部分、verbatim 環境）
content = content.replace(/__PRESERVED_(\d+)__/g, (_, i) => preserved[i]);

fs.writeFileSync(outputFile, content, 'utf-8');
console.log(`Done: ${outputFile}`);
