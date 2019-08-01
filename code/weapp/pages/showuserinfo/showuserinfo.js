// pages/showuserinfo/showuserinfo.js
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: -1,
        avatar_src: "../../images/icons/timg.jpg",
        user: {},
        error: false,
        button_message: "编辑个人信息",
        editing: false,
        userInfo: {},
        genders: ['女', '男', '保密'],
        levels: ['不可见', '全部可见', '好友可见'],
        current: 'tab1',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('onLoad')
        var that = this
        that.setData({
            id: options.id
        })
        //调用应用实例的方法获取全局数据
        // app.getUserInfo(function(userInfo) {
        //     //更新数据
        //     that.setData({
        //         userInfo: userInfo
        //     })
        // })
        wx.request({
            url: 'https://jing855.cn/api/public/detail?id=' + that.data.id,
            method: 'GET',
            success: function(res) {
                console.log(res);
                that.setData({
                    user: res.data
                });
                if (res.data.avatar_url !== 'http://image.jing855.cn/') {
                    that.setData({
                        avatar_src: res.data.avatar_url
                    })
                }
            }
        })
        wx.request({
            url: 'https://jing855.cn/api/public/feedback/query?receiver_id=' + that.data.id,
            method: 'GET',
            success: function(res) {
                console.log(res)
                if (res.statusCode === 200)
                    that.setData({
                        feedback: res.data
                    })
                else that.setData({
                    feedback: []
                })
            }
        })

    },

    handleChange({
        detail
    }) {
        this.setData({
            current: detail.key
        });
    },
})