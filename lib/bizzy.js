'use strict';

const fs = require('fs');
const bzip2 = require('bzip2-maybe');
const {inherits} = require('util');
const assert = require('assert');
const {EventEmitter} = require('events');
const tar = require('tar-fs');
const tarStream = require('tar-stream');
const pipe = require('pipe-io');

inherits(Bizzy, EventEmitter);

module.exports = bizzy;

function check(from, to) {
    assert(typeof from === 'string', 'from should be a string!');
    assert(typeof to === 'string', 'to should be a string!');
}

function bizzy(from, to) {
    return new Bizzy(from, to);
}

function Bizzy(from, to) {
    check(from, to);
    
    process.nextTick(() => {
        EventEmitter.call(this);
        this._i = 0;
        this._n = 0;
        
        this._percent = 0;
        this._percentPrev = 0;
        
        this._from = from;
        this._to = to;
            
        this._parse(from, (error) => {
            if (error)
                return this._emitError(error);
            
            if (!this._n)
                return this._emitError(Error('No entries found'));
            
            return this._extract();
        });
    });
}

Bizzy.prototype._emitError = function(e) {
    this._wasError = true;
    this.emit('error', e);
}

Bizzy.prototype._extract  = function() {
    this.emit('start');
    
    const from = this._from;
    const to = this._to;
    const streamFile  = fs.createReadStream(from);
    const streamUnbzip = bzip2();
    const streamUntar = tar.extract(to);
    
    streamUntar.on('entry', header => {
        this._progress();
        this.emit('file', header.name);
    });
    
    streamUntar.on('finish', () => {
        this.emit('end');
    });
    
    pipe([
        streamFile,
        streamUnbzip,
        streamUntar
    ], (e) => {
        e && this._emitError(e);
    });
};

Bizzy.prototype._parse = function(name, callback) {
    const streamFile  = fs.createReadStream(name);
    const streamUnbzip = bzip2();
    const streamParse = tarStream.extract();
    
    streamParse.on('entry', (header, stream, callback) => {
        stream.on('end', () => {
            ++this._n;
            
            callback();
        });
        
        stream.resume();
    });
    
    streamParse.on('finish', callback);
    
    pipe([
        streamFile,
        streamUnbzip,
        streamParse
    ], (error) => {
        error && callback(error);
    });
};

Bizzy.prototype._progress = function() {
    ++this._i;
    
    const value = Math.round(this._i * 100 / this._n);
    
    this._percent = value;
    
    if (value !== this._percentPrev) {
        this._percentPrev = value;
        this.emit('progress', value);
    }
};

