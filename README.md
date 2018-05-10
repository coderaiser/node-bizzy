# Bizzy [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

Extract .tar.bz2 archives with emitter.

## Global

`Bizzy` could be installed global with

```
npm i bizzy -g
```

And used this way:

```
Usage: bizzy [filename]
Options:
  -h, --help      display this help and exit
  -v, --version   output version information and exit
```

## Local

`Bizzy` could be used localy. It will emit event on every extracted file.
Good for making progress bars.

### Install

```
npm i bizzy --save
```

### How to use?

- `from` - path to **.tar.bz2** archive
- `to` - path to directory where files would be stored.

```js
const bizzy = require('bizzy');
const path = require('path');
const cwd = process.cwd();
const name = 'pipe.tar.bz2';
const to = cwd + '/pipe-io';
const from = path.join(cwd, name);

const extract = bizzy(from, to);

extract.on('file', (name) => {
    console.log(name);
});

extract.on('progress', (percent) => {
    console.log(percent + '%');
});

extract.on('error', (error) => {
    console.error(error);
});

extract.on('end', () => {
    console.log('done');
});
```

In case of starting example output should be similar to:

```
33%
67%
100%
done
```

## Related

- [Jag](https://github.com/coderaiser/node-jag "Jag") - Pack files and folders with tar and gzip.
- [Jaguar](https://github.com/coderaiser/node-jaguar "Jaguar") - Pack and extract .tar.gz archives with emitter.
- [OneZip](https://github.com/coderaiser/node-onezip "OneZip") - Pack and extract zip archives with emitter.
- [Tar-to-zip](https://github.com/coderaiser/node-tar-to-zip "tar-to-zip") - Convert tar and tar.gz archives to zip.
- [Copymitter](https://github.com/coderaiser/node-copymitter "Copymitter") - Copy files with emitter.
- [Remy](https://github.com/coderaiser/node-remy "Remy") - Remove files with emitter.

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/bizzy.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/node-bizzy/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/node-bizzy.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/bizzy "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/node-bizzy  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/node-bizzy "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/coderaiser/node-bizzy?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/node-bizzy/badge.svg?branch=master&service=github

