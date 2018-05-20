import * as path from 'path';
import * as prettier from 'prettier';

// Copied over from https://github.com/prettier/prettier/blob/bc78541/src/main/options.js#L112-L127
//   because prettier.getFileInfo returns a Promise :(
export const inferParser = (
  filepath: string,
  plugins?: Array<string | prettier.Plugin>
): string | null => {
  const extension = path.extname(filepath);
  const filename = path.basename(filepath).toLowerCase();

  const targetLanguage = prettier
    .getSupportInfo(null, { plugins })
    .languages.find(language => {
      const resultLanguage =
        language.since !== null &&
        ((language.extensions && language.extensions.indexOf(extension) > -1) ||
          (language.filenames &&
            language.filenames.find(name => name.toLowerCase() === filename)));

      return !!resultLanguage;
    });

  if (!targetLanguage) {
    return null;
  }

  return targetLanguage.parsers[0];
};

// const JSXSTYLE_SOURCES = {
//   jsxstyle: true,
//   'jsxstyle/preact': true,
// };
