import type { GitHubContext } from './context';
import { github } from './github';

export async function getCheckRunForAction<E>({
  context
}: {
  context: GitHubContext<E>;
}) {
  const ref = context.ref;
  const [owner, repo] = context.repository.split('/');

  const checkRunsResponse = await github.rest.checks.listForRef({
    owner,
    repo,
    ref,
    status: 'in_progress'
  });

  if (checkRunsResponse.data.check_runs.length === 0) {
    throw new Error(`Could not find an in-progress check run for ref: ${ref}`);
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
  checkRunId: number;
  name: string;
  checks: NonNullable<
    NonNullable<Parameters<typeof github.rest.checks.update>[0]>['output']
  >;
}): ReturnType<typeof github.rest.checks.update> {
  const [owner, repo] = context.repository.split('/');

  return github.rest.checks.update({
    owner,
    repo,
    check_run_id: checkRunId,
    name: name,
    output: checks
  });
}
