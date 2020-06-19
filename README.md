# DVDRentalNodeJs

Sample NodeJS

## Demo

http://35.215.111.93:5002/

## Preparing database

Download sample data from https://www.postgresqltutorial.com/postgresql-sample-database/

## Installation

```
  git clone https://github.com/trantamjp/DVDRentalNodeJs.git
  cd DVDRentalNodeJs

  npm install
```

## Run

Change config/config.json as needed.
Using pm2 https://pm2.keymetrics.io/ is recommended.

```
  NODE_ENV=production PORT=<port> node bin/www
  DATABASE_URL='<database_url>' FLASK_APP='app.webapp' python3 -m flask run --port=<port> --host=<ip_address>

  # example NODE_ENV=production PORT=5002 node bin/www

```

Goto http://localhost:5002/
