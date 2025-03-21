/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['main', 'next'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          {
            breaking: true,
            release: 'major',
          },
          {
            type: 'feat',
            release: 'minor',
          },
          {
            type: 'build',
            release: 'minor',
          },
          {
            type: 'fix',
            release: 'patch',
          },
          {
            type: 'docs',
            scope: 'README',
            release: 'patch',
          },
          {
            type: 'chore',
            release: 'patch',
          },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            {
              type: 'feat',
              section: 'Features',
              hidden: false,
            },
            {
              type: 'fix',
              section: 'Bug Fixes',
              hidden: false,
            },
            {
              type: 'docs',
              section: 'Miscellaneous Chores',
              hidden: false,
            },
            {
              type: 'chore',
              section: 'Miscellaneous Chores',
              hidden: false,
            },
            {
              type: 'ci',
              section: 'Continuous Integration',
              hidden: false,
            },
          ],
        },
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/gitlab',
      {
        assets: [
          { path: 'package.json', label: 'Module' },
          { path: 'CHANGELOG.md', label: 'Changelog' },
          { path: 'docs/*', label: 'Documentation' },
        ],

        gitlabUrl: 'https://gitlab.zweieuro.at',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md', 'docs/*'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
