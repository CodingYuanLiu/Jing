//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    navTab: ["通知", "赞与感谢", "关注"],
    currentNavtab: "0",
      category: [{
          "idx": 0,
          "r": [{
              "idx": 0,
              "name": "外卖",
              "icon": "../../images/icons/takeout.png"
          },
          {
              "idx": 1,
              "name": "打车",
              "icon": "../../images/icons/taxi.png"
          },
          {
              "idx": 2,
              "name": "游戏",
              "icon": "../../images/icons/games.png"
          },
          {
              "idx": 3,
              "name": "电影",
              "icon": "../../images/icons/movie.png"
          }
          ]
      }, {
          "idx": 1,
          "r": [{
              "idx": 4,
              "name": "网购",
              "icon": "../../images/icons/movie.png"
          }, {
              "idx": 5,
              "name": "会员",
              "icon": "../../images/icons/movie.png"
          }, {
              "idx": 6,
              "name": "会员",
              "icon": "../../images/icons/movie.png"
          }, {
              "idx": 7,
              "name": "会员",
              "icon": "../../images/icons/movie.png"
          }]
      }],
  },
  onLoad: function () {

  },
  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  handleClick: function() {
      wx.navigateTo({
          url: '/pages/newact/newact',
      })
  }
})
