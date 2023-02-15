/* global describe expect it */

const oscalProcessor = require('./index.js');
const schema = require('./OSCAL/json/schema/oscal_complete_schema.json');

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
})

describe('That, post import; subsequent processor operate with key criteria', () => {
  it('oscalProcessor - Should have a process property', () => {
    expect(oscalProcessor(schema)).toHaveProperty('process');
  })

  it('oscalProcessor - Should have a process property', () => {
    expect(oscalProcessor(schema)).toHaveProperty('process');
  })
})

