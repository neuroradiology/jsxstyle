import t = require('@babel/types');
import { componentStyles } from 'jsxstyle-utils';
import util = require('util');

export const defaultStyleAttributes: Record<string, t.JSXAttribute[]> = {};

for (const componentName in componentStyles) {
  const styleObj = componentStyles[componentName];

  // skip `Box`
  if (!styleObj) {
    continue;
  }

  const propKeys: string[] = Object.keys(styleObj);
  const styleProps: t.JSXAttribute[] = [];

  for (const prop of propKeys) {
    const value = styleObj[prop];
    if (value == null || value === '') {
      continue;
    }

    let valueEx: t.JSXExpressionContainer | t.StringLiteral;
    if (typeof value === 'number') {
      valueEx = t.jsxExpressionContainer(t.numericLiteral(value));
    } else if (typeof value === 'string') {
      valueEx = t.stringLiteral(value);
    } else {
      throw new Error(
        util.format(
          'Unhandled type `%s` for `%s` component styles',
          typeof value,
          componentName
        )
      );
    }

    styleProps.push(t.jsxAttribute(t.jsxIdentifier(prop), valueEx));
  }

  defaultStyleAttributes[componentName] = styleProps;
}
