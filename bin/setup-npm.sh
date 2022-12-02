#!/bin/bash
set -e

curl -o ~/.npmrc -u$JFROG_USERNAME:$JFROG_PASSWORD "https://universe.jfrog.io/universe/api/npm/npm-local/auth/universe"
echo "@universe:registry=https://universe.jfrog.io/universe/api/npm/npm-local/" >> .npmrc
