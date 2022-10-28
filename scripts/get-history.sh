ROOT="${1:-.}" 
FILE="${2:-}"
git -C $ROOT log --max-count=1 --pretty=format:'{%n "commit": "%H",%n "author": "%aN",%n "date": "%aD"%n}' $FILE
