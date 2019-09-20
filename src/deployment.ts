import { GitHubContext } from './context';
import { github } from './github';

export async function createSuccessfulDeployment<E>({
  context,
  description,
  environment,
  url
}: {
  context: GitHubContext<E>;
  description: string;
  environment: string;
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
    environment,
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
