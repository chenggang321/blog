const path = require('path')
const { autoGenSideBarConfig } = require('./utils')

const sideBarConfig = autoGenSideBarConfig(path.join(__dirname, '../note'))
const defaultBlogPath = '/note/' + sideBarConfig[0].children[0]

module.exports = {
  title: "博客",
  description: "一个值得收藏的博客，涵盖了前端、后端、运维等关键技术。",
  base: "/",
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' }],
  ],
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    repo: 'https://github.com/chenggang321/blog',
    sidebarDepth: 2,
    nav: [
      { text: '主页', link: '/' },
      { text: '随记博客', link: defaultBlogPath },
    ],
    sidebar: {
      // '/note/': [
      //   {
      //     title: 'javascript',
      //     children:[
      //         'javascript/a-problem-with-tar-and-curl',
      //     ]
      //   }
      // ]
      '/note/': sideBarConfig
    },
    lastUpdated: 'Last Updated'
  },
};
