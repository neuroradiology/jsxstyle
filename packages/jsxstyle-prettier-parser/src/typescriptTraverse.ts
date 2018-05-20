export default function typescriptTraverse(ast: any): void {
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
}
