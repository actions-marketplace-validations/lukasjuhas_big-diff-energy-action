const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get inputs
    const token = core.getInput('github-token', { required: true });
    const threshold = parseInt(core.getInput('threshold') || '1000', 10);

    // Get PR context
    const context = github.context;
    
    if (!context.payload.pull_request) {
      core.info('This action only works on pull_request events');
      return;
    }

    const octokit = github.getOctokit(token);
    const { owner, repo } = context.repo;
    const pull_number = context.payload.pull_request.number;

    core.info(`Checking PR #${pull_number} for large diffs...`);

    // Fetch PR files to calculate additions/deletions
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
      per_page: 100
    });

    // Calculate total additions and deletions
    let totalAdditions = 0;
    let totalDeletions = 0;

    for (const file of files) {
      totalAdditions += file.additions;
      totalDeletions += file.deletions;
    }

    core.info(`PR stats: +${totalAdditions} -${totalDeletions}`);

    // Check if we already commented
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: pull_number,
      per_page: 100
    });

    const botComment = comments.find(comment => 
      comment.user.type === 'Bot' && 
      comment.body.includes('<!-- big-diff-energy -->')
    );

    // Helper function to generate comment body
    const generateCommentBody = (additions, deletions) => {
      const imageUrl = 'https://raw.githubusercontent.com/lukasjuhas/big-diff-energy-action/main/assets/matthew-smoking.jpeg';
      const imageCell = `<td width="40%"><img src="${imageUrl}" alt="Matthew smoking" width="100%" /></td>`;
      
      return `<!-- big-diff-energy -->
## 🚬 Whoa there, partner!

<table>
<tr>
${imageCell}
<td width="60%">

### This PR has some **big diff energy**:

<span style="color: #1a7f37;">**+${additions.toLocaleString()}**</span> additions  
<span style="color: #cf222e;">**-${deletions.toLocaleString()}**</span> deletions

That's a lot of changes! Consider breaking this into smaller PRs for easier review.

</td>
</tr>
</table>`;
    };

    // If comment exists, update or delete based on current stats
    if (botComment) {
      if (totalAdditions >= threshold) {
        // Still above threshold - update the comment with new numbers
        core.info(`Updating existing comment with new stats: +${totalAdditions} -${totalDeletions}`);
        await octokit.rest.issues.updateComment({
          owner,
          repo,
          comment_id: botComment.id,
          body: generateCommentBody(totalAdditions, totalDeletions)
        });
        core.info('✅ Comment updated successfully!');
      } else {
        // Below threshold - delete the comment (reward for cleaning up!)
        core.info(`PR now below threshold (${totalAdditions} < ${threshold}). Deleting comment.`);
        await octokit.rest.issues.deleteComment({
          owner,
          repo,
          comment_id: botComment.id
        });
        core.info('✅ Comment deleted - great job cleaning up the PR!');
      }
      return;
    }

    // No existing comment - check if we should create one
    if (totalAdditions < threshold) {
      core.info(`PR additions (${totalAdditions}) below threshold (${threshold}). No comment needed.`);
      return;
    }

    // Post the comment
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: generateCommentBody(totalAdditions, totalDeletions)
    });

    core.info('✅ Comment posted successfully!');
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();

