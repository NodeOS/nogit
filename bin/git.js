#!/usr/bin/env node

require('../lib/es6'); // polyfills
var program = require('commander');
var commands = {
  archive: require('../commands/archive'),
  clone: require('../commands/clone'),
  config: require('../commands/config'),
  lsRemote: require('../commands/ls-remote'),
  revList: require('../commands/rev-list')
};
var config = require('../lib/config');
var proxy = require('../lib/proxy');

config.read(function(config) {
  program
    .version(require('git-node').version)

  program
    .command('archive <ref>')
    .description('Create an archive of files from a named tree')
    .option('--format <tar|zip>', 'format of the resulting archive: tar or zip')
    .option('--prefix <path>', 'prepend <prefix>/ to each filename in the archive')
    .action(commands.archive);
    
  program
    .command('clone <url> [dir]')
    .description('Clone a repository into a new directory')
    .option('-b, --branch <branch/tag/ref>', 'checkout to specefic branch, tag or ref')
    .option('--depth <num>', 'do a shallow clone with num commits deep')
    .option('--mirror', 'not supported yet (will act as a "git fetch")')
    .option('--progress', 'show progress status')
    .option('--template <path>', 'not supported')
    .action(commands.clone);

  program
    .command('config')
    .description('Get repository options')
    .option('--get <key>', 'get the value for a given key')
    .action(commands.config);

  program
    .command('ls-remote <repo>')
    .description('List references in a remote repository')
    .option('-t, --tags', 'limit to tags')
    .option('-h, --heads', 'limit to heads')
    .action(commands.lsRemote);
    
  program
    .command('rev-list <branch>')
    .description('Lists commit objects in reverse chronological order')
    .option('-n, --max-count <n>', 'limit the number of commits to output', parseInt)
    .action(commands.revList);

  proxy.enableIfRequired();
  
  fixNumArgs();
  program.parse(process.argv);

  if (process.argv.length < 3) {
    program.outputHelp();
    process.exit(1);
  }

  function fixNumArgs() {
    for (var i = 0; i < process.argv.length; ++i) {
      if (/^-[a-zA-Z](\d+)$/g.test(process.argv[i])) {
        process.argv.splice(i + 1, 0, process.argv[i].slice(2));
        process.argv[i] = process.argv[i].slice(0, 2);
      }
    }
  }
});