#!/usr/bin/env bash
# Cut an annotated release tag that matches package.json (triggers Release workflow).
# Usage: scripts/cut-release.sh           # uses package.json version
#        scripts/cut-release.sh 0.1.1     # bumps package.json then tags
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

want="${1:-}"
cur="$(node -p "require('./package.json').version")"
if [[ -n "$want" && "$want" != "$cur" ]]; then
  node -e "
    const fs=require('fs');
    const p=JSON.parse(fs.readFileSync('package.json','utf8'));
    p.version=process.argv[1];
    fs.writeFileSync('package.json', JSON.stringify(p,null,2)+'\n');
  " "$want"
  git add package.json
  git commit -m "chore: bump version to $want"
  cur="$want"
fi

tag="v$cur"
if git rev-parse "$tag" >/dev/null 2>&1; then
  echo "Tag $tag already exists" >&2
  exit 1
fi

git tag -a "$tag" -m "chronify $tag"
echo "Created annotated tag $tag"
echo "Push with: git push origin main && git push origin $tag"