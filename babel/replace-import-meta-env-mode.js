module.exports = function replaceImportMetaEnvMode({ types: t }) {
  function isImportMeta(node) {
    return (
      t.isMetaProperty(node) &&
      t.isIdentifier(node.meta, { name: 'import' }) &&
      t.isIdentifier(node.property, { name: 'meta' })
    );
  }

  function isImportMetaEnv(node) {
    return (
      t.isMemberExpression(node) &&
      isImportMeta(node.object) &&
      t.isIdentifier(node.property, { name: 'env' })
    );
  }

  function isImportMetaEnvMode(node) {
    return (
      t.isMemberExpression(node) &&
      isImportMetaEnv(node.object) &&
      t.isIdentifier(node.property, { name: 'MODE' })
    );
  }

  return {
    name: 'replace-import-meta-env-mode',
    visitor: {
      IfStatement(path) {
        const test = path.node.test;
        if (
          t.isBinaryExpression(test, { operator: '!==' }) &&
          t.isLogicalExpression(test.left, { operator: '&&' }) &&
          isImportMetaEnv(test.left.left) &&
          isImportMetaEnvMode(test.left.right) &&
          t.isStringLiteral(test.right, { value: 'production' })
        ) {
          path.get('test').replaceWith(t.identifier('__DEV__'));
        }
      },
    },
  };
};
