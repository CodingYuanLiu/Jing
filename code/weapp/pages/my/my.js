//logs.js
var app = getApp()
const {
    $Toast
} = require('../../dist/base/index');
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
        $Toast({
            content: '正在加载',
            type: 'loading',
            duration: 0
        });
        wx.login({
            success: res => {
                // ------ 获取凭证 ------
                var code = res.code;
                console.log(res);

                if (code) {
                    console.log('获取用户登录凭证：' + code);
                    //------ 发送凭证 ------
                    wx.request({
                        url: 'https://jing855.cn/api/public/login/wx',
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
                                    url: 'https://jing855.cn/api/user/status',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + app.globalData.jwt,
                                    },
                                    success: function(res) {
                                        app.globalData.userid = res.data.id;
                                        wx.request({
                                            url: 'https://jing855.cn/api/public/detail?id=' + res.data.id,
                                            method: 'GET',
                                            header: {
                                                "Authorization": "Bearer " + app.globalData.jwt,
                                            },
                                            success: function(res) {
                                                console.log(res);
                                                console.log(111);
                                                app.globalData.userInfo = res.data;
                                                that.setData({
                                                    log: true
                                                });
                                                that.setData({
                                                    userInfo: res.data
                                                });
                                                $Toast.hide();
                                                $Toast({
                                                    content: '登录成功',
                                                    type: 'success',
                                                    duration: 1
                                                });
                                                if (app.globalData.userInfo.avatar_url !== "http://puo7ltwok.bkt.clouddn.com/") {
                                                    that.setData({
                                                        avatar_src: app.globalData.userInfo.avatar_url
                                                    })
                                                }
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
                userInfo: app.globalData.userInfo
            });
            that.setData({
                log: true
            });
            if (app.globalData.userInfo.avatar_url !== "http://puo7ltwok.bkt.clouddn.com/") {
                that.setData({
                    avatar_src: app.globalData.userInfo.avatar_url
                })
            }
        }
    },
    handleLogout: function() {
        app.globalData.userInfo = null;
        this.setData({
            user: null,
            avatar_src: '../../images/icons/timg.jpg'
        });
        this.setData({
            log: false
        });
    },
    add: function(a, b) {
        return a + b;
    },
    handlePub: function() {
        wx.navigateTo({
            url: '/pages/my/mypublish/mypublish',
        })
    },
    handleJoin: function() {
        wx.navigateTo({
            url: '/pages/my/myjoin/myjoin',
        })
    },
})