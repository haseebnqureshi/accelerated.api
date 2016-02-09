#!/bin/bash

# Make sure to run this script as sudo su!

export DEBIAN_FRONTEND=noninteractive
export DB_USERNAME=root
export DB_PASSWORD=root
export DB_NAME=Accelerated/API

echo "[Accelerated/API/BootstrapPostgres.sh] Installing postgres ..."

apt-get install postgresql postgresql-contrib -y > /dev/null
apt-get install postgresql-contrib libpq-dev -y > /dev/null

echo "[Accelerated/API/BootstrapPostgres.sh] -- Creating database user and granting privileges"

echo -e "postgres\npostgres" | passwd postgres
userhash=`echo -n "$DB_PASSWORD$DB_USERNAME" | md5sum | awk '{print $1}'`
su postgres -c "psql -c \"CREATE ROLE $DB_USERNAME PASSWORD 'md5$userhash' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;\"" 

echo "[Accelerated/API/BootstrapPostgres.sh] -- Configuring postgres"

echo "listen_addresses = '*'" >> /etc/postgresql/9.*/main/postgresql.conf
echo "host all all samenet md5" >> /etc/postgresql/9.*/main/pg_hba.conf

echo "[Accelerated/API/BootstrapPostgres.sh] -- Restarting postgres service"

su postgres service postgresql restart

echo "[Accelerated/API/BootstrapPostgres.sh] -- Creating & importing database $DB_NAME"

su postgres -c "psql -c \"CREATE EXTENSION pgcrypto;\" -d $DB_NAME"
su postgres -c "createdb $DB_NAME"
su postgres -c "psql -f $DB_NAME.sql -d $DB_NAME"

echo "[Accelerated/API/BootstrapPostgres.sh] -- Installing nodejs postgres drivers"

npm install pg --save --loglevel=error > /dev/null
npm install pg-native --save --loglevel=error > /dev/null

echo "[Accelerated/API/BootstrapPostgres.sh] Finished installing postgres!"
