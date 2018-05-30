import * as prettier from 'prettier';
import babylonTraverse from './babylonTraverse';

const parse: prettier.CustomParser = (text, parsers, options): null | void => {
  if (!options.filepath) {
    return null;
  }

  const fileInfo = prettier.getFileInfo.sync(options.filepath, {
    ...options,
    plugins: [],
  });

  const parserName = fileInfo.inferredParser;

  if (!parserName) {
    throw new Error(
      'Parser could not be inferred for `' + options.filepath + '`'
    );
  }

  if (
    // only handling JS and TS parsers
    parserName !== 'typescript' &&
    parserName !== 'babylon'
  ) {
    throw new Error(
      'jsxstyle-prettier-parser received an unsupported parser: `' +
        parserName +
        '`'
    );
  }

  const parser = parsers[parserName];
  const ast = parser(text);

  babylonTraverse(ast);

  return ast;
};

export = parse;
