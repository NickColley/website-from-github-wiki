#!/bin/bash

OUTPUT_DIRECTORY="_wiki"
ECHO_PREFIX="[get-wiki-files]"

# Check if wiki is already pulled
if [ -d "$OUTPUT_DIRECTORY/.git" ]; then
    # If wiki already exists then check if it's up-to-date
    echo "$ECHO_PREFIX Checking wiki for updates..."
    git -C $OUTPUT_DIRECTORY remote update > /dev/null

    LOCAL=$(git -C $OUTPUT_DIRECTORY rev-parse @)
    REMOTE=$(git -C $OUTPUT_DIRECTORY rev-parse @{u})

    if ! [ $LOCAL = $REMOTE ]; then
        echo "$ECHO_PREFIX Pulling new changes..."
        git -C $OUTPUT_DIRECTORY pull;
        exit
    fi
    echo "$ECHO_PREFIX Wiki is up-to-date."
    exit
fi
REMOTE_URL=$(./scripts/get-remote-url.sh)
# If there is a git extension remove it
REMOVED_GIT_EXTENSION=${REMOTE_URL/\.git/}
WIKI_REMOTE_URL="${REMOVED_GIT_EXTENSION}.wiki.git"
echo "$ECHO_PREFIX Checking if wiki exists ($WIKI_REMOTE_URL)..."
# Check if Wiki has been created yet...
if ! git ls-remote --exit-code $WIKI_REMOTE_URL &> /dev/null; then
    echo "$ECHO_PREFIX Wiki does not exist, make sure to create a new page."
    if [ -d $OUTPUT_DIRECTORY ]; then
        exit;
    fi
    echo "$ECHO_PREFIX Creating a placeholder page..."
    mkdir $OUTPUT_DIRECTORY
    cp "./scripts/_placeholder.md" "$OUTPUT_DIRECTORY/Home.md"
    exit
fi
echo "$ECHO_PREFIX Wiki exists pulling latest changes."
# Clean up any existing directory
if [ -d $OUTPUT_DIRECTORY ]; then
    echo "$ECHO_PREFIX Cleaning up '${OUTPUT_DIRECTORY}'..."
    rm -rf $OUTPUT_DIRECTORY
fi
git clone $WIKI_REMOTE_URL $OUTPUT_DIRECTORY
