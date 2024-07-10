#!/bin/bash
# Initialize some dependencies

# OSCAL Schema
#   Downloads the latest release from OSCAL direct.
#   Note that this library is released as source code,
#   therefore; we cannot link to a 'release' the same as past library.
wget -P lib https://github.com/usnistgov/oscal-content/raw/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json
