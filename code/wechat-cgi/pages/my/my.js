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
    handleToLogin: function() {
        // wx.navigateTo({
        //     url: '/pages/login/login',
        // })
        let that = this;
        wx.login({
            success: res => {
                // ------ 获取凭证 ------
                var code = res.code;
                console.log(res);

                if (code) {
                    console.log('获取用户登录凭证：' + code);
                    //------ 发送凭证 ------
                    wx.request({
                        url: 'https://sebastianj1wzyd.xyz/api/public/login/wx',
                        data: {
                            code: code
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            console.log(res);
                            if (res.statusCode === 301) {
                                app.globalData.qrcode = "data:image/png;base64," + res.data;
                                wx.navigateTo({
                                    url: '/pages/scan/scan',
                                })
                            } else if (res.data.status === 22) {
                                wx.navigateTo({
                                    url: '/pages/fillinfo/fillinfo',
                                })
                            } else if (res.data.message === "Login success") {
                                app.globalData.jwt = res.data.jwt;
                                console.log(123);
                                wx.request({
                                    url: 'https://sebastianj1wzyd.xyz/api/public/status',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + app.globalData.jwt,
                                    },
                                    success: function(res) {
                                        app.globalData.userid = res.data.id;
                                        wx.request({
                                            url: 'https://sebastianj1wzyd.xyz/api/public/detail/' + res.data.id,
                                            method: 'GET',
                                            header: {
                                                "Authorization": "Bearer " +app.globalData.jwt,
                                            },
                                            success: function(res) {
                                                console.log(123);
                                                app.globalData.userInfo = res.data;
                                                that.setData({ log: true });
                                                that.setData({userInfo: res.data});
                                            }
                                        })
                                    }
                                })
                            } else {

                            }
                        },
                    })
                } else {
                    console.log('获取用户登录失败：' + res.errMsg);
                }
            }
        })
    },
    onShow: function() {
        console.log('onShow');
        var that = this
        //调用应用实例的方法获取全局数据
        if (app.globalData.userInfo !== null) {
            that.setData({
                user: app.globalData.userInfo
            });
            that.setData({
                log: true
            });
        }
    },
    handleLogout: function() {
        app.globalData.userInfo = null;
        this.setData({
            user: null
        });
        this.setData({
            log: false
        });
    },
    add: function(a, b) {
        return a + b;
    }
})