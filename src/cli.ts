#!/usr/bin/env node
import * as yargs from 'yargs';
import { generate } from './generate-client';

interface IArgs extends yargs.Arguments {
  out: string;
  namespace: string;
  url?: string;
  file?: string;
  baseUrl?: string;
}

yargs
  .scriptName('openapi-ts-client-gen')
  .command('$0', 'generate client', args => {
    return args.options({
      'namespace': {
        alias: 'n',
        required: true,
        description: 'Module namespace'
      },
      'url': {
        alias: 'u',
        required: false,
        description: 'URL of swagger.json file'
      },
      'file': {
        alias: 'f',
        required: false,
        description: 'Path of swagger.json file'
      },
      'out': {
        alias: 'o',
        required: true,
        description: 'Output path (e.g. ./out/swagger.json)'
      },
      'baseUrl': {
        alias: 'b',
        required: false,
        description: 'Base URL of API'
      }
    })
  }, async _args => {
    const args = _args as IArgs;
    if (args.file) {
      await generate({
        type: 'file',
        srcPath: args.file,
        destPath: args.out,
        namespace: args.namespace
      });
    } else if (args.url) {
      await generate({
        type: 'url',
        srcPath: args.url,
        destPath: args.out,
        namespace: args.namespace
      });
    } else {
      console.error('must provide file or url');
      process.exit(1);
    }
  })
  .argv;
