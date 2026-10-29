export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/jaainil/auto-linker.git',
  tagFormat: 'auto-linker-v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'conventionalcommits',
      releaseRules: [{ scope: 'site', release: false }],
    }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    ['@semantic-release/npm', { pkgRoot: '.', npmPublish: true }],
    ['@semantic-release/github', {
      successCommentCondition: false,
      failCommentCondition: false,
      releasedLabels: false,
    }],
  ],
};
