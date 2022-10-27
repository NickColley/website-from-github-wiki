#!/bin/bash

OUTPUT_DIRECTORY="_wiki"
if [ -d $OUTPUT_DIRECTORY ]; then
    echo "Cleaning up '${OUTPUT_DIRECTORY}'..."
    rm -rf $OUTPUT_DIRECTORY
fi
REMOTE_URL=$(./scripts/get-remote-url.sh)
# If there is a git extension remove it
REMOVED_GIT_EXTENSION=${REMOTE_URL/\.git/}
WIKI_REMOTE_URL="${REMOVED_GIT_EXTENSION}.wiki.git"
if git ls-remote --exit-code $WIKI_REMOTE_URL &> /dev/null; then
    git clone $WIKI_REMOTE_URL $OUTPUT_DIRECTORY
else
    echo "Remote repo '${WIKI_REMOTE_URL}' does not exist."
fi
# If the output directory does not exist setup a placeholder.
if ! [ -d $OUTPUT_DIRECTORY ]; then
    echo "No source files, so create a placeholder..."
    mkdir $OUTPUT_DIRECTORY
    cp "./scripts/_placeholder.md" "$OUTPUT_DIRECTORY/Home.md"
fi
