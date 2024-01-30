/**
 * oscalProcessor
 *
 *  Leveraging the official OSCAL Schema; oscalProcessor resolves the
 * entirety of the supplied OSCAL content, including all nested items.
 * oscalProcessor will fail if the content is not OSCAL compliant, but
 * is not designed to be a validator.
 *
 * @param {Object} schema - Optional SCHEMA to use for the OSCAL processor.
 * @returns (Object) The processor itself.
 */
const oscalProcessor = (dependencies, schema) => {
  if (typeof schema === 'undefined') {
    schema = require('./OSCAL/json/schema/oscal_complete_schema.json');
  } else if (typeof schema !== 'object' && schema.$comment !== 'OSCAL Unified Model of Models: JSON Schema') {
    return {};
  }

  const ajv = typeof dependencies.ajv === 'function'
    ? dependencies.ajv
    : false;
  const ajvFormats = typeof dependencies.ajvFormats === 'function'
    ? dependencies.ajvFormats
    : false;

  if (ajv === false || ajvFormats === false) {
    return {};
  }

  return Object.assign({}, schema, {
    /**
     * process
     * @param {Object} OSCAL - OSCAL (schema) compliant Object (JSON).
     * @returns The processed (resolved) OSCAL, or null.
     */
    process: (OSCAL, identifier) => {
      /**
       * We need a better method to perform OSCAL validation before processing.
       */
      if (typeof OSCAL !== 'object' || typeof OSCAL === 'undefined') {
        return {};
      }

      const validator = new ajv() || false;

      if (ajv === false) {
        return {};
      }

      ajvFormats(validator);

      if (validator.compile(schema)(OSCAL) === false) {
        return {};
      }

      /** process here */
      function resolveReferences(oscalObject, rootObject = identifier || oscalObject) {
        // Check if the given value is an object
        if (oscalObject !== null && typeof oscalObject === "object") {
          // If it's a reference, resolve it
          if (oscalObject.href) {
            const refId = oscalObject.href.replace(/^#/, "");
            const refObject = rootObject[refId];
            if (!refObject) {
              throw new Error(`Failed to resolve reference: ${oscalObject.href}`);
            }
            return resolveReferences(refObject, rootObject);
          }
      
          // Recursively resolve references in child objects
          Object.keys(oscalObject).forEach((key) => {
            oscalObject[key] = resolveReferences(oscalObject[key], rootObject);
          });
        }
      
        // Return the value
        return oscalObject;
      }

      return resolveReferences(identifier, OSCAL);
    }
  });
};

const oscal = require('./oscal-content/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json');
const ajv = require('ajv');
const ajvFormats = require('ajv-formats');
const dependencies = {
  ajv,
  ajvFormats
}

console.log(JSON.stringify(oscalProcessor(dependencies).process(oscal, 'ac-1')));

module.exports = oscalProcessor;

exports.default = oscalProcessor;
