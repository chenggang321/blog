const { autoGenBarConfigByKey } = require('./utils')

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
      { text: '随记', link: autoGenBarConfigByKey('note').entryPath },
      { text: '学习笔记', link: autoGenBarConfigByKey('study').entryPath },
    ],
    sidebar: {
      '/note/': autoGenBarConfigByKey('note').config,
      '/study/': autoGenBarConfigByKey('study').config,
    },
    lastUpdated: 'Last Updated'
  },
};
