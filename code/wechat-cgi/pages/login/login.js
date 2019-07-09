// pages/login/login.js
const { $Toast } = require('../../dist/base/index');
let sha = require('../../utils/sha.js');

let app = getApp();
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
        let that = this;
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/login',
            method: 'POST',
            data: {
                'username': this.data.username,
                'password': sha.SHA256(this.data.pwd).toString()
            },
            success: function(res) {
                // console.log(res);
                if (res.statusCode !== 200) {
                    that.handleWarning();
                }
                if (res.data.status === "error") {
                    that.handleError();
                } else {
                    app.globalData.userInfo = res.data.data;
                    that.handleSuccess();
                    wx.navigateBack();
                }
            },
            fail: function(res) {
                that.handleWarning();
            }
        });

    },
    handleClickSignUp: function () {
        wx.navigateTo({
            url: '/pages/signup/signup',
        })
    },

    handleUsernameInput: function(event) {
        this.setData({
            username: event.detail.detail.value
        });
    },

    handlePwdInput: function(event) {
        this.setData({
            pwd: event.detail.detail.value
        });
    },
    handleSuccess() {
        $Toast({
            content: '登录成功',
            type: 'success'
        });
    },
    handleWarning() {
        $Toast({
            content: '网络错误',
            type: 'warning'
        });
    },
    handleError() {
        $Toast({
            content: '用户名或密码错误',
            type: 'error'
        });
    },
    handleLoading() {
        $Toast({
            content: '加载中',
            type: 'loading'
        });
    },
})