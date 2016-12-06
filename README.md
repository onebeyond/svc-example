# svc-example
An example service using

* [systemic](https://github.com/guidesmiths/systemic)
* [confabulous](https://github.com/guidesmiths/confabulous)
* [prepper](https://github.com/guidesmiths/prepper)
* [systemic-express](https://github.com/guidesmiths/systemic-express)
* [systemic-mongo](https://github.com/guidesmiths/systemic-mongo)
* [systemic-redis](https://github.com/guidesmiths/systemic-redis)
* [systemic-pg](https://github.com/guidesmiths/systemic-pg)

## Features
* Environmental config
* Secrets obtained from a runtime location
* Automatically re-initialises when config changes
* Orderly startup / shutdown (establishes database connections before setting up http listeners and vice versa)
* Graceful shutdown on unhandled exceptions, SIGINT and SIGTERM
* Useful log decorators, including request scoped logging
* JSON logging to stdout in "proper" environments, human friendly logging locally
* The Dockerfile uses settings from .npmrc and .nvmrc
* The docker build cache busts using package.json and npm-shrinkwrap.json so npm install only runs when necessary
* Deployed artifact (a docker image) is traceable back to SCM commit via manifest.json, exposed via /manifest endpoint

## Use of domains
Domains have been deprecated, but as yet there's no alternative way to catch unhandled exceptions. This service will have to be updated when a new API emerges

## Use of docker
The example uses mongo on localhost:27017. The easiest way to standup a test environment is with docker compose
```
docker network create local
docker-compose --file docker/docker-compose-local.yml up -d
```

## Running locally
```
npm start
```

## Running tests
```
npm test
```

## In container build, test and publish
```
docker-compose -f docker/docker-compose-build.yml build
docker-compose -f docker/docker-compose-build.yml run --rm -e SERVICE_ENV=build svc-example npm test
docker-compose -f docker/docker-compose-build.yml stop
docker tag quay.io/guidesmiths/svc-example:latest quay.io/guidesmiths/svc-example:$COMMIT
docker push quay.io/guidesmiths/svc-example
```

