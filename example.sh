#!/bin/bash

# pass our desired absolute path to install example as 
# npm run-script example YOUR_ABSOLUTE_PATH_HERE

rsync -avP example $1
rsync -avP example/env.json $1/env.json --ignore-existing
cd $1/example
npm install --unsafe-perm
