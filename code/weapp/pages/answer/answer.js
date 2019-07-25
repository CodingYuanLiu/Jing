//answer.js
const {
    $Toast
} = require('../../dist/base/index');

Date.prototype.toString = function() {
    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + (this.getHours() >= 10 ? "" + this.getHours() : "0" + this.getHours()) + ':' + (this.getMinutes() >= 10 ? "" + this.getMinutes() : "0" + this.getMinutes());
}


var app = getApp()
Page({
    data: {
        counter: 0,
        motto: '知乎--微信小程序版',
        userInfo: {},
        act_id: 0,
        content: {},
        comment_length: 0,
        your_comment: '',
        place_holder: '添加评论',
        avatar_src: '../../images/icons/timg.jpg',
        to_user: -1,
        visible1: false,
        actions3: [{
            name: '现金支付',
            color: '#2d8cf0',
        }],
        mode: "net",
        images: ["http://puo7ltwok.bkt.clouddn.com/Fj0kHQJU5c_EiVQAJy_vrsCosnSZ"]
    },
    //事件处理函数
    // toQuestion: function() {
    //     wx.navigateTo({
    //         url: '../question/question'
    //     })
    // },
    refresh: function() {
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/public/act/query?act_id=' + that.data.act_id,
            method: 'GET',
            success: function(res) {
                console.log(res);
                that.setData({
                    content: res.data
                });
                that.setData({
                    comment_length: res.data.comments.length
                })
            }
        });
    },
    onLoad: function(options) {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        // app.getUserInfo(function(userInfo){
        //   //更新数据
        //   that.setData({
        //     userInfo:userInfo
        //   })
        // })
        this.setData({
            act_id: options.id
        });
        console.log("id是" + options.id);
        wx.request({
            url: 'https://jing855.cn/api/public/act/query?act_id=' + that.data.act_id,
            method: 'GET',
            success: function(res) {
                that.setData({
                    content: res.data
                });
                that.setData({
                    comment_length: res.data.comments.length
                });
                console.log(res);
                if (res.data.sponsor_avatar !== 'http://puo7ltwok.bkt.clouddn.com/')
                    that.setData({
                        avatar_src: res.data.sponsor_avatar
                    })
                let d = res.data;
                // wx.request({
                //     url: 'https://jing855.cn/api/public/detail?id=' + res.data.sponsor_id,
                //     method: 'GET',
                //     success: function(res) {
                //         console.log(res);
                        
                //     }
                // })
                for (let i = 0; i < res.data.comments.length; i++) {
                    wx.request({
                        url: 'https://jing855.cn/api/public/detail?id=' + res.data.comments[i].user_id,
                        method: 'GET',
                        success: function(res) {
                            d.comments[i].avatar_src = res.data.avatar_url;
                            that.setData({
                                content: d
                            })
                        }
                    })
                }
                if (app.globalData.userInfo !== null) {
                    wx.request({
                        url: 'https://jing855.cn/api/user/act/addbehavior',
                        method: 'POST',
                        header: {
                            "Authorization": "Bearer " + app.globalData.jwt,
                        },
                        data: {
                            "type": that.data.content.type,
                            "behavior": "scanning"
                        },
                        success: function(res) {
                            console.log(res);
                        }
                    })
                }
            }
        });


    },
    tapName: function(event) {
        console.log(event)
    },
    handleCommentInput: function(event) {
        this.setData({
            your_comment: event.detail.value
        });
    },
    handleAddComment: function(event) {
        let that = this;
        that.setData({
            counter: that.data.counter + 1
        })
        if (that.data.counter > 3) {
            that.setData({
                counter: 0
            })
            $Toast({
                content: '不能为空',
                type: 'error',
            });
            return;
        }
        if (app.globalData.userInfo === null) {
            $Toast({
                content: '未登录',
                type: 'warning',
            });
            return;
        }
        if (that.data.your_comment === '' || that.data.your_comment === null) {
            setTimeout(that.handleAddComment, 200);
            return;
        }
        $Toast({
            content: '正在处理',
            type: 'loading',
            duration: 0
        });
        let date = new Date();
        let dateString = date.toString();
        console.log(app.globalData.userInfo);
        wx.request({
            url: 'https://jing855.cn/api/user/act/comment',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            method: 'POST',
            data: {
                "act_id": parseInt(that.data.act_id),
                "receiver_id": -1,
                "content": that.data.your_comment,
                "time": dateString
            },
            success: function(res) {
                console.log(res);
                that.setData({
                    your_comment: ''
                })
                $Toast.hide();
                $Toast({
                    content: '评论成功',
                    type: 'success',
                });
                that.refresh();
            }
        })
    },
    handleJoin: function() {
        // wx request join
        let that = this;
        if (app.globalData.userInfo === null) {
            $Toast({
                content: '未登录',
                type: 'warning',
            });
            return;
        }
        wx.request({
            url: 'https://jing855.cn/api/user/act/status?act_id=' + that.data.act_id,
            method: 'GET',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function(res) {
                console.log(res);
                if (res.data.status === 0) {
                    $Toast({
                        content: '已加入',
                        type: 'warning',
                    });
                    return;
                } else if (res.data.status === -1) {
                    $Toast({
                        content: '等待接受',
                        type: 'warning',
                    });
                    return;
                } else if (res.data.status === 1) {
                    $Toast({
                        content: '不能加入自己发起的活动',
                        type: 'warning',
                    });
                    return;
                }
                $Toast({
                    content: '加载中',
                    type: 'loading',
                    duration: 0
                });
                wx.request({
                    url: 'https://jing855.cn/api/user/act/join?act_id=' + that.data.act_id,
                    method: 'POST',
                    header: {
                        "Authorization": "Bearer " + app.globalData.jwt,
                    },
                    success: function(res) {
                        console.log(res);
                        $Toast.hide();
                        $Toast({
                            content: '等待接收',
                            type: 'success',
                            duration: 0.7
                        });
                    }
                })
                wx.request({
                    url: 'https://jing855.cn/api/user/act/addbehavior',
                    method: 'POST',
                    header: {
                        "Authorization": "Bearer " + app.globalData.jwt,
                    },
                    data: {
                        "type": that.data.content.type,
                        "behavior": "join"
                    },
                    success: function(res) {
                        console.log(res);
                    }
                })
            }
        })

    },
    handleCommentToUser: function(event) {
        if (app.globalData.userInfo === null) {
            $Toast({
                content: '未登录',
                type: 'warning',
            });
            return;
        }
        let user_id = event.currentTarget.dataset.id;
        let user_nick = event.currentTarget.dataset.nick;
        console.log(user_nick);
        this.setData({
            to_user: user_id
        });
        this.setData({
            place_holder: '回复： ' + user_nick
        });
        this.setData({
            visible1: true
        });
    },
    handleCancel: function() {
        this.setData({
            visible1: false
        });
    },
    handleConfirmComment: function() {
        this.setData({
            visible1: false
        });
        $Toast({
            content: '正在发送',
            type: 'loading',
            duration: 0
        });
        let that = this;
        let date = new Date();
        let dateString = date.toString();
        // console.log("啊太容易");
        wx.request({
            url: 'https://jing855.cn/api/user/act/comment',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            method: 'POST',
            data: {
                "act_id": parseInt(that.data.act_id),
                "receiver_id": that.data.to_user,
                "content": that.data.your_comment,
                "time": dateString
            },
            success: function(res) {
                console.log(100000);
                console.log(res);
                that.setData({
                    your_comment: ''
                })
                $Toast.hide();
                $Toast({
                    content: '评论成功',
                    type: 'success',
                });
                that.refresh();
            }
        })
    },
    bindTextAreaBlur: function(event) {
        this.setData({
            your_comment: event.detail.value
        });
    },
    handleToShowInfo: function(event) {
        let id = event.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
            url: '/pages/showuserinfo/showuserinfo?id=' + id,
        })
    },
    handleToRoutine: function() {
        let origin = this.data.content.origin.latitude + "," + this.data.content.origin.longitude
        let dest = this.data.content.destination.latitude + "," + this.data.content.destination.longitude
        let center_la = (this.data.content.origin.latitude + this.data.content.destination.latitude) / 2
        let center_lo = (this.data.content.origin.longitude + this.data.content.destination.longitude) /2
        wx.navigateTo({
            url: '/pages/showroutine/showroutine?ori='+origin+"&dest="+dest+"&latitude="+center_la+"&longitude="+center_lo,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    }
})