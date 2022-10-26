#!/bin/bash

REMOTE_NAME=$(git branch --list "$(git branch --show-current)" "--format=%(upstream:remotename)")
REMOTE_URL=$(git remote get-url ${REMOTE_NAME})
echo -n $REMOTE_URL;
