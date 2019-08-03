//logs.js
let app = getApp();
const {
    $Message
} = require('../../dist/base/index');
// Page({
//  data: {
//    logs: []
//  },
//  onLoad: function () {
//    this.setData({
//      logs: (wx.getStorageSync('logs') || []).map(function (log) {
//        return util.formatTime(new Date(log))
//      })
//    })
//  }
// })

Page({
    data: {
        focus: false,
        inputValue: '',
        aid: 0,
        uid: 0,
        loged: true,
        applicant: [],
        notify_length: 0,
        navTab: ["通知"],
        currentNavtab: "0",
        visible: false,
        message: {
            unread: 0,
            length: 2,
            content: [{
                    avatar: "../../images/icon8.jpg",
                    nickname: "Alex",
                    lasttime: "1 月前",
                    lasttext: "你好呀！",
                },
                {
                    avatar: "../../images/icon9.jpeg",
                    nickname: "Nicks",
                    lasttime: "2 天前",
                    lasttext: "在吗！",
                }
            ]
        },
        groupchat: {
            unread: 0,
            length: 4,
            content: [{
                    avatar: "../../images/icon1.jpeg",
                    title: "肯德基拼单",
                    lasttime: "1 月前",
                    lasttext: "你好呀！",
                    last_nick: "Rebecca"
                },
                {
                    avatar: "../../images/icon9.jpeg",
                    title: "7月7日去机场",
                    lasttime: "2 天前",
                    lasttext: "我觉得可以",
                    last_nick: "Nicks"
                },
                {
                    avatar: "../../images/icon8.jpg",
                    title: "周日约球",
                    lasttime: "1 月前",
                    lasttext: "你好呀！",
                    last_nick: "Jeck"

                },
                {
                    avatar: "../../images/icon9.jpeg",
                    title: "拼单Nike 500 减 200",
                    lasttime: "2 天前",
                    lasttext: "我觉得这个不错",
                    last_nick: "Bob"

                }
            ]
        }
    },
    bindButtonTap: function() {
        this.setData({
            focus: Date.now()
        })
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    bindReplaceInput: function(e) {
        var value = e.detail.value
        var pos = e.detail.cursor
        if (pos != -1) {
            //光标在中间
            var left = e.detail.value.slice(0, pos)
            //计算光标的位置
            pos = left.replace(/11/g, '2').length
        }

        //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        return {
            value: value.replace(/11/g, '2'),
            cursor: pos
        }

        //或者直接返回字符串,光标在最后边
        //return value.replace(/11/g,'2'),
    },
    bindHideKeyboard: function(e) {
        if (e.detail.value === '123') {
            //收起键盘
            wx.hideKeyboard()
        }
    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });
    },
    handleToAccept: function(event) {
        let aid = event.currentTarget.dataset.aid;
        let uid = event.currentTarget.dataset.uid;
        let nick = event.currentTarget.dataset.nick;
        // wx.navigateTo({
        //     url: '/pages/accept/accept?id='+aid + '&uid='+uid,
        // })
        this.setData({
            aid: aid,
            uid: uid
        });
        this.setData({
            message: "是否接受" + nick + "的请求？"
        })
        this.setData({
            visible: true
        });
    },
    handleOk: function() {
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/user/act/acceptjoin?act_id=' + that.data.aid + '&user_id=' + that.data.uid,
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function() {
                // wx.switchTab({
                //     url: '/pages/notify/notify',
                // })
                that.onShow();
            }
        })
        this.setData({
            visible: false
        });

    },
    handleCancel: function() {
        this.setData({
            visible: false
        });

    },
    onLoad: function(res) {
        let that = this;
        if (app.globalData.userInfo === null) {
            that.setData({
                loged: false
            })
        } else {
            that.setData({
                loged: true
            })
        }
        wx.request({
            url: 'https://jing855.cn/api/user/act/getjoinapp',
            method: 'GET',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function(res) {
                if (res.data === null) {
                    that.setData({
                        applicant: [],
                        notify_length: 0
                    });
                    return;
                }
                console.log(1);
                console.log(res);
                console.log(2);
                let applicant = res.data;
                that.setData({
                    notify_length: applicant.length
                })
                for (let i = 0; i < applicant.length; i++) {
                    wx.request({
                        url: 'https://jing855.cn/api/public/detail?id=' + applicant[i].applicant_id,
                        method: 'GET',
                        success: function(res) {
                            console.log(res);
                            applicant[i].app_nick = res.data.nickname;
                            that.setData({
                                applicant: applicant
                            });
                        }
                    })
                }
            }
        })
    },
    onShow: function() {
        this.onLoad();
    }
})