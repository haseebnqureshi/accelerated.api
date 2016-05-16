#!/bin/bash

rsync -avP example $PWD
rsync -avP example/env.json $PWD/env.json --ignore-existing

# if our node path is different than this npm package, 
# we install our example

CWD=$(pwd)
if [ "$CWD" != "$PWD" ]; then
	cd $PWD/example
	npm install --unsafe-perm
fi
