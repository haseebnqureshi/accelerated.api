#!/bin/bash

# Make sure to run this script as sudo su!

export DEBIAN_FRONTEND=noninteractive

echo "[Accelerated/API/Bootstrap.sh] Go get some coffee, this might take awhile ..."

echo "[Accelerated/API/Bootstrap.sh] -- Installing nodejs"

curl -sL https://deb.nodesource.com/setup_4.x | bash - > /dev/null
apt-get install nodejs -y > /dev/null

echo "[Accelerated/API/Bootstrap.sh] -- Installing nodejs build-essential"

apt-get install build-essential -y > /dev/null

echo "[Accelerated/API/Bootstrap.sh] -- Installing nodejs application"

npm install --loglevel=error > /dev/null

echo "[Accelerated/API/Bootstrap.sh] -- Installing git"

apt-get install git -y > /dev/null

echo "[Accelerated/API/Bootstrap.sh] -- Installing global npm packages"

npm install make -g --loglevel=error > /dev/null
npm install node-gyp -g --loglevel=error > /dev/null
npm install forever -g --loglevel=error > /dev/null
npm install bower -g --loglevel=error > /dev/null
npm install nodemon -g --loglevel=error > /dev/null

echo "[Accelerated/API/Bootstrap.sh] -- Installing rethinkdb as our standard"

bash BootstrapRethinkDB.sh

echo "[Accelerated/API/Bootstrap.sh] All done! Go and get started!"
