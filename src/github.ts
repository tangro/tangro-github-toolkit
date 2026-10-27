import { getOctokit } from '@actions/github';

const token = process.env.GITHUB_TOKEN;

if (!token || token.trim().length === 0) {
  throw new Error(
    `You have to provide the GITHUB_TOKEN inside your secrets configuration and provide it as an env variable`
  );
}

export const github = getOctokit(token, {
  request: {
    headers: {
      'X-GitHub-Api-Version': '2026-03-10'
    }
  }
});
