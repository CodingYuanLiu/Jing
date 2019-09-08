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
        avatar_src: "http://image.jing855.cn/defaultAvatar.png",
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
                                console.log("jwt: " + res.data.jwt)
                                console.log(123);
                                wx.request({
                                    url: 'https://jing855.cn/api/user/status',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + app.globalData.jwt,
                                    },
                                    success: function(res) {
                                        app.globalData.userid = res.data.id;

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
                                        if (app.globalData.userInfo.avatar_url !== "http://image.jing855.cn/") {
                                            that.setData({
                                                avatar_src: app.globalData.userInfo.avatar_url
                                            })
                                        }

                                    }
                                })
                                wx.request({
                                    url: 'https://jing855.cn/api/user/followings',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + app.globalData.jwt,
                                    },
                                    success: function(res) {
                                        console.log(res)
                                        if (res.data === null) {
                                            app.globalData.following = []
                                            that.setData({
                                                followingNum: 0
                                            })
                                        } else {
                                            app.globalData.following = res.data
                                            that.setData({
                                                followingNum: res.data.length
                                            })
                                        }
                                    }
                                })
                                wx.request({
                                    url: 'https://jing855.cn/api/user/followers',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + app.globalData.jwt,
                                    },
                                    success: function(res) {
                                        console.log(res)
                                        if (res.data === null) {
                                            app.globalData.followers = []
                                            that.setData({
                                                followerNum: 0
                                            })
                                        } else {
                                            app.globalData.followers = res.data
                                            that.setData({
                                                followerNum: res.data.length
                                            })
                                        }
                                    }
                                })
                                wx.request({
                                    url: 'https://jing855.cn/api/user/friends',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + app.globalData.jwt,
                                    },
                                    success: function(res) {
                                        console.log(res)
                                        app.globalData.friends = res.data
                                    }
                                })
                                wx.request({
                                    url: 'https://jing855.cn/api/user/act/myact',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + app.globalData.jwt,
                                    },
                                    success: function(res) {
                                        if (res.data.acts === null) {
                                            wx.request({
                                                url: 'https://jing855.cn/api/user/act/manageact',
                                                method: 'GET',
                                                header: {
                                                    "Authorization": "Bearer " + app.globalData.jwt,
                                                },
                                                success: function(res) {
                                                    if (res.data.acts === null) {
                                                        that.setData({
                                                            myActCount: 0
                                                        });
                                                    } else {
                                                        that.setData({
                                                            myActCount: res.data.acts.length
                                                        });
                                                    }
                                                }
                                            })
                                        } else {
                                            let count = res.data.acts.length;
                                            wx.request({
                                                url: 'https://jing855.cn/api/user/act/manageact',
                                                method: 'GET',
                                                header: {
                                                    "Authorization": "Bearer " + app.globalData.jwt,
                                                },
                                                success: function(res) {
                                                    if (res.data.acts === null) {
                                                        that.setData({
                                                            myActCount: count
                                                        });
                                                    } else {
                                                        that.setData({
                                                            myActCount: count + res.data.acts.length
                                                        });
                                                    }
                                                }
                                            })
                                        }
                                    },
                                    fail: function(res) {
                                        console.log(res)
                                    }
                                })
                            } else {}
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
            if (app.globalData.userInfo.avatar_url !== "http://image.jing855.cn/") {
                that.setData({
                    avatar_src: app.globalData.userInfo.avatar_url
                })
            }
        }
        wx.getStorage({
            key: 'history',
            success: function(res) {
                console.log(res)
                if (res.data.length === 0) {
                    that.setData({
                        historyNum: 0
                    })
                } else {
                    let ids = Array.from(new Set(res.data))
                    that.setData({
                        historyNum: ids.length
                    })
                }
            },
            fail: function() {
                that.setData({
                    historyNum: 0
                })
            }
        })
    },
    handleLogout: function() {
        app.globalData.userInfo = null;
        this.setData({
            user: null,
            avatar_src: 'http://image.jing855.cn/defaultAvatar.png'
        });
        this.setData({
            log: false
        });
    },
    // add: function(a, b) {
    //     return a + b;
    // },
    handleMyAct: function() {
        wx.navigateTo({
            url: '/pages/my/myAct/myAct',
        })
    },
    // handleFeedback: function() {
    //     wx.navigateTo({
    //         url: '/pages/feedback/feedback',
    //     })
    // },
    handleFollower: function() {
        wx.navigateTo({
            url: '/pages/follow/follow?mode=follower',
        })
    },
    handleFollowing: function() {
        wx.navigateTo({
            url: '/pages/follow/follow?mode=following',
        })
    },
    handleLook: function() {
        wx.navigateTo({
            url: './history/history',
        })
    }
})