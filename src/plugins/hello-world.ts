import { CodemodPlugin } from 'vue-metamorph';

export const helloWorldCodemod: CodemodPlugin = {
  type: 'codemod',
  name: 'hello-world',
  transform({ scriptASTs, utils: { astHelpers } }) {
    let transformCount = 0;

    for (const scriptAST of scriptASTs) {
      astHelpers
        .findAll(scriptAST, { type: 'ImportDeclaration' })
        .forEach((importDeclaration) => {
          if (typeof importDeclaration.source.type === 'string') {
            importDeclaration.source.value = 'vue';
            transformCount++;
          }
        });
    }

    return transformCount;
  },
};
