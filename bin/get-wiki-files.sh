outputDirectory="_wiki"
if [ $CI ]; then
    # If the output directory does not exist setup a placeholder.
    if ! [ -d $outputDirectory ]; then
        echo "No source files, so create a placeholder..."
        placeholder="[Create your first wiki page](https://github.com/$GITHUB_REPOSITORY/wiki)"
        mkdir $outputDirectory
        echo $placeholder > "$outputDirectory/Home.md"
    fi
else
    if [ -d $outputDirectory ]; then
        echo "Cleaning up '${outputDirectory}'..."
        rm -rf $outputDirectory
    fi
    remoteName=$(git branch --list "$(git branch --show-current)" "--format=%(upstream:remotename)")
    remoteUrl=$(git remote get-url ${remoteName})
    # If there is a git extension remove it
    removedGitExtension=${remoteUrl/\.git/}
    wikiRemoteUrl="${removedGitExtension}.wiki.git"
    git clone $wikiRemoteUrl $outputDirectory
fi