# Publishing Guide

## Prerequisites

Before publishing, ensure:
- [ ] All code is tested and working
- [ ] README.md is complete with usage examples
- [ ] Image is in `assets/matthew-smoking.jpeg`
- [ ] Dependencies are installed (`npm install`)

## Steps to Publish

### 1. Install Dependencies

```bash
cd /Users/lukasjuhas/projects/big-diff-energy-action
npm install
```

This will create `node_modules/` with the required dependencies. **Important**: You need to commit `node_modules/` for GitHub Actions to work (unless you compile the action).

### 2. Commit All Files

```bash
git add .
git commit -m "Initial release: Big Diff Energy Action v1.0.0"
git push origin main
```

### 3. Create a Git Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Also create/update the v1 tag for easier version pinning
git tag -fa v1 -m "Update v1 to v1.0.0"
git push origin v1 --force
```

### 4. Create a GitHub Release

1. Go to: https://github.com/lukasjuhas/big-diff-energy-action/releases/new
2. Choose tag: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description:
```markdown
## 🚬 Big Diff Energy Action - v1.0.0

First release of the Big Diff Energy Action!

### Features
- ✅ Automatically comments on PRs with 1000+ line additions
- ✅ Shows addition/deletion statistics
- ✅ Only comments once per PR (no spam)
- ✅ Configurable threshold
- ✅ Includes humorous Matthew smoking image

### Usage

\`\`\`yaml
- uses: lukasjuhas/big-diff-energy-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    threshold: 1000
\`\`\`

See the [README](https://github.com/lukasjuhas/big-diff-energy-action#readme) for full documentation.
```
5. Check "Set as the latest release"
6. Click "Publish release"

### 5. (Optional) Publish to GitHub Marketplace

1. Edit the release you just created
2. Check the box "Publish this Action to the GitHub Marketplace"
3. Review and accept the terms
4. Select appropriate categories:
   - "Code review"
   - "Utilities"
5. Click "Publish release"

Your action will now be discoverable at: https://github.com/marketplace/actions/big-diff-energy

### 6. Test the Action

Create a test PR in the posh-react repository (or any repo using the workflow) with 1000+ line additions to verify it works:

```bash
# The workflow is already set up at:
# /Users/lukasjuhas/projects/posh-react/.github/workflows/big-diff-energy.yml
```

## Updating the Action

For future updates:

1. Make your changes
2. Update version in `package.json`
3. Commit and push
4. Create new tag: `git tag -a v1.0.1 -m "Release v1.0.1"`
5. Update major version tag: `git tag -fa v1 -m "Update v1 to v1.0.1"`
6. Push tags: `git push origin v1.0.1 v1 --force`
7. Create new GitHub release

## Important Notes

### About node_modules

GitHub Actions require dependencies to be available. You have two options:

1. **Commit node_modules** (Easier, but larger repo):
```bash
git add node_modules/
git commit -m "Add node_modules for GitHub Actions"
```

2. **Compile the action** (Cleaner, but requires build step):
   - Use `@vercel/ncc` to compile everything into a single `dist/index.js`
   - Update `action.yml` to point to `dist/index.js`
   - Add `dist/` to git, ignore `node_modules/`

For simplicity, option 1 (committing node_modules) is recommended for now.

## Troubleshooting

### Action Not Working
- Ensure `node_modules/` is committed or action is compiled
- Check that the tag is pushed: `git tag -l`
- Verify permissions in workflow: `pull-requests: write`, `contents: read`

### Image Not Showing
- Verify `assets/matthew-smoking.jpeg` exists
- Check image file size (GitHub has limits on base64 embedded images)
- Image will be embedded as base64 in comments

## Resources

- [Creating Actions Documentation](https://docs.github.com/en/actions/creating-actions)
- [Publishing Actions to Marketplace](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace)
- [Action Metadata Syntax](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)

