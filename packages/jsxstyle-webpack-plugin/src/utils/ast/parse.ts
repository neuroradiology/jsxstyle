import babelParser = require('@babel/parser');

export default function parse(
  code: string | Buffer,
  plugins: babelParser.ParserPlugin[] = []
): any {
  return babelParser.parse(code.toString(), {
    plugins: Array.from(
      new Set<babelParser.ParserPlugin>([
        'asyncGenerators',
        'classProperties',
        'dynamicImport',
        'functionBind',
        'jsx',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        ...plugins,
      ])
    ),
    sourceType: 'module',
  });
}
