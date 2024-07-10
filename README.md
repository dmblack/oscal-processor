# oscal-processor
The goal/purpose of this simple
; 
  To provide an interface between software/users and OSCAL content.

An example of this may be;
  * a middleware between a frontend (web?) application, and the OSCAL.

The project is, ideally;
  * dependency lite, and
  * transparent and true to core OSCAL.

Considering the later; the project currently depends heavily on OSCAL, 
and oscal-content, from NIST. This is achieved now using direct web
requests to the official projects on github.

Note that consumers CAN override the schema by design. These are not 
hard links.

# Usage
## Requirements;
* ajv
* ajv-formats

Note: Both dependencies must be injected via the dependencies object, when initiating the processor;
    ``` const oscalProcessor = require('oscalProcessor')({ ajv, ajvFormats}, <opt - Schema>)

IMPORTANT: These dependencies are NOT bundled or included in the library
 in any way. Please ensure you include them in your project, and inject 
into this library.

This project, during the development experience, now uses little 
storage. Execute `npm run developer` to gather the additional developer 
dependencies.

(If you're using windows, please checkout the setupDevDependencies.sh 
scirpt for your required library files (catalog for testing, schema for 
core library))

# Further (from the developer) Notes
  This project is being developed on my own time, with many constraints
such as internet connectivity - and multiple systems. In some cases; my 
development lifecycle is inconsistent, resulting in broken or stale 
branches - often resolved with large sudden commit changes to the 
project. I do apologise in advance for any inconvenience this creates.
