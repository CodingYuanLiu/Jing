//answer.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    motto: '知乎--微信小程序版',
    userInfo: {},
    content: {
        title: "假的,测试标题，标题测试",
        username: "anormaluser",
        usersign: "我是一个很开心的人",
        useravatar: "../../images/icon1.jpeg",
        text: "想吃肯德基，满50减15券差23元！上的风格化法国的手法对付国家和地方打赏！"
    },
    comment: {
        length: 3,
        content: [
            {
                avatar: "../../images/icon8.jpg",
                nickname: "George",
                lasttime: "3 天前",
                content: "我我我！",
            },
            {
                avatar: "../../images/icon9.jpeg",
                nickname: "Alex",
                lasttime: "3 天前",
                content: "我我我！",
            },
            {
                avatar: "../../images/icon8.jpg",
                nickname: "sssnnne",
                lasttime: "1 天前",
                content: "我aa我aa我！",
            },
        ]
    }
  },
  //事件处理函数
  toQuestion: function() {
    wx.navigateTo({
      url: '../question/question'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  tapName: function(event){
    console.log(event)
  }
})
