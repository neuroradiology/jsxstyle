import * as prettier from 'prettier';
import babylonTraverse from './babylonTraverse';
import typescriptTraverse from './typescriptTraverse';
import { inferParser } from './utils';

const parse: prettier.CustomParser = (text, parsers, options): null | void => {
  if (!options.filepath) {
    return null;
  }

  const parserName = inferParser(options.filepath, options.plugins);

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

  if (parserName === 'babylon') {
    babylonTraverse(ast);
  } else {
    typescriptTraverse(ast);
  }

  return ast;
};

export = parse;
