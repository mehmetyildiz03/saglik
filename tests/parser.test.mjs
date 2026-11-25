import test from 'node:test';import assert from 'node:assert/strict';import {parseLine,parseRows} from '../parser.js';import {findTest} from '../catalog.js';
// Case 1
// Case 2
// Case 3
// Case 4
// Case 5
// Case 6
// Case 7
// Case 8
// Case 9
// Case 10
// Case 11
// Case 12
test('strict report lines',()=>{assert.equal(parseLine('HGB 13,5 g/dL 12 - 16').value,13.5);assert.equal(parseLine('NEUT% 52 % 40-75').testId,'neutpct');assert.equal(parseLine('NEUT# 3.5 10^3/µL').testId,'neut');assert.equal(parseLine('Glukoz 100 mg/dL').testId,'glucose');for(const line of ['Kreatinin 0.9 mg/dL','HGB <13 g/dL','HGB 12 g/dL 16-12','HGB 13 g/dLjunk','HGB 13 g/dL 12'])assert.equal(parseLine(line),null);assert.equal(parseLine('LDL 120 mg/dL').testId,'ldl');assert.equal(parseRows([{text:'unknown 10 mg/dL',page:1}]).unresolved.length,1);assert.equal(findTest('LÖKOSİT')[0],'wbc')});
