import { CodemodPlugin } from 'vue-metamorph';

export const helloWorldCodemod: CodemodPlugin = {
  type: 'codemod',
  name: 'hello-world',
  transform({ scriptASTs, utils: { astHelpers } }) {
    let transformCount = 0;

    for (const scriptAST of scriptASTs) {
      // or, using the findAll helper
      astHelpers
        .findAll(scriptAST, { type: 'Literal' })
        .forEach((literal) => {
          if (typeof literal.value === 'string') {
            literal.value = 'Hello, world!';
            transformCount++;
          }
        });
    }

    return transformCount;
  },
};
