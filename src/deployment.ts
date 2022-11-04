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
  const response = await github.rest.repos.createDeployment({
    owner,
    repo,
    ref,
    description,
    auto_merge: false,
    environment,
    transient_environment: true,
    required_contexts: []
  });
  const deploymentId = (response.data as any).id; // we need the type ReposCreateDeploymentResponseData but we cannot import it, that why we cast to any beforehand
  await github.rest.repos.createDeploymentStatus({
    owner,
    repo,
    deployment_id: deploymentId,
    state: 'success',
    environment_url: url
  });
}
