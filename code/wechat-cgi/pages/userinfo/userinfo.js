// pages/userinfo/userinfo.js
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {
            username: "sebastianj1w",
            nickname: "Seb",
            phone: "18766699977",
            avatar_id: "1",
            signature: "签名功能不实现"
        },
        button_message: "编辑个人信息",
        editing: false,
        userInfo: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/queryuser?id=1',
            method: 'GET',
            success: function (res) {
                that.setData({user: res.data.data});
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    handleClick: function() {
        if (!this.data.editing) {
            this.setData({
                editing: true,
                button_message: "保存"
            });
        } else {
            this.setData({
                editing: false,
                button_message: "编辑个人信息"
            });
        }

        console.log(this.data.editing);
    }
})