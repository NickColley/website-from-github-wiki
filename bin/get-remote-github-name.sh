#!/bin/bash

remoteName=$(git branch --list "$(git branch --show-current)" "--format=%(upstream:remotename)")
remoteUrl=$(git remote get-url ${remoteName})
removedGitExtension=${remoteUrl/\.git/}
removedProtocol=${removedGitExtension/git@github.com:/}
echo $removedProtocol;
