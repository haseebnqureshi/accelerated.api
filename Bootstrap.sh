#!/bin/bash

# Make sure to run this script as sudo su!

export DEBIAN_FRONTEND=noninteractive

echo "[ACCELERATED/Bootstrap.sh] Go get some coffee, this might take awhile ..."

echo "[ACCELERATED/Bootstrap.sh] -- Installing nodejs"

curl -sL https://deb.nodesource.com/setup_4.x | bash - > /dev/null
apt-get install nodejs -y > /dev/null

echo "[ACCELERATED/Bootstrap.sh] -- Installing nodejs build-essential"

apt-get install build-essential -y > /dev/null

echo "[ACCELERATED/Bootstrap.sh] -- Installing nodejs application"

npm install --loglevel=error > /dev/null

echo "[ACCELERATED/Bootstrap.sh] -- Installing git"

apt-get install git -y > /dev/null

echo "[ACCELERATED/Bootstrap.sh] -- Installing global npm packages"

npm install make -g --loglevel=error > /dev/null
npm install node-gyp -g --loglevel=error > /dev/null
npm install forever -g --loglevel=error > /dev/null
npm install bower -g --loglevel=error > /dev/null
npm install nodemon -g --loglevel=error > /dev/null

echo "[ACCELERATED/Bootstrap.sh] -- Running bower on www directory"

cd www
bower install --loglevel=error --allow-root --force-yes --force -y > /dev/null
cd ..

echo "[ACCELERATED/Bootstrap.sh] -- Installing rethinkdb as our standard"

bash BootstrapRethinkDB.sh

echo "[ACCELERATED/Bootstrap.sh] All done! Go and get started!"
