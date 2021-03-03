const { autoGenBarConfigByKey } = require('./utils')

module.exports = {
  "title": "博客",
  "description": "一个值得收藏的博客，涵盖了前端、后端、运维等关键技术。",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "主页",
        "link": "/",
        "icon": "reco-home"
      },
      { text: '随记', link: autoGenBarConfigByKey('note').entryPath },
      { text: '学习笔记', link: autoGenBarConfigByKey('study').entryPath },
      {
        "text": "动态",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "关于",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/chenggang321/blog.git",
            "icon": "reco-github"
          }
        ]
      }
    ],
    "sidebar": {
      '/note/': autoGenBarConfigByKey('note').config,
      '/study/': autoGenBarConfigByKey('study').config,
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    // "friendLink": [
    //   {
    //     "title": "午后南杂",
    //     "desc": "Enjoy when you can, and endure when you must.",
    //     "email": "1156743527@qq.com",
    //     "link": "https://www.recoluan.com"
    //   },
    //   {
    //     "title": "vuepress-theme-reco",
    //     "desc": "A simple and beautiful vuepress Blog & Doc theme.",
    //     "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    //     "link": "https://vuepress-theme-reco.recoluan.com"
    //   }
    // ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "chenggang",
    "authorAvatar": "/avatar.jpg",
    "record": "皖ICP备17006327号-1",
    "startYear": "2017"
  },
  "markdown": {
    "lineNumbers": false
  }
}
