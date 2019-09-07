// pages/showuserinfo/showuserinfo.js
var app = getApp()
const {
    $Toast
} = require('../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: -1,
        avatar_src: "http://image.jing855.cn/defaultAvatar.png",
        user: {},
        error: false,
        button_message: "编辑个人信息",
        editing: false,
        userInfo: {},
        genders: ['女', '男', '保密'],
        levels: ['不可见', '全部可见', '好友可见'],
        current: 'tab1',
        followed: false
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
            url: 'https://jing855.cn/api/public/act/quitratio?user_id=' + that.data.id,
            method: 'GET',
            success: function(res) {
                that.setData({
                    quitRatio: res.data.ratio
                })
            }
        })
        wx.request({
            url: 'https://jing855.cn/api/public/feedback/query?receiver_id=' + that.data.id,
            method: 'GET',
            success: function(res) {
                console.log(res)
                if (res.statusCode === 200) {
                    that.setData({
                        feedback: res.data
                    })
                    let sumH = 0;
                    let sumC = 0;
                    let sumP = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        sumH += res.data[i].honesty;
                        sumC += res.data[i].communication;
                        sumP += res.data[i].punctuality;
                    }
                    that.setData({
                        avgC: sumC / res.data.length,
                        avgH: sumH / res.data.length,
                        avgP: sumP / res.data.length,
                    })
                } else that.setData({
                    feedback: []
                })
            }
        })
        wx.request({
            url: 'https://jing855.cn/api/public/act/findbyuser?id='+that.data.id,
            method: 'GET',
            success: function(res) {
                that.setData({acts: res.data.acts})
            }
        })
        if (app.globalData.userInfo !== null) {
            if (app.globalData.following !== null) {
                let i = 0;
                for (i = 0; i < app.globalData.following.length; i++) {
                    console.log("finding")
                    if (app.globalData.following[i].id.toString() === that.data.id) {
                        that.setData({
                            followed: true
                        })
                        console.log("followed!!!!!!")
                        break
                    }

                }
                if (i == app.globalData.following.length)
                    that.setData({
                        followed: false
                    })
            } else
                that.setData({
                    followed: false
                })
        }
    },
    onShow: function() {
        let that = this;
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
            url: 'https://jing855.cn/api/public/act/quitratio?user_id=' + that.data.id,
            method: 'GET',
            success: function(res) {
                that.setData({
                    quitRatio: res.data.ratio
                })
            }
        })
        wx.request({
            url: 'https://jing855.cn/api/public/feedback/query?receiver_id=' + that.data.id,
            method: 'GET',
            success: function(res) {
                console.log(res)
                if (res.statusCode === 200) {
                    that.setData({
                        feedback: res.data
                    })
                    let sumH = 0;
                    let sumC = 0;
                    let sumP = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        sumH += res.data[i].honesty;
                        sumC += res.data[i].communication;
                        sumP += res.data[i].punctuality;
                    }
                    that.setData({
                        avgC: sumC / res.data.length,
                        avgH: sumH / res.data.length,
                        avgP: sumP / res.data.length,
                    })
                } else that.setData({
                    feedback: []
                })
            }
        })
        wx.request({
            url: 'https://jing855.cn/api/public/act/findbyuser?id=' + that.data.id,
            method: 'GET',
            success: function (res) {
                that.setData({ acts: res.data.acts })
            }
        })
        if (app.globalData.userInfo !== null) {
            if (app.globalData.following !== null) {
                let i = 0;
                for (i = 0; i < app.globalData.following.length; i++) {
                    console.log("finding")
                    if (app.globalData.following[i].id.toString() === that.data.id) {
                        that.setData({
                            followed: true
                        })
                        console.log("followed!!!!!!")
                        break
                    }

                }
                if (i == app.globalData.following.length)
                    that.setData({
                        followed: false
                    })
            } else
                that.setData({
                    followed: false
                })
        }
    },
    bindQueTap: function (event) {
        let actid = event.currentTarget.dataset.id
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '../answer/answer?id=' + actid
        })
    },
    handleFollow: function(event) {
        if (app.globalData.userInfo === null) {
            $Toast({
                content: '请登录',
                type: 'warning',
            });
            return
        }
        let id = this.data.id;
        let that = this;
        if (!that.data.followed) {
            // console.log(id);
            wx.request({
                url: 'https://jing855.cn/api/user/follow?id=' + id,
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'GET',
                success: function(res) {
                    // console.log(100000);
                    console.log(res);
                    // $Toast.hide();
                    if (res.statusCode === 200) {
                        $Toast({
                            content: '成功',
                            type: 'success',
                        });
                        // that.setData({
                        //     followed: true
                        // })
                    } else {
                        $Toast({
                            content: res.data.message,
                            // type: 'success',
                        });
                    }
                    wx.request({
                        url: 'https://jing855.cn/api/user/followings',
                        method: 'GET',
                        header: {
                            "Authorization": "Bearer " + app.globalData.jwt,
                        },
                        success: function(res) {
                            console.log(res)
                            app.globalData.following = res.data
                            that.onShow();
                        }
                    })

                }
            })
        } else {
            wx.request({
                url: 'https://jing855.cn/api/user/unfollow?id=' + id,
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'GET',
                success: function(res) {
                    // console.log(100000);
                    console.log(res);
                    // $Toast.hide();
                    if (res.statusCode === 200)
                        $Toast({
                            content: '成功',
                            type: 'success',
                        });
                    wx.request({
                        url: 'https://jing855.cn/api/user/followings',
                        method: 'GET',
                        header: {
                            "Authorization": "Bearer " + app.globalData.jwt,
                        },
                        success: function(res) {
                            console.log(res)
                            app.globalData.following = res.data

                            that.onShow();
                        }
                    })

                }
            })
        }
    },
    handleChange({
        detail
    }) {
        this.setData({
            current: detail.key
        });
    },

    handleToComments: function(e) {
        let id = e.currentTarget.dataset.id
        console.log(id)
        console.log(this.data.feedback[id])
        let comments = JSON.stringify(this.data.feedback[id].fb_comments)
        // let fake_comment = [
        //     {
        //         "comment_desc": "乱说",
        //         "commentator_avatar": "http://image.jing855.cn/FmcpkwJsYI4nGTbB_FdlEjmMS6xW",
        //         "commentator_id": 3,
        //         "commentator_nickname": "孙笑川",
        //         "time": "2019-7-29 17:17:36"
        //     },
        // ]
        // let comments = JSON.stringify(fake_comment)
        let fb_id = this.data.feedback[id].feedback_id
        wx.navigateTo({
            url: './fb_comments/fb_comments?id=' + fb_id + '&comments=' + comments,
        })
    },
    handleToShowUserinfo: function(e) {
        let id = e.currentTarget.dataset.id
        console.log(id)
        // console.log(this.data.feedback[id])
        wx.navigateTo({
            url: '/pages/showUserinfo/showUserinfo?id=' + id,
        })
    },
    handleToDetail: function () {
        // let id = e.currentTarget.dataset.id
        // console.log(id)
        // console.log(this.data.feedback[id])
        let detail = JSON.stringify(this.data.user)
        // let fb_id = this.data.feedback[id].feedback_id
        wx.navigateTo({
            url: './detail/detail?detail=' + detail,
        })
    },
})