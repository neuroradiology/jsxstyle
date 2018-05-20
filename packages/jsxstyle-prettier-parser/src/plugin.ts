import parser = require('./parser');

export const languages = [
  {
    name: 'JavaScript (jsxstyle)',
    since: '0.0.0',
    parsers: ['jsxstyle'],
    group: 'JavaScript',
    tmScope: 'source.js',
    aceMode: 'javascript',
    codemirrorMode: 'javascript',
    codemirrorMimeType: 'text/javascript',
    aliases: ['js', 'node'],
    extensions: ['.js'],
    linguistLanguageId: 183,
    vscodeLanguageIds: ['javascript'],
  },
  {
    name: 'JSX (jsxstyle)',
    since: '0.0.0',
    parsers: ['jsxstyle'],
    group: 'JavaScript',
    extensions: ['.jsx'],
    tmScope: 'source.js.jsx',
    aceMode: 'javascript',
    codemirrorMode: 'jsx',
    codemirrorMimeType: 'text/jsx',
    liguistLanguageId: 178,
    vscodeLanguageIds: ['javascriptreact'],
  },
  {
    name: 'TypeScript (jsxstyle)',
    since: '1.4.0',
    parsers: ['jsxstyle'],
    group: 'JavaScript',
    aliases: ['ts'],
    extensions: ['.ts', '.tsx'],
    tmScope: 'source.ts',
    aceMode: 'typescript',
    codemirrorMode: 'javascript',
    codemirrorMimeType: 'application/typescript',
    liguistLanguageId: 378,
    vscodeLanguageIds: ['typescript', 'typescriptreact'],
  },
];

const jsxstyleParser = {
  astFormat: 'estree',
  hasPragma: () => false,
  locEnd: node => node.end,
  locStart: node => node.start,
  parse: () => parser,
};

export const parsers = {
  jsxstyle: jsxstyleParser,
};

// export const printers = {
//   jsxstyle: estreePrinter,
// };
