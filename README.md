# oscal-processor
This is a simple NodeJS OSCAL processor. The goal of the project is to facilitate usage of OSCAL - either input or output.

# Usage
## Requirements;
* ajv
* ajv-formats

Note: Both dependencies must be injected via the dependencies object, when initiating the processor;
    ``` const oscalProcessor = require('oscalProcessor')({ ajv, ajvFormats}, <opt - Schema>)
