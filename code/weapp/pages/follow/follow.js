// pages/follow/follow.js
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        that.setData({
            mode: options.mode
        })
        if (options.mode === "following") {
            wx.request({
                url: 'https://jing855.cn/api/user/followings',
                method: 'GET',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                success: function(res) {
                    console.log(res)
                    app.globalData.following = res.data
                    that.setData({
                        users: app.globalData.following
                    })
                }
            })
        } else {
            wx.request({
                url: 'https://jing855.cn/api/user/followers',
                method: 'GET',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                success: function(res) {
                    console.log(res)
                    app.globalData.followers = res.data
                    that.setData({
                        users: app.globalData.followers
                    })
                }
            })

        }
    },
    handleToShowInfo: function(event) {
        let id = event.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
            url: '/pages/showuserinfo/showuserinfo?id=' + id,
        })
    },
})