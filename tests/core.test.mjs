import test from 'node:test';import assert from 'node:assert/strict';import {status,parseNumber,series,derive,seal,unseal,empty} from '../core.js';
test('missing reference is not normal',()=>assert.equal(status({value:2,low:null,high:null}),'Referans yok'));
test('range boundaries',()=>{assert.equal(status({value:2,low:2,high:4}),'Aralık içinde');assert.equal(status({value:5,low:2,high:4}),'Aralık üstünde')});
test('number validation',()=>{assert.equal(parseNumber('3,5'),3.5);assert.equal(parseNumber(''),null);assert.equal(parseNumber('1.2.3'),null)});
test('unit separation',()=>assert.equal(series([{name:'x',unit:'a',date:'2026-01-01'},{name:'x',unit:'b',date:'2026-01-01'}],'x','a').length,1));
test('encrypted roundtrip and wrong password',async()=>{const salt=crypto.getRandomValues(new Uint8Array(16)),key=await derive('test password 123',salt),raw=await seal(empty(),key,salt);assert.deepEqual((await unseal(raw,'test password 123')).data,empty());await assert.rejects(unseal(raw,'wrong'))});
