# oscal-processor
This is a simple NodeJS OSCAL processor. The goal of the project is to facilitate usage of OSCAL - either input or output.

# Usage
## Requirements;
* ajv
* ajv-formats

Note: Both dependencies must be injected via the dependencies object, when initiating the processor;
    ``` const oscalProcessor = require('oscalProcessor')({ ajv, ajvFormats}, <opt - Schema>)

# Further (from the developer) Notes
  This project is being developed on my own time, with many constraints
such as internet connectivity - and multiple systems. In some cases; my 
development lifecycle is inconsistent, resulting in broken or stale 
branches - often resolved with large sudden commit changes to the 
project. I do apologise in advance for any inconvenience this creates.
