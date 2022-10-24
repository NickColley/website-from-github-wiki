outputDirectory="_wiki"
echo "Cleaning up '${outputDirectory}'..."
rm -rf $outputDirectory
remoteName=$(git branch --list "$(git branch --show-current)" "--format=%(upstream:remotename)")
remoteUrl=$(git remote get-url ${remoteName})
# If there is a git extension remove it
removedGitExtension=${remoteUrl/\.git/}
wikiRemoteUrl="${removedGitExtension}.wiki.git"
git clone $wikiRemoteUrl $outputDirectory