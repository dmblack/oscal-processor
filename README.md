# oscal-processor
This is a simple NodeJS OSCAL processor. The goal/purpose of this simple
; 
  To provide an interface between software/users and OSCAL content.

An example of this may be;
  * a middleware between a frontend (web?) application, and the OSCAL.

The project is, ideally;
  * dependency lite, and
  * transparent and true to core OSCAL.

Considering the later; the project currently depends heavily on OSCAL, 
and oscal-content, from NIST - as submodules. The 'releases' of the 
project will only bundle in the true 'hard' dependencies, such as the 
relevant core schema that NIST supply. Additionally; users CAN override 
the schema.

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
