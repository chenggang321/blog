const path = require('path')
const { autoGenSideBarConfig } = require('./utils')

const sideBarConfig = autoGenSideBarConfig(path.join(__dirname, '../note'))
const defaultBlogPath = '/note/' + sideBarConfig[0].children[0]

module.exports = {
  title: "前端博客",
  description: "一个值得收藏的前端博客，里面涵盖了html,css,js,jquery,vue,react,axios等前端关键技术。",
  base: "/",
  head: [
    ["link",{ rel: "icon",href: "/assets/logo.png" }]
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
