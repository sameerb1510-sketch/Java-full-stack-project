#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
  case "$DATABASE_URL" in
    jdbc:*) export DATABASE_URL_JDBC="$DATABASE_URL" ;;
    postgresql://*)
      postgresUrl="${DATABASE_URL#postgresql://}"
      postgresUrl="${postgresUrl#*@}"
      export DATABASE_URL_JDBC="jdbc:postgresql://${postgresUrl}"
      ;;
  esac
  [ -z "${DB_USER:-}" ] || export SPRING_DATASOURCE_USERNAME="$DB_USER"
  [ -z "${DB_PASSWORD:-}" ] || export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
fi

exec java -jar /app/app.jar
