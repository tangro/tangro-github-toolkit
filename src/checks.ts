import { GitHubContext } from './context';
import { github } from './github';
import { ChecksUpdateParams } from '@octokit/rest';

export async function getCheckRunForAction<E>({
  context
}: {
  context: GitHubContext<E>;
}) {
  const ref = context.ref;
  const [owner, repo] = context.repository.split('/');

  const checkRunsResponse = await github.checks.listForRef({
    owner,
    repo,
    ref,
    status: 'in_progress'
  });

  if (checkRunsResponse.data.check_runs.length === 0) {
    throw new Error(`Could not find check run for action: ${name}`);
  } else {
    const checkRun = checkRunsResponse.data.check_runs.find(run =>
      run.name.includes('test')
    );
    if (!checkRun) {
      console.log(JSON.stringify(checkRunsResponse.data, null, 2));
      throw new Error(`Could not find check run in: runs`);
    } else return checkRun;
  }
}

export async function updateCheckRun<E>({
  context,
  checkRunId,
  name,
  checks
}: {
  context: GitHubContext<E>;
  checkRunId: ChecksUpdateParams['check_run_id'];
  name: ChecksUpdateParams['name'];
  checks: ChecksUpdateParams['output'];
}) {
  const [owner, repo] = context.repository.split('/');

  return github.checks.update({
    owner,
    repo,
    check_run_id: checkRunId,
    name: name,
    output: checks
  });
}
