if [[ -z "${CI}" ]]; then
    echo "Running in CI, already cloned wiki files as part of GitHub actions..."
else
    outputDirectory="_wiki"
    echo "Cleaning up '${outputDirectory}'..."
    rm -rf $outputDirectory
    remoteName=$(git branch --list "$(git branch --show-current)" "--format=%(upstream:remotename)")
    remoteUrl=$(git remote get-url ${remoteName})
    # If there is a git extension remove it
    removedGitExtension=${remoteUrl/\.git/}
    wikiRemoteUrl="${removedGitExtension}.wiki.git"
    git clone $wikiRemoteUrl $outputDirectory
fi
