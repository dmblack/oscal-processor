'use strict'
/**
 * OSCALProcessor
 *
 *  Leveraging the official OSCAL Schema; OSCALProcessor resolves the
 * entirety of the supplied OSCAL content, including all nested items.
 * OSCALProcessor will fail if the content is not OSCAL compliant, but
 * is not necessarily designed to be a validator.
 * @param {Object} dependencies - The mandatory dependencies for this
 *  processor. We require either ajv, and or struct.js - latter preferred.
 * @param {Object} schema - Optional SCHEMA to use for the OSCAL
 *  processor. This gives users the flexibility to reduce OSCAL down
 *  to individual properties.
 * 
 *  Note: A '$Comment' property, and value, are used for verification.
 *  If not provided; willdefault to the complete oscal schema.
 * @param {Object} oscal - The OSCAL we are going to process.
 * @returns {Object} The processor itself.
 */
const OSCALProcessor = (dependencies, schema, oscal, debug = false) => {
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
  const struct = typeof dependencies.struct === 'function'
    ? dependencies.struct
    : true;

  if (ajv === false || ajvFormats === false || struct === false) {
    return {};
  }

  // Helper function to check if an item is a URL
  // This is generally called by our resolveReferences function, and
  //  avoids conflict due to href ambiguity in uuid references, and
  //  url references.
  function isURL(target) {
    return /^http/.test(target);
  }

  const getSchemaByPropertyName = (propertyName, newSchemaAsObject = schema, newOSCALAsObject = oscal) => {
    /**
     * newSchemaAsObject.oneOf[0].properties[Object.keys(newSchemaAsObject.oneOf[0].properties)[0]]
     */

    // If our object is type correct
    const result = typeof newSchemaAsObject.oneOf === 'object' && Array.isArray(newSchemaAsObject.oneOf)
      ? newSchemaAsObject.oneOf.find((property) => {
        return property.properties[Object.keys(property.properties)[0]]['$ref'] === propertyName
      })
      : false;

    return result;
  }

  /**
   * getObjectByInstanceID
   * 
   * Should return the component 'object' by the supplied ID, if it exists.
   *  it MAY be possible for this to exhaust the stack, endless loop, if the
   *  object itself is referenced again before resolution. May need to include
   *  a counter to measure depth. (An additional parameter.. default 0)
   * 
   * @param {String} instanceIDAsString Unique ID of the instance to resolve.
   * @param {Object} newSchemaAsObject An override for OSCAL Schema
   * @param {Object} OSCALOverrideAsObject An override for the OSCAL.
   * @param {Number} depthAsNumber Depth of oscal to delve before exit, avoiding recursion.
   * @returns the resolved object, or false if not found.
   */
  const getOSCALElementByElementID = (instanceIDAsString, OSCALOverrideAsObject = oscal, depthAsNumber = 0) => {
    if (typeof depthAsNumber === 'number' && depthAsNumber >= 20) {
      if (debug) {
        console.warn('Depth threshold was exceeded. This could indicate a (valid) circular reference.');
      }
      return false;
    }
  
    if (typeof OSCALOverrideAsObject === 'object') {
      if (OSCALOverrideAsObject.uuid === instanceIDAsString) {
        return OSCALOverrideAsObject;
      }
  
      if (Array.isArray(OSCALOverrideAsObject)) {
        for (const element of OSCALOverrideAsObject) {
          if (element.uuid === instanceIDAsString) {
            return element;
          }
          const result = getOSCALElementByElementID(instanceIDAsString, element, depthAsNumber + 1);
          if (result) {
            return result; // Return the result if found in the recursive call.
          }
        }
      } else {
        for (const key in OSCALOverrideAsObject) {
          if (Object.prototype.hasOwnProperty.call(OSCALOverrideAsObject, key)) {
            const child = OSCALOverrideAsObject[key];
            if (typeof child === 'object') {
              const result = getOSCALElementByElementID(instanceIDAsString, child, depthAsNumber + 1);
              if (result) {
                return result; // Return the result if found in the recursive call.
              }
            }
          }
        }
      }
    }
  
    return false;
  };

  /**
   * resolveReferences - 'Resolves References' within an OSCAL object.
   * @param {object} oscalObject - The OSCAL Object we are interrogating.
   * @param {string} identifier - The UUID of the element we are resolving.
   * @param {Map} visited - A map of visited references, to avoid recursion.
   * @param {number} depth - A current depth iterator.
   * @returns The resolved reference requested.
   */
  const resolveReferences = (oscalObject, identifier, visited = new Map(), depth = 0) => {
    /**
     *  Assign our root object, post undefined checks.
     */
    const rootObject = typeof oscalObject !== 'undefined'
      ? oscalObject
      : identifier;

    /** 
     *  Due to ambiguous use; 'href' can literally be a URL (web target)
     * rather than another reference with the catalog. For this reason, 
     * we have some horrible 'isURL' tests here.
     */
    // Check if href is an external URL
    if (isURL(oscalObject)) {
      // Handle external URLs as needed, or simply return them as is
      return oscalObject;
    }
    
    if (typeof(oscalObject) === 'object') {
      if (typeof(oscalObject.href) !== 'undefined') {

        // Check if href is an external URL
        if (isURL(oscalObject.href)) {
          // Handle external URLs as needed, or simply return them as is
          return oscalObject;
        }
      }
    }

    // Base case to avoid infinite recursion
    if (depth > 20) {
      if (debug) {
        console.warn(`Maximum depth exceeded while resolving references.`);
      }
      return oscalObject;
    }
  
    if (oscalObject !== null && typeof oscalObject === 'object') {
      // Check for circular references
      if (oscalObject.uuid && visited.has(oscalObject.uuid)) {
        if (debug) {
          console.warn(`Circular reference detected for UUID: ${oscalObject.uuid}`);
        }
        return visited.get(oscalObject.uuid); // Return already resolved object
      }
  
      // Store this object in the visited map
      if (oscalObject.uuid) {
        visited.set(oscalObject.uuid, oscalObject);
      }
  
      // Resolve href references
      if (typeof oscalObject.href !== 'undefined') {
        const refId = oscalObject.href.replace(/^#/, '');
        const refObject = rootObject[refId] ? rootObject[refId] : null;
  
        if (!refObject) {
          if (debug) {
            console.warn(`Failed to resolve reference: ${oscalObject.href}. It may be an external reference, and not a URL.`);
          }
          return oscalObject; // Return original object if reference can't be resolved
        } else {
          return resolveReferences(refObject, rootObject, visited, depth + 1);
        }
      }
  
      // Recursively resolve references in child objects
      Object.keys(oscalObject).forEach((key) => {
        oscalObject[key] = resolveReferences(oscalObject[key], rootObject, visited, depth + 1);
      });
    }
  
    return oscalObject;
  };
  
  /**
   * process - The OSCAL Processor.
   *  A bit like an initator of the oscal-processor, returns the 
   * processed OSCAL.
   * 
   *  I'm actually a little confused as to the purpse of this function?
   * 
   * @param {Object} OSCAL The OSCAL to process
   * @returns The processed object, or false if it fails.
   */
  const process = (OSCAL) => {
    /**
     * We need a better method to perform OSCAL validation before processing.
     */
    if (typeof OSCAL !== 'object' || typeof OSCAL === 'undefined') {
      return {};
    }

    // Initiate our AJV (Another JSON Validator)
    const validator = new ajv() || false;
    // Expand with formats (iirc; required for date time)
    ajvFormats(validator);
    // Expose our validator.
    const validate = validator.compile(schema);

    if (validate(OSCAL) === false) {
      return {};
    }

    return (resolveReferences(OSCAL));
  }

  /**
   * The primary, returned, component.
   * @param {Object} schemaOverride The OSCAL schema used for the processor.
   * @returns The OSCALProcessor.
   */
  return Object.assign(
    {},
    {
      // our state
      state:
      {
        dependencies: dependencies,
        oscal: oscal,
        schema: schema,
      }
    }, {
    getOSCALElementByElementID: getOSCALElementByElementID,
    /**
     * resolvePropertyReferences
     * @param {String} propertyName Property to resolve - by name
     * @param {Object} newSchemaAsObject OSCAL Schema to use for resolution.
     *  Defaults to instantiated schema.
     * @param {Object} newOscalAsObject OSCAL to be used for resolution.
     *  Defaults to instantiated oscal.
     * @returns The identified/found object - or false for none.
     */
    getSchemaByPropertyName: getSchemaByPropertyName,
    resolveReferences: resolveReferences,
    /**
     * process
     * @param {Object} OSCAL - OSCAL Object (JSON) for processing.
     * @param {String} identifier - No idea what this was meant to be..
     * @returns The processed (resolved) OSCAL, or null.
    */
    process: process
  });
};

module.exports = OSCALProcessor;

exports.default = OSCALProcessor;
