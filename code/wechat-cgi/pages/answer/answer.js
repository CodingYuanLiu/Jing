//answer.js
var util = require('../../utils/util.js')

Date.prototype.toString = function() {
    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + (this.getHours() >= 10 ? "" + this.getHours() : "0" + this.getHours()) + ':' + (this.getMinutes() >= 10 ? "" + this.getMinutes() : "0" + this.getMinutes());
}


var app = getApp()
Page({
    data: {
        motto: '知乎--微信小程序版',
        userInfo: {},
        act_id: 0,
        content: {},
        comment_length: 0,
        your_comment: '',
        place_holder: '添加评论',
        to_user: -1,
        visible1: false,
        actions3: [
            {
                name: '现金支付',
                color: '#2d8cf0',
            }
        ],
    },
    //事件处理函数
    toQuestion: function() {
        wx.navigateTo({
            url: '../question/question'
        })
    },
    refresh: function() {
        let that = this;
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/public/act/query?act_id=' + that.data.act_id,
            method: 'GET',
            success: function (res) {
                that.setData({
                    content: res.data
                });
                that.setData({
                    comment_length: res.data.comments.length
                })
            }
        });
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
                });
                console.log(res);
            }
        });
    },
    tapName: function(event) {
        console.log(event)
    },
    handleCommentInput: function(event) {
        this.setData({
            your_comment: event.detail.value
        });
    },
    handleAddComment: function(event) {
        let that = this;
        let date = new Date();
        let dateString = date.toString();
        console.log(app.globalData.userInfo);
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/user/act/comment',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            method: 'POST',
            data: {
                "act_id": parseInt(that.data.act_id),
                "receiver_id": -1,
                "content": that.data.your_comment,
                "time": dateString
            },
            success: function(res) {
                console.log(res);
                that.setData({your_comment: ''})
                that.refresh();
            }
        })
    },
    handleJoin: function() {
        // wx request join
        let that = this;
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/user/act/join?act_id=' + that.data.act_id,
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function (res) {
                console.log(res);
            }
        })
    },
    handleCommentToUser: function (event) {
        let user_id = event.currentTarget.dataset.id;
        let user_nick = event.currentTarget.dataset.nick;
        console.log(user_nick);
        this.setData({ to_user: user_id });
        this.setData({place_holder: '回复： '+user_nick});
        this.setData({visible1: true});
    },
    handleCancel: function () {
        this.setData({visible1 : false});
    },
    handleConfirmComment: function () {
        this.setData({ visible1: false });
        let that = this;
        let date = new Date();
        let dateString = date.toString();
        console.log("啊太容易");
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/user/act/comment',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            method: 'POST',
            data: {
                "act_id": parseInt(that.data.act_id),
                "receiver_id": that.data.to_user,
                "content": that.data.your_comment,
                "time": dateString
            },
            success: function (res) {
                console.log(100000);
                console.log(res);
                that.setData({ your_comment: '' })
                that.refresh();
            }
        })
    },
    bindTextAreaBlur: function (event) {
        this.setData({
            your_comment: event.detail.value
        });
    }
})