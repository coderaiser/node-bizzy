'use strict';

const {EventEmitter} = require('events');
const {tmpdir} = require('os');
const {
    sep,
    join
} = require('path');
const {
    readFileSync,
    unlinkSync,
    rmdirSync,
    mkdtempSync
} = require('fs');

const test = require('tape');
const extract = require('..');

test('bizzy: extract: no args', (t) => {
    t.throws(extract, /from should be a string!/, 'should throw when no args');
    t.end();
});

test('bizzy: extract: to', (t) => {
    const fn = () => extract('hello');
    t.throws(fn, /to should be a string!/, 'should throw when no to');
    t.end();
});

test('bizzy: extract: error: file not found', (t) => {
    const expect = 'ENOENT: no such file or directory, open \'hello.tar.bz2\'';
    const extracter = extract('hello.tar.bz2', 'hello');
    
    extracter.on('error', (e) => {
        t.equal(e.message,  expect, 'should emit error when file not found');
        t.end();
    });
});

test('bizzy: extract', (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const fixture = join(__dirname, 'fixture');
    const from = join(fixture, 'bizzy.txt.tar.bz2');
    const extracter = extract(from, to);
    
    extracter.on('end', () => {
        const pathUnpacked = join(to, 'bizzy.txt');
        const pathFixture = join(fixture, 'bizzy.txt');
        
        const fileUnpacked = readFileSync(pathUnpacked);
        const fileFixture = readFileSync(pathFixture);
        
        unlinkSync(pathUnpacked);
        rmdirSync(to);
        
        t.deepEqual(fileFixture, fileUnpacked, 'should extract file');
        t.end();
    });
});

test('bizzy: extract: gz: invalid tar header', (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const fixture = join(__dirname, 'fixture');
    const from = join(fixture, 'awk.1.bz2');
    const extracter = extract(from, to);
    
    extracter.on('error', (e) => {
        const msg = 'Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?';
        t.equal(e.message, msg, 'should emit error');
        t.end();
        rmdirSync(to);
    });
});

test('bizzy: extract: empty: error', (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const fixture = join(__dirname, 'fixture');
    const from = join(fixture, 'empty.tar.bz2');
    const extracter = extract(from, to);
    
    extracter.on('error', (e) => {
        const msg = 'No entries found';
        t.equal(e.message, msg, 'should emit error');
        t.end();
        rmdirSync(to);
    });
});

test('bizzy: extract: tar', (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const fixture = join(__dirname, 'fixture');
    const from = join(fixture, 'bizzy.tar');
    const extracter = extract(from, to);
    
    extracter.on('end', () => {
        const pathUnpacked = join(to, 'bizzy.txt');
        const pathFixture= join(fixture, 'bizzy.txt');
        
        const fileUnpacked = readFileSync(pathUnpacked);
        const fileFixture = readFileSync(pathFixture);
        
        unlinkSync(pathUnpacked);
        rmdirSync(to);
        
        t.deepEqual(fileFixture, fileUnpacked, 'should extract file');
        t.end();
    });
});
