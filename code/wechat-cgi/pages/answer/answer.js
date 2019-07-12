//answer.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
    data: {
        motto: '知乎--微信小程序版',
        userInfo: {},
        act_id: 0,
        content: {},
        comment_length: 0
    },
    //事件处理函数
    toQuestion: function() {
        wx.navigateTo({
            url: '../question/question'
        })
    },
    onLoad: function(options) {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        // app.getUserInfo(function(userInfo){
        //   //更新数据
        //   that.setData({
        //     userInfo:userInfo
        //   })
        // })
        this.setData({
            act_id: options.id
        });
        console.log("id是" + options.id);
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/public/act/query?act_id=' + that.data.act_id,
            method: 'GET',
            success: function(res) {
                that.setData({
                    content: res.data
                });
                that.setData({
                    comment_length: res.data.comments.length
                })
            }
        });
    },
    tapName: function(event) {
        console.log(event)
    }
})