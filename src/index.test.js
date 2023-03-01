/* global describe expect it */

const oscalProcessor = require('./index.js');
const schema = require('./OSCAL/json/schema/oscal_complete_schema.json');
const validOSCAL = require('./setupTests');
const ajv = require('ajv');
const ajvFormats = require('ajv-formats');

const dependencies = {
  ajv,
  ajvFormats
}

describe('The module import behavior under key criteria;', () => {
  it('Should return an empty object when missing the mandatory dependencies', () => {
    expect(oscalProcessor(dependencies, false)).toEqual({});
  });

  it('Should return the processor with default schema with no dependencies', () => {
    expect(typeof oscalProcessor(dependencies) === 'object').toBeTruthy();
  });

  it('Should return the processor with the supplied schema, when supplied', () => {
    expect(typeof oscalProcessor(dependencies, schema) === 'object').toBeTruthy();
  });
});

describe('That, post import; subsequent processor operate with key criteria', () => {
  it('oscalProcessor - Should have a process property', () => {
    expect(oscalProcessor(dependencies, schema)).toHaveProperty('process');
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(oscalProcessor(dependencies)).toHaveProperty('process');
  });

  it('oscalProcessor - Should (process property) be a function', () => {
    expect(typeof oscalProcessor(dependencies, schema).process === 'function').toBeTruthy();
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(typeof oscalProcessor(dependencies).process === 'function').toBeTruthy();
  });

  it('oscalProcessor - Should return an empty object with invalid (or empty) input', () => {
    expect(oscalProcessor(dependencies, schema).process()).toEqual({});
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(oscalProcessor(dependencies).process()).toEqual({});
  });

  it('oscalProcessor - Should return an empty object with input of valid type, but invalid value', () => {
    expect(oscalProcessor(dependencies, schema).process({ key: 'value' })).toEqual({});
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(oscalProcessor(dependencies).process({ key: 'value' })).toEqual({});
  });

  it('oscalProcessor - Should return an object with valid input', () => {
    expect(typeof oscalProcessor(dependencies, schema).process(validOSCAL) === 'object').toBeTruthy();
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(typeof oscalProcessor(dependencies).process(validOSCAL) === 'object').toBeTruthy();
  });

  it('oscalProcessor - Should return an object without a process property', () => {
    const result = oscalProcessor(dependencies, schema).process(validOSCAL);
    expect(typeof result.process === 'undefined').toBeTruthy();
  });
});
