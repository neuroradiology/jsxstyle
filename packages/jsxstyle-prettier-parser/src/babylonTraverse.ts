import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import * as prettier from 'prettier';
import * as postcssParser from 'prettier/parser-postcss';

const seenValues: { [key: string]: string } = {};

// TODO: traverse TypeScript AST
// node.kind:
// - JsxSelfClosingElement
// - JsxElement
// component props:
// - JsxSelfClosingElement.attributes
// - JsxElement.openingElement.attributes
// property is a JsxAttribute
// value: JsxAttribute.initializer (StringLiteral)
// JsxAttribute.initializer.text

export default function babylonTraverse(ast: any): void {
  // TraverseOptions
  const traverseOptions: any = {
    JSXElement(path: NodePath<t.JSXElement>) {
      const node = path.node.openingElement;

      node.attributes.forEach(attr => {
        if (
          t.isJSXSpreadAttribute(attr) ||
          !attr.value ||
          !t.isStringLiteral(attr.value)
        ) {
          return;
        }

        if (!seenValues[attr.value.value]) {
          try {
            if (attr.value.value.includes(';')) {
              throw new Error('CSS values cannot contain semicolons');
            }

            // the minimal amount of CSS that the CSS parser can parse
            const wrapped = `__jsxstyle__:${attr.value.value};`;
            const cssAst = postcssParser.parsers.css.parse(wrapped, null, {});

            const value = prettier.__debug.formatAST(cssAst.nodes[0].value, {
              filepath: 'example.css',
              printWidth: 1000,
            });

            if (typeof value.formatted !== 'string') {
              throw new Error('formatted value is not a string!');
            }

            seenValues[attr.value.value] = value.formatted;
          } catch (e) {
            console.error(e);
            return;
          }
        }

        attr.value = t.stringLiteral(seenValues[attr.value.value]);
        // TODO: figure out a better way to set the raw value
        (attr.value as any).raw = JSON.stringify(seenValues[attr.value.value]);
      });

      return null;
    },
  };

  traverse(ast, traverseOptions);
}
