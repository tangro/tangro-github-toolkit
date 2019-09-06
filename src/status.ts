import { GitHubContext } from './context';
import { github } from './github';

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
  const [owner, repo] = context.repository.split('/');
  const sha = context.sha;

  await github.repos.createStatus({
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

  const listOfStatuses = await github.repos.listStatusesForRef({
    owner,
    repo,
    ref: context.sha
  });

  return listOfStatuses.data.find(
    status => status.context === `${statusContext}/${step}`
  );
}
