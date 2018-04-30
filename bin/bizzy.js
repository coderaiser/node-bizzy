#!/usr/bin/env node

'use strict';

const bizzy = require('..');
const glob = require('glob');
const argv = process.argv;

const args = require('minimist')(argv.slice(2), {
    alias: {
        v: 'version',
        h: 'help',
    },
    unknown: (cmd) => {
        const name = info().name;
        
        console.error(
            `'%s' is not a ${name} option. See '${name} --help'.`, cmd
        );
        
        process.exit(-1);
    }
});

if (args.version)
    version();
else if (args.help)
    help();
else if (args.pack)
    getName(args.pack, name => {
        main('pack', name);
    });
else if (args.extract)
    getName(args.extract, name => {
        main('extract', name);
    });
else
    help();

function main(operation, file) {
    const cwd = process.cwd();
    const packer = bizzy(file, cwd);
    
    packer.on('error', error => {
        console.error(error.message);
    });
    
    packer.on('progress', percent => {
        process.stdout.write(`\r${percent}%`);
    });
    
    packer.on('end', () => {
        process.stdout.write('\n');
    });
}

function getName(str, fn) {
    glob(str, (error, files) => {
        if (error)
            return console.error(error.message);
        
        if (!files.length)
            return console.error('file not found');
        
        fn(files[0]);
    });
}

function version() {
    console.log(`v${info().version}`);
}

function info() {
    return require('../package');
}

function help() {
    const bin = require('../json/bin');
    const usage = `Usage: ${info().name} [path]`;
    
    console.log(usage);
    console.log('Options:');
    
    Object.keys(bin).forEach(name => {
        const line = `  ${name} ${bin[name]}`;
        console.log(line);
    });
}

