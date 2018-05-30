import jsxstyleParser = require('jsxstyle-prettier-parser');
import * as prettier from 'prettier';

const demoSource = `
import { Block } from 'jsxstyle';

<Block
  color="rgba(0,0,0,.1) "
  backgroundImage="linear-gradient( to bottom,  0% red, 100% blue )"
/>;

<div
  color="rgba(0,0,0,.1) "
  backgroundImage="linear-gradient( to bottom,  0% red, 100% blue )"
/>;
`;

describe('prettier-plugin-jsxstyle', () => {
  it('parses JS files', () => {
    const output = prettier.format(demoSource, {
      filepath: 'test.js',
      parser: jsxstyleParser,
    });

    expect(output).toMatchSnapshot();
  });

  it('parses TSX files', () => {
    const output = prettier.format(demoSource, {
      filepath: 'test.tsx',
      parser: jsxstyleParser,
    });

    expect(output).toMatchSnapshot();
  });

  it('does not parse non-TS/JS files with jsxstyle-prettier-parser', () => {
    const getOutput = () => {
      prettier.format('whatever', {
        filepath: 'test.css',
        parser: jsxstyleParser,
      });
    };

    expect(getOutput).toThrowErrorMatchingSnapshot();
  });
});
