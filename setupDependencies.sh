#!/bin/bash
# Initialize some dependencies

# OSCAL Schema
#   Downloads the latest release from OSCAL direct.
#   Releases do not include beta/dev.
wget -P lib https://github.com/usnistgov/OSCAL/releases/latest/download/oscal_complete_schema.json
