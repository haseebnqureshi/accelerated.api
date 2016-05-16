#!/bin/bash

# pass our desired absolute path to install example as 
# npm run-script example YOUR_ABSOLUTE_PATH_HERE

rsync -avP example/* $1 --ignore-existing
cd $1
npm install accelerated.api.body-parser --save --unsafe-perm
npm install accelerated.api.module --save --unsafe-perm
npm install accelerated.api.versioning --save --unsafe-perm
