import { GitHubContext } from './context';
import { github } from './github';

export async function createSuccessfulDeployment<E>({
  context,
  description,
  url
}: {
  context: GitHubContext<E>;
  description: string;
  url: string;
}): Promise<void> {
  const [owner, repo] = context.repository.split('/');
  const ref = context.ref.replace('refs/heads/', '');
  const response = await github.repos.createDeployment({
    owner,
    repo,
    ref,
    description,
    auto_merge: false,
    environment: 'qa',
    transient_environment: true,
    required_contexts: []
  });
  const deploymentId = response.data.id;
  await github.repos.createDeploymentStatus({
    owner,
    repo,
    deployment_id: deploymentId,
    state: 'success',
    environment_url: url
  });
}
