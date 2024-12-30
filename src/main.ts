import { createVueMetamorphCli } from 'vue-metamorph';
import process from 'process';

import { absolutePathCodemod } from './plugins/absolute-path.js';

const cli = createVueMetamorphCli({
  // register plugins here!
  plugins: [
    absolutePathCodemod,
  ],
  additionalCliOptions: (program) => {
    program.option('--project-source <path>', 'The src directory of the project', process.cwd());
  }
});

process.on('SIGQUIT', cli.abort);
process.on('SIGTERM', cli.abort);
process.on('SIGINT', cli.abort);

cli.run();
