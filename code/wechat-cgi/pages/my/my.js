//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        user: {},
        avatar_src: "../../images/icons/timg.jpg",
        log: false
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: ''
        })
    },
    handleToUserInfo: function() {
        wx.navigateTo({
            url: '/pages/userinfo/userinfo',
        })
    },
    handleToLogin: function () {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    onShow: function() {
        console.log('onShow');
        var that = this
        //调用应用实例的方法获取全局数据
        if (app.globalData.userInfo !== null) {
            that.setData({user : app.globalData.userInfo});
            that.setData({log : true});
        }
    },
    handleLogout: function() {
        app.globalData.userInfo = null;      
        this.setData({ user: null });
        this.setData({ log: false });  
    }
})