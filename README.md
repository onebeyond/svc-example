# svc-example
An example service using

* [systemic](github.com/guidesmiths/systemic)
* [confabulous](github.com/guidesmiths/confabulous)
* [prepper](github.com/guidesmiths/prepper)

## Behaviour
* Environmental config
* Secrets obtained from a vault server
* Automatically re-initialises when config changes
* Graceful shutdown on unhandled exceptions, SIGINT and SIGTERM

## Use of domains
Domains have been deprecated, but as yet there's no alternative way to catch unhandled exceptions. This service will have to be updated when a new API emerges

## Configuring Vault
This example uses vault to hold secure secrets. To run locally use a docker container...

### Start a vault server in development mode
```
docker run -d -p 8200:8200 --hostname vault --name vault sjourdan/vault
docker logs vault
```
### Make note of the Unseal Key and Root Token and configure exports
```
export VAULT_ADDR=http://vault:8200
export VAULT_TOKEN=<INSERT_TOKEN_HERE>
```
### Create an alias so you can execute vault commands from a container
```
alias vaultcmd="docker run --volume $(pwd)/conf/vault:/tmp --link vault --rm -e VAULT_ADDR -e VAULT_TOKEN sjourdan/vault"
```
### Unseal the vault so you can read / write secrets
```
vaultcmd unseal <INSERT_UNSEAL_KEY>
```
### Upload a policy
```
vaultcmd policy-write example-live /tmp/policies/live/example.json
```
### Configure an app-id login
```
vaultcmd auth-enable app-id
vaultcmd write auth/app-id/map/app-id/svc-example value=example-live display_name=svc-example
vaultcmd write auth/app-id/map/user-id/example-live value=svc-example
vaultcmd policy-write example-live /tmp/policies/live/example.json
```