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
const oscalProcessor = (schema) => {
  if (typeof schema === 'undefined') {
    schema = require('./OSCAL/json/schema/oscal_complete_schema.json');
  } else if (typeof schema !== 'object' && schema.$comment !== 'OSCAL Unified Model of Models: JSON Schema') {
    return {};
  }

  return Object.assign({}, schema, {
    /**
     * process
     * @param {Object} OSCAL - OSCAL (schema) compliant Object (JSON).
     * @returns The processed (resolved) OSCAL, or null.
     */
    process: (OSCAL) => {
      /**
       * We need a better method to perform OSCAL validation before processing.
       */
      if (typeof OSCAL !== 'object') {
        return null;
      }

      if (typeof OSCAL === 'object' && typeof OSCAL.profile === 'undefined') {
        return null;
      }

      /** process here */
      const result = Object.entries(schema).map(
        (keys) => {
          if (typeof (keys[0].metadata) === 'undefined') {
            return OSCAL;
          }

          return OSCAL;
        }
      );

      return result;
    }
  });
};

module.exports = oscalProcessor;

exports.default = oscalProcessor;
