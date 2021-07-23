export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-eleventy-blog'
      }
    },
    { name: 'structure-menu' },
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '60f97a8c59ac070008a219d3',
                  title: 'Sanity Studio',
                  name: 'music-quiz-studio',
                  apiId: '290b37ea-c90a-482a-b311-277632559d2e'
                },
                {
                  buildHookId: '60f97a8c5c2b28fb2cee3a7f',
                  title: 'Blog Website',
                  name: 'music-quiz-web',
                  apiId: '686328b2-7511-41da-95d4-9658dd6c19b3'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/boyum/music-quiz',
            category: 'Code'
          },
          { title: 'Frontend', value: 'https://music-quiz-web.netlify.app', category: 'apps' }
        ]
      }
    },
    { name: 'project-users', layout: { height: 'auto' } },
    {
      name: 'document-list',
      options: { title: 'Recent blog questions', order: '_createdAt desc', types: ['question'] },
      layout: { width: 'medium' }
    }
  ]
};
