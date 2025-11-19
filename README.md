# 🚬 Big Diff Energy Action

A GitHub Action that automatically comments on PRs with large diffs (1000+ additions by default), showing the change statistics with a humorous touch.

## Why?

Large PRs are harder to review and more prone to issues slipping through. This action gently reminds contributors to consider breaking up massive changes into smaller, more reviewable chunks.

## Features

- 🔍 Automatically detects PRs with large diffs
- 📊 Shows addition and deletion statistics in a clean two-column layout with GitHub's diff colors
- 🔄 **Dynamically updates** comment numbers as PR changes
- 🧹 **Auto-deletes** comment when PR is cleaned up below threshold (rewards good behavior!)
- ⚙️ Configurable threshold for what counts as "large" (default: 1000 additions)
- 🎨 Includes a fun image to keep things light-hearted

## Usage

Add this action to your repository's workflow:

```yaml
name: Big Diff Check
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: write
  contents: read

jobs:
  check-pr-size:
    runs-on: ubuntu-latest
    steps:
      - name: Check for big diffs
        uses: lukasjuhas/big-diff-energy-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          threshold: 1000  # Optional: defaults to 1000
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for posting comments | Yes | N/A |
| `threshold` | Minimum number of additions to trigger the comment | No | `1000` |

## Permissions

This action requires the following permissions:

```yaml
permissions:
  pull-requests: write  # To post comments
  contents: read        # To read PR files
```

## Example Comment

When triggered, the action posts a comment like this:

```
🚬 Whoa there, partner!

┌─────────────────────┬──────────────────────────────────┐
│                     │                                  │
│  [Matthew smoking]  │  This PR has some big diff       │
│                     │  energy:                         │
│                     │                                  │
│                     │  +1,234 additions                │
│                     │  -567 deletions                  │
│                     │                                  │
│                     │  That's a lot of changes!        │
│                     │  Consider breaking this into     │
│                     │  smaller PRs for easier review.  │
│                     │                                  │
└─────────────────────┴──────────────────────────────────┘
```

The comment uses a two-column layout with the image on the left and stats on the right.

## How It Works

1. Triggered on PR open, synchronize, or reopen events
2. Fetches all files changed in the PR
3. Calculates total additions and deletions
4. **Smart comment management**:
   - If above threshold and no comment exists: Posts new comment
   - If above threshold and comment exists: Updates comment with new numbers
   - If below threshold and comment exists: Deletes comment (rewards cleanup!)

## Customization

### Different Threshold

Want to be stricter or more lenient? Adjust the threshold:

```yaml
- uses: lukasjuhas/big-diff-energy-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    threshold: 500  # Trigger on 500+ additions
```

### Workflow Triggers

You can customize when the action runs:

```yaml
on:
  pull_request:
    types: [opened]  # Only on first open, not on updates
```

## Development

### Local Setup

```bash
# Clone the repo
git clone https://github.com/lukasjuhas/big-diff-energy-action.git
cd big-diff-energy-action

# Install dependencies
npm install

# Make your changes to index.js
```

### Testing

To test this action in your own repository:

1. Reference it using a branch or commit SHA:
```yaml
- uses: lukasjuhas/big-diff-energy-action@main
```

2. Create a PR with 1000+ line additions to trigger the comment

## Contributing

Contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit PRs with improvements
- Share feedback on the action

## License

MIT © Lukas Juhas

## Credits

Inspired by the eternal struggle of reviewing massive PRs. 🙏

