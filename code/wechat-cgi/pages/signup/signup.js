// pages/signup/signup.js
let sha = require('../../utils/sha.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        nickname: "",
        phone: "",
        password: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    handleClick: function () {
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/insertuser',
            method: 'POST',
            data: {
                "username": this.data.username,
                "password": sha.SHA256(this.data.password).toString(),
                "nickname": this.data.nickname,
                "phone": this.data.phone
            },
            success: function(res) {
                console.log(res);
                wx.navigateBack();
            }
        })
    },
    handleUsernameInput: function (event) {
        this.setData({
            username: event.detail.detail.value
        });
    },

    handlePwdInput: function (event) {
        this.setData({
            password: event.detail.detail.value
        });
    },
    handleNickInput: function (event) {
        this.setData({
            nickname: event.detail.detail.value
        });
    },

    handlePhoneInput: function (event) {
        this.setData({
            phone: event.detail.detail.value
        });
    }
})