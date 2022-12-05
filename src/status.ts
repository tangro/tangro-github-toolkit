import * as core from '@actions/core';
import { GitHubContext } from './context';
import { github } from './github';
import { Result } from './result';

const statusContext = 'Tangro CI';

export async function setStatus<E>({
  context,
  description,
  step,
  target_url,
  state
}: {
  context: GitHubContext<E>;
  description?: string;
  step: string;
  target_url?: string;
  state: 'pending' | 'success' | 'failure';
}) {
  console.log(JSON.stringify(context, null, 2));
  const [owner, repo] = context.repository.split('/');
  const sha = context.sha;

  await github.rest.repos.createCommitStatus({
    context: `${statusContext}/${step}`,
    owner,
    repo,
    description,
    sha,
    state,
    target_url
  });
}

export async function getStatus<E>({
  context,
  step
}: {
  context: GitHubContext<E>;
  step: string;
}) {
  const [owner, repo] = context.repository.split('/');

  const listOfStatuses = await github.rest.repos.listCommitStatusesForRef({
    owner,
    repo,
    ref: context.sha
  });

  return listOfStatuses.data.find(
    status => status.context === `${statusContext}/${step}`
  );
}

export async function wrapWithSetStatus<T>(
  context: GitHubContext<any>,
  step: string,
  code: () => Promise<Result<T>>
) {
  core.info(`Setting status to pending`);
  await setStatus({
    context,
    step,
    description: `Running ${step}`,
    state: 'pending'
  });

  try {
    const result = await code();
    core.info(`Setting status to ${result.isOkay ? 'success' : 'failure'}`);
    await setStatus({
      context,
      step,
      description: result.shortText,
      state: result.isOkay ? 'success' : 'failure'
    });
    return result;
  } catch (error) {
    core.info(`Setting status to failure`);
    await setStatus({
      context,
      step,
      description: `Failed: ${step}`,
      state: 'failure'
    });
    core.setFailed(`CI failed at step: ${step}`);
  }
}
