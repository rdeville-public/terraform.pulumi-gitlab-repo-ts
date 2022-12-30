#!/usr/bin/env bash

if ! command -v pre-commit
then
  echo "ERROR-Command pre-commit is not installed"
  exit 1
fi
pre-commit install
pre-commit install --hook-type commit-msg
curl https://raw.githubusercontent.com/carloscuesta/gitmoji/master/packages/gitmojis/src/gitmojis.json  \
  > ./node_modules/commitlint-plugin-gitmoji/lib/gitmojis.json
