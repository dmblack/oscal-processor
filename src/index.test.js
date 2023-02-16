/* global describe expect it */

const oscalProcessor = require('./index.js');
const schema = require('./OSCAL/json/schema/oscal_complete_schema.json');
const validOSCAL = require('./setupTests');

describe('The module import behavior under key criteria;', () => {
  it('Should return an empty object when missing the mandatory dependencies', () => {
    expect(oscalProcessor(false)).toEqual({});
  });

  it('Should return the processor with default schema with no dependencies', () => {
    expect(typeof oscalProcessor() === 'object').toBeTruthy();
  });

  it('Should return the processor with the supplied schema, when supplied', () => {
    expect(typeof oscalProcessor(schema) === 'object').toBeTruthy();
  });
});

describe('That, post import; subsequent processor operate with key criteria', () => {
  it('oscalProcessor - Should have a process property', () => {
    expect(oscalProcessor(schema)).toHaveProperty('process');
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(oscalProcessor()).toHaveProperty('process');
  });

  it('oscalProcessor - Should (process property) be a function', () => {
    expect(typeof oscalProcessor(schema).process === 'function').toBeTruthy();
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(typeof oscalProcessor().process === 'function').toBeTruthy();
  });

  it('oscalProcessor - Should return null with invalid (or empty) input', () => {
    expect(oscalProcessor(schema).process() === null).toBeTruthy();
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(oscalProcessor().process() === null).toBeTruthy();
  });

  it('oscalProcessor - Should return null with input of valid type, but invalid value', () => {
    expect(oscalProcessor(schema).process({ key: 'value' }) === null).toBeTruthy();
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(oscalProcessor().process({ key: 'value' }) === null).toBeTruthy();
  });

  it('oscalProcessor - Should return an object with valid input', () => {
    expect(typeof oscalProcessor(schema).process(validOSCAL) === 'object').toBeTruthy();
  });

  it('oscalProcessor - Should return the same, without a schema', () => {
    expect(typeof oscalProcessor().process(validOSCAL) === 'object').toBeTruthy();
  });

  it('oscalProcessor - Should return an object without a process property', () => {
    const result = oscalProcessor(schema).process(validOSCAL);
    expect(typeof result.process === 'undefined').toBeTruthy();
  });
});
