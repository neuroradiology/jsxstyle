import traverse, { NodePath, TraverseOptions } from '@babel/traverse';
import * as t from '@babel/types';
import * as prettier from 'prettier';

const seenValues: { [key: string]: string } = {};

export default function babylonTraverse(ast: any): void {
  const traverseOptions: TraverseOptions = {
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

        let value: string = attr.value.value;
        if (!seenValues[attr.value.value]) {
          try {
            const wrapped = `__jsxstyle__:${attr.value.value};`;
            const result = prettier
              .format(wrapped, {
                parser: 'css',
                printWidth: 1000,
              })
              .trim()
              .replace('\n', '');
            const match = result.match(/__jsxstyle__:(.+);$/);
            if (match) {
              value = match[1].trim();
            } else {
              throw new Error('no match!');
            }
          } catch (e) {
            console.error(e);
            return;
          }
        }

        attr.value = t.stringLiteral(value);
        // TODO: figure out a better way to set the raw value
        (attr.value as any).raw = `"${value}"`;
      });

      return null;
    },
  };

  traverse(ast, traverseOptions);
}
