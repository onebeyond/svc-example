#!/bin/bash

set -o errexit

REPOSITORY=$1
SERVICE_NAME=$2
BUILD_NUMBER=$3

if [ -z $REPOSITORY ] || [ -z $SERVICE_NAME ] || [ -z $BUILD_NUMBER ]; then
  echo 'Usage: build.sh <REPOSITORY> <SERVICE_NAME> <BUILD_NUMBER>'
  exit 1
fi

echo Building $REPOSITORY/$SERVICE_NAME:$BUILD_NUMBER
node_modules/.bin/make-manifest --extra "build: ${BUILD_NUMBER}"
docker-compose --file ./docker/docker-compose-build.yml build
docker-compose --file ./docker/docker-compose-build.yml run -e SERVICE_ENV=build --rm $SERVICE_NAME node_modules/.bin/mocha tests
docker tag $REPOSITORY/$SERVICE_NAME:latest $REPOSITORY/$SERVICE_NAME:$BUILD_NUMBER
docker-compose --file ./docker/docker-compose-build.yml down