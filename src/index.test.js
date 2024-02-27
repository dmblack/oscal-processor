/* global describe expect it */
const OSCALProcessor = require('./index.js');
const schema = require('./OSCAL/json/schema/oscal_complete_schema.json');
const catalogSchema = require('./setupTests').catalogSchema;
// const validOSCAL = require('./setupTests').validOSCAL.profile;
const validOSCAL = require('./oscal-content/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json')
const ajv = require('ajv');
const ajvFormats = require('ajv-formats');
const struct = require('struct.js');

// Prepare our dependencies for inject.
const dependencies = {
  ajv,
  ajvFormats,
  struct
};

/**
 * Core Module section
 */
describe('MODULE;', () => {
  // INIT Tests..
  describe('The module import behavior under key criteria;', () => {
    // it('Should return an empty object when missing the mandatory dependencies', () => {
    //   expect(OSCALProcessor(dependencies, false)).toNotEqual({});
    // });
  
    it('Should return the processor with default schema with no dependencies', () => {
      expect(typeof OSCALProcessor(dependencies) === 'object').toBeTruthy();
    });
  
    it('Should return the processor with the supplied schema, when supplied', () => {
      expect(typeof OSCALProcessor(dependencies, schema) === 'object').toBeTruthy();
    });
  });
})

/**
 * Catalog section.
 */
describe('CATALOG;', () => {
  describe('Functionality of child properties, key operational criteria', () => {
    it('OSCALProcessor - Should contain the getOSCALElementByElementID property', () => {
      expect(OSCALProcessor(dependencies, schema, validOSCAL)).toHaveProperty('getOSCALElementByElementID');
    });

    it('OSCALProcessor - The getOSCALElementByElementID property should be a function', () => {
      expect(typeof OSCALProcessor(dependencies, schema, validOSCAL).getOSCALElementByElementID === 'function').toBeTruthy();
    });

    it('OSCALProcessor - The getOSCALElementByElementID function should return an Object', () => {
      expect(typeof OSCALProcessor(dependencies, schema, validOSCAL).getOSCALElementByElementID('fdac0321-959f-43ec-a91d-322da7d9761c') === 'object').toBeTruthy();
    });

    it('OSCALProcessor - Should contain the getSchemaByPropertyName property', () => {
      expect(OSCALProcessor(dependencies, schema, validOSCAL)).toHaveProperty('getSchemaByPropertyName');
    })

    it('OSCALProcessor - The getSchemaByPropertyName property should be a function', () => {
      expect(typeof OSCALProcessor(dependencies, schema, validOSCAL).getSchemaByPropertyName === 'function').toBeTruthy();
    });

    it('OSCALProcessor - The getSchemaByPropertyName property should return an (object)', () => {
      expect(OSCALProcessor(dependencies, schema, validOSCAL).getSchemaByPropertyName('#assembly_oscal-catalog_catalog')).toEqual(catalogSchema);
    });
  })

  describe('That, post import; subsequent processor operate with key criteria', () => {
    it('OSCALProcessor - Should have a process property', () => {
      expect(OSCALProcessor(dependencies, schema)).toHaveProperty('process');
    });

    it('OSCALProcessor - Should return the same, without a schema', () => {
      expect(OSCALProcessor(dependencies)).toHaveProperty('process');
    });

    it('OSCALProcessor - Should (process property) be a function', () => {
      expect(typeof OSCALProcessor(dependencies, schema).process === 'function').toBeTruthy();
    });

    it('OSCALProcessor - Should return the same, without a schema', () => {
      expect(typeof OSCALProcessor(dependencies).process === 'function').toBeTruthy();
    });

    it('OSCALProcessor - Should return an empty object with invalid (or empty) input', () => {
      expect(OSCALProcessor(dependencies, schema).process()).toEqual({});
    });

    it('OSCALProcessor - Should return the same, without a schema', () => {
      expect(OSCALProcessor(dependencies).process()).toEqual({});
    });

    it('OSCALProcessor - Should return an empty object with input of valid type, but invalid value', () => {
      expect(OSCALProcessor(dependencies, schema).process({ key: 'value' })).toEqual({});
    });

    it('OSCALProcessor - Should return the same, without a schema', () => {
      expect(OSCALProcessor(dependencies).process({ key: 'value' })).toEqual({});
    });

    it('OSCALProcessor - Should return an object with valid input', () => {
      expect(typeof OSCALProcessor(dependencies, schema).process(validOSCAL) === 'object').toBeTruthy();
    });

    it('OSCALProcessor - Should return the same, without a schema', () => {
      expect(typeof OSCALProcessor(dependencies).process(validOSCAL) === 'object').toBeTruthy();
    });

    it('OSCALProcessor - Should return an object without a process property', () => {
      expect(typeof OSCALProcessor(dependencies, schema).process(validOSCAL, 'profile').process === 'undefined').toBeTruthy();
    });
  });
});