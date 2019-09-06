// pages/showuserinfo/fb_comments/fb_comments.js
let app = getApp();
const {
    $Toast
} = require('../../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        your_comment: '',
        no_content: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        let comments = JSON.parse(options.comments)
        this.setData({
            id: id,
            comments: comments
        })
        console.log(id)
        console.log(comments)
        if (comments.length === 0) {
            this.setData({
                no_content: true
            });
        }
    },
    handleAddComment: function() {
        if (app.globalData.userInfo === null) {
            $Toast({
                content: '请登录',
                type: 'error',
            });
            return;
        }
        let that = this
        let date = new Date()
        let dateStr = date.toString()
        let newComment = {
            "object_id": that.data.id,
            "time": dateStr,
            "commentator_desc": that.data.your_comment
        }
        let con = {
            "comment_desc": that.data.your_comment,
            "commentator_avatar": app.globalData.userInfo.avatar_url,
            "commentator_id": app.globalData.userInfo.id,
            "commentator_nickname": app.globalData.userInfo.nickname,
            "time": dateStr,
        }
        wx.request({
            url: 'https://jing855.cn/api/user/feedback/comment',
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            data: newComment,
            success: function() {
                that.setData({
                    comments: that.data.comments.concat(con),
                    your_comment: '',
                    no_content: false,
                })

            }
        })
    },
    handleCommentInput: function(event) {
        this.setData({
            your_comment: event.detail.value
        });
    }
})