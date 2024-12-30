import { CodemodPlugin } from 'vue-metamorph';
import path from 'path';

class RelativePath {
  constructor(
    /**
     * The path to the file as relative path from the source file.
     * 
     * @example '../utils'
     */
    private readonly importPath: string,
    /**
     * The absolute path to the source file from the root of the filesystem.
     * 
     * @example '/home/user/project/src/utils/index.ts'
     */
    private readonly filePath: string,
    /**
     * The directory where the source file is located as absolute path from the root of the filesystem.
     * 
     * @example '/home/user/project/src'
     */
    private readonly projectSource: string,
  ) {
    if (!RelativePath.isValid(this.importPath)) {
      throw new Error('Path is not relative');
    }
  }

  static isValid(path: string) {
    return path.startsWith('./') || path.startsWith('../');
  }

  toAbsolutePath() {
    const fileDir = path.dirname(this.filePath);
    const absoluteFromSystem = path.resolve(fileDir, this.importPath);
    const absoluteFromProject = absoluteFromSystem.replace(this.projectSource, 'src');
    return absoluteFromProject;
  }
}

export const absolutePathCodemod: CodemodPlugin = {
  type: 'codemod',
  name: 'absolute-path',
  transform({ scriptASTs, filename, utils: { astHelpers }, opts: { projectSource } }) {
    let transformCount = 0;

    for (const scriptAST of scriptASTs) {
      astHelpers
        .findAll(scriptAST, { type: 'ImportDeclaration' })
        .forEach((importDeclaration) => {
          if (typeof importDeclaration.source.value === 'string' && importDeclaration.source.value.startsWith('@')) {
            importDeclaration.source.value = importDeclaration.source.value.replace(/^@/, 'src');
            transformCount++;
          }

          if (typeof importDeclaration.source.value === 'string' && RelativePath.isValid(importDeclaration.source.value)) {
            importDeclaration.source.value = new RelativePath(importDeclaration.source.value, filename, projectSource).toAbsolutePath();
            transformCount++;
          }
        });
    }

    return transformCount;
  },
};
